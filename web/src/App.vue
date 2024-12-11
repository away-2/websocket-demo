<template>
  <!-- 外层容器 -->
  <MainContainer>
    <!-- 顶部栏 -->
    <NavHeader :group-name="'聊天室'" :person-number="userList.size" />
    <!-- 内容区域 -->
    <div class="px-4">
      <ChatItem :chat-data="chatData" @click-user="handleClickUserAvatar" />
    </div>
    <InputBox v-model="message" @send="handleSend" />
  </MainContainer>
  <JoinModal @join="handleJoin" />
</template>

<script setup>
import { reactive, ref } from 'vue'
import MainContainer from './components/MainContainer.vue'
import NavHeader from './components/NavHeader.vue'
import ChatItem from './components/ChatItem.vue'
import InputBox from './components/InputBox.vue'
import JoinModal from './components/JoinModal.vue'
import { io } from 'socket.io-client'

// 创建 socket 实例
const socket = io('ws://localhost:5432')

const chatData = ref([]) // 聊天数据
const userList = ref(new Map()) // 在线用户列表
const message = ref('') // 当前输入框的消息
// 当前用户信息
const curUser = reactive({
  name: '',
  avatar: '',
  id: '',
})

const handleJoin = (e) => {
  socket.emit('join', Object.assign({}, e))
}

socket.on('joined', (e) => {
  curUser.avatar = e.avatar
  curUser.id = e.id
  curUser.name = e.name
})

// 监听 welcome 新用户加入
socket.on('welcome', ({ name, uList }) => {
  uList.forEach((item) => {
    const [id, value] = item
    userList.value.set(id, value)
  })
  // 添加一条欢迎消息到 chatData
  chatData.value.push({
    type: 'tips',
    id: Math.random().toString().split('.')[1].slice(0, 10),
    content: '欢迎' + name + '加入群聊~',
  })
})

// 群聊发送消息
const handleSend = (v) => {
  const obj = {
    id: Math.random().toString().split('.')[1].slice(0, 10),
    name: curUser.name,
    avatar: curUser.avatar,
    content: v,
    userId: curUser.id,
  }
  const type = 'me'
  chatData.value.push(Object.assign({}, { type }, obj))
  message.value = ''
  socket.emit('send', obj)
}

// 监听群聊消息的广播
socket.on('message', (e) => {
  const msg = Object.assign({}, e, { type: 'your' })
  chatData.value.push(msg)
})

// 监听接受消息
socket.on('message-user', (e) => {
  const msg = Object.assign({}, e, { type: 'your' })
  const sendId = e.userId
  if (!userChatData.value.has(sendId)) {
    userChatData.value.set(sendId, [])
  }
  const chatData = userChatData.value.get(sendId) || []
  chatData.push(msg)
  const u = userList.value.get(sendId)
  if (u) {
    u.new = true
  }
})

// 监听退出
socket.on('quit', (id) => {
  const user = userList.value.get(id)
  userList.value.delete(id)
  chatData.value.push({
    type: 'tips',
    id: Math.random().toString().split('.')[1].slice(0, 10),
    content: user?.name + '退出群聊~',
  })
})
</script>
