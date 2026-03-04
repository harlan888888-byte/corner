<template>
  <!-- 布局容器：包含选项卡和路由视图 -->
  <div class="layout-container">
    <NativeSwipeTabs
      :tabs="tabs"
      :if_click="if_click"
      :swipeThreshold="0.5"
      :animationDuration="300"
      v-model:activeTab="activeTab"
      @tabChange="handleTabChange"
    />

    <van-tabbar
      ref="tabbarRef"
      v-model="activeTab"
      active-color="#b44bc6"
      inactive-color="#000"
      @change="handleTabbarChange"
    >
      <van-tabbar-item
        v-for="(tab, index) in tabs"
        :key="index"
        :icon="tab.icon"
        @click="clickTab"
      >
        {{ tab.title }}
      </van-tabbar-item>
    </van-tabbar>

    <router-view v-slot="{ Component }">
      <transition name="slide-fade" mode="out-in">
        <component
          :is="Component"
          v-if="
            !['/hometab', '/footprint', '/plan', '/mine'].includes(route.path)
          "
        />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import NativeSwipeTabs from '@/components/base/NativeSwipeTabs.vue'

const HomeTab = defineAsyncComponent(() => import('./HomeTab.vue'))
const FootPrintTab = defineAsyncComponent(() => import('./FootPrintTab.vue'))
const PlanTab = defineAsyncComponent(() => import('./PlanTab.vue'))
const MineTab = defineAsyncComponent(() => import('./MineTab.vue'))

const router = useRouter()
const route = useRoute()
const tabbarRef = ref(null)
const activeTab = ref(0)
const if_click = ref(false)

const tabs = [
  {
    path: '/hometab',
    title: '首页',
    icon: 'wap-home-o',
    component: HomeTab
  },
  {
    path: '/footprint',
    title: '足迹',
    icon: 'eye-o',
    component: FootPrintTab
  },
  {
    path: '/plan',
    title: '计划',
    icon: 'star-o',
    component: PlanTab
  },
  {
    path: '/mine',
    title: '我的',
    icon: 'user-o',
    component: MineTab
  }
]

const clickTab = () => {
  if_click.value = true
}

// 处理 SwipeTabs 的 tab 变化
const handleTabChange = (index) => {
  activeTab.value = index
}

// 处理 tabbar 的点击变化
const handleTabbarChange = (index) => {
  activeTab.value = index
  const paths = ['/hometab', '/footprint', '/plan', '/mine']
  router.push(paths[index])
}

// 监听路由变化，同步 tab
watch(
  () => route.path,
  () => {
    const path = route.path
    const tabIndex = tabs.findIndex((tab) => tab.path === path)
    if (tabIndex !== -1) {
      activeTab.value = tabIndex
    }
  }
)

// 页面初始化时检查当前路由
onMounted(() => {
  const path = route.path
  // 如果当前路由不是首页，设置 if_click 为 true，直接跳转到对应页面
  if (path !== '/hometab') {
    if_click.value = true
  }
  // 同步更新 activeTab，确保 tabbar 显示正确的 icon
  const tabIndex = tabs.findIndex((tab) => tab.path === path)
  if (tabIndex !== -1) {
    activeTab.value = tabIndex
  }
})
</script>

<style scoped>
.layout-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
}
</style>
