const { ipcRenderer } = require('electron');
const Timer = require('timer.js');

function startWork() {
    const workTimer = new Timer({
        ontick: (ms) => {
            updateTime(ms);
        },
        onend: () => {
            notification();
        }
    });
    workTimer.start(10);
}

function updateTime(ms) {
    const timerContainer = document.getElementById('timer-container');
    timerContainer.innerText = ms;
}

async function notification() {
    const res = await ipcRenderer.invoke('work-notification');
    if (res === 'rest') {
        setTimeout(() => {
            alert('休息');
        }, 5 * 1000);
    } else if (res === 'work') {
        startWork();
    }
}

startWork();

console.log(versions.chrome());
console.log(123)
const information = document.getElementById('info');
information.innerText = `本应用正在使用 Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), 和 Electron (v${versions.electron()})`;
