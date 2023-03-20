const { ipcMain } = require('electron');
const robot = require('robotjs');
const vkey = require('vkey');
function handleMouse(data) {
    // data {clientX, clientY, screen: {width, height}, video: {width, height}}
    const { clientX, clientY, screen, video } = data;
    const x = clientX * screen.width / video.width;
    const y = clientY * screen.height / video.height;
    console.log(x, y);
    robot.moveMouse(x, y);
    robot.mouseClick();
}

function handleKey(data) {
    // data {clientX, clientY, screen: {width, height}, video: {width, height}}
    const modifiers = [];
    if (data.meta) modifiers.push('meta');
    if (data.shift) modifiers.push('shift');
    if (data.alt) modifiers.push('alt');
    if (data.ctrl) modifiers.push('ctrl');
    const key = vkey[data.keyCode].toLowerCase();
    console.log(key);
    if (key[0] !== '<') {
        robot.keyTap(key, modifiers);
    }
}

module.exports = function () {
    ipcMain.on('robot', (e, type, data) => {
        console.log('handle', type, data);
        if (type === 'mouse') {
            handleMouse(data);
        } else if (type === 'key') {
            handleKey(data);
        }
    });
};
