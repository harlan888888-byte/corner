<template>
  <!-- 加载更多组件：加载中文本 + 无更多数据文本 -->
  <div class="load-more">
    <span v-if="loading">{{ loadingText }}</span>
    <span v-else-if="!hasMore">{{ noMoreText }}</span>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
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
    default: '已加载全部数据'
  }
})
</script>

<style scoped>
.load-more {
  font-size: 14px;
}

.load-more span {
  display: block;
}
</style>
