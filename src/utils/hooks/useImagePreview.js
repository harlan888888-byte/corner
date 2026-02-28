import { ref } from 'vue'

export function useImagePreview() {
  // 弹窗显示/隐藏状态，响应式绑定
  const isModalShow = ref(false)
  // 当前预览图片的索引
  const currentIndex = ref(0)
  // 是否为双击操作
  const isDoubleTap = ref(false)
  // 是否正在打开预览，防止重复调用
  const isOpening = ref(false)

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

  // 关闭图片预览弹窗
  const closePreview = () => {
    // 隐藏弹窗
    isModalShow.value = false
    // 恢复页面滚动条
    document.body.style.overflow = ''
  }

  return {
    isModalShow,
    currentIndex,
    handleImgClick,
    handleImgDblClick,
    openPreview,
    closePreview

  }
}
