const { app, Tray, Menu } = require('electron');
const { show: showMainWindow } = require('../window/main');
const { create: createAboutWindow } = require('../window/about');
const path = require('path');

let tray;
function setTray() {
    tray = new Tray(path.resolve(__dirname, './icon_win32.png'));
    const contestMenu = Menu.buildFromTemplate([
        { label: `打开${app.name}`, click: showMainWindow },
        { label: `关于${app.name}`, click: createAboutWindow },
        { type: 'separator' },
        { label: '退出', click: app.quit }
    ]);
    tray.setContextMenu(contestMenu);
}

function setAppMenu() {
    const appMenu = Menu.buildFromTemplate([]);
    app.applicationMenu = appMenu;
}
setTray();
setAppMenu();