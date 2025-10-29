const { app, BrowserWindow } = require('electron/main');
const path = require('node:path');

app.whenReady().then(() => {
  const browserWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'electron/preload.js'),
    },
  });

  browserWindow.loadFile('dist/angular-electron-application/browser/index.html');
});
