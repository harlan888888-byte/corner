<template>
  <!-- 搜索栏组件：输入框 + 搜索按钮 + 清除按钮 + 搜索历史 -->
  <div ref="searchWrapperRef" class="custom-search-wrapper">
    <div class="custom-search-container">
      <input
        type="text"
        v-model="searchValue"
        :placeholder="placeholder"
        class="custom-search-input"
        @input="handleInput"
        @keyup.enter="handleSearch"
        @focus="showHistory = true"
      />
      <div class="custom-search-actions">
        <span
          v-if="searchValue"
          class="custom-search-clear"
          @click="handleClear"
        >
          ✕
        </span>
        <button class="custom-search-btn" @click="handleSearch">搜索</button>
      </div>
    </div>

    <!-- 搜索历史 -->
    <div
      ref="historyRef"
      v-if="showHistory && searchHistory.length > 0"
      class="custom-search-history"
    >
      <div class="custom-search-history-header">
        <span>搜索历史</span>
        <button class="custom-search-history-clear" @click="clearSearchHistory">
          清空
        </button>
      </div>
      <ul class="custom-search-history-list">
        <li
          v-for="(item, index) in searchHistory"
          :key="index"
          class="custom-search-history-item"
        >
          <span class="custom-search-history-text" @click="selectHistory(item)">
            {{ item }}
          </span>
          <span
            class="custom-search-history-delete"
            @click.stop="deleteHistory(index)"
          >
            ✕
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  defineProps,
  defineEmits,
  watch,
  onMounted,
  onUnmounted
} from 'vue'

const props = defineProps({
  placeholder: {
    type: String,
    default: '请输入搜索关键词'
  },
  value: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['input', 'search', 'clear'])

const searchValue = ref(props.value)
// 存储上次搜索内容
const lastSearchValue = ref('')
// 搜索历史列表
const searchHistory = ref([])
// 搜索历史是否显示
const showHistory = ref(false)
// 搜索组件容器引用
const searchWrapperRef = ref(null)
// 搜索历史容器引用
const historyRef = ref(null)

// 初始化搜索历史
const initSearchHistory = () => {
  const history = localStorage.getItem('searchHistory')
  if (history) {
    searchHistory.value = JSON.parse(history)
  }
}

// 保存搜索历史
const saveSearchHistory = (keyword) => {
  if (!keyword) {
    return
  }

  // 移除重复的历史记录
  searchHistory.value = searchHistory.value.filter((item) => item !== keyword)

  // 将新的搜索词添加到历史记录的开头
  searchHistory.value.unshift(keyword)

  // 限制历史记录数量最多为8个
  if (searchHistory.value.length > 8) {
    searchHistory.value = searchHistory.value.slice(0, 8)
  }

  // 保存到 localStorage
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
}

// 点击外部区域关闭搜索历史
const handleClickOutside = (event) => {
  if (showHistory.value) {
    const searchWrapper = searchWrapperRef.value
    const historyEl = historyRef.value

    // 如果点击的不是搜索组件内部的元素，关闭搜索历史
    if (searchWrapper && !searchWrapper.contains(event.target)) {
      showHistory.value = false
    }
  }
}

// 初始化搜索历史
initSearchHistory()

// 组件挂载时添加点击外部区域的事件监听器
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

// 组件卸载时移除事件监听器
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 监听外部 value 变化
watch(
  () => props.value,
  (newValue) => {
    searchValue.value = newValue
  }
)

// 输入事件处理
const handleInput = () => {
  emit('input', searchValue.value)
}

// 搜索事件处理
const handleSearch = () => {
  // 去除前后空格
  const trimmedValue = searchValue.value.trim()

  // 如果与上次搜索内容相同，不触发搜索
  if (trimmedValue === lastSearchValue.value) {
    return
  }

  // 触发搜索事件
  emit('search', trimmedValue)

  // 保存搜索历史
  saveSearchHistory(trimmedValue)

  // 更新上次搜索内容
  lastSearchValue.value = trimmedValue

  // 搜索后隐藏历史记录
  showHistory.value = false
}

// 清除事件处理
const handleClear = () => {
  searchValue.value = ''
  emit('input', '')
}

// 删除搜索历史
const deleteHistory = (index) => {
  searchHistory.value.splice(index, 1)
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
}

// 清空搜索历史
const clearSearchHistory = () => {
  searchHistory.value = []
  localStorage.removeItem('searchHistory')
}

// 选择搜索历史
const selectHistory = (item) => {
  searchValue.value = item
  emit('input', item)
  emit('search', item)
  lastSearchValue.value = item
  showHistory.value = false
}
</script>

<style scoped>
.custom-search-container {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 20px;
  padding: 2px;
}

.custom-search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 16px;
  color: #333;
  padding: 0 10px;
}

.custom-search-input::placeholder {
  color: #999;
}

.custom-search-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.custom-search-clear {
  font-size: 12px;
  line-height: 12px;
  color: white;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.3);
  padding: 10px;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.custom-search-clear:hover {
  background: rgba(0, 0, 0, 0.5);
}

.custom-search-btn {
  color: white;
  font-size: 16px;
  padding: 6px 20px;
  cursor: pointer;
  font-weight: 500;
  border-radius: 20px;
  background: #b44bc6;
  border: none;
}

/* 搜索历史样式 */
.custom-search-wrapper {
  position: relative;
}

.custom-search-history {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 8px;
  z-index: 100;
}

.custom-search-history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid #f0f0f0;
}

.custom-search-history-header span {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.custom-search-history-clear {
  font-size: 12px;
  color: #999;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.custom-search-history-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
}

.custom-search-history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.custom-search-history-item:hover {
  background-color: #f5f5f5;
}

.custom-search-history-text {
  font-size: 14px;
  color: #333;
  flex: 1;
}

.custom-search-history-delete {
  font-size: 12px;
  color: #999;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.custom-search-history-delete:hover {
  background-color: #f0f0f0;
  color: #666;
}
</style>
