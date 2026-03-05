import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import pinia from '@/stores'
import { performanceMonitor } from '@/performance'
import '@/styles/base.css'
import '@/styles/vant-common.css'
import '@/styles/vue-common.css'

// 初始化性能监控
performanceMonitor.init()

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
