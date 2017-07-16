const electron = require('electron')
const electron = require('electron-settings')
const {app, BrowserWindow} = electron

app.on('ready', function() {

  var mainWindow = new BrowserWindow({
    width: 1280,
    height: 720
  })
  mainWindow.loadURL(BrowserURL)

})
