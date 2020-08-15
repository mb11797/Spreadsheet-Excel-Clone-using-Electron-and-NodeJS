// Installation:
// 1. create main.js
// 2. cd => main.js
// 3. npm init -y
// 4. npm install electron --save-dev
// 5. npm install --save-dev jquery

// To run:
// npm start

//not much high use of electron 
// https://www.electronjs.org/docs/tutorial/first-app
// https://www.electronjs.org/docs/tutorial/first-app#electron-development-in-a-nutshell

// let ab use nhn karenge 
// ab const use karenge => value remains constant
// const a = 10;
// a = 20;

const electron = require("electron")
const app = electron.app;
const ejs = require("ejs-electron");

ejs.data({
  "title": "My Excel 1.0",
  "rows": 100,
  "cols": 26
})

function createWindow() {
  const win = new electron.BrowserWindow({
    width: 800,
    height: 600,
    //to open app in hidden 
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile("index.html").then(function () {
    //to remove default menu
    win.removeMenu();
    //maximize
    win.maximize();
    //unhide app so that user could view it
    win.show();
    //to open dev tools
    win.webContents.openDevTools();
  });
}

// app.whenReady() => package kardega app ko => desktop open => by calling createWindow
app.whenReady().then(createWindow);


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.