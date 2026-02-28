// stores/modules/stackStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export const useStackStore = defineStore('stack', () => {
  const router = useRouter()
  const route = useRoute()

  // 历史记录栈
  const addedHistoryCount = ref(0)

  // 弹窗栈：{ 'routeName': [closeFn1, closeFn2] }
  const stackMap = ref({})

  // 当前路由名
  const currentRouteName = ref('')

  // 防止重复处理后退事件的标志
  const isHandlingBack = ref(false)

  // ===== 历史记录栈相关方法 =====

  // 打开选择器：新增历史记录（使用路由参数）
  function pushHistory(router, route) {
    try {
      // 使用路由参数来标记历史记录
      // 生成一个唯一的历史ID
      const historyId = Date.now()
      // 保留当前的所有路由参数，添加historyId参数
      const newQuery = {
        ...route.query,
        historyId: historyId.toString()
      }
      // 使用router.push添加新的历史记录
      router.push({
        path: route.path,
        query: newQuery
      })
      addedHistoryCount.value += 1
    } catch (error) {
      console.error('pushHistory执行失败：', error)
    }
  }

  // 关闭选择器：后退历史记录（使用路由参数）
  let lastPopTime = 0
  function popHistory(router, route) {
    // 防抖：防止频繁调用
    const now = Date.now()
    if (now - lastPopTime < 300) {
      return
    }
    lastPopTime = now

    try {
      if (addedHistoryCount.value > 0) {
        // 使用router.back()后退到上一个历史记录
        router.back()
      }
    } catch (error) {
      console.error('popHistory执行失败：', error)
    }
  }

  // 重置历史记录计数
  function resetHistoryCount() {
    addedHistoryCount.value = 0
  }

  // 获取新增的历史记录数
  function getAddedHistoryCount() {
    return addedHistoryCount.value || 0
  }

  // ===== 弹窗栈相关方法 =====

  // 设置当前路由名
  function setCurrentRoute(name) {
    currentRouteName.value = name
    if (!stackMap.value[name]) {
      stackMap.value[name] = []
    }
  }

  // 推入当前路由的弹窗
  function pushDialog(routeKey, closeFn) {
    if (!stackMap.value[routeKey]) {
      stackMap.value[routeKey] = []
    }
    stackMap.value[routeKey].push(closeFn)
  }

  // 弹出当前路由顶层弹窗
  function popDialog(routeKey) {
    const stack = stackMap.value[routeKey]
    if (stack?.length) stack.pop()
  }

  // 清空当前路由所有弹窗并关闭
  function clearCurrentDialogs(routeKey) {
    const stack = stackMap.value[routeKey] || []
    while (stack.length) {
      const close = stack.pop()
      close?.()
    }
  }

  // 清空特定路由的弹窗栈（不执行关闭函数）
  function clearRouteDialogs(routeKey) {
    if (stackMap.value[routeKey]) {
      stackMap.value[routeKey] = []
    }
  }

  // 重置特定路由的状态（用于页面切换时）
  function resetRouteState(routeKey) {
    clearRouteDialogs(routeKey)
    // 如果当前路由是目标路由，重置历史记录计数
    const currentRouteKey = route.name || route.path || 'default'
    if (currentRouteKey === routeKey) {
      addedHistoryCount.value = 0
    }
  }

  // 获取当前路由栈长度
  const currentDepth = computed(() => {
    return stackMap.value[currentRouteName.value]?.length || 0
  })

  return {
    // 历史记录栈
    addedHistoryCount, // 新增历史记录计数
    pushHistory, // 添加历史记录
    popHistory, // 移除历史记录
    resetHistoryCount, // 重置历史记录计数
    getAddedHistoryCount, // 获取新增历史记录数

    // 弹窗栈
    stackMap, // 弹窗栈映射表
    currentRouteName, // 当前路由名
    setCurrentRoute, // 设置当前路由
    pushDialog, // 添加弹窗到栈
    popDialog, // 从栈中移除弹窗
    clearCurrentDialogs, // 清空当前路由所有弹窗
    clearRouteDialogs, // 清空特定路由弹窗栈
    resetRouteState, // 重置特定路由状态
    currentDepth, // 当前路由栈深度
    isHandlingBack // 防止重复处理后退事件标志
  }
})
