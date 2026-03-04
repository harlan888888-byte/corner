<template>
  <!-- 图片卡片组件：网格布局，支持点击预览和双击放大 -->
  <div class="img-preview-container">
    <div class="moment-card">
      <div class="img-grid">
        <LazyImage
          class="grid-img"
          v-for="(src, idx) in props.images"
          :key="idx"
          :src="src"
          @click="vanImageHandleClick(idx)"
          @dblclick="vanImageHandleDblClick(idx)"
        />
      </div>
    </div>

    <van-image-preview
      v-if="vanImageModalShow"
      v-model:show="vanImageModalShow"
      :images="props.images"
      :start-position="vanImageCurrentIndex"
      @close="vanImageClose"
      teleport="body"
      show-indicators
      :show-index="false"
    />
  </div>
</template>

<script setup>
import { useVanImagePreview } from '@/composables/vant-utils/useVanImagePreview'

const props = defineProps({
  images: {
    type: Array,
    required: true,
    default: () => []
  }
})

// 使用 van-image-preview 组合式函数
const {
  vanImageModalShow,
  vanImageCurrentIndex,
  vanImageHandleClick,
  vanImageHandleDblClick,
  vanImageClose
} = useVanImagePreview()

</script>

<style scoped>
/* 阻止背景滚动 */
:global(body:has(.img-preview-container)) {
  overflow: hidden;
}

/* 保留原有样式，移除全局*和body（移到全局样式更合适，此处保留以兼容功能） */
.moment-card {
  background: #fff;
  padding: 12px;
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
