<template>
  <!-- 空状态组件：图片 + 文本 -->
  <div class="empty-state">
    <img :src="imgSrc || defaultImg" :alt="altText" class="empty-state-img" />
    <p class="empty-state-text">{{ text }}</p>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue'
import defaultImgSrc from '@/assets/icons/miss_data.svg'

const props = defineProps({
  imgSrc: {
    type: String,
    default: ''
  },
  altText: {
    type: String,
    default: '无数据'
  },
  text: {
    type: String,
    default: '暂无数据'
  }
})

const defaultImg = ref(defaultImgSrc)
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  width: 100%;
  padding: 20px;
  text-align: center;
  box-sizing: border-box;
}

.empty-state-img {
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
}

.empty-state-text {
  font-size: 16px;
  color: #999;
  margin: 0;
}
</style>
