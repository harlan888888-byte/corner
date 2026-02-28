<template>
  <div class="swiper-container">

  </div>
</template>

<script setup>
import { ref } from 'vue'


</script>

<style scoped>
.swiper-container {
  width: 100%;
  height: 300px;
  margin: 20px 0;
}

.mySwiper {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.swiper-slide:nth-child(odd) {
  background-color: #e3f2fd;
}

.swiper-slide:nth-child(even) {
  background-color: #f3e5f5;
}
</style>
