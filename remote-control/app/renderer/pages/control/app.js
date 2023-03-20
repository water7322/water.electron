const { ipcRenderer } = require('electron');
const peer = require('./peer-control');

// ipcRenderer.on('add-stream', async (event, sourceId) => {
//     try {
//         console.log(window.screen.width);
//         const stream = await navigator.mediaDevices.getUserMedia({
//             audio: false,
//             video: {
//                 mandatory: {
//                     chromeMediaSource: 'desktop',
//                     chromeMediaSourceId: sourceId,
//                     maxWidth: window.screen.width,
//                     maxHeight: window.screen.height
//                 }
//             }
//         });
//         console.log(stream);
//         play(stream);
//     } catch (e) {
//         handleError(e);
//     }
// });

peer.on('add-stream', (stream) => {
    console.log("play stream", stream);
    play(stream);
});
const video = document.getElementById('screen-video');
function handleError(e) {
    console.log(e);
}

function play(steam) {
    const video = document.getElementById('screen-video');
    video.srcObject = steam;
    video.onloadedmetadata = (e) => {
        video.play();
    };
}

window.onmouseup = function (e) {
    const data = {
        clientX: e.clientX,
        clientY: e.clientY,
        video: {
            width: video.getBoundingClientRect().width,
            height: video.getBoundingClientRect().height,
        }
    };
    peer.emit('robot', 'mouse', data);
};
window.onkeydown = function (e) {
    const data = {
        keyCode: e.keyCode,
        shift: e.shiftKey,
        meta: e.metaKey,
        ctrl: e.ctrlKey,
        alt: e.altKey
    };
    peer.emit('robot', 'key', data);
};