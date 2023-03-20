const { app, Tray, Menu } = require('electron');
const { show: showMainWindow } = require('../window/main');
const { create: createAboutWindow } = require('../window/about');
const path = require('path');

let tray;
function setTray() {
    tray = new Tray(path.resolve(__dirname, './icon_darwin.png'));

    tray.on('click', () => {
        showMainWindow();
    });
    tray.on('right-click', () => {
        const contestMenu = Menu.buildFromTemplate([
            { label: '显示', click: showMainWindow },
            { label: '退出', click: app.quit }
        ]);
        tray.popUpContextMenu(contestMenu);
    });
}

function setAppMenu() {
    const appMenu = Menu.buildFromTemplate([
        {
            label: app.name,
            submenu: [
                {
                    label: 'About',
                    click: createAboutWindow
                },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideOthers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        },
        { role: 'fileMenu' },
        { role: 'windowMenu' },
        { role: 'editMenu' }
    ]);
    app.applicationMenu = appMenu;
}
setTray();
setAppMenu();