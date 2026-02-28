<template>
  <!-- 城市选择器组件：热门城市 + 按字母分类 -->
  <div v-if="true" style="display: none">
    <teleport to="body">
      <div
        class="city-picker-container"
        :class="{
          'enter-active': isEnterActive,
          'leave-active': isLeaveActive
        }"
      >
        <div ref="headerRef" class="city-picker-header">
          <h2>选择城市</h2>
          <button class="close-btn" @click="handleClose">取消</button>
        </div>

        <div
          ref="contentRef"
          class="city-picker-content"
          @scroll="handleScroll"
        >
          <!-- 热门城市 -->
          <div class="city-section">
            <div class="city-section-title">热门</div>
            <div class="city-list hot-city-list">
              <div
                v-for="city in hotCities"
                :key="city.id"
                class="city-item"
                @click="selectCity(city)"
              >
                {{ city.name }}
              </div>
            </div>
          </div>

          <!-- 按首字母分类的城市列表（按 A-Z 顺序） -->
          <div
            v-for="letter in indexLetters"
            :key="letter"
            class="city-section"
            :id="`letter-${letter}`"
          >
            <div class="city-section-title">{{ letter }}</div>
            <div class="city-list">
              <div
                v-for="city in groupedCities[letter]"
                :key="city.id"
                class="city-item"
                @click="selectCity(city)"
              >
                {{ city.name }}
              </div>
            </div>
          </div>
        </div>

        <!-- 侧边栏索引 -->
        <div class="city-picker-index">
          <div
            v-for="letter in indexLetters"
            :key="letter"
            class="index-item"
            :class="{ active: currentLetter === letter }"
            @click="scrollToLetter(letter)"
          >
            {{ letter }}
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['select', 'close'])

// 动画状态
const isEnterActive = ref(false)
const isLeaveActive = ref(false)

// 城市数据
const cities = ref([
  { id: 1, name: '北京', letter: 'B' },
  { id: 2, name: '上海', letter: 'S' },
  { id: 3, name: '广州', letter: 'G' },
  { id: 4, name: '深圳', letter: 'S' },
  { id: 5, name: '杭州', letter: 'H' },
  { id: 6, name: '成都', letter: 'C' },
  { id: 7, name: '武汉', letter: 'W' },
  { id: 8, name: '西安', letter: 'X' },
  { id: 9, name: '南京', letter: 'N' },
  { id: 10, name: '重庆', letter: 'C' },
  { id: 11, name: '天津', letter: 'T' },
  { id: 12, name: '苏州', letter: 'S' },
  { id: 13, name: '郑州', letter: 'Z' },
  { id: 14, name: '长沙', letter: 'C' },
  { id: 15, name: '青岛', letter: 'Q' },
  { id: 16, name: '宁波', letter: 'N' },
  { id: 17, name: '东莞', letter: 'D' },
  { id: 18, name: '佛山', letter: 'F' },
  { id: 19, name: '厦门', letter: 'X' },
  { id: 20, name: '济南', letter: 'J' },
  { id: 21, name: '大连', letter: 'D' },
  { id: 22, name: '哈尔滨', letter: 'H' },
  { id: 23, name: '福州', letter: 'F' },
  { id: 24, name: '昆明', letter: 'K' },
  { id: 25, name: '南宁', letter: 'N' },
  { id: 26, name: '贵阳', letter: 'G' },
  { id: 27, name: '南昌', letter: 'N' },
  { id: 28, name: '合肥', letter: 'H' },
  { id: 29, name: '太原', letter: 'T' },
  { id: 30, name: '石家庄', letter: 'S' }
])

// 热门城市
const hotCities = ref([
  { id: 0, name: '所有城市' },
  { id: 1, name: '佛山' },
  { id: 2, name: '北京' },
  { id: 3, name: '上海' },
  { id: 4, name: '广州' },
  { id: 5, name: '深圳' },
  { id: 6, name: '杭州' },
  { id: 7, name: '成都' },
  { id: 8, name: '武汉' },
  { id: 9, name: '西安' }
])

// 按首字母分组城市
const groupedCities = computed(() => {
  const groups = {}
  cities.value.forEach((city) => {
    if (!groups[city.letter]) {
      groups[city.letter] = []
    }
    groups[city.letter].push(city)
  })
  return groups
})

// 索引字母列表
const indexLetters = computed(() => {
  return Object.keys(groupedCities.value).sort()
})

// 内容容器引用
const contentRef = ref(null)
// 头部容器引用
const headerRef = ref(null)

// 当前活跃的首字母
const currentLetter = ref('')
// 是否是用户主动点击字母
const isUserClick = ref(false)

// 选择城市
const selectCity = (city) => {
  emit('select', city)
}

// 滚动到指定首字母的城市列表
const scrollToLetter = (letter) => {
  // 标记为用户主动点击
  isUserClick.value = true

  // 直接设置当前活跃字母，不依赖滚动事件
  currentLetter.value = letter

  const element = document.getElementById(`letter-${letter}`)
  if (element && contentRef.value) {
    // 使用 contentRef 的 scrollTop 而不是 window.scrollY
    const sectionTop = element.offsetTop
    // 获取头部高度作为偏移量
    const headerHeight = headerRef.value ? headerRef.value.offsetHeight : 0

    // 计算最大滚动位置，避免滚动超出范围
    const maxScrollTop =
      contentRef.value.scrollHeight - contentRef.value.clientHeight
    const scrollTop = Math.min(sectionTop - headerHeight, maxScrollTop)

    contentRef.value.scrollTop = scrollTop

    // 滚动结束后恢复滚动事件监听
    setTimeout(() => {
      isUserClick.value = false
    }, 300)
  }
}

// 监听滚动，更新当前活跃的首字母
const handleScroll = (event) => {
  // 如果是用户主动点击字母，暂时不响应滚动事件
  if (isUserClick.value) {
    return
  }

  const target = event.target
  const sections = document.querySelectorAll('.city-section')
  let current = ''

  // 获取头部高度作为临界点基准
  const headerHeight = headerRef.value ? headerRef.value.offsetHeight : 0

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    // 以头部底部位置为临界点
    if (target.scrollTop >= sectionTop - headerHeight) {
      const id = section.id
      current = id.replace('letter-', '')
    }
  })

  if (current !== currentLetter.value) {
    currentLetter.value = current
  }
}

// 组件挂载时触发进入动画
onMounted(() => {
  setTimeout(() => {
    isEnterActive.value = true
  }, 10)
})

// 点击取消按钮时触发离开动画
const handleClose = () => {
  isLeaveActive.value = true

  // 动画结束后执行关闭操作
  setTimeout(() => {
    emit('close')
  }, 300)
}
</script>

<style scoped>
.city-picker-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  z-index: 99999;
  backdrop-filter: blur(5px);
  overflow: hidden;
  /* 确保覆盖整个屏幕，包括刘海屏和底部安全区域 */
  padding: env(safe-area-inset-top) env(safe-area-inset-right)
    env(safe-area-inset-bottom) env(safe-area-inset-left);
  box-sizing: border-box;
  transition: transform 0.3s ease;
  transform: translateX(100%);
}

.city-picker-container.enter-active {
  transform: translateX(0);
}

.city-picker-container.leave-active {
  transform: translateX(100%);
}

/* 确保在所有设备上都能覆盖整个屏幕 */
:global(html, body) {
  margin: 0;
  padding: 0;
  height: 100%;
}

:global(body) {
  position: relative;
  z-index: 1;
}

.city-picker-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  background: linear-gradient(to right, #673ab7, #d154ff);
  color: white;
  position: sticky;
  top: 0;
  z-index: 10;
  position: relative;
}

.city-picker-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.city-picker-header button {
  position: absolute;
  right: 15px;
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.city-picker-header button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.city-picker-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20px;
}

.city-section {
  margin-top: 15px;
}

.city-section-title {
  padding: 0 15px;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  color: #999;
  background-color: #f0f0f0;
}

.city-list {
  display: flex;
  flex-wrap: wrap;
  padding: 10px 5px 0;
  background-color: white;
}

.hot-city-list {
  padding: 15px 5px 0;
}

.city-item {
  width: 33.33%;
  height: 44px;
  line-height: 44px;
  text-align: center;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

.city-item:active {
  background-color: #f0f0f0;
}

.city-picker-index {
  position: fixed;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 5px 2px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  z-index: 2010;
}

.index-item {
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  border-radius: 50%;
}

.index-item.active {
  color: #4fc08d;
  font-weight: 500;
}

.index-item:active {
  background-color: rgba(0, 0, 0, 0.1);
}

/* 阻止背景滚动 */
:global(body:has(.city-picker-container)) {
  overflow: hidden;
}
</style>
<template>
  <!-- 城市选择器组件：热门城市 + 按字母分类 -->
  <teleport to="body">
    <div
      class="city-picker-container"
      :class="{ 'enter-active': isEnterActive, 'leave-active': isLeaveActive }"
    >
      <div ref="headerRef" class="city-picker-header">
        <h2>选择城市</h2>
        <button class="close-btn" @click="handleClose">取消</button>
      </div>

      <div ref="contentRef" class="city-picker-content" @scroll="handleScroll">
        <!-- 热门城市 -->
        <div class="city-section">
          <div class="city-section-title">热门</div>
          <div class="city-list hot-city-list">
            <div
              v-for="city in hotCities"
              :key="city.id"
              class="city-item"
              @click="selectCity(city)"
            >
              {{ city.name }}
            </div>
          </div>
        </div>

        <!-- 按首字母分类的城市列表（按 A-Z 顺序） -->
        <div
          v-for="letter in indexLetters"
          :key="letter"
          class="city-section"
          :id="`letter-${letter}`"
        >
          <div class="city-section-title">{{ letter }}</div>
          <div class="city-list">
            <div
              v-for="city in groupedCities[letter]"
              :key="city.id"
              class="city-item"
              @click="selectCity(city)"
            >
              {{ city.name }}
            </div>
          </div>
        </div>
      </div>

      <!-- 侧边栏索引 -->
      <div class="city-picker-index">
        <div
          v-for="letter in indexLetters"
          :key="letter"
          class="index-item"
          :class="{ active: currentLetter === letter }"
          @click="scrollToLetter(letter)"
        >
          {{ letter }}
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['select', 'close'])

// 动画状态
const isEnterActive = ref(false)
const isLeaveActive = ref(false)

// 城市数据
const cities = ref([
  { id: 1, name: '北京', letter: 'B' },
  { id: 2, name: '上海', letter: 'S' },
  { id: 3, name: '广州', letter: 'G' },
  { id: 4, name: '深圳', letter: 'S' },
  { id: 5, name: '杭州', letter: 'H' },
  { id: 6, name: '成都', letter: 'C' },
  { id: 7, name: '武汉', letter: 'W' },
  { id: 8, name: '西安', letter: 'X' },
  { id: 9, name: '南京', letter: 'N' },
  { id: 10, name: '重庆', letter: 'C' },
  { id: 11, name: '天津', letter: 'T' },
  { id: 12, name: '苏州', letter: 'S' },
  { id: 13, name: '郑州', letter: 'Z' },
  { id: 14, name: '长沙', letter: 'C' },
  { id: 15, name: '青岛', letter: 'Q' },
  { id: 16, name: '宁波', letter: 'N' },
  { id: 17, name: '东莞', letter: 'D' },
  { id: 18, name: '佛山', letter: 'F' },
  { id: 19, name: '厦门', letter: 'X' },
  { id: 20, name: '济南', letter: 'J' },
  { id: 21, name: '大连', letter: 'D' },
  { id: 22, name: '哈尔滨', letter: 'H' },
  { id: 23, name: '福州', letter: 'F' },
  { id: 24, name: '昆明', letter: 'K' },
  { id: 25, name: '南宁', letter: 'N' },
  { id: 26, name: '贵阳', letter: 'G' },
  { id: 27, name: '南昌', letter: 'N' },
  { id: 28, name: '合肥', letter: 'H' },
  { id: 29, name: '太原', letter: 'T' },
  { id: 30, name: '石家庄', letter: 'S' }
])

// 热门城市
const hotCities = ref([
  { id: 0, name: '所有城市' },
  { id: 1, name: '北京' },
  { id: 2, name: '上海' },
  { id: 3, name: '广州' },
  { id: 4, name: '深圳' },
  { id: 5, name: '杭州' },
  { id: 6, name: '成都' },
  { id: 7, name: '武汉' },
  { id: 8, name: '西安' }
])

// 按首字母分组城市
const groupedCities = computed(() => {
  const groups = {}
  cities.value.forEach((city) => {
    if (!groups[city.letter]) {
      groups[city.letter] = []
    }
    groups[city.letter].push(city)
  })
  return groups
})

// 索引字母列表
const indexLetters = computed(() => {
  return Object.keys(groupedCities.value).sort()
})

