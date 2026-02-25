<template>
  <!-- 预览弹窗组件 -->
  <div class="preview-modal" :class="{ show: localIsModalShow }">
    <!-- 滑块容器：用于水平滑动切换图片 -->
    <div
      ref="sliderWrapper"
      class="slider-wrapper"
      :style="{ transform: getSliderTransform }"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <!-- 图片幻灯片：v-for 渲染所有预览图片 -->
      <div v-for="(src, idx) in images" :key="idx" class="slide-item">
        <!-- 图片缩放容器：处理图片的缩放和位移 -->
        <div
          ref="imgScaleWraps"
          class="img-scale-wrap"
          :style="{ transform: getWrapTransform(idx) }"
        >
          <!-- 预览图片 -->
          <img class="preview-img" :src="src" @load="handleImgLoad(idx)" />
        </div>
      </div>
    </div>

    <!-- 页码指示器：显示当前图片索引和总数量 -->
    <div class="page-indicator">
      {{ state.currentIndex + 1 }} / {{ images.length }}
    </div>
  </div>
</template>

<script setup>
// 导入Vue 3组合式API所需的核心方法
import { ref, reactive, computed, watch, onMounted } from 'vue'

// 接收父组件传入的属性
const props = defineProps({
  images: {
    type: Array,
    required: true,
    default: () => []
  },
  currentIndex: {
    type: Number,
    default: 0
  },
  isModalShow: {
    type: Boolean,
    default: false
  }
})

// 本地显示状态
const localIsModalShow = ref(false)

// 监听父组件传入的isModalShow变化
watch(
  () => props.isModalShow,
  (newValue) => {
    localIsModalShow.value = newValue
  },
  { immediate: true }
)

// 滑块容器DOM引用，用于后续手动操作滑块样式
const sliderWrapper = ref(null)
// 图片缩放容器DOM引用数组，存储所有预览图片的缩放容器DOM元素
const imgScaleWraps = ref([])

// 核心交互状态对象，reactive用于复杂对象的响应式绑定，统一管理所有交互相关状态
const state = reactive({
  // 基础配置常量 - 图片交互的核心参数
  BASE_SCALE: 1, // 默认缩放比例（原始大小）
  MAX_SCALE: 2.2, // 最大缩放比例
  SCALE_SENSITIVITY: 0.12, // 双指缩放的灵敏度
  SLIDE_THRESHOLD: 70, // 滑动切换图片的阈值（像素）
  CLICK_MAX_MOVE: 10, // 判断是否为点击的最大移动距离（超过则视为滑动）
  DOUBLE_TAP_DELAY: 300, // 双击判断的延迟时间（毫秒）

  // 运行时动态状态 - 交互过程中实时变化的参数
  currentIndex: 0, // 当前预览图片的索引
  currentScale: 1, // 当前图片的缩放比例
  offsetX: 0, // 当前图片的水平偏移量（像素）
  offsetY: 0, // 当前图片的垂直偏移量（像素）
  img_lock: false, // 图片是否锁定（贴边后禁止图片移动，允许滑块滑动）
  img_state: 'center', // 图片状态（center：居中/未贴边；left：贴左边界；right：贴右边界）
  startTouches: [], // 触摸开始时的触摸点信息数组
  startX: 0, // 触摸开始时的水平坐标
  startY: 0, // 触摸开始时的垂直坐标
  lastX: 0, // 上一次触摸移动时的水平坐标
  lastY: 0, // 上一次触摸移动时的垂直坐标
  hasMoved: false, // 是否发生了有效滑动（用于区分点击和滑动）
  isSingle: false, // 是否为单指触摸
  wrapperBaseX: 0, // 滑块的基础水平偏移量（基于当前图片索引）
  clickTimer: null, // 单击/双击判断的定时器
  isDoubleTap: false, // 是否为双击操作
  containerW: 0, // 容器（窗口）宽度
  containerH: 0, // 容器（窗口）高度
  imgNaturalW: 0, // 当前图片的自然宽度（原始尺寸）
  imgNaturalH: 0, // 当前图片的自然高度（原始尺寸）
  this_offsetX: 0 // 图片贴边时的水平偏移量备份（用于恢复图片位置）
})

// 监听父组件传入的currentIndex变化
watch(
  () => props.currentIndex,
  (newIndex) => {
    // 禁用滑块过渡效果，避免从之前索引动画到当前索引
    if (sliderWrapper.value) {
      sliderWrapper.value.style.transition = 'none'
    }

    // 更新当前索引
    state.currentIndex = newIndex
    state.currentScale = state.BASE_SCALE
    state.offsetX = 0
    state.offsetY = 0

    // 强制更新滑块位置
    if (sliderWrapper.value) {
      sliderWrapper.value.style.transform = `translateX(${-state.currentIndex * 100}vw)`
    }

    // 短暂延迟后恢复过渡效果，确保后续操作有动画
    setTimeout(() => {
      if (sliderWrapper.value) {
        sliderWrapper.value.style.transition =
          'transform 0.32s cubic-bezier(0.25, 0.8, 0.25, 1)'
      }
    }, 100)
  }
)

// 计算属性 - 动态计算滑块的transform样式，实现滑块的水平平移
// 基于当前图片索引，计算滑块需要向左平移的距离（vw单位，适配不同屏幕）
const getSliderTransform = computed(() => {
  return `translateX(${-state.currentIndex * 100}vw)`
})

// 工具函数 - 计算单个图片缩放容器的transform样式
// 参数idx：图片的索引
// 返回值：当前图片的平移+缩放样式字符串
function getWrapTransform(idx) {
  // 非当前预览的图片，保持原始位置和缩放比例
  if (idx !== state.currentIndex) {
    return 'translate(0, 0) scale(1)'
  }
  // 当前预览的图片，返回实时的偏移量和缩放比例样式
  return `translate(${state.offsetX}px, ${state.offsetY}px) scale(${state.currentScale})`
}

// 跳转到指定索引的图片
// 参数idx：要跳转的图片索引
const jumpToSlide = (idx) => {
  // 重置预览状态为目标图片
  state.currentIndex = idx
  state.currentScale = state.BASE_SCALE
  state.offsetX = 0
  state.offsetY = 0

  // 重置滑块过渡效果（平滑切换到目标图片）
  if (sliderWrapper.value) {
    sliderWrapper.value.style.transition =
      'transform 0.32s cubic-bezier(0.25, 0.8, 0.25, 1)'
  }
}

// 图片加载完成事件处理（获取图片的自然尺寸）
// 参数idx：加载完成的图片索引
const handleImgLoad = (idx) => {
  // 只关注当前预览的图片
  if (idx !== state.currentIndex) {
    return
  }
  // 获取图片DOM元素，提取自然尺寸（原始宽高，不受缩放影响）
  const img = imgScaleWraps.value[idx]?.querySelector('.preview-img')
  if (img) {
    state.imgNaturalW = img.naturalWidth
    state.imgNaturalH = img.naturalHeight
  }
}

// 工具函数 - 计算图片的容器边界（最大可偏移范围）
// 返回值：包含最大偏移量和是否贴边的对象
const calcContainerBasedBounds = () => {
  // 若为原始缩放比例，无偏移边界限制
  if (state.currentScale === state.BASE_SCALE) {
    return {
      maxOX: 0, // 最大水平偏移量
      maxOY: 0, // 最大垂直偏移量
      leftHit: false, // 是否贴左边界
      rightHit: false, // 是否贴右边界
      topHit: false, // 是否贴上边界
      bottomHit: false // 是否贴下边界
    }
  }

  // 计算缩放后的图片尺寸
  const scaledW = state.containerW * state.currentScale
  const scaledH = state.containerH * state.currentScale
  // 计算最大可偏移量（图片超出容器的部分的一半，即最大可拖动距离）
  const maxOX = (scaledW - state.containerW) / 2
  const maxOY = (scaledH - state.containerH) / 2
  // 判断是否贴边（当前偏移量是否达到最大偏移量）
  const leftHit = state.offsetX <= -maxOX
  const rightHit = state.offsetX >= maxOX
  const topHit = state.offsetY <= -maxOY
  const bottomHit = state.offsetY >= maxOY

  // 返回边界计算结果
  return { maxOX, maxOY, leftHit, rightHit, topHit, bottomHit }
}

