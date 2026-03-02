import { u as useStackStore } from "../main.mjs";
function useBackButton() {
  const stackStore = useStackStore();
  const {
    pushHistory,
    popHistory,
    resetHistoryCount,
    getAddedHistoryCount,
    setCurrentRoute,
    popDialog
  } = stackStore;
  const getStackMap = () => {
    if (!stackStore.stackMap || typeof stackStore.stackMap !== "object") {
      stackStore.stackMap = { value: {} };
    }
    if (stackStore.stackMap.value !== void 0) {
      return stackStore.stackMap.value || {};
    }
    return stackStore.stackMap || {};
  };
  const getCurrentRouteName = () => stackStore.currentRouteName.value;
  const pushDialog = (route, closeFn) => {
    const routeKey = route.name || route.path || "default";
    stackStore.pushDialog(routeKey, closeFn);
  };
  const dialogStackStore = {
    get stackMap() {
      return getStackMap();
    },
    get currentRouteName() {
      return getCurrentRouteName();
    },
    setCurrentRoute,
    push: pushDialog,
    pop: popDialog
  };
  const handleBackButton = (router, route) => {
    try {
      if (stackStore.isHandlingBack) {
        return false;
      }
      stackStore.isHandlingBack = true;
      const addedCount = getAddedHistoryCount();
      if (addedCount > 0) {
        const routeKey = route.name || route.path || "default";
        const stackMap = getStackMap();
        const stack = stackMap[routeKey] || [];
        if (stack.length > 0) {
          const closeFn = stack[stack.length - 1];
          if (typeof closeFn === "function") {
            closeFn();
          }
          stackStore.popDialog(routeKey);
        }
        const currentCount = stackStore.getAddedHistoryCount();
        if (currentCount > 0) {
          stackStore.addedHistoryCount = currentCount - 1;
        }
        setTimeout(() => {
          stackStore.isHandlingBack = false;
        }, 100);
        return true;
      }
      setTimeout(() => {
        stackStore.isHandlingBack = false;
      }, 100);
      return false;
    } catch (error) {
      setTimeout(() => {
        stackStore.isHandlingBack = false;
      }, 100);
      return false;
    }
  };
  const handlePopState = (router, route) => {
    return (event) => {
      const handled = handleBackButton(router, route);
      if (handled) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
  };
  return {
    pushHistory,
    // 添加历史记录
    popHistory,
    // 移除历史记录
    resetHistoryCount,
    // 重置历史记录计数
    getAddedHistoryCount,
    // 获取新增的历史记录数
    handleBackButton,
    // 处理后退事件
    handlePopState,
    // 创建popstate事件处理函数
    pushDialog,
    // 添加弹窗到栈中
    resetRouteState: stackStore.resetRouteState,
    // 重置特定路由状态
    dialogStackStore
    // 弹窗栈store实例
  };
}
export {
  useBackButton as u
};
