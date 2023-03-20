const { app, BrowserWindow, Notification, ipcMain } = require('electron');
// require('update-electron-app')()
const path = require('path');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    win.loadFile('./index.html');
    handleIPC();
};
app.whenReady().then(() => {
    createWindow();
    // app.on('activate', () => {
    //     if (BrowserWindow.getAllWindows().length === 0) createWindow();
    // });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

function handleIPC() {
    ipcMain.handle('work-notification', async () => {
        const res = await new Promise((resolve, reject) => {
            const notification = new Notification({
                title: '任务结束',
                body: '是否开始休息',
                actions: [{ text: '开始休息', type: 'button' }],
                closeButtonText: '继续工作'
            });
            notification.show();
            notification.on('action', () => {
                resolve('rest');
            });
            notification.on('close', () => {
                resolve('work');
            });
        });
        return res;
    });
}
