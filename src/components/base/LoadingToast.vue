<template>
  <div class="loading-wrapper">
    <div class="loading-container">
      <van-loading
        vertical
        :type="type"
        :color="color"
        :text-size="textSize"
        :size="size"
      >
        {{ text || '加载中...' }}
      </van-loading>
    </div>
  </div>
</template>

<script setup>
// 定义组件 props
const props = defineProps({
  // 加载提示文本
  text: {
    type: String,
    default: ''
  },
  textSize: {
    type: String,
    default: '18px'
  },
  // 加载图标类型：spinner | circular
  type: {
    type: String,
    default: 'circular'
  },
  // 加载图标颜色
  color: {
    type: String,
    default: '#c8c9cc'
  },
  // 加载图标大小
  size: {
    type: String,
    default: '40px'
  }
})
</script>

<style scoped>
.loading-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  /* background-color: rgba(0, 0, 0, 0.3); */
  z-index: 9999;
}

.loading-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 150px;
  min-height: 120px;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 10px;
  padding: 20px;
  gap: 15px;
  box-sizing: border-box;
}

:deep(.van-loading) {
  color: #ffffff;
  margin: 0;
  text-align: center;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
  max-width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
}
</style>
