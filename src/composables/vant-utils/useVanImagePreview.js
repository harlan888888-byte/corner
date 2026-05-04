import { ref, watch, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStackStore } from '@/stores/modules/stackStore'

export function useVanImagePreview() {
  const vanImageModalShow = ref(false)
  const vanImageCurrentIndex = ref(0)

  const router = useRouter()
  const route = useRoute()
  const stackStore = useStackStore()

  // 标记是否已添加历史记录
  let hasPushedHistory = false

  // 处理popstate事件（浏览器返回键）
  const handlePopState = () => {
    if (vanImageModalShow.value) {
      vanImageModalShow.value = false
    }
  }

  const vanImageHandleClick = (idx) => {
    vanImageCurrentIndex.value = idx
    vanImageModalShow.value = true

    // 只添加一次历史记录
    if (!hasPushedHistory) {
      stackStore.pushHistory(router, route)
      hasPushedHistory = true
    }
    window.addEventListener('popstate', handlePopState)
  }

  const vanImageHandleDblClick = (idx) => {
    vanImageHandleClick(idx)
  }

  // 监听弹窗关闭（无论是点击关闭按钮、遮罩层、还是返回键）
  watch(vanImageModalShow, (newVal, oldVal) => {
    // 当弹窗从显示变为隐藏时
    if (oldVal === true && newVal === false) {
      window.removeEventListener('popstate', handlePopState)
      // 只有添加过历史记录才回退
      if (hasPushedHistory) {
        stackStore.popHistory(router, route)
        hasPushedHistory = false
      }
    }
  })

  // 组件卸载时清理
  onUnmounted(() => {
    window.removeEventListener('popstate', handlePopState)
    hasPushedHistory = false
  })

  return {
    vanImageModalShow,
    vanImageCurrentIndex,
    vanImageHandleClick,
    vanImageHandleDblClick
  }
}
