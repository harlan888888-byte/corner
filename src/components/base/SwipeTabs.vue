<template>
  <!-- 滑动切换组件：选项卡 + 内容区域 -->
  <div class="swipe-tabs-container">
    <div class="main-content">
      <!-- 使用 van-swipe 实现左右滑动切换 -->
      <van-swipe
        ref="swipeRef"
        v-model="activeTab"
        :loop="false"
        :show-indicators="false"
        @change="handleSwipeChange"
        :duration="300"
        class="page-swipe"
        :auto-play="false"
        :stop-propagation="true"
        :touch-move-prevent-default="false"
        :touch-angle="45"
      >
        <van-swipe-item
          v-for="(tab, index) in tabs"
          :key="index"
          class="swipe-item"
        >
          <div
            ref="(el) => { if (el) pageRefs[index] = el }"
            class="page-container"
            @scroll="saveScrollPosition(index, $event)"
          >
            <template v-if="index === activeTab || loadedTabs.includes(index)">
              <keep-alive>
                <component :is="tab.component" />
              </keep-alive>
            </template>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
    default: () => []
  },
  activeTab: {
    type: Number,
    default: 0
  },
  if_click: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:activeTab', 'tabChange'])

const router = useRouter()
const route = useRoute()
const swipeRef = ref(null)
const activeTab = ref(props.activeTab)
const pageRefs = ref([])
const scrollPositions = ref([])
const loadedTabs = ref([])
const trackElement = ref(null)

// 初始化滚动位置数组
const initScrollPositions = () => {
  scrollPositions.value = new Array(props.tabs.length).fill(0)
}

// 路由与 tab 同步
const syncRouteWithTab = () => {
  const path = route.path
  const tabIndex = props.tabs.findIndex((tab) => tab.path === path)
  if (tabIndex !== -1) {
    activeTab.value = tabIndex
  }
}

// 保存滚动位置
const saveScrollPosition = (index, event) => {
  event.stopPropagation() // 阻止滚动事件冒泡
  scrollPositions.value[index] = event.target.scrollTop
}

// 恢复滚动位置
const restoreScrollPosition = (index) => {
  if (pageRefs[index]) {
    pageRefs[index].scrollTop = scrollPositions.value[index]
  }
}

// 滑动切换时更新路由和恢复滚动位置
const handleSwipeChange = (index) => {
  activeTab.value = index
  emit('update:activeTab', index)
  emit('tabChange', index)
  const tab = props.tabs[index]
  if (tab && tab.path) {
    router.push(tab.path)
  }

  // ✅ 核心修复：切换 Tab 时标记为已加载
  if (!loadedTabs.value.includes(index)) {
    loadedTabs.value.push(index)
  }

  // 恢复滚动位置
  restoreScrollPosition(index)
}

// 监听路由变化，同步 tab 和恢复滚动位置
watch(
  () => route.path,
  () => {
    syncRouteWithTab()
    // 路由变化时，强制更新 van-swipe 的当前索引
    if (swipeRef.value) {
      swipeRef.value.swipeTo(activeTab.value, { immediate: props.if_click })
    }
    // 恢复滚动位置
    restoreScrollPosition(activeTab.value)
  }
)

// 监听 tabs 变化，重新初始化
watch(
  () => props.tabs,
  () => {
    initScrollPositions()
    syncRouteWithTab()
  },
  { deep: true }
)

onMounted(async () => {
  // 初始化滚动位置数组
  initScrollPositions()

  // 等待DOM更新完成
  await nextTick()

  // 获取 track 元素引用
  trackElement.value = document.querySelector('.page-swipe .van-swipe__track')

  // 初始化时同步路由与 tab
  syncRouteWithTab()

  // ✅ 核心补充：初始化时标记当前激活的 Tab 为已加载
  const currentIndex = activeTab.value
  if (!loadedTabs.value.includes(currentIndex)) {
    loadedTabs.value.push(currentIndex)
  }

  // 初始化时，强制更新 van-swipe 的当前索引
  if (swipeRef.value) {
    swipeRef.value.swipeTo(activeTab.value, { immediate: true })
  }

  // 初始化时恢复滚动位置
  restoreScrollPosition(activeTab.value)
})
</script>

<style scoped>
.swipe-tabs-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.main-content {
  height: calc(100vh - 50px); /* 减去 tabbar 的高度 */
  overflow: hidden;
}

/* 核心优化：硬件加速 + 宽松的触摸行为 */
.page-swipe {
  height: 100%;
  overflow: hidden;
}

.swipe-item {
  height: 100%;
  overflow: hidden;
  position: relative;
}

.page-container {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  position: relative;
  z-index: 1;
  contain: strict;
  touch-action: pan-y;
}

/* 优化过渡效果，确保动画流畅 */
.custom-swipe :deep(.van-swipe__track) {
  will-change: transform;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  /* 优化重绘性能 */
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

/* 隐藏滚动条但保持滚动功能 */
.page-container::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.page-container::-webkit-scrollbar-track {
  background: transparent;
}

.page-container::-webkit-scrollbar-thumb {
  background: transparent;
}

/* 为Firefox添加样式 */
.page-container {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
}

/* 确保 page-container 是相对定位，loading 能基于它居中 */
.page-container {
  position: relative;
}
</style>
