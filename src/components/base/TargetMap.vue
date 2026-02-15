<template>
  <div
    class="map-icon-trigger"
    @click="openAmapApp"
    title="打开高德地图查看地址"
  >
    <!-- 插槽：放入你的任意图标 -->
    <slot>
      <!-- 默认图标（未传插槽时显示） -->
      <i class="icon-map">🗺️</i>
    </slot>
  </div>
  <LoadingToast v-if="btnLoading" :text="btnLoadingText" />
</template>

<script setup>
import { ref, defineProps, watch } from 'vue'

const btnLoading = ref(false)
const btnLoadingText = ref('尝试打开高德地图...')

// 1. 新增Props：支持外部传入地址（核心需求）
const props = defineProps({
  // 外部传入要导航的地址（必传）
  address: {
    type: String,
    required: true
  }
})

// 2. 响应式地址变量：同步外部传入的地址
const targetAddress = ref(props.address)

// 3. 监听外部地址变化，实时更新
watch(
  () => props.address,
  (newVal) => {
    targetAddress.value = newVal
  },
  { immediate: true }
)

/**
 * 新增：检测是否为微信浏览器（核心补充）
 */
const isWechatBrowser = () => {
  const userAgent = navigator.userAgent.toLowerCase()
  return /micromessenger/.test(userAgent)
}

/**
 * 打开高德地图App（仅保留visibilitychange + blur检测，补充微信判断/异常捕获）
 */
const openAmapApp = () => {
  // 空地址校验（保留原有逻辑）
  if (!targetAddress.value.trim()) {
    alert('请输入有效的地址！')
    return
  }

  // 新增：微信浏览器特殊处理（优先判断，避免无意义的唤起）
  if (isWechatBrowser()) {
    alert(
      '微信浏览器无法直接唤起高德地图App，请点击右上角「在浏览器中打开」后重试'
    )
    return
  }

  // 1. 构造高德地图URL Scheme（保留原有逻辑）
  const amapScheme = `amapuri://poi/search/?keywords=${encodeURIComponent(targetAddress.value)}&src=vue3_webapp`
  // 新增：网页版兜底链接（用于降级）
  const webUrl = `https://uri.amap.com/search?query=${encodeURIComponent(targetAddress.value)}`

  // 2. 尝试打开高德地图（保留原有逻辑）
  const link = document.createElement('a')
  link.href = amapScheme
  link.style.display = 'none'
  document.body.appendChild(link)

  // 3. 检测设备类型（保留原有逻辑）
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )

  if (isMobile) {
    btnLoading.value = true
    // ===== 核心修改：仅保留visibilitychange + blur检测 =====
    let isAppOpened = false // 标记是否成功唤起App
    let timeoutId = null // 超时定时器

    // 检测1：页面可见性变化（核心）
    const handleVisibilityChange = () => {
      if (document.hidden || document.webkitHidden) {
        isAppOpened = true
        clearTimeout(timeoutId)
        cleanUp() // 清理监听
      }
    }

    // 检测2：页面失焦（补充）
    const handleBlur = () => {
      if (!document.hasFocus()) {
        isAppOpened = true
        clearTimeout(timeoutId)
        cleanUp() // 清理监听
      }
    }

    // 辅助函数：清理所有监听（避免内存泄漏）
    const cleanUp = () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleBlur)
      btnLoading.value = false // 关闭加载弹窗
    }

    // 注册监听事件
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleBlur)

    // 新增：try/catch 捕获同步异常（避免link.click()语法错误导致加载弹窗一直显示）
    try {
      link.click()
    } catch (err) {
      console.error('唤起高德地图同步报错：', err)
      cleanUp() // 立即清理监听+关闭加载
      goAmapDownloadPage() // 触发降级逻辑
      document.body.removeChild(link)
      return
    }

    // 移除a标签（保留原有逻辑）
    document.body.removeChild(link)

    // 超时兜底：未唤起则触发降级（分设备适配超时时间）
    const timeoutDelay = /iPhone|iPad|iPod/i.test(navigator.userAgent)
      ? 4000
      : 3500
    timeoutId = setTimeout(() => {
      cleanUp() // 清理监听
      if (!isAppOpened) {
        // 未成功唤起，触发你的降级逻辑
        goAmapDownloadPage()
        // 自动打开网页版（可选，如需开启可取消注释）
        // window.open(webUrl, '_blank')
      }
    }, timeoutDelay)
  } else {
    // 新增：隐藏加载动画
    btnLoading.value = false
    // 桌面设备：直接跳转到高德地图网页版（保留原有逻辑）
    window.open(webUrl, '_blank')
  }
}

/**
 * 跳转到高德地图下载页面（完全保留你的降级逻辑）
 */
const goAmapDownloadPage = () => {
  if (confirm('未检测到启动的高德地图App，是否前往官网下载？')) {
    window.open('https://amap.com', '_blank')
  }
}
</script>

<style scoped>
.map-icon-trigger {
  display: inline-block; /* div宽高由img决定 */
  line-height: 0; /* 消除图片底部空白 */
  vertical-align: middle; /* 垂直对齐 */
  cursor: pointer; /* 可选：鼠标悬浮变手型（交给你决定是否保留） */
}

.map-icon-trigger img {
  display: block; /* 消除img默认的行内间隙 */
}
</style>
