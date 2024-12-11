import { Server } from 'socket.io'
import { socketServer } from './model/socket.js'
// 开启cors跨域
const io = new Server(5432, { cors: true })

socketServer(io)
// io.on('connection', socket => {
//   console.log('连接成功')

//   // 从客户端收到消息
//   socket.on('send', e => {
//     console.log(e)
//     socket.emit('back', '服务器返回的消息')
//   })

//   socket.on('disconnecting', () => {
//     console.log('用户离开，连接断开')
//   })
// })
