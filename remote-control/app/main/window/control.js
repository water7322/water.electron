const { BrowserWindow, desktopCapturer } = require('electron');
const path = require('path');

let win;
function create() {
    win = new BrowserWindow({
        width: 1000,
        height: 680,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    win.loadFile(path.resolve(__dirname, '../../renderer/pages/control/index.html'));
    win.webContents.openDevTools();

    desktopCapturer.getSources({ types: ['screen'] }).then(sources => {
        console.log(sources);
        // for (const source of sources) {
        //     if (source.name === '屏幕 1') {
        //         console.log(source.id);
        //         win.webContents.send('add-stream', source.id);
        //         return;
        //     }
        // }
    });
};
function send(channel, ...args) {
    win.webContents.send(channel, ...args);
}
module.exports = { create, send };