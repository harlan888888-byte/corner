import { resolveComponent, useSSRContext, ref, computed, createApp } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { createRouter, createMemoryHistory, useRouter, useRoute } from "vue-router";
import { defineStore, createPinia } from "pinia";
import persist from "pinia-plugin-persistedstate";
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_router_view = resolveComponent("router-view");
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_router_view, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/App.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
class PerformanceMonitor {
  /**
   * 构造函数 - 初始化性能监控实例
   */
  constructor() {
    this.startTime = performance.now();
    this.marks = {};
    this.measures = {};
    this.isInitialized = false;
    this.currentPage = null;
  }
  /**
   * 初始化性能监控
   * 只执行一次，设置基础标记和事件监听器
   */
  init() {
    if (this.isInitialized) return;
    this.mark("app_start");
    this.setupEventListeners();
    this.isInitialized = true;
  }
  /**
   * 设置事件监听器
   * 监听DOM和页面加载相关事件
   */
  setupEventListeners() {
    document.addEventListener("DOMContentLoaded", () => {
      this.mark("domContentLoaded");
      this.measure("domContentLoaded", "app_start", "domContentLoaded");
    });
    window.addEventListener("load", () => {
      this.mark("load");
      this.measure("load", "app_start", "load");
    });
    if ("PerformanceObserver" in window) {
      this.observePaintMetrics();
    }
  }
  /**
   * 观察绘制指标
   * 监听首次绘制和最大内容绘制等关键性能指标
   */
  observePaintMetrics() {
    const paintObserver = new PerformanceObserver((entries) => {
      entries.getEntries().forEach((entry) => {
        if (entry.name === "first-paint") {
          this.marks.firstPaint = entry.startTime;
          this.measure("firstPaint", "app_start", entry.startTime);
        } else if (entry.name === "first-contentful-paint") {
          this.marks.firstContentfulPaint = entry.startTime;
          this.measure("firstContentfulPaint", "app_start", entry.startTime);
        }
      });
    });
    paintObserver.observe({ type: "paint", buffered: true });
    const lcpObserver = new PerformanceObserver((entries) => {
      entries.getEntries().forEach((entry) => {
        this.marks.largestContentfulPaint = entry.startTime;
        this.measure("largestContentfulPaint", "app_start", entry.startTime);
      });
    });
    lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
  }
  /**
   * 开始页面性能监控
   * @param {string} pageName 页面名称，用于标识监控的页面
   */
  startPageMonitor(pageName) {
    this.currentPage = pageName;
    this.startTime = performance.now();
    this.marks = {};
    this.measures = {};
    this.mark(`${pageName}_start`);
  }
  /**
   * 结束页面性能监控并报告
   * @param {string} pageName 页面名称，用于标识监控的页面
   * @returns {object} 性能数据对象
   */
  endPageMonitor(pageName) {
    if (!this.currentPage) return;
    this.mark(`${pageName}_end`);
    this.measure(`${pageName}_load`, `${pageName}_start`, `${pageName}_end`);
    const performanceData = this.reportPerformance(pageName);
    return performanceData;
  }
  /**
   * 添加性能标记
   * @param {string} name 标记名称
   */
  mark(name) {
    const timestamp = performance.now();
    this.marks[name] = timestamp;
    if (performance.mark) {
      performance.mark(name);
    }
  }
  /**
   * 测量时间差
   * @param {string} name 测量名称
   * @param {string|number} start 开始标记或时间戳
   * @param {string|number} end 结束标记或时间戳
   */
  measure(name, start, end) {
    const startTime = typeof start === "string" ? this.marks[start] || 0 : start;
    const endTime = typeof end === "string" ? this.marks[end] || performance.now() : end;
    const duration = endTime - startTime;
    this.measures[name] = duration;
  }
  /**
   * 报告性能数据
   * @param {string} pageName 页面名称
   * @returns {object} 性能数据对象
   */
  reportPerformance(pageName = this.currentPage) {
    const performanceData = {
      page: pageName || "Unknown Page",
      // 页面名称
      appStart: this.startTime,
      // 开始时间
      marks: this.marks,
      // 所有标记
      measures: this.measures,
      // 所有测量结果
      metrics: {
        firstPaint: this.measures.firstPaint || null,
        // 首次绘制时间
        firstContentfulPaint: this.measures.firstContentfulPaint || null,
        // 首次内容绘制时间
        largestContentfulPaint: this.measures.largestContentfulPaint || null,
        // 最大内容绘制时间
        domContentLoaded: this.measures.domContentLoaded || null,
        // DOM加载完成时间
        load: this.measures.load || null,
        // 页面加载完成时间
        totalLoadTime: this.measures.load || performance.now() - this.startTime
        // 总加载时间
      }
    };
    console.log(`%c${pageName}首屏测试`, "font-size: 16px; font-weight: bold; color: #007acc;", performanceData.metrics);
    return performanceData;
  }
  /**
   * 在页面上显示性能数据
   * @param {string} pageName 页面名称
   * @param {object} performanceData 性能数据
   */
  // showPerformanceToast(pageName, performanceData) {
  //   // 获取性能指标
  //   const metrics = performanceData.metrics
  //   // 创建性能提示元素
  //   const performanceInfo = document.createElement('div')
  //   // 设置样式
  //   performanceInfo.style.cssText = `
  //     position: fixed;
  //     top: 20px;
  //     right: 20px;
  //     background: rgba(0,0,0,0.8);
  //     color: white;
  //     padding: 12px;
  //     border-radius: 6px;
  //     font-size: 12px;
  //     z-index: 9999;
  //     max-width: 320px;
  //     box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  //   `
  //   // 设置内容
  //   performanceInfo.innerHTML = `
  //     <h4 style="margin: 0 0 8px 0; font-size: 14px;">${pageName} 性能</h4>
  //     <div style="margin-bottom: 4px;">FCP: ${(metrics.firstContentfulPaint || 0).toFixed(2)}ms</div>
  //     <div style="margin-bottom: 4px;">LCP: ${(metrics.largestContentfulPaint || 0).toFixed(2)}ms</div>
  //     <div style="margin-bottom: 4px;">DOM加载: ${(metrics.domContentLoaded || 0).toFixed(2)}ms</div>
  //     <div style="margin-bottom: 4px;">页面加载: ${(metrics.load || 0).toFixed(2)}ms</div>
  //     <div style="margin-bottom: 4px; font-weight: bold;">总时间: ${(metrics.totalLoadTime || 0).toFixed(2)}ms</div>
  //   `
  //   // 移除之前的性能提示（如果存在）
  //   const oldToast = document.getElementById('performance-toast')
  //   if (oldToast) {
  //     oldToast.remove()
  //   }
  //   // 设置ID并添加到页面
  //   performanceInfo.id = 'performance-toast'
  //   document.body.appendChild(performanceInfo)
  //   // 3秒后自动隐藏
  //   setTimeout(() => {
  //     performanceInfo.style.opacity = '0'
  //     performanceInfo.style.transition = 'opacity 0.5s'
  //     setTimeout(() => {
  //       performanceInfo.remove()
  //     }, 500)
  //   }, 3000)
  // }
  /**
   * 获取性能数据
   * @returns {object} 性能数据对象
   */
  getPerformanceData() {
    return this.reportPerformance();
  }
}
const performanceMonitor = new PerformanceMonitor();
const router = createRouter({
  history: createMemoryHistory("/"),
  routes: [
    {
      path: "/",
      component: () => import("./js/index-CJBtSE8L.js"),
      redirect: "/hometab",
      children: [
        {
          path: "/hometab",
          component: () => import("./js/HomeTab-D86wNsuC.js")
        },
        {
          path: "/footprint",
          component: () => import("./js/FootPrintTab-Bmusy2e4.js")
        },
        {
          path: "/plan",
          component: () => import("./js/PlanTab-BNz3pw1y.js")
        },
        {
          path: "/mine",
          component: () => import("./js/MineTab-BRE3X47g.js")
        },
        {
          path: "/store-detail/:storeid",
          name: "StoreDetail",
          component: () => import("./js/StoreDetail-CnlayttZ.js")
        },
        {
          path: "/aatest",
          name: "AATest",
          component: () => import("./js/AaTest-DUI9xgdm.js"),
          children: [
            {
              path: "indexpage",
              name: "IndexPage",
              component: () => import("./js/IndexPage-3owv8weh.js")
            }
          ]
        }
      ]
    }
  ]
});
let isInitialLoad = true;
router.beforeEach((to) => {
  if (isInitialLoad) {
    const pageName = to.name || to.path.replace(/\//g, "-").slice(1) || "index";
    performanceMonitor.startPageMonitor(pageName);
  }
  return true;
});
router.afterEach((to) => {
  if (isInitialLoad) {
    const pageName = to.name || to.path.replace(/\//g, "-").slice(1) || "index";
    setTimeout(() => {
      performanceMonitor.endPageMonitor(pageName);
      isInitialLoad = false;
    }, 2e3);
  }
});
const useUserStore = defineStore(
  "user",
  () => {
    const token = ref(true);
    return {
      token
    };
  },
  {
    persist: true
  }
);
const useStackStore = defineStore("stack", () => {
  useRouter();
  const route = useRoute();
  const addedHistoryCount = ref(0);
  const stackMap = ref({});
  const currentRouteName = ref("");
  const isHandlingBack = ref(false);
  function pushHistory(router2, route2) {
    try {
      const historyId = Date.now();
      const newQuery = {
        ...route2.query,
        historyId: historyId.toString()
      };
      router2.push({
        path: route2.path,
        query: newQuery
      });
      addedHistoryCount.value += 1;
    } catch (error) {
      console.error("pushHistory执行失败：", error);
    }
  }
  let lastPopTime = 0;
  function popHistory(router2, route2) {
    const now = Date.now();
    if (now - lastPopTime < 300) {
      return;
    }
    lastPopTime = now;
    try {
      if (addedHistoryCount.value > 0) {
        router2.back();
      }
    } catch (error) {
      console.error("popHistory执行失败：", error);
    }
  }
  function resetHistoryCount() {
    addedHistoryCount.value = 0;
  }
  function getAddedHistoryCount() {
    return addedHistoryCount.value || 0;
  }
  function setCurrentRoute(name) {
    currentRouteName.value = name;
    if (!stackMap.value[name]) {
      stackMap.value[name] = [];
    }
  }
  function pushDialog(routeKey, closeFn) {
    if (!stackMap.value[routeKey]) {
      stackMap.value[routeKey] = [];
    }
    stackMap.value[routeKey].push(closeFn);
  }
  function popDialog(routeKey) {
    const stack = stackMap.value[routeKey];
    if (stack?.length) stack.pop();
  }
  function clearCurrentDialogs(routeKey) {
    const stack = stackMap.value[routeKey] || [];
    while (stack.length) {
      const close = stack.pop();
      close?.();
    }
  }
  function clearRouteDialogs(routeKey) {
    if (stackMap.value[routeKey]) {
      stackMap.value[routeKey] = [];
    }
  }
  function resetRouteState(routeKey) {
    clearRouteDialogs(routeKey);
    const currentRouteKey = route.name || route.path || "default";
    if (currentRouteKey === routeKey) {
      addedHistoryCount.value = 0;
    }
  }
  const currentDepth = computed(() => {
    return stackMap.value[currentRouteName.value]?.length || 0;
  });
  return {
    // 历史记录栈
    addedHistoryCount,
    // 新增历史记录计数
    pushHistory,
    // 添加历史记录
    popHistory,
    // 移除历史记录
    resetHistoryCount,
    // 重置历史记录计数
    getAddedHistoryCount,
    // 获取新增历史记录数
    // 弹窗栈
    stackMap,
    // 弹窗栈映射表
    currentRouteName,
    // 当前路由名
    setCurrentRoute,
    // 设置当前路由
    pushDialog,
    // 添加弹窗到栈
    popDialog,
    // 从栈中移除弹窗
    clearCurrentDialogs,
    // 清空当前路由所有弹窗
    clearRouteDialogs,
    // 清空特定路由弹窗栈
    resetRouteState,
    // 重置特定路由状态
    currentDepth,
    // 当前路由栈深度
    isHandlingBack
    // 防止重复处理后退事件标志
  };
});
const pinia = createPinia();
pinia.use(persist);
function main() {
  const app = createApp(App);
  app.use(pinia);
  app.use(router);
  return { app, router };
}
export {
  _export_sfc as _,
  useUserStore as a,
  main as default,
  router as r,
  useStackStore as u
};
