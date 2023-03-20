// createAnswer
// addstream
// const { desktopCapturer } = require('electron');

const { ipcRenderer } = require("electron");

async function getScreenStream(sourceId = 'screen:69734272:0') {
    // const sources = await desktopCapturer.getSources({ types: ['screen'] });
    console.log(sourceId);
    return new Promise((resolve, reject) => {
        navigator.webkitGetUserMedia({
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: sourceId,
                    maxWidth: window.screen.width,
                    maxHeight: window.screen.height,
                }
            }
        }, (stream) => {
            resolve(stream);
        }, (err) => {
            console.error(err);
        });
    });
}
const pc = new window.RTCPeerConnection({});
pc.ondatachannel = (e) => {
    console.log('datachannel', e);
    e.channel.onmessage = (e) => {
        const { type, data } = JSON.parse(e.data);
        if (type === 'mouse') {
            data.screen = {
                width: window.screen.width,
                height: window.screen.height
            };
        }
        ipcRenderer.send('robot', type, data);
    };
};
// onicecandidate iceEvent
// addIceCandidate
pc.onicecandidate = function (e) {
    console.log('candidate', JSON.stringify(e.candidate));
    if (e.candidate) {
        ipcRenderer.send('forward', 'puppet-candidate', e.candidate.toJSON());
    }
};
ipcRenderer.on('candidate', (e, candidate) => {
    addIceCandidate(candidate);
});
let candidates = [];
async function addIceCandidate(candidate) {
    if (candidate) {
        candidates.push(candidate);
    }
    if (pc.remoteDescription?.type) {
        for (const candidate of candidates) {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
        candidates = [];
    }
}

window.addIceCandidate = addIceCandidate;
ipcRenderer.on('offer', async (e, offer) => {
    const answer = await createAnwser(offer);
    ipcRenderer.send('forward', 'answer', { type: answer.type, sdp: answer.sdp });
});
async function createAnwser(offer, sourceId) {
    const screenStream = await getScreenStream(sourceId);
    pc.addStream(screenStream);
    await pc.setRemoteDescription(offer);
    await pc.setLocalDescription(await pc.createAnswer());
    console.log('answer', JSON.stringify(pc.localDescription));
    return pc.localDescription;
}

window.createAnwser = createAnwser;