<template>
  <div class="mine-tab-container">
    <h1>个人中心</h1>

    <button class="open-dialog-btn" @click="openDialog1">打开弹窗1</button>

    <!-- 弹窗1 -->
    <div v-if="showDialog1" class="dialog-overlay">
      <div class="dialog-content">
        <h2>弹窗1</h2>
        <p>这是弹窗1的内容</p>
        <button class="dialog-btn" @click="openDialog2">打开弹窗2</button>
        <button class="dialog-btn" @click="closeDialog1">关闭</button>
      </div>
    </div>

    <!-- 弹窗2 -->
    <div v-if="showDialog2" class="dialog-overlay">
      <div class="dialog-content">
        <h2>弹窗2</h2>
        <p>这是弹窗2的内容</p>
        <button class="dialog-btn" @click="closeDialog2">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBackButton } from '@/utils/hooks/useBackButton'

const route = useRoute()
const router = useRouter()

// 弹窗状态
const showDialog1 = ref(false)
const showDialog2 = ref(false)

// 使用回退功能 hook
const {
  pushHistory,
  popHistory,
  resetHistoryCount,
  getAddedHistoryCount,
  handlePopState,
  pushDialog,
  resetRouteState
} = useBackButton()

// 保存事件监听器引用
const popStateHandler = handlePopState(router, route)

// 打开弹窗1
const openDialog1 = () => {
  showDialog1.value = true
  pushHistory(router, route)
  pushDialog(route, () => {
    showDialog1.value = false
  })
}

// 关闭弹窗1
const closeDialog1 = () => {
  popHistory(router, route)
}

// 打开弹窗2
const openDialog2 = () => {
  showDialog2.value = true
  pushHistory(router, route)
  pushDialog(route, () => {
    showDialog2.value = false
  })
}

// 关闭弹窗2
const closeDialog2 = () => {
  popHistory(router, route)
}

// 生命周期
onMounted(() => {
  // 添加后退按钮事件监听器
  window.addEventListener('popstate', popStateHandler)
})

// 监听路由变化，当路由切换到当前组件时重置状态
watch(
  () => route.path,
  (newPath, oldPath) => {
    const currentRouteKey = route.name || route.path || 'default'
    const isCurrentRoute = currentRouteKey.includes('/mine')

    if (isCurrentRoute) {
      // 重置当前路由的状态
      resetRouteState(currentRouteKey)
    }
  }
)

onUnmounted(() => {
  // 移除事件监听器
  window.removeEventListener('popstate', popStateHandler)
  // 清理新增的历史记录
  while (getAddedHistoryCount() > 0) {
    popHistory(router, route)
  }
  // 重置历史记录计数
  resetHistoryCount()
})
</script>

<style scoped>
.mine-tab-container {
  padding: 20px;
  min-height: 100vh;
  background-color: #f6f6f6;
}

h1 {
  text-align: center;
  margin-bottom: 40px;
  color: #333;
}

.open-dialog-btn {
  display: block;
  margin: 0 auto 20px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: #673ab7;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.open-dialog-btn:hover {
  background-color: #5e35b1;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 400px;
}

h2 {
  margin-top: 0;
  color: #333;
}

.dialog-btn {
  display: inline-block;
  margin-right: 10px;
  padding: 8px 16px;
  font-size: 14px;
  color: white;
  background-color: #673ab7;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.dialog-btn:hover {
  background-color: #5e35b1;
}
</style>
