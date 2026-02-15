<template>
  <div class="home-container">
    <h1>首页</h1>
    <p>欢迎来到首页</p>
    <div>
      <h2>TypeScript 示例</h2>
    </div>
    <TargetMap></TargetMap>
  </div>
</template>

<script setup>
// 定义响应式数据
// import { ref } from 'vue'
import { getStoreInfo } from '@/api/home/store'
import TargetMap from '@/components/TargetMap.vue'

const getStoreInfoList = async () => {
  const res = await getStoreInfo()
  console.log(res.data.data)
}
getStoreInfoList()
</script>

<style lang="scss" scoped>
.home-container {
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
