const { BrowserWindow } = require('electron');
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
            contextIsolation: false
        }
    });
    remoteMain.enable(win.webContents);
    win.on('close', (e) => {
        if (willQuitApp) {
            win = null;
        } else {
            e.preventDefault();
            win.hide();
        }
    });
    if (isDev) {
        win.loadURL('http://localhost:3000');
        win.webContents.openDevTools();
    } else {
        win.loadFile(path.resolve(__dirname, '../../renderer/pages/main/index.html'));
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