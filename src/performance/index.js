/**
 * 性能监控模块导出入口
 * 统一导出所有性能监控相关功能
 */

// 首屏性能监控实例
import { PerformanceMonitor } from './monitors/page'
const performanceMonitor = new PerformanceMonitor()
export { performanceMonitor }

