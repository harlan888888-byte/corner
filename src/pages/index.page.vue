<template>
  <div>
    <h1>首页</h1>
    <p>这是通过 vite-plugin-ssr 预渲染的首页</p>
    <router-link to="/hometab">前往 HomeTab</router-link>
  </div>
</template>

<script setup>
// 首页页面
</script>

<style scoped>
h1 {
  color: #333;
  margin-bottom: 20px;
}

p {
  color: #666;
  margin-bottom: 20px;
}

router-link {
  color: #409eff;
  text-decoration: none;
}

router-link:hover {
  text-decoration: underline;
}
</style>