const EventEmitter = require('events');
const peer = new EventEmitter();

const { ipcRenderer } = require('electron');

// peer.on('robot', (type, data) => {
//     console.log('robot', type, data);
//     if (type === 'mouse') {
//         data.screen = {
//             width: window.screen.width,
//             height: window.screen.height
//         };
//     }
//     setTimeout(() => {
//         ipcRenderer.send('robot', type, data);
//     }, 2000);
// });

const pc = new window.RTCPeerConnection();
const dc = pc.createDataChannel('robotchannel', { reliable: false });
dc.onopen = () => {
    peer.on('robot', (type, data) => {
        dc.send(JSON.stringify({ type, data }));
    });
};
dc.onmessage = (event) => {
    console.log('message', event);
};
dc.onerror = (e) => {
    console.log('error', e);
};
// onicecandidate iceEvent
// addIceCandidate
pc.onicecandidate = function (e) {
    console.log('candidate', JSON.stringify(e.candidate));
    if (e.candidate) {
        ipcRenderer.send('forward', 'control-candidate', e.candidate.toJSON());
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

async function createOffer() {
    const offer = await pc.createOffer({
        offerToReceiveAudio: false,
        offerToReceiveVideo: true
    });
    await pc.setLocalDescription(offer);
    console.log('pc offer', JSON.stringify(offer));
    return pc.localDescription;
}
createOffer().then((offer) => {
    ipcRenderer.send('forward', 'offer', { type: offer.type, sdp: offer.sdp });
});

async function setRemote(answer) {
    await pc.setRemoteDescription(answer);
}
ipcRenderer.on('answer', (e, answer) => {
    setRemote(answer);
});
window.setRemote = setRemote;
pc.onaddstream = function (e) {
    console.log('add-stream', e);
    peer.emit('add-stream', e.stream);
};
module.exports = peer;