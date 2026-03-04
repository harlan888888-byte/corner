<template>
  <!-- 原生滑动切换组件：选项卡 + 内容区域 -->
  <div class="native-swipe-tabs-container">
    <div class="main-content">
      <!-- 使用原生方法实现左右滑动切换 -->
      <div
        ref="swipeContainer"
        class="swipe-container"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      >
        <div ref="swipeTrack" class="swipe-track" :style="trackStyle">
          <div v-for="(tab, index) in tabs" :key="index" class="swipe-item">
            <div
              ref="(el) => { if (el) pageRefs[index] = el }"
              class="page-container"
              @scroll="saveScrollPosition(index, $event)"
            >
              <template
                v-if="index === activeTab || loadedTabs.includes(index)"
              >
                <keep-alive>
                  <component :is="tab.component" />
                </keep-alive>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch, computed } from 'vue'
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
  },
  swipeThreshold: {
    type: Number,
    default: 0.5 // 滑动阈值，容器宽度的比例，默认 50%
  },
  animationDuration: {
    type: Number,
    default: 300 // 动画持续时间，单位：毫秒，默认 300ms
  }
})
const emit = defineEmits(['update:activeTab', 'tabChange'])

const router = useRouter()
const route = useRoute()
const swipeContainer = ref(null)
const swipeTrack = ref(null)
const activeTab = ref(props.activeTab)
const pageRefs = ref([])
const scrollPositions = ref([])
const loadedTabs = ref([])
const trackStyle = ref({})

// 触摸相关变量
const touchStartX = ref(0)
const touchStartY = ref(0)
const touchEndX = ref(0)
const touchEndY = ref(0)
const touchStartTime = ref(0)
const touchEndTime = ref(0)
const isDragging = ref(false)
const startTranslateX = ref(0)
const currentTranslateX = ref(0)
const containerWidth = ref(0)
const hasChangedDirection = ref(false)
const lastTouchX = ref(0)

// 路由跳转相关
const needRouteUpdate = ref(false) // 是否需要更新路由

// 初始化滚动位置数组
const initScrollPositions = () => {
  scrollPositions.value = Array.from({ length: props.tabs.length }, () => 0)
}

// 路由与 tab 同步
const syncRouteWithTab = () => {
  const path = route.path
  const tabIndex = props.tabs.findIndex((tab) => tab.path === path)
  if (tabIndex !== -1) {
    activeTab.value = tabIndex
    updateTrackPosition(tabIndex, true)
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

// 更新轨道位置
const updateTrackPosition = (index, immediate = false) => {
  const translateX = -index * containerWidth.value
  // 直接更新 currentTranslateX，避免动画过程中的位置计算错误
  currentTranslateX.value = translateX
  if (immediate) {
    trackStyle.value = {
      transform: `translateX(${translateX}px)`,
      transition: 'none',
      willChange: 'transform'
    }
  } else {
    trackStyle.value = {
      transform: `translateX(${translateX}px)`,
      transition: `transform ${props.animationDuration / 1000}s`,
      willChange: 'transform'
    }
  }
}

// 处理触摸开始
const handleTouchStart = (event) => {
  const touch = event.touches[0]
  touchStartX.value = touch.clientX
  touchStartY.value = touch.clientY
  lastTouchX.value = touch.clientX
  touchStartTime.value = Date.now() // 记录触摸开始时间
  isDragging.value = true
  hasChangedDirection.value = false
  startTranslateX.value = currentTranslateX.value
  // 禁用过渡效果，以便实时更新位置
  trackStyle.value = {
    ...trackStyle.value,
    transition: 'none',
    willChange: 'transform'
  }
}

// 处理触摸移动
const handleTouchMove = (event) => {
  if (!isDragging.value) return

  const touch = event.touches[0]
  const currentX = touch.clientX
  touchEndX.value = currentX
  touchEndY.value = touch.clientY

  // 计算水平和垂直位移
  const deltaX = touchEndX.value - touchStartX.value
  const deltaY = touchEndY.value - touchStartY.value

  // 检查方向是否改变
  if (lastTouchX.value !== 0) {
    const currentDirection = Math.sign(currentX - lastTouchX.value)
    const initialDirection = Math.sign(deltaX)
    if (
      currentDirection !== 0 &&
      initialDirection !== 0 &&
      currentDirection !== initialDirection
    ) {
      hasChangedDirection.value = true
    }
  }

  // 更新最后触摸位置
  lastTouchX.value = currentX

  // 只处理水平滑动
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // 边界检查：在第一个页面时不能向右滑动，在最后一个页面时不能向左滑动
    const isFirstPage = activeTab.value === 0
    const isLastPage = activeTab.value === props.tabs.length - 1

    // 如果是第一个页面且向右滑动，或者是最后一个页面且向左滑动，不处理
    if ((isFirstPage && deltaX > 0) || (isLastPage && deltaX < 0)) {
      return
    }

    event.preventDefault() // 阻止默认行为，避免页面滚动

    // 计算新的位置，添加边界限制
    let newTranslateX = startTranslateX.value + deltaX
    const maxTranslateX = 0
    const minTranslateX = -(props.tabs.length - 1) * containerWidth.value

    // 边界限制，添加弹性效果
    if (newTranslateX > maxTranslateX) {
      newTranslateX = maxTranslateX + (newTranslateX - maxTranslateX) * 0.3
    } else if (newTranslateX < minTranslateX) {
      newTranslateX = minTranslateX + (newTranslateX - minTranslateX) * 0.3
    }

    trackStyle.value = {
      transform: `translateX(${newTranslateX}px)`,
      transition: 'none'
    }
    currentTranslateX.value = newTranslateX
  }
}

// 处理触摸结束
const handleTouchEnd = () => {
  if (!isDragging.value) return
  isDragging.value = false

  // 记录触摸结束时间
  touchEndTime.value = Date.now()

  // 计算滑动距离
  const deltaX = currentTranslateX.value - startTranslateX.value
  const threshold = containerWidth.value * props.swipeThreshold // 滑动阈值，容器宽度的比例

  // 计算滑动时间
  const deltaTime = touchEndTime.value - touchStartTime.value

  // 计算滑动速度 (像素/毫秒)
  const velocity = deltaX / deltaTime
  const velocityThreshold = 0.2 // 速度阈值，大于此值视为快速滑动，值越小越容易触发切换

  // 计算应该切换到哪个 tab
  let newIndex = activeTab.value

  // 检查是否满足切换条件：距离足够或速度足够快
  // 并且滑动方向与最终位移方向一致
  // 并且没有改变方向
  if (
    (Math.abs(deltaX) > threshold || Math.abs(velocity) > velocityThreshold) &&
    Math.sign(deltaX) === Math.sign(velocity) &&
    !hasChangedDirection.value
  ) {
    if (deltaX > 0) {
      // 向右滑动，切换到上一个 tab
      newIndex = Math.max(0, activeTab.value - 1)
    } else {
      // 向左滑动，切换到下一个 tab
      newIndex = Math.min(props.tabs.length - 1, activeTab.value + 1)
    }
  } else {
    // 滑动距离和速度都不足，或方向不一致，或改变了方向，回到原位置
    newIndex = activeTab.value
  }

  // 动画到目标位置
  // 始终使用动画效果，确保回退时也有平滑过渡
  updateTrackPosition(newIndex, false)

  // 更新 tab 和路由
  if (newIndex !== activeTab.value) {
    activeTab.value = newIndex
    emit('update:activeTab', newIndex)
    emit('tabChange', newIndex)

    // 标记需要更新路由，动画完成后会执行
    needRouteUpdate.value = true
  }

  // 恢复滚动位置
  restoreScrollPosition(newIndex)

  // 标记为已加载
  if (!loadedTabs.value.includes(newIndex)) {
    loadedTabs.value.push(newIndex)
  }
}

// 监听路由变化，同步 tab 和恢复滚动位置
watch(
  () => route.path,
  () => {
    syncRouteWithTab()
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

// 处理动画完成事件
const handleTransitionEnd = (event) => {
  // 确保是 transform 属性的过渡完成
  if (event.propertyName === 'transform' && needRouteUpdate.value) {
    needRouteUpdate.value = false
    // 执行路由跳转逻辑
    const tab = props.tabs[activeTab.value]
    if (tab && tab.path && route.path !== tab.path) {
      router.push(tab.path)
    }
  }
}

// 监听 activeTab 变化
watch(
  () => props.activeTab,
  (newIndex) => {
    activeTab.value = newIndex
    updateTrackPosition(newIndex)
  }
)

onMounted(async () => {
  // 初始化滚动位置数组
  initScrollPositions()

  // 等待DOM更新完成
  await nextTick()

  // 获取容器宽度
  if (swipeContainer.value) {
    containerWidth.value = swipeContainer.value.offsetWidth
  }

  // 初始化时同步路由与 tab
  syncRouteWithTab()

  // 初始化时标记当前激活的 Tab 为已加载
  const currentIndex = activeTab.value
  if (!loadedTabs.value.includes(currentIndex)) {
    loadedTabs.value.push(currentIndex)
  }

  // 初始化时恢复滚动位置
  restoreScrollPosition(activeTab.value)

  // 添加 transitionend 事件监听器
  if (swipeTrack.value) {
    swipeTrack.value.addEventListener('transitionend', handleTransitionEnd)
  }
})

// 组件卸载时移除事件监听器
onUnmounted(() => {
  if (swipeTrack.value) {
    swipeTrack.value.removeEventListener('transitionend', handleTransitionEnd)
  }
})
</script>

<style scoped>
.native-swipe-tabs-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.main-content {
  height: calc(100vh - 50px); /* 减去 tabbar 的高度 */
  overflow: hidden;
}

.swipe-container {
  position: relative;
  height: 100%;
  overflow: hidden;
  touch-action: pan-y;
}

.swipe-track {
  display: flex;
  height: 100%;
  transition: transform 0.3s ease;
  will-change: transform;
}

.swipe-item {
  flex: 0 0 100%;
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
