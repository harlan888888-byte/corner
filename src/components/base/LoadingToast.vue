<template>
  <div class="loading-wrapper">
    <div class="loading-container">
      <van-loading
        :type="type"
        :color="color"
        :size="size"
        :text-size="textSize"
        vertical
      />
      <p v-if="text" class="loading-text">{{ text }}</p>
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
    default: '16px'
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  height: 120px;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 10px;
  padding: 20px;
  gap: 15px;
}

.loading-text {
  color: #ffffff;
  margin: 0;
  text-align: center;
}
</style>
