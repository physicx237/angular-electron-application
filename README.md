# Angular Electron Application

```ts
const { app, BrowserWindow } = require('electron');

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  win.loadFile('dist/angular-electron-application/browser/index.html');
});
```
