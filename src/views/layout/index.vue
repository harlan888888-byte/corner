<template>
  <div class="layout-container">
    <div ref="mainContentRef" class="main-content">
      <!-- 二级路由出口：二级组件展示的位置 -->
      <router-view></router-view>
    </div>

    <van-tabbar
      ref="tabbarRef"
      route
      active-color="#ee0a24"
      inactive-color="#000"
    >
      <van-tabbar-item to="/hometab" icon="wap-home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/footprint" icon="eye-o">足迹</van-tabbar-item>
      <van-tabbar-item to="/plan" icon="star-o">计划</van-tabbar-item>
      <van-tabbar-item to="/mine" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const tabbarRef = ref(null)
const mainContentRef = ref(null)

onMounted(async () => {
  // 等待DOM更新完成
  await nextTick()

  // 动态获取tabbar的高度
  if (tabbarRef.value && mainContentRef.value) {
    const tabbarHeight = tabbarRef.value.$el.offsetHeight
    mainContentRef.value.style.paddingBottom = `${tabbarHeight}px`
  }
})
</script>

<style lang="scss" scoped>
.layout-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1; /* 自动占据剩余空间 */
}
.home-container {
  padding: 20px;
  text-align: center;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

h2 {
  font-size: 20px;
  margin: 30px 0 20px;
}

button {
  margin: 0 10px;
  padding: 5px 15px;
  cursor: pointer;
}
</style>
