const { AsyncResource } = require('async_hooks');
const { app, BrowserWindow, Menu, dialog, shell, screen, ipcMain} = require('electron');
const fastcsv = require("fast-csv");
const fs = require("fs");
const path = require('path');

var connection;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const contactDatabase = (focusedWindow) => {
	var mysql = require('mysql')

	connection = mysql.createConnection({
		host: 'ifamd.ccjfknxcg3zc.us-east-2.rds.amazonaws.com',
		port: '3306',
		user: 'EECS341IFAMD',
		password: 'BdpicXQEBtpUjgK1VLIx',
		database: 'ifamd',
		timezone: 'utc' 
	})

	connection.connect(function(err) {
		if(err){
			const failed = {
				type: 'info',
				title: 'Connection Error',
				buttons: ['OK'],
				message: 'An Error Occurred When Trying to Contact Database:\n' + err.code
			}
			dialog.showMessageBox(focusedWindow, failed);
		}
	})
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
	const :{ width, height } = screen.getPrimaryDisplay().workAreaSize,
    width: parseInt(width*0.55),
    height: parseInt(height*0.65),
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
										buttons: ['分かりました！'],
										message: 'You don\'t need help.'
								}
								dialog.showMessageBox(mainWindow, options)
						}
					}
				},
				{label: 'Gimme Money',
				 click: () => {shell.openExternal('https://www.paypal.com/us/home')}},
				{type: 'separator'},
				{label: 'Exit',
				 role: 'close'}
			]
		},
		{
			label: 'Connection',
			submenu: [
				{label: 'Connection Status',
					click: function(item, focusedWindow) {
						if (focusedWindow) {
							const retry = {
									type: 'info',
									title: 'Info',
									message: "Status: " + connection.state
							}
							dialog.showMessageBox(mainWindow, retry)
						}
					}
				},
				{label: 'Retry Connection',
				 click: function(){contactDatabase(mainWindow)}
				}

			]
		}
	]

	const menu = Menu.buildFromTemplate(template)
	Menu.setApplicationMenu(menu)

	mainWindow.loadURL(`file://${__dirname}/index.html`)
	mainWindow.once('ready-to-show', () => {
		contactDatabase(mainWindow);
		mainWindow.show()
	})

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
	connection.end()
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

ipcMain.on('lookupPlayer', (event, arg) => {
	if (arg.length === 0){dialog.showErrorBox('Empty Field','Please complete the query.')}
	else{
		$findPlayer = "SELECT * FROM Player WHERE Player.short_name = '" + arg + "';"
		submitQuery($findPlayer)
	}
})

ipcMain.on('lookupClub', (event, arg) => {
	if (arg.length === 0){dialog.showErrorBox('Empty Field','Please complete the query.')}
	else{
		$findClub = "SELECT * FROM Club WHERE Club.club_Name = '" + arg + "';"
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
		console.log(arg)
		submitQuery(arg)
	}
})

//submit whatever query the user entered. If nothing is returned, this function
//will throw an error box.
const submitQuery = ($queryString) => {
	connection.query($queryString, (err, rows, fields) => {
		if(err){
			dialog.showErrorBox('An Error has Occurred', String(err))
		}else{
			const jsonData = JSON.parse(JSON.stringify(rows))
			if(jsonData.length !== 0){
				//console.log("jsondata", jsonData)
				saveToFile(jsonData)
			}else{
				dialog.showErrorBox("No Result", "Query did not Return Any Results.")
			}
		}
	})
}

//if the user so choose to save the file, this function is invoked.
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
