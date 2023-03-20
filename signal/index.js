const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8010 });
const code2ws = new Map();

wss.on('connection', function connection(ws, request) {
    // ws => 端
    const code = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    code2ws.set(code, ws);
    ws.sendData = (event, data) => {
        ws.send(JSON.stringify({ event, data }));
    };
    ws.on('message', function incoming(message) {
        console.log('incoming', message);
        let parseMessage = {};
        try {
            parseMessage = JSON.parse(message);
        } catch (e) {
            ws.sendError('message invalid');
            console.log('parse message error', e);
            return;
        }
        const { event, data } = parseMessage;
        if (event === 'login') {
            ws.sendData('logined', { code });
        } else if (event === 'control') {
            const remote = +data.remote;
            if (code2ws.has(remote)) {
                ws.sendData('controlled', { remote });
                const remoteWs = code2ws.get(remote);
                ws.sendRemote = remoteWs.sendData;
                remoteWs.sendRemote = ws.sendData;
                ws.sendRemote('be-controlled', { remote: code });
            }
        } else if (event === 'forward') {
            // daat = {event, data}
            ws.sendRemote(data.event, data.data);
        }
    });

    ws.on('close', () => {
        code2ws.delete(code);
        clearTimeout(ws._closeTimeout);
    });
    ws._closeTimeout = setTimeout(() => {
        ws.terminate();
    }, 10 * 60 * 1000);
});