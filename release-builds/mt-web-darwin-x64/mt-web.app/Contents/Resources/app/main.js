const electron = require('electron')
const settings = require('electron-settings')
const prompt = require('electron-prompt')
const {app, BrowserWindow, Menu} = electron

//get the meta trader web URL
var mturl = settings.get('mt.url');

app.on('ready', function() {
  //Define main window of the application
  var mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    title: 'MT-Web'
  })

  //Define the application menu for anything than OSX
  if (process.platform != 'darwin'){
    const template = [
      {
        label: 'MT-Web',
        submenu: [
          {
            label: 'Settings',
            //click() {opensettings()}
            click() {
              prompt({
                title: 'Enter Metatrader URL',
                label: 'URL:',
                value: 'http://www.example.org',
                inputAttrs: {
                  type: 'url'
                }
              })
              .then((r) => {
                console.log('result', r); //null if window was closed, or user clicked Cancel
                settings.set('mt', {url: r});
                mturl = settings.get('mt.url');
                mainWindow.loadURL(mturl);
              })
              .catch(console.error);
            }
          },
          {
            label: 'Quit',
            click() {app.quit();}
          }
        ]
      }]
      //set the application menu
      const menu = Menu.buildFromTemplate(template)
      Menu.setApplicationMenu(menu)
    }
    //Define the application menu for OSX
     if (process.platform === 'darwin') {
      const osxtemplate = [{
        label: 'MT-Web',
        submenu: [
          {
            label: 'Preferences',
            accelerator: 'CmdOrCtrl+,',
            click() {
              prompt({
                title: 'Enter Metatrader URL',
                label: 'URL:',
                value: mturl,
                inputAttrs: {
                  type: 'url'
                }
              })
              .then((r) => {
                settings.set('mt', {url: r});
                mturl = settings.get('mt.url');
                mainWindow.loadURL(mturl);
              })
              .catch(console.error);
            }
          },
          {
          label: 'Quit',
          accelerator: 'CmdOrCtrl+Q',
          click: function() { app.quit();
          }
        }]
      }, {
        label: 'Edit',
        submenu: [{
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          selector: 'undo:'
        }, {
          label: 'Redo',
          accelerator: 'Shift+CmdOrCtrl+Z',
          selector: 'redo:'
        }, {
          type: 'separator'
        }, {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          selector: 'cut:'
        }, {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          selector: 'copy:'
        }, {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          selector: 'paste:'
        }, {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          selector: 'selectAll:'
        }]
      }]
      //set the application menu
      const osxmenu = Menu.buildFromTemplate(osxtemplate)
      Menu.setApplicationMenu(osxmenu)
    }

  //Load the URL stored in the settings
  if (mturl === null) {
    mainWindow.loadURL('file://' + __dirname + '/nourlset.html')
  } else {
    mainWindow.loadURL(mturl)
  }

  mainWindow.on('close', function() {
    app.quit()
  })
});

function opensettings(){
  //Define settings window of the application. Do not show the window by default
  var settingsWindow = new BrowserWindow({
    width: 600,
    height: 400
  })
  //Load the settings.html in the settings window and hide any additional menu

  settingsWindow.loadURL('file://' + __dirname + '/settings.html')
  settingsWindow.setMenu(null)
}

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
    app.quit();
});
