// stores/dialogStack.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDialogStackStore = defineStore('dialogStack', () => {
  // 结构：{ 'aaa': [closeFn1, closeFn2], 'bbb': [closeFn3] }
  const stackMap = ref({})

  // 当前路由名
  const currentRouteName = ref('')

  function setCurrentRoute(name) {
    currentRouteName.value = name
    if (!stackMap.value[name]) {
      stackMap.value[name] = []
    }
  }

  // 推入当前路由的弹窗
  function push(closeFn) {
    const stack = stackMap.value[currentRouteName.value]
    if (stack) stack.push(closeFn)
  }

  // 弹出当前路由顶层弹窗
  function pop() {
    const stack = stackMap.value[currentRouteName.value]
    if (stack?.length) stack.pop()
  }

  // 清空当前路由所有弹窗并关闭
  function clearCurrent() {
    const stack = stackMap.value[currentRouteName.value] || []
    while (stack.length) {
      const close = stack.pop()
      close?.()
    }
  }

  // 获取当前路由栈长度
  const currentDepth = computed(() => {
    return stackMap.value[currentRouteName.value]?.length || 0
  })

  return {
    stackMap,
    currentRouteName,
    setCurrentRoute,
    push,
    pop,
    clearCurrent,
    currentDepth
  }
})