// 工具函数 - 应用容器边界约束，限制图片偏移量在可拖动范围内
// 返回值：更新后的边界信息
const applyContainerBounds = () => {
  // 获取边界信息
  const { maxOX, maxOY } = calcContainerBasedBounds()
  // 限制水平偏移量在 [-maxOX, maxOX] 范围内
  state.offsetX = Math.min(Math.max(state.offsetX, -maxOX), maxOX)
  // 限制垂直偏移量在 [-maxOY, maxOY] 范围内
  state.offsetY = Math.min(Math.max(state.offsetY, -maxOY), maxOY)
  // 返回更新后的边界信息
  return calcContainerBasedBounds()
}

// 工具函数 - 计算两个触摸点之间的距离（用于双指缩放）
// 参数t1：第一个触摸点信息，t2：第二个触摸点信息
// 返回值：两个触摸点之间的直线距离
const getPinchDist = (t1, t2) => {
  return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY)
}

// 工具函数 - 计算两个触摸点的中心坐标（用于双指缩放的中心点）
// 参数t1：第一个触摸点信息，t2：第二个触摸点信息
// 返回值：触摸点中心的x、y坐标
const getPinchCenter = (t1, t2) => {
  return {
    x: (t1.clientX + t2.clientX) / 2,
    y: (t1.clientY + t2.clientY) / 2
  }
}

// 处理双击缩放逻辑
// 参数clientX：双击时的水平坐标，clientY：双击时的垂直坐标
const handleDoubleTap = (clientX, clientY) => {
  // 获取当前预览图片的缩放容器DOM
  const wrap = imgScaleWraps.value[state.currentIndex]
  if (!wrap) {
    return
  }

  // 判断目标缩放比例（切换原始大小/最大缩放）
  const targetScale =
    state.currentScale === state.BASE_SCALE ? state.MAX_SCALE : state.BASE_SCALE
  // 计算缩放中心点相对于容器的比例（用于偏移量校准）
  const centerRX = clientX / state.containerW - 0.5
  const centerRY = clientY / state.containerH - 0.5

  // 若目标为原始大小，直接重置偏移和缩放
  if (targetScale === state.BASE_SCALE) {
    state.currentScale = state.BASE_SCALE
    state.offsetX = 0
    state.offsetY = 0
  } else {
    // 计算缩放差值
    const deltaScale = targetScale - state.currentScale
    // 校准图片偏移量，使缩放围绕双击点中心进行
    state.offsetX -= centerRX * deltaScale * state.containerW
    state.offsetY -= centerRY * deltaScale * state.containerH
    // 更新缩放比例
    state.currentScale = targetScale
    // 应用边界约束，避免缩放后图片偏移超出范围
    applyContainerBounds()
  }

  // 设置图片过渡效果（平滑缩放）
  wrap.style.transition = 'transform 0.2s ease'
}

// 关闭图片预览弹窗
const closePreview = () => {
  // 获取当前预览图片的缩放容器DOM
  const wrap = imgScaleWraps.value[state.currentIndex]
  // 设置图片的过渡效果（平滑复位）
  if (wrap) {
    wrap.style.transition = 'transform 0.15s ease-in-out'
  }

  // 重置图片缩放和偏移状态
  state.currentScale = state.BASE_SCALE
  state.offsetX = 0
  state.offsetY = 0

  // 延迟隐藏弹窗，等待过渡效果完成
  setTimeout(() => {
    // 直接更新本地显示状态
    localIsModalShow.value = false
    // 恢复页面滚动条
    document.body.style.overflow = ''
  }, 150)
}

// 3. 触摸事件处理 - 处理移动端的触摸交互（单指滑动、双指缩放）

// 触摸开始事件处理（touchstart）
const handleTouchStart = (e) => {
  // 阻止默认事件（避免页面滚动、缩放等原生行为干扰）
  e.preventDefault()
  // 记录触摸开始时的所有触摸点信息
  state.startTouches = Array.from(e.touches)
  const cnt = state.startTouches.length

  // 双指触摸（缩放操作）
  if (cnt === 2) {
    state.isSingle = false
    // 获取当前图片缩放容器，关闭过渡效果（保证缩放流畅）
    const wrap = imgScaleWraps.value[state.currentIndex]
    if (wrap) {
      wrap.style.transition = 'none'
    }
    return
  }

  // 单指触摸（滑动/点击操作）
  if (cnt === 1) {
    // 关闭滑块过渡效果（保证滑动流畅）
    if (sliderWrapper.value) {
      sliderWrapper.value.style.transition = 'none'
    }
    state.isSingle = true
    // 记录触摸开始时的坐标
    const t = state.startTouches[0]
    state.startX = t.clientX
    state.startY = t.clientY
    state.lastX = t.clientX
    state.lastY = t.clientY
    // 重置滑动状态标记
    state.hasMoved = false
    // 计算滑块基础偏移量（基于当前图片索引）
    state.wrapperBaseX = -state.currentIndex * 100

    // 获取当前图片缩放容器，关闭过渡效果（保证滑动流畅）
    const wrap = imgScaleWraps.value[state.currentIndex]
    if (wrap) {
      wrap.style.transition = 'none'
    }
  }
}

