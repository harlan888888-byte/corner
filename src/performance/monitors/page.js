/**
 * 首屏性能监控工具
 * 用于监控和报告页面加载性能指标
 * 支持页面级别的性能监控和分析
 */

class PerformanceMonitor {
  /**
   * 构造函数 - 初始化性能监控实例
   */
  constructor() {
    // 记录开始时间
    this.startTime = performance.now()
    // 存储性能标记（时间点）
    this.marks = {}
    // 存储性能测量结果（时间差）
    this.measures = {}
    // 初始化状态标志
    this.isInitialized = false
    // 当前监控的页面名称
    this.currentPage = null
  }

  /**
   * 初始化性能监控
   * 只执行一次，设置基础标记和事件监听器
   */
  init() {
    // 防止重复初始化
    if (this.isInitialized) return

    // 开始标记（使用自定义名称避免与浏览器保留名称冲突）
    this.mark('app_start')

    // 设置事件监听器，监听关键性能事件
    this.setupEventListeners()

    // 标记初始化完成
    this.isInitialized = true
  }

  /**
   * 设置事件监听器
   * 监听DOM和页面加载相关事件
   */
  setupEventListeners() {
    // 监听DOMContentLoaded事件 - DOM结构解析完成
    document.addEventListener('DOMContentLoaded', () => {
      // 标记DOM加载完成时间
      this.mark('domContentLoaded')
      // 测量从应用开始到DOM加载完成的时间
      this.measure('domContentLoaded', 'app_start', 'domContentLoaded')
    })

    // 监听load事件 - 所有资源加载完成
    window.addEventListener('load', () => {
      // 标记页面加载完成时间
      this.mark('load')
      // 测量从应用开始到页面加载完成的时间
      this.measure('load', 'app_start', 'load')
      // 报告初始性能数据
      // this.reportPerformance()
    })

    // 监听首次内容渲染指标（现代浏览器支持）
    if ('PerformanceObserver' in window) {
      this.observePaintMetrics()
    }
  }

  /**
   * 观察绘制指标
   * 监听首次绘制和最大内容绘制等关键性能指标
   */
  observePaintMetrics() {
    // 监听首次绘制指标
    const paintObserver = new PerformanceObserver((entries) => {
      entries.getEntries().forEach((entry) => {
        if (entry.name === 'first-paint') {
          // 首次绘制时间
          this.marks.firstPaint = entry.startTime
          this.measure('firstPaint', 'app_start', entry.startTime)
        } else if (entry.name === 'first-contentful-paint') {
          // 首次内容绘制时间
          this.marks.firstContentfulPaint = entry.startTime
          this.measure('firstContentfulPaint', 'app_start', entry.startTime)
        }
      })
    })

    // 开始观察绘制指标
    paintObserver.observe({ type: 'paint', buffered: true })

    // 观察最大内容绘制指标
    const lcpObserver = new PerformanceObserver((entries) => {
      entries.getEntries().forEach((entry) => {
        // 最大内容绘制时间
        this.marks.largestContentfulPaint = entry.startTime
        this.measure('largestContentfulPaint', 'app_start', entry.startTime)
      })
    })

    // 开始观察最大内容绘制指标
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
  }

  /**
   * 开始页面性能监控
   * @param {string} pageName 页面名称，用于标识监控的页面
   */
  startPageMonitor(pageName) {
    // 设置当前页面名称
    this.currentPage = pageName
    // 重置开始时间
    this.startTime = performance.now()
    // 清空之前的标记和测量数据
    this.marks = {}
    this.measures = {}
    // 创建页面开始标记
    this.mark(`${pageName}_start`)

    // 打印开始监控信息到控制台
    // console.log(`%c📊 开始监控页面: ${pageName}`, 'font-size: 14px; font-weight: bold; color: #4CAF50;')
  }

  /**
   * 结束页面性能监控并报告
   * @param {string} pageName 页面名称，用于标识监控的页面
   * @returns {object} 性能数据对象
   */
  endPageMonitor(pageName) {
    // 如果没有当前页面，直接返回
    if (!this.currentPage) return

    // 创建页面结束标记
    this.mark(`${pageName}_end`)
    // 测量页面加载时间
    this.measure(`${pageName}_load`, `${pageName}_start`, `${pageName}_end`)

    // 报告性能数据
    const performanceData = this.reportPerformance(pageName)
    // 在页面上显示性能数据
    // this.showPerformanceToast(pageName, performanceData)

    return performanceData
  }

  /**
   * 添加性能标记
   * @param {string} name 标记名称
   */
  mark(name) {
    // 获取当前时间戳
    const timestamp = performance.now()
    // 存储到内部标记对象
    this.marks[name] = timestamp
    // 如果浏览器支持，也添加到浏览器的performance API
    if (performance.mark) {
      performance.mark(name)
    }
  }

  /**
   * 测量时间差
   * @param {string} name 测量名称
   * @param {string|number} start 开始标记或时间戳
   * @param {string|number} end 结束标记或时间戳
   */
  measure(name, start, end) {
    // 获取开始时间（支持标记名称或直接时间戳）
    const startTime = typeof start === 'string' ? this.marks[start] || 0 : start
    // 获取结束时间（支持标记名称或直接时间戳）
    const endTime = typeof end === 'string' ? this.marks[end] || performance.now() : end
    // 计算时间差
    const duration = endTime - startTime
    // 存储测量结果
    this.measures[name] = duration

    // 只在内部记录测量结果，不使用浏览器的 native measure 方法
    // 避免浏览器兼容性问题
  }

  /**
   * 报告性能数据
   * @param {string} pageName 页面名称
   * @returns {object} 性能数据对象
   */
  reportPerformance(pageName = this.currentPage) {
    // 构建性能数据对象
    const performanceData = {
      page: pageName || 'Unknown Page', // 页面名称
      appStart: this.startTime, // 开始时间
      marks: this.marks, // 所有标记
      measures: this.measures, // 所有测量结果
      metrics: {
        firstPaint: this.measures.firstPaint || null, // 首次绘制时间
        firstContentfulPaint: this.measures.firstContentfulPaint || null, // 首次内容绘制时间
        largestContentfulPaint: this.measures.largestContentfulPaint || null, // 最大内容绘制时间
        domContentLoaded: this.measures.domContentLoaded || null, // DOM加载完成时间
        load: this.measures.load || null, // 页面加载完成时间
        totalLoadTime: this.measures.load || performance.now() - this.startTime // 总加载时间
      }
    }

    // 打印性能报告到控制台
    console.log(`%c${pageName}首屏测试`, 'font-size: 16px; font-weight: bold; color: #007acc;', performanceData.metrics)

    return performanceData
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
    return this.reportPerformance()
  }
}

// 导出 PerformanceMonitor 类
// 实例化由 index.js 统一管理
export { PerformanceMonitor }
