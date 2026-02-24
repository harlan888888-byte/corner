<template>
  <div class="aatest-container">
    <h1>测试组件</h1>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
</script>

<style lang="scss" scoped>
.aatest-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: blue;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

/* 阻止背景滚动 */
:global(body:has(.aatest-container)) {
  overflow: hidden;
}
</style>
