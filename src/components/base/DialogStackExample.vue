<template>
  <div class="dialog-stack-example">
    <h1>弹窗栈示例</h1>
    <p>当前路由: {{ currentRouteName }}</p>
    <p>弹窗栈深度: {{ dialogStore.currentDepth }}</p>
    
    <van-button type="primary" @click="openFirstDialog">打开第一个弹窗</van-button>
    <van-button type="success" @click="openSecondDialog">打开第二个弹窗</van-button>
    <van-button type="danger" @click="closeAllDialogs">关闭所有弹窗</van-button>
    
    <!-- 第一个弹窗 -->
    <van-popup v-model:show="firstDialogVisible" position="center" round>
      <div class="dialog-content">
        <h2>第一个弹窗</h2>
        <p>按返回键应该关闭当前弹窗，回到页面</p>
        <van-button type="primary" @click="closeFirstDialog">关闭</van-button>
        <van-button type="success" @click="openSecondDialog">打开第二个弹窗</van-button>
      </div>
    </van-popup>
    
    <!-- 第二个弹窗 -->
    <van-popup v-model:show="secondDialogVisible" position="center" round>
      <div class="dialog-content">
        <h2>第二个弹窗</h2>
        <p>按返回键应该关闭当前弹窗，回到第一个弹窗</p>
        <van-button type="primary" @click="closeSecondDialog">关闭</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDialogStackStore } from '@/stores'

const route = useRoute()
const dialogStore = useDialogStackStore()

// 弹窗可见性状态
const firstDialogVisible = ref(false)
const secondDialogVisible = ref(false)

// 获取当前路由名称
const currentRouteName = computed(() => {
  return route.name || route.path
})

// 打开第一个弹窗
const openFirstDialog = () => {
  firstDialogVisible.value = true
  // 将关闭函数推入弹窗栈
  dialogStore.push(() => {
    firstDialogVisible.value = false
  })
}

// 关闭第一个弹窗
const closeFirstDialog = () => {
  firstDialogVisible.value = false
  // 从弹窗栈中弹出
  dialogStore.pop()
}

// 打开第二个弹窗
const openSecondDialog = () => {
  secondDialogVisible.value = true
  // 将关闭函数推入弹窗栈
  dialogStore.push(() => {
    secondDialogVisible.value = false
  })
}

// 关闭第二个弹窗
const closeSecondDialog = () => {
  secondDialogVisible.value = false
  // 从弹窗栈中弹出
  dialogStore.pop()
}

// 关闭所有弹窗
const closeAllDialogs = () => {
  firstDialogVisible.value = false
  secondDialogVisible.value = false
  // 清空当前路由的弹窗栈
  dialogStore.clearCurrent()
}

// 组件挂载时设置当前路由
onMounted(() => {
  dialogStore.setCurrentRoute(currentRouteName.value)
})

// 组件卸载时清空当前路由的弹窗栈
onUnmounted(() => {
  dialogStore.clearCurrent()
})
</script>

<style scoped>
.dialog-stack-example {
  padding: 20px;
  text-align: center;
}

.dialog-content {
  padding: 20px;
  min-width: 280px;
}

.dialog-content h2 {
  margin-bottom: 10px;
}

.dialog-content p {
  margin-bottom: 20px;
  color: #666;
}

.van-button {
  margin: 0 10px;
}
</style>