// 触摸移动事件处理（touchmove）
const handleTouchMove = (e) => {
  // 阻止默认事件（避免页面滚动、缩放等原生行为干扰）
  e.preventDefault()
  // 获取当前触摸点信息
  const currTouches = Array.from(e.touches)
  const cnt = currTouches.length
  // 获取当前图片缩放容器
  const wrap = imgScaleWraps.value[state.currentIndex]
  if (!wrap) {
    return
  }

  // 双指触摸（缩放操作）
  if (cnt === 2) {
    state.isSingle = false
    const t1 = currTouches[0]
    const t2 = currTouches[1]
    const sT1 = state.startTouches[0]
    const sT2 = state.startTouches[1]

    // 计算触摸开始和当前的两点距离
    const sDist = getPinchDist(sT1, sT2)
    const cDist = getPinchDist(t1, t2)
    // 计算触摸中心坐标
    const center = getPinchCenter(t1, t2)
    // 计算缩放比例
    const scaleRatio = cDist / sDist
    // 计算新的缩放比例（限制在最小/最大缩放之间）
    const newScale = Math.max(
      state.BASE_SCALE,
      Math.min(
        state.MAX_SCALE,
        state.currentScale * (1 + (scaleRatio - 1) * state.SCALE_SENSITIVITY)
      )
    )

    // 计算缩放中心相对于容器的比例（用于偏移量校准）
    const cxRel = center.x / state.containerW - 0.5
    const cyRel = center.y / state.containerH - 0.5
    // 计算缩放差值
    const scaleDelta = newScale - state.currentScale
    // 校准图片偏移量，使缩放围绕双指中心进行
    state.offsetX -= cxRel * scaleDelta * state.containerW
    state.offsetY -= cyRel * scaleDelta * state.containerH
    // 更新缩放比例
    state.currentScale = newScale

    // 应用边界约束，避免缩放后图片偏移超出范围
    applyContainerBounds()
    return
  }

  // 单指触摸（滑动操作）
  if (cnt === 1 && state.isSingle) {
    const t = currTouches[0]
    const currX = t.clientX
    const currY = t.clientY
    // 计算本次移动的偏移量
    const deltaX = currX - state.lastX
    const deltaY = currY - state.lastY
    // 计算从触摸开始到当前的总水平偏移量
    let totalMoveX = currX - state.startX

    // 判断是否为有效滑动（超过最小移动距离则标记为滑动）
    if (
      Math.abs(totalMoveX) > state.CLICK_MAX_MOVE ||
      Math.abs(currY - state.startY) > state.CLICK_MAX_MOVE
    ) {
      state.hasMoved = true
    }

    // 未放大状态（原始大小）：直接滑动滑块切换图片
    if (state.currentScale === state.BASE_SCALE) {
      // 计算滑块的水平偏移比例（vw单位）
      const slidePercent = (totalMoveX / state.containerW) * 100
      const translateXInVw = state.wrapperBaseX + slidePercent
      // 手动更新滑块样式，实现滑动效果
      sliderWrapper.value.style.transform = `translateX(${translateXInVw}vw)`
    } else {
      // 放大分支：移除反解逻辑，直接复用增量计算
      if (!state.img_lock) {
        state.offsetX += deltaX
        state.offsetY += deltaY
      }

      const bounds = applyContainerBounds()

      // 核心：直接计算手指移动的增量（和未放大分支一致）
      const slidePercent = (totalMoveX / state.containerW) * 100
      let translateXInVw = state.wrapperBaseX + slidePercent

      // 图片居中状态（未贴边）
      if (state.img_state === 'center') {
        if (bounds.leftHit && deltaX < 0) {
          state.this_offsetX = state.offsetX
          state.img_state = 'right'
          state.img_lock = true
          sliderWrapper.value.style.transform = `translateX(${translateXInVw}vw)`
        } else if (bounds.rightHit && deltaX > 0) {
          state.this_offsetX = state.offsetX
          state.img_state = 'left'
          state.img_lock = true
          sliderWrapper.value.style.transform = `translateX(${translateXInVw}vw)`
        }
      } else if (state.img_state === 'right') {
        state.offsetX = state.this_offsetX
        if (state.wrapperBaseX > translateXInVw) {
          sliderWrapper.value.style.transform = `translateX(${translateXInVw}vw)`
        } else {
          sliderWrapper.value.style.transform = `translateX(${translateXInVw}vw)`
          state.img_lock = false
          state.img_state = 'center'
        }
      } else if (state.img_state === 'left') {
        state.offsetX = state.this_offsetX
        if (state.wrapperBaseX < translateXInVw) {
          sliderWrapper.value.style.transform = `translateX(${translateXInVw}vw)`
        } else {
          sliderWrapper.value.style.transform = `translateX(${translateXInVw}vw)`
          state.img_lock = false
          state.img_state = 'center'
        }
      }
    }

    // 更新上一次触摸坐标
    state.lastX = currX
    state.lastY = currY
  }
}

