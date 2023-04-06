const { BrowserWindow, BrowserView, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const remoteMain = require('@electron/remote/main');

let win;
let willQuitApp = false;
function create() {
    win = new BrowserWindow({
        width: 1000,
        height: 680,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
        show: false
    });
    // const view = new BrowserView();
    // win.addBrowserView(view);
    // view.setBounds({ x: 0, y: 0, width: 800, height: 600 });
    // view.webContents.loadFile('./loading.html');
    // view.webContents.on('dom-ready', () => {
    //     win.show();
    // });
    // ipcMain.on('stop-loading-main', () => {
    //     win.removeBrowserView(view);
    // });
    remoteMain.enable(win.webContents);
    win.on('close', (e) => {
        if (willQuitApp) {
            win = null;
        } else {
            e.preventDefault();
            win.hide();
        }
    });

    win.on('ready-to-show', () => {
        win.show();
    });

    if (isDev) {
        win.loadURL('http://localhost:3000');
        win.webContents.openDevTools();
    } else {
        win.loadFile(path.resolve(__dirname, '../../renderer/pages/main/index.html'));
        win.webContents.openDevTools();
    }
};

function send(channel, ...args) {
    win.webContents.send(channel, ...args);
}
function show() {
    win.show();
}
function close() {
    willQuitApp = true;
    win.close();
}
module.exports = { create, send, show, close };