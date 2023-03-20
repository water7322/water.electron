控制端渲染进程输入傀儡端的 code

控制端渲染进程 send control 到控制端主进程

```js
ipcRenderer.send('control', remoteCode);
```

控制端主进程监听 control，发送到 signal 信令服务器

```js
ipcMain.on('control', async (e, remote) => {
    signal.send('control', { remote });
});
```

signal 信令服务器通知控制端主进程正在控制傀儡端（傀儡端 remote），通知傀儡端主进程正在被控制端控制（控制端 code）

```js
ws.on('message', function incoming(message) {
    // xxx
    ws.sendData('controlled', { remote });
    ws.sendRemote = code2ws.get(remote).sendData;
    ws.sendRemote('be-controlled', { remote: code });
    /// xxx
});
```

各自执行相应逻辑

```js
ws.on('message', (message) => {
    signal.emit(data.event, data.data);
});
```

控制端 createControlWindow 创建控制窗口，执行渲染进程 control-state-change 事件

```js
// 这里的send就是sendMainWindow
function send(channel, ...args) {
    win.webContents.send(channel, ...args);
}
signal.on('controlled', (data) => {
    // 这里跟服务端交互，成功后会唤起面板
    sendMainWindow('control-state-change', data.remote, 1);
    createControlWindow();
});
```

傀儡端执行渲染进程 control-state-change 事件

```js
// 这里的send就是sendMainWindow
function send(channel, ...args) {
    win.webContents.send(channel, ...args);
}
signal.on('be-controlled', (data) => {
    sendMainWindow('control-state-change', data.remote, 2);
});
```

控制端和傀儡端渲染进程监听 control-state-change 事件，handleControlState 更新各自状态

```js
ipcRenderer.on('control-state-change', handleControlState);
```

控制窗口引入 peer-control.js，创建 offer，ipcRenderer.send 发送到控制端主进程

```js
createOffer().then((offer) => {
    ipcRenderer.send('forward', 'offer', { type: offer.type, sdp: offer.sdp });
});
```

控制端主进程 ipcMain.on 拿到 offer，发送给 signal 信令服务器

```js
ipcMain.on('forward', (e, event, data) => {
    signal.send('forward', { event, data });
});
```

信令服务器发送 offer 到傀儡端

```js
ws.sendRemote(data.event, data.data);
```

傀儡端 ws 拿到 offer，发送到傀儡端主进程

```js
ws.on('message', (message) => {
    signal.emit(data.event, data.data);
});
signal.on('offer', (data) => {
    sendMainWindow('offer', data);
});
```

傀儡端主进程拿到 offer，发送到傀儡端渲染进程

```js
function send(channel, ...args) {
    win.webContents.send(channel, ...args);
}
```

傀儡端渲染进程引入 peer-puppet.js，拿到 offer 后，创建 answer，发送 answer 到傀儡端主进程

```js
ipcRenderer.on('offer', async (e, offer) => {
    const answer = await createAnwser(offer);
    ipcRenderer.send('forward', 'answer', { type: answer.type, sdp: answer.sdp });
});
```

傀儡端主进程拿到 answer，发送到 signal 信令服务器

```js
ipcMain.on('forward', (e, event, data) => {
    signal.send('forward', { event, data });
});
```

信令服务器发送 answer 到控制端

```js
ws.sendRemote(data.event, data.data);
```

控制端 ws 拿到 answer，发送到控制端主进程

```js
ws.on('message', (message) => {
    signal.emit(data.event, data.data);
});
signal.on('anwser', (data) => {
    sendControlWindow('anwser', data);
});
```

控制端主进程拿到 anwser，发送到控制窗口

```js
function send(channel, ...args) {
    win.webContents.send(channel, ...args);
}
```

傀儡端渲染进程引入 peer-control.js，拿到 answer

```js
ipcRenderer.on('answer', (e, answer) => {
    setRemote(answer);
});
```
