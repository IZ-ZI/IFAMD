// Modules to control application life and create native browser window
const {BrowserWindow, app, Menu, dialog, shell} = require('electron')
const path = require('path')
const url = require('url')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
		show: false,
    // webPreferences: {
    //   preload: path.join(__dirname, 'preload.js')
    // }
  })

	const template = [
		{
			label: 'Help',
			submenu: [
				{label: 'App info',
				click: function(item, focusedWindow) {
          if (focusedWindow) {
              const options = {
                  type: 'info',
                  title: 'INFO',
                  buttons: ['分かりました！'],
                  message: 'You don\'t need help.'
              }
              dialog.showMessageBox(focusedWindow, options)
          }
				}},
				{label: 'Gimme Money',
				 click: () => {shell.openExternal('https://www.paypal.com/us/home')}},
				{type: 'separator'},
				{label: 'Exit',
			   role: 'close'}
			]
		}
	]

	const menu = Menu.buildFromTemplate(template)
	Menu.setApplicationMenu(menu)

	// and load the index.html of the app.
	mainWindow.loadFile('IFAMD.html')
	mainWindow.once('ready-to-show', () => {
  mainWindow.show()
	})

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// let menu = [{
//     label: 'File',
//     submenu: [{
//         label: 'Bulk Insert'
//         // click: function(item, focusedWindow) {
//         //     if (focusedWindow) {
//         //         const options = {
//         //             type: 'info',
//         //             title: 'Bulk insert',
//         //             buttons: ['分かりました！'],
//         //             message: 'This is where we should open up a system dialog for user to select .csv.'
//         //         }
//         //         dialog.showMessageBox(focusedWindow, options, functions() {})
//         //     }
//         // }
//     }]
// }]

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
