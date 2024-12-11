<template>
  <div class="form-control mt-4">
    <div class="input-group px-4">
      <input type="text" v-model="value" placeholder="请输入..." class="input input-bordered w-full"
        style="--tw-bg-opacity: 0.7" @keyup.enter="handleSend" />
      <button class="btn btn-square" style="--tw-bg-opacity: 0.7" @click="handleSend">
        发送
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
// 接收一个名为 modelValue 的 prop
interface Props {
  modelValue: string
}
const props = defineProps<Props>()

 //  定义两个事件
const emits = defineEmits(['update:modelValue', 'send'])

//  定义一个计算属性，监听 modelValue 的变化
const value = computed({
  // 当 value 被访问时，返回 props.modelValue
  get() {
    return props.modelValue
  },
  // 当 value 被修改时，emits 事件并将修改后的值更新到 props.modelValue
  set(v) {
    emits('update:modelValue', v)
  },
})

// 发送消息
const handleSend = () => {
  emits('send', value.value)
}
</script>

<style scoped></style>
