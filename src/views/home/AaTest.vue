<template>
  <div class="aatest-container">
    <div class="box">
      <h1 @click="handleClickTitle">测试组件</h1>
    </div>

    <router-view v-slot="{ Component }">
      <transition name="slide-fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleClickTitle = () => {
  router.push({ name: 'IndexPage' })
}
</script>

<style lang="scss" scoped>
.aatest-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: blue;
  color: white;
  font-size: 24px;
  z-index: 9999;
  overflow: hidden;
}

// .box {
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
// }

// /* 阻止背景滚动 */
// :global(body:has(.aatest-container)) {
//   overflow: hidden;
// }
</style>
