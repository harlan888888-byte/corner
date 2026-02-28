import { useStackStore } from '@/stores'

export function useBackButton() {
  // 使用统一的栈管理 store
  const stackStore = useStackStore()
  const {
    pushHistory,
    popHistory,
    resetHistoryCount,
    getAddedHistoryCount,
    setCurrentRoute,
    popDialog
  } = stackStore

  // 直接访问 store 中的 ref 值
  const getStackMap = () => {
    // 确保 stackMap 有值
    if (!stackStore.stackMap || typeof stackStore.stackMap !== 'object') {
      stackStore.stackMap = { value: {} }
    }
    // 如果 stackMap 是一个 ref 对象，访问其 value 属性
    if (stackStore.stackMap.value !== undefined) {
      return stackStore.stackMap.value || {}
    }
    // 如果 stackMap 本身就是一个对象，直接返回
    return stackStore.stackMap || {}
  }
  const getCurrentRouteName = () => stackStore.currentRouteName.value

  // 推送弹窗到栈中
  const pushDialog = (route, closeFn) => {
    const routeKey = route.name || route.path || 'default'
    stackStore.pushDialog(routeKey, closeFn)
  }

  // 使用弹窗栈 store（保持向后兼容）
  const dialogStackStore = {
    get stackMap() {
      return getStackMap()
    },
    get currentRouteName() {
      return getCurrentRouteName()
    },
    setCurrentRoute,
    push: pushDialog,
    pop: popDialog
  }

  // 使用Vue Router控制后退事件
  const handleBackButton = (router, route) => {
    try {
      // 防止重复处理
      if (stackStore.isHandlingBack) {
        return false
      }

      stackStore.isHandlingBack = true
      const addedCount = getAddedHistoryCount()

      // 检查是否有新增的历史记录，如果有，说明是从城市选择器页面后退
      if (addedCount > 0) {
        // 确保当前路由名已设置
        const routeKey = route.name || route.path || 'default'

        // 直接使用路由键作为栈的键，不依赖currentRouteName
        const stackMap = getStackMap()
        const stack = stackMap[routeKey] || []

        if (stack.length > 0) {
          // 执行关闭函数
          const closeFn = stack[stack.length - 1]
          if (typeof closeFn === 'function') {
            closeFn()
          }
          // 从栈中移除
          stackStore.popDialog(routeKey)
        }
        // 直接减少历史记录计数，不调用popHistory
        const currentCount = stackStore.getAddedHistoryCount()
        // 使用 store 的方法来减少历史记录计数
        if (currentCount > 0) {
          stackStore.addedHistoryCount = currentCount - 1
        }

        // 延迟恢复，防止重复处理
        setTimeout(() => {
          stackStore.isHandlingBack = false
        }, 100)

        return true // 表示已处理后退事件
      }

      // 恢复处理状态
      setTimeout(() => {
        stackStore.isHandlingBack = false
      }, 100)

      return false // 未处理后退事件，让浏览器默认处理
    } catch (error) {
      // 恢复处理状态
      setTimeout(() => {
        stackStore.isHandlingBack = false
      }, 100)

      return false // 出错时让浏览器默认处理
    }
  }

  // 定义事件处理函数
  const handlePopState = (router, route) => {
    return (event) => {
      const handled = handleBackButton(router, route)
      if (handled) {
        // 如果已处理后退事件，阻止默认行为
        event.preventDefault()
        event.stopPropagation()
      }
    }
  }

  return {
    pushHistory, // 添加历史记录
    popHistory, // 移除历史记录
    resetHistoryCount, // 重置历史记录计数
    getAddedHistoryCount, // 获取新增的历史记录数
    handleBackButton, // 处理后退事件
    handlePopState, // 创建popstate事件处理函数
    pushDialog, // 添加弹窗到栈中
    resetRouteState: stackStore.resetRouteState, // 重置特定路由状态
    dialogStackStore // 弹窗栈store实例
  }
}
