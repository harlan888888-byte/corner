<template>
  <div class="layout-container">
    <SwipeTabs
      :tabs="tabs"
      :if_click="if_click"
      v-model:activeTab="activeTab"
      @tabChange="handleTabChange"
    />

    <van-tabbar
      ref="tabbarRef"
      v-model="activeTab"
      active-color="#ee0a24"
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

    <template v-if="route.name == 'StoreDetail'">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SwipeTabs from '@/components/base/SwipeTabs.vue'
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
})
</script>

<style scoped>
.layout-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
}
</style>
