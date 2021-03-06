'use strict';

const {app, BrowserWindow, dialog} = require('electron');
// const {dialog} = require('electron').remote;
const opn = require('opn');

require('./server.js').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// messagebox when the server has started to show you where it is
function showServerStarted() {
  var ifs = require('os').networkInterfaces();
  var currentIP = Object.keys(ifs)
    .map(x => [x, ifs[x].filter(x => x.family === 'IPv4')[0]])
    .filter(x => x[1])
    .map(x => x[1].address);

  dialog.showMessageBox({
    type: 'info',
    message: `Open http://${currentIP[1]}:3000/admin on another computer to control the cautions and warnings`,
    buttons: ['ok']
  });
}

require('electron-context-menu')({
  prepend: () => [{
    label: 'Show IP',
    click() {
      showServerStarted();
    }
  }]
});

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 760,
    height: 760,
    icon: 'src/img/favicon-804.png'
  });

  // and load the index.html of the app.
  mainWindow.loadURL('http://localhost:3000');

  // external urls should be opened in the regular browser
  function handleRedirect(e, url) {
    if (url.includes('http')) {
      e.preventDefault();
      opn(url);
    }
  }

  mainWindow.webContents.on('will-navigate', handleRedirect);
  mainWindow.webContents.on('new-window', handleRedirect);
  showServerStarted();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
