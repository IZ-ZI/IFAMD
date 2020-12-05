const { AsyncResource } = require('async_hooks');
const { app, BrowserWindow, Menu, dialog, shell, screen, ipcMain, systemPreferences} = require('electron');
const fastcsv = require("fast-csv");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require('path');

//http GET urls.
let urlCheck = 'https://8twgwhdclf.execute-api.us-east-2.amazonaws.com/alpha/checkdb'
let urlQuery = 'https://8twgwhdclf.execute-api.us-east-2.amazonaws.com/alpha/querydb?queryString='

process.env.NODE_ENV = 'production'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

//this function is invoked whenever the user clicks "connection status" from the menu dropdown.
const contactDatabase = (focusedWindow) => {
	fetch(urlCheck).then(
		async res=> await res.json()).then(data => {
			const status = {
				type: 'info',
				title: 'Connection Status',
				buttons: ['OK'],
				message: 'Connection Status: ' + JSON.parse(JSON.stringify(data))
			};
			dialog.showMessageBox(focusedWindow, status)
		}).catch(e=>console.error('Error: ' + e));
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
	const :{ width, height } = screen.getPrimaryDisplay().workAreaSize,
    width: parseInt(width*0.6),
	height: parseInt(height*0.7),
	icon: __dirname + '/icon/icon.ico',
	show: false,
	fullscreenable:false,
    fullscreen: false,
	maximizable: false,
	webPreferences: {
		nodeIntegration: true
	}
  });
  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
	const template = [
		{
			label: 'Help',
			submenu: [
				{label: 'App info',
					click: function(item, focusedWindow) {
						if (focusedWindow) {
								const options = {
										type: 'info',
										title: 'Info',
										buttons: ['OK'],
										message: 'IFAMD Interface Ver 1.0.0'
								}
								dialog.showMessageBox(mainWindow, options)
						}
					}
				},
				{label: 'Gimme Money',
				 click: () => {shell.openExternal('https://www.paypal.com/us/home')}}, // Just a joke :).
				{type: 'separator'},
				{label: 'Exit',
				 role: 'close'}
			]
		},
		// allow user to check connectivity here
		{
			label: 'Connection',
			submenu: [
				{label: 'Connection Status',
					click: function(){contactDatabase(mainWindow)}
				},
				{label: 'Retry Connection',
				 	click: function(){contactDatabase(mainWindow)} //This function kinda incomplete right now, because it doesn't tell you if the attempt is successful or not.
				}

			]
		}
	]

	const menu = Menu.buildFromTemplate(template)
	Menu.setApplicationMenu(menu)

	mainWindow.loadURL(`file://${__dirname}/index.html`)
	mainWindow.once('ready-to-show', () => {
		mainWindow.show()
	})

	//to avoid background sizing issues, full-screen function has been disabled.
	mainWindow.on('maximize', () => {
		mainWindow.unmaximize()
		const disabled = {
			type: 'info',
			title: 'Info',
			buttons: [':('],
			message: 'Full Screen has been Disabled.'
		}
		dialog.showMessageBox(mainWindow, disabled)
	});

	mainWindow.webContents.on('new-window', function(e, url) {
		e.preventDefault();
		require('electron').shell.openExternal(url);
	});
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
	//connection.end()
    app.quit();
  }
});


app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// event triggers

ipcMain.on('lookupPlayer', (event, arg) => {
	if (arg.length === 0){dialog.showErrorBox('Empty Field','Please complete the query.')}
	else{
		$findPlayer = "SELECT" + 
		"(SELECT P.short_name FROM Player AS P WHERE (P.short_name = '" + arg + "' OR P.long_name = '" + arg + "')) AS 'Abbreviated Name'," +
		"(SELECT P.long_name FROM Player AS P WHERE (P.short_name = '" + arg + "' OR P.long_name = '" + arg + "')) AS 'Full Name'," +
		"(SELECT P.nationality FROM Player AS P WHERE (P.short_name = '" + arg + "' OR P.long_name = '" + arg + "')) AS 'Nationality'," + 
		"(SELECT P.position FROM Player AS P WHERE (P.short_name = '" + arg + "' OR P.long_name = '" + arg + "')) AS 'Position'," +
		"(SELECT C.club_name FROM Player AS P, Club AS C, Contract AS CO WHERE (P.short_name = '" + arg + "' OR P.long_name = '" + arg + "' ) AND (P.playerID = CO.playerID) AND (CO.club_name = C.club_name)) AS 'Club'," +
		"(SELECT CAST(IFNULL(SUM(HS.goal),0) AS UNSIGNED) AS 'Total Goals' FROM Player AS P, Has_Scored AS HS WHERE (P.short_name = '" + arg + "' OR P.long_name = '" + arg + "') AND " + 
		"P.playerID = HS.playerID) AS 'Total Goals'"
		submitQuery($findPlayer)
	}
})

