<template>
  <!-- 图片懒加载组件：占位图 + data-src存储真实地址 + 加载状态 -->
  <div class="lazy-image-container">
    <div class="img-placeholder" v-if="!imgLoaded">
      <span class="loading-icon">
        <img src="@/assets/icons/loading.svg" alt="" />
      </span>
    </div>
    <img
      loading="lazy"
      class="lazy"
      :data-src="src"
      :src="src"
      :alt="alt"
      @load="imgLoaded = true"
      @error="handleImgError"
      ref="lazyImg"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted, watch } from 'vue'
import defaultImgSrc from '@/assets/icons/miss_store.svg'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  }
})

// 给父组件传值：load/error事件
const emit = defineEmits(['load', 'error'])

// 占位图：1x1浅灰色图
const placeholderImg =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADklEQVR4AWL6+vXrfwAAAAD//4U+q8cAAAAGSURBVAMACasD4eJnF0gAAAAASUVORK5CYII='
// 图片加载状态
const imgLoaded = ref(false)
// 图片DOM引用
const lazyImg = ref(null)

// 图片加载失败处理：显示兜底图
const handleImgError = () => {
  if (lazyImg.value) {
    lazyImg.value.src = defaultImgSrc
    emit('error')
  }
}

// 图片加载成功处理
const handleImgLoad = () => {
  imgLoaded.value = true
  emit('load')
}

// 懒加载核心逻辑：IntersectionObserver监听图片进入视口
const initLazyLoad = () => {
  if (!lazyImg.value) {
    return
  }

  // 避免重复监听
  if (lazyImg.value._lazyObserved) {
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          const realSrc = img.dataset.src || img.getAttribute('data-src')

          // 校验真实地址
          if (realSrc) {
            img.src = realSrc
            img.addEventListener('load', handleImgLoad)
            img.addEventListener('error', handleImgError)
          } else {
            handleImgError() // 无地址时显示兜底图
          }

          observer.unobserve(img)
          img._lazyObserved = true
        }
      })
    },
    {
      rootMargin: '100px 0px' // 提前100px加载
    }
  )

  observer.observe(lazyImg.value)
}

// 监听src变化（动态数据更新时重新初始化懒加载）
watch(
  () => props.src,
  () => {
    imgLoaded.value = false
    initLazyLoad()
  },
  { immediate: true }
)

// 组件挂载后初始化懒加载
onMounted(() => {
  initLazyLoad()
})
</script>

<style lang="scss" scoped>
.lazy-image-container {
  position: relative; // 用于占位图定位
  width: 100%;
  height: 100%;

  // 图片加载占位样式
  .img-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
    border-radius: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    .loading-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 50%;
        height: 50%;
        animation: spin 1s linear infinite;
      }
    }
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: inherit;
    position: relative;
  }
}

// 加载动画
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