// 触摸结束事件处理（touchend）
const handleTouchEnd = (e) => {
  // 若还有触摸点未离开（如双指先后离开），不处理
  if (e.touches.length > 0) {
    return
  }
  // 计算触摸开始到结束的总水平偏移量
  const totalDx = state.lastX - state.startX
  // 获取离开的触摸点信息
  const touch = e.changedTouches[0]
  // 获取当前图片缩放容器
  const wrap = imgScaleWraps.value[state.currentIndex]

  // 非单指触摸，重置状态并返回
  if (!state.isSingle) {
    if (wrap) {
      // 恢复图片过渡效果
      wrap.style.transition = 'transform 0.1s ease'
    }
    state.isSingle = false
    return
  }

  // 恢复滑块过渡效果（平滑复位或切换）
  if (sliderWrapper.value) {
    sliderWrapper.value.style.transition =
      'transform 0.32s cubic-bezier(0.25, 0.8, 0.25, 1)'
  }

  // 未发生有效滑动：判断为单击/双击操作
  if (!state.hasMoved) {
    // 已有定时器（双击的第二次点击）
    if (state.clickTimer) {
      // 清除定时器，标记为双击
      clearTimeout(state.clickTimer)
      state.clickTimer = null
      state.isDoubleTap = true
      // 执行双击缩放逻辑
      handleDoubleTap(touch.clientX, touch.clientY)
    }
    // 无定时器（单击的第一次点击）
    else {
      state.isDoubleTap = false
      // 设置定时器，判断是否为双击
      state.clickTimer = setTimeout(() => {
        // 定时器到期，判断为单击
        if (!state.isDoubleTap && !state.hasMoved) {
          // 关闭预览弹窗
          setTimeout(() => closePreview(), 50)
        }
        state.clickTimer = null
      }, state.DOUBLE_TAP_DELAY)
    }
    // 重置状态标记
    state.hasMoved = false
    state.isSingle = false
    return
  }

  // 放大状态：边界判断 + 滑动切换图片
  if (state.currentScale > state.BASE_SCALE) {
    // 获取边界信息
    const bounds = calcContainerBasedBounds()
    // 判断是否为贴边后的有效滑动
    const isEdgeSlide =
      (bounds.leftHit && totalDx < 0) || (bounds.rightHit && totalDx > 0)

    // 满足切换阈值：跳转到相邻图片
    if (isEdgeSlide && Math.abs(totalDx) >= state.SLIDE_THRESHOLD) {
      // 向左滑动，跳转到上一张
      if (totalDx > 0 && state.currentIndex > 0) {
        jumpToSlide(state.currentIndex - 1)
      }
      // 向右滑动，跳转到下一张
      else if (totalDx < 0 && state.currentIndex < props.images.length - 1) {
        jumpToSlide(state.currentIndex + 1)
      }
      // 无法跳转（已到首尾），复位滑块和图片
      else {
        applyContainerBounds()
        if (sliderWrapper.value) {
          sliderWrapper.value.style.transform = `translateX(${state.wrapperBaseX}vw)`
        }
      }
    }
    // 不满足切换阈值：复位滑块和图片
    else {
      applyContainerBounds()
      if (sliderWrapper.value) {
        sliderWrapper.value.style.transform = `translateX(${state.wrapperBaseX}vw)`
      }
    }
    // 重置状态标记
    state.hasMoved = false
    state.isSingle = false
    return
  }

  // 正常状态（原始大小）：滑动切换图片
  if (Math.abs(totalDx) >= state.SLIDE_THRESHOLD) {
    // 向左滑动，跳转到上一张
    if (totalDx > 0 && state.currentIndex > 0) {
      jumpToSlide(state.currentIndex - 1)
    }
    // 向右滑动，跳转到下一张
    else if (totalDx < 0 && state.currentIndex < props.images.length - 1) {
      jumpToSlide(state.currentIndex + 1)
    }
    // 无法跳转（已到首尾），复位滑块
    else {
      if (sliderWrapper.value) {
        sliderWrapper.value.style.transform = `translateX(${state.wrapperBaseX}vw)`
      }
    }
  }
  // 不满足切换阈值：复位滑块
  else {
    if (sliderWrapper.value) {
      sliderWrapper.value.style.transform = `translateX(${state.wrapperBaseX}vw)`
    }
  }

  // 重置状态标记
  state.hasMoved = false
  state.isSingle = false
}

// 4. 组件生命周期钩子 - 组件挂载完成后初始化
onMounted(() => {
  // 获取当前窗口尺寸，用于后续计算偏移和缩放
  state.containerW = window.innerWidth
  state.containerH = window.innerHeight
})
</script>

<style scoped>
.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  z-index: 9999;
  display: flex;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.1s ease-in-out;
  overflow: hidden;
}

.preview-modal.show {
  opacity: 1;
  pointer-events: auto;
  transition: opacity 0.1s ease-in-out;
}

.slider-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  transition: transform 0.32s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slide-item {
  width: 100vw;
  height: 100vh;
  flex-shrink: 0;
  overflow: hidden;
  position: relative;
}

.img-scale-wrap {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transform-origin: center center;
  touch-action: none;
  transition: transform 0.1s ease;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  -webkit-user-drag: none;
}

.page-indicator {
  position: fixed;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-size: 14px;
  background: rgba(0, 0, 0, 0.4);
  padding: 5px 14px;
  border-radius: 16px;
  z-index: 10000;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
}
</style>