ipcMain.on('lookupClub', (event, arg) => {
	if (arg.length === 0){dialog.showErrorBox('Empty Field','Please complete the query.')}
	else{
		$findClub = "SELECT C.*, CONCAT_WS(' ', first_name, last_name) AS 'Manager' FROM Club AS C, Manager AS M, Manage AS MG WHERE C.club_Name = '" + arg + "' AND M.managerId = MG.managerId AND C.club_name = MG.club_name;"
		submitQuery($findClub)
	}
})

ipcMain.on('lookupDate', (event, arg) => {
	if (arg.length === 0){dialog.showErrorBox('Empty Field','Please complete the query.')}
	else{
		$findDate = "SELECT M.match_id, M.start_time, C.club_name, P.score FROM Club AS C, Matches AS M, Participate AS P WHERE P.club_name = C.club_name AND P.match_id = M.match_id AND M.date = '" + arg + "';"
		submitQuery($findDate)
	}
})

ipcMain.on('lookupGeneral', (event, arg) => {
	if (arg.length === 0){dialog.showErrorBox('Empty Field','Please complete the query.')}
	else{
		submitQuery(arg)
	}
})

ipcMain.on('close-table-window', () => {
	BrowserWindow.getFocusedWindow().close()
})

ipcMain.on('save-file-to-computer', (event, arg) => {
	saveToFile(arg)
})

//submit whatever query the user entered. If nothing is returned, this function
//will throw an error box.
//the query is submitted through a REST api, such that the database is directly exposed to the client.
const submitQuery = ($queryBody) => {
	queryComplete = urlQuery+$queryBody
	var rows
	fetch(queryComplete).then(
		async res=> await res.json()).then(data => {
			rows = data;
			json = JSON.stringify(rows);
			jsonData = JSON.parse(json);

			if(jsonData.length !== 0 && !json.includes('null') && !json.includes('Internal server error')){
				viewTableWindow(jsonData)
			}else{
				dialog.showErrorBox("No Result", "Query did not Return Any Results.")
			}
		}).catch(e=>console.error('Error: ' + e));
}

//if the user chooses to save the file, this function is invoked.
const saveToFile = (data) => {
	dialog.showSaveDialog(BrowserWindow.getFocusedWindow(),{
		filters: [{
			name: 'Comma-separated values',
			extensions: ['csv']
		}]}).then((result) => {
			//do nothing if canceled.
			if(!result.canceled){
				var path = String(result.filePath)
				fastcsv.write(data, {headers:true}).pipe(fs.createWriteStream(path))
			}
	})
}

// child window to display a table.
const viewTableWindow = (tableContent) => {
	var tableViewWindow = new BrowserWindow({
		const :{ width, height } = screen.getPrimaryDisplay().workAreaSize,
		width: parseInt(width * 0.25),
		height: parseInt(height * 0.5),
		show: false,
		frame: false,
		parent: BrowserWindow.getFocusedWindow(),
		fullscreenable:false,
		fullscreen: false,
		maximizable: false,
		webPreferences: {
			nodeIntegration: true
		}
	})

	tableViewWindow.loadURL(`file://${__dirname}/tableview.html`)
	tableViewWindow.once('ready-to-show', () => {
		tableViewWindow.show()
		//when window is ready, send the data to be displayed.
		tableViewWindow.webContents.send('display-query-result', tableContent)
	})

	//remove reference when window is closed
	tableViewWindow.on('closed', () => {
		tableViewWindow = null
	})
}