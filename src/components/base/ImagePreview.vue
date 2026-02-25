<template>
  <div class="img-preview-container">
    <!-- 图片卡片：v-for 渲染网格，无需手动创建DOM -->
    <div class="moment-card">
      <div class="moment-text">图片预览</div>
      <div class="img-grid">
        <img
          class="grid-img"
          v-for="(src, idx) in props.images"
          :key="idx"
          :src="src"
          @click="handleImgClick(idx)"
          @dblclick="handleImgDblClick(idx)"
        />
      </div>
    </div>

    <!-- 预览弹窗组件 -->
    <ImagePreviewModal
      :images="images"
      :current-index="currentIndex"
      :is-modal-show="isModalShow"
    />
  </div>
</template>

<script setup>
// 导入Vue 3组合式API所需的核心方法
import { ref, onMounted } from 'vue'

// 接收父组件传入的图片列表
const props = defineProps({
  images: {
    type: Array,
    required: true,
    default: () => []
  }
})

// 弹窗显示/隐藏状态，响应式绑定
const isModalShow = ref(false)
// 当前预览图片的索引
const currentIndex = ref(0)
// 是否为双击操作
const isDoubleTap = ref(false)
// 是否正在打开预览，防止重复调用
const isOpening = ref(false)

// 2. 核心业务方法 - 处理图片预览的核心功能逻辑

// 图片单击事件处理（防双击冲突）
// 参数idx：被点击图片的索引
const handleImgClick = (idx) => {
  // 延迟执行，等待双击事件判断（避免单击和双击冲突）
  setTimeout(() => {
    // 若不是双击操作，则打开预览弹窗
    if (!isDoubleTap.value && !isOpening.value) {
      openPreview(idx)
    }
  }, 200)
}

// 图片双击事件处理
// 参数idx：被双击图片的索引
const handleImgDblClick = (idx) => {
  // 标记为双击操作，避免单击事件触发
  isDoubleTap.value = true
  // 打开预览弹窗（双击也会进入预览，同时后续会触发双击缩放）
  if (!isOpening.value) {
    openPreview(idx)
  }
}

// 打开图片预览弹窗
// 参数idx：要预览的图片索引
const openPreview = (idx) => {
  // 设置正在打开标志，防止重复调用
  isOpening.value = true

  // 设置当前预览图片的索引
  currentIndex.value = idx
  // 重置并显示预览弹窗
  isModalShow.value = false
  // 强制DOM更新
  setTimeout(() => {
    isModalShow.value = true
    // 隐藏页面滚动条，避免预览时页面滚动
    document.body.style.overflow = 'hidden'

    // 重置双击标记
    setTimeout(() => {
      isDoubleTap.value = false
      isOpening.value = false
    }, 300)
  }, 50)
}

// 4. 组件生命周期钩子 - 组件挂载完成后初始化
onMounted(() => {
  // 组件挂载完成后的初始化操作
})
</script>

<style scoped>
/* 阻止背景滚动 */
:global(body:has(.img-preview-container)) {
  overflow: hidden;
}

/* 保留原有样式，移除全局*和body（移到全局样式更合适，此处保留以兼容功能） */
.moment-card {
  max-width: 340px;
  background: #fff;
  border-radius: 10px;
  padding: 12px;
  margin: 20px auto;
}

.moment-text {
  font-size: 15px;
  color: #333;
  line-height: 1.5;
  margin-bottom: 10px;
  text-align: center;
}

.img-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  width: 100%;
}

.grid-img {
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
}

/* 全局样式建议移到 App.vue 或单独的 global.css */
:deep(*) {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

:deep(body) {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #f5f5f5;
  padding: 15px;
}
</style>
