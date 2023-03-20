const { app } = require('electron');
const handleIPC = require('./ipc');
const { create: createMainWindow, show: showMainWindow, close: closeMainWindow } = require('./window/main');
const { create: createControlWindow } = require('./window/control');
const remoteMain = require('@electron/remote/main');
app.allowRendererProcessReuse = false;

// const gotTheLock = app.requestSingleInstanceLock();
// if (!gotTheLock) {
//     app.quit();
// } else {
    // app.on('second-instance', () => {
    //     showMainWindow();
    // });
    app.whenReady().then(() => {
        // createControlWindow();
        remoteMain.initialize();
        createMainWindow();
        handleIPC();
        require('./trayAndMenu');
        require('./robot.js')();
    });
    app.on('before-quit', () => {
        closeMainWindow();
    });
    app.on('activate', () => {
        showMainWindow();
    });
// }



















// const totalMonth = 12;
// const dayEveryMonth = 21.75;
// const hoursInNowcoder = 2 + 4.5 + 1.5;
// const hoursInPdd = 2 + 4 + 2;
// const packageInNowcoder = 440000;
// const baseInPdd = 44000;
// const packageInPdd = baseInPdd * 16;
// const totalHoursInNowcoder = totalMonth * dayEveryMonth * hoursInNowcoder;
// const totalHoursInPdd = totalMonth * dayEveryMonth * hoursInPdd;
// const priceOfHoursInNowcoder = packageInNowcoder / totalHoursInNowcoder;
// const priceOfHoursInPdd = packageInPdd / totalHoursInPdd;
// console.log(priceOfHoursInNowcoder);
// console.log(priceOfHoursInPdd);

// const extraPackage = baseInPdd * 2;
// const extraDays = 48;
// const extraHours = extraDays * hoursInPdd * 2
// const realPriceOfHoursInPdd = (packageInPdd + extraPackage) / (totalHoursInPdd + extraHours)
// console.log(realPriceOfHoursInPdd)