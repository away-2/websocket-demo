export const socketServer = io => {
  let userList = new Map()
  io.on('connection', socket => {
    // 监听加入用户加入
    socket.on('join', e => {
      userList.set(socket.id, e)
      // 加入成功后返回加入成功的事件
      socket.emit('joined', Object.assign({}, e, { id: socket.id }))
      const uList = [...userList.entries()]
      // 触发广播
      socket.broadcast.emit('welcome', {
        ...e,
        uList,
      })
      // 自己展示加入的信息
      socket.emit('welcome', {
        ...e,
        uList,
      })
    })

    // 监听消息发送
    socket.on('send', e => {
      // 接受到消息给他广播出去
      socket.broadcast.emit('message', e)
    })

    // 用户离开
    socket.on('disconnecting', () => {
      const bool = userList.delete(socket.id)
      // 如果有用户离开，再进行广播（因为只打开页面不进入关闭页面也会触发这个事件）
      bool && socket.broadcast.emit('quit', socket.id)
    })
  })
}

// connection：当有客户端连接时触发。为每个客户端分配一个 socket.id，并在连接后处理不同的事件（如加入、发送消息、退出等）。

// join：当一个客户端请求加入时，服务端接收到 join 事件后，会将该用户信息存储到 userList 中，并通过 joined 事件返回给客户端，包括该用户的 id 和其他信息（例如 name 和 avatar）。

// send：监听客户端发送的群聊消息，接收到消息后会广播给所有连接的客户端（除了发送者）。

// disconnecting：当客户端断开连接时触发，服务端会将该客户端从 userList 中删除，并广播 quit 事件通知所有其他客户端该用户已退出。

// 心跳机制服务端
// const WebSocket = require('ws');

// 创建 WebSocket 服务器并监听 8080 端口
// const wss = new WebSocket.Server({ port: 8080 });

// 当客户端连接时触发
// wss.on('connection', (ws) => {
//   console.log('Client connected');
//   // 接收客户端消息
//   ws.on('message', (message) => {
//     console.log(`Received: ${message}`);
//     // 向客户端发送回声消息
//     ws.send(`Echo: ${message}`);
//   });
//   // 实现心跳机制
//   const interval = setInterval(() => {
//     if (ws.readyState === WebSocket.OPEN) {
//       ws.send('ping'); // 发送心跳包
//     }
//   }, 30000); // 每30秒发送一次心跳包
//   // 客户端关闭连接时清除心跳机制
//   ws.on('close', () => {
//     clearInterval(interval);
//     console.log('Client disconnected');
//   });
// });

// 心跳机制：客户端
// const ws = new WebSocket('ws://localhost:8080');
// let heartbeatInterval;
// ws.onopen = () => {
//   console.log('Connected to server');
//   heartbeatInterval = setInterval(() => {
//     if (ws.readyState === WebSocket.OPEN) {
//       ws.send('ping'); // 客户端发送心跳包
//     }
//   }, 30000); // 每30秒发送一次心跳
// };
// ws.onmessage = (event) => {
//   console.log('Received:', event.data);
//   if (event.data === 'ping') {
//     ws.send('pong'); // 响应服务器的心跳包
//   }
// };
// ws.onclose = () => {
//   clearInterval(heartbeatInterval);
//   console.log('Connection closed');
// };
