<template>
  <!-- 店铺列表组件：滚动加载，支持自定义内容插槽 -->
  <div class="store-list-container">
    <ul ref="storeListRef" class="store-list">
      <slot v-for="item in storeList" :key="item.id" :item="item">
        <!-- 默认插槽内容 -->
      </slot>
      <!-- 使用封装的 LoadMore 组件，放在 ul 内部作为最后一个子元素，只有当数据不为空时才显示 -->
      <li v-if="storeList.length > 0" class="load-more-item">
        <LoadMore
          :loading="loading"
          :hasMore="hasMore"
          :loadingText="loadingText"
          :noMoreText="noMoreText"
        />
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import LoadMore from '../base/LoadMore.vue'

const props = defineProps({
  storeList: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  hasMore: {
    type: Boolean,
    default: true
  },
  loadingText: {
    type: String,
    default: '加载中...'
  },
  noMoreText: {
    type: String,
    default: '滑到底啦！暂无更多数据~'
  }
})

const emit = defineEmits(['loadMore'])

// 滚动容器引用
const scrollContainer = ref(null)
// 店铺列表引用
const storeListRef = ref(null)

// 滚动事件处理函数
const handleScroll = (event) => {
  // 确定滚动容器
  const target = event.target === window ? window : event.target
  const scrollTop =
    target.scrollTop ||
    document.documentElement.scrollTop ||
    document.body.scrollTop
  const scrollHeight =
    target.scrollHeight ||
    document.documentElement.scrollHeight ||
    document.body.scrollHeight
  const clientHeight =
    target.clientHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight

  // 检测滚动到底部
  if (scrollTop + clientHeight >= scrollHeight - 30) {
    emit('loadMore')
  }
}

// 组件挂载时添加滚动事件监听
onMounted(() => {
  // 查找父级的 .page-container 滚动容器
  setTimeout(() => {
    let container = storeListRef.value
    while (container && !container.classList.contains('page-container')) {
      container = container.parentElement
    }

    if (container) {
      scrollContainer.value = container
      container.addEventListener('scroll', handleScroll)
    }
  }, 100)
})

// 组件卸载时移除滚动事件监听
onUnmounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', handleScroll)
  }
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.store-list-container {
  width: 100%;
}

.store-list {
  list-style: none;
  margin: 0;
  padding: 0 5px;
}

.load-more-item {
  display: flex;
  justify-content: center;
  padding: 10px 0;
}
</style>