// 内容容器引用
const contentRef = ref(null)
// 头部容器引用
const headerRef = ref(null)

// 当前活跃的首字母
const currentLetter = ref('')
// 是否是用户主动点击字母
const isUserClick = ref(false)

// 选择城市
const selectCity = (city) => {
  emit('select', city)
}

// 滚动到指定首字母的城市列表
const scrollToLetter = (letter) => {
  // 标记为用户主动点击
  isUserClick.value = true

  // 直接设置当前活跃字母，不依赖滚动事件
  currentLetter.value = letter

  const element = document.getElementById(`letter-${letter}`)
  if (element && contentRef.value) {
    // 使用 contentRef 的 scrollTop 而不是 window.scrollY
    const sectionTop = element.offsetTop
    // 获取头部高度作为偏移量
    const headerHeight = headerRef.value ? headerRef.value.offsetHeight : 0

    // 计算最大滚动位置，避免滚动超出范围
    const maxScrollTop =
      contentRef.value.scrollHeight - contentRef.value.clientHeight
    const scrollTop = Math.min(sectionTop - headerHeight, maxScrollTop)

    contentRef.value.scrollTop = scrollTop

    // 滚动结束后恢复滚动事件监听
    setTimeout(() => {
      isUserClick.value = false
    }, 300)
  }
}

// 监听滚动，更新当前活跃的首字母
const handleScroll = (event) => {
  // 如果是用户主动点击字母，暂时不响应滚动事件
  if (isUserClick.value) {
    return
  }

  const target = event.target
  const sections = document.querySelectorAll('.city-section')
  let current = ''

  // 获取头部高度作为临界点基准
  const headerHeight = headerRef.value ? headerRef.value.offsetHeight : 0

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    // 以头部底部位置为临界点
    if (target.scrollTop >= sectionTop - headerHeight) {
      const id = section.id
      current = id.replace('letter-', '')
    }
  })

  if (current !== currentLetter.value) {
    currentLetter.value = current
  }
}

// 组件挂载时触发进入动画
onMounted(() => {
  setTimeout(() => {
    isEnterActive.value = true
  }, 10)
})

// 点击取消按钮时触发离开动画
const handleClose = () => {
  isLeaveActive.value = true

  // 动画结束后执行关闭操作
  setTimeout(() => {
    emit('close')
  }, 300)
}
</script>

<style scoped>
.city-picker-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  z-index: 99999;
  backdrop-filter: blur(5px);
  overflow: hidden;
  /* 确保覆盖整个屏幕，包括刘海屏和底部安全区域 */
  padding: env(safe-area-inset-top) env(safe-area-inset-right)
    env(safe-area-inset-bottom) env(safe-area-inset-left);
  box-sizing: border-box;
  transition: transform 0.3s ease;
  transform: translateX(100%);
}

.city-picker-container.enter-active {
  transform: translateX(0);
}

.city-picker-container.leave-active {
  transform: translateX(100%);
}

/* 确保在所有设备上都能覆盖整个屏幕 */
:global(html, body) {
  margin: 0;
  padding: 0;
  height: 100%;
}

:global(body) {
  position: relative;
  z-index: 1;
}

.city-picker-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  background: linear-gradient(to right, #673ab7, #d154ff);
  color: white;
  position: sticky;
  top: 0;
  z-index: 10;
  position: relative;
}

.city-picker-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.city-picker-header button {
  position: absolute;
  right: 15px;
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.city-picker-header button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.city-picker-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20px;
}

.city-section {
  margin-top: 15px;
}

.city-section-title {
  padding: 0 15px;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  color: #999;
  background-color: #f0f0f0;
}

.city-list {
  display: flex;
  flex-wrap: wrap;
  padding: 10px 5px 0;
  background-color: white;
}

.hot-city-list {
  padding: 15px 5px 0;
}

.city-item {
  width: 33.33%;
  height: 44px;
  line-height: 44px;
  text-align: center;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

.city-item:active {
  background-color: #f0f0f0;
}

.city-picker-index {
  position: fixed;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 5px 2px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  z-index: 2010;
}

.index-item {
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  border-radius: 50%;
}

.index-item.active {
  color: #4fc08d;
  font-weight: 500;
}

.index-item:active {
  background-color: rgba(0, 0, 0, 0.1);
}

/* 阻止背景滚动 */
:global(body:has(.city-picker-container)) {
  overflow: hidden;
}
</style>
