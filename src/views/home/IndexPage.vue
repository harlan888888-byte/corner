<template>
  <div class="home-container">
    <h1>首页</h1>
    <p>欢迎来到首页</p>
    <div>
      <h2>TypeScript 示例</h2>
      <p v-for="i in 50" :key="i">这是第 {{ i }} 行内容，用于测试滚动功能</p>
    </div>
  </div>
</template>

<script setup>
// 定义响应式数据
// import { ref } from 'vue'
</script>

<style lang="scss" scoped>
.home-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
  background-color: inherit;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  height: 2000px;
  padding: 20px;
  text-align: center;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

h2 {
  font-size: 20px;
  margin: 30px 0 20px;
}

button {
  margin: 0 10px;
  padding: 5px 15px;
  cursor: pointer;
}
</style>
