import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import pinia from '@/stores'
import { performanceMonitor } from '@/performance'
import '@/styles/base.css'
import '@/styles/vant-common.css'
import '@/styles/vue-common.css'
import 'vant/es/toast/style'
import 'vant/es/notify/style'
import 'vant/es/dialog/style'
import 'vant/es/area/style'
import 'vant/es/popup/style'
import 'vant/es/field/style'
import 'vant/es/image-preview/style'
import {
  Area as VanArea,
  Popup as VanPopup,
  Field as VanField,
  ImagePreview as VanImagePreview
} from 'vant'

// 初始化性能监控
performanceMonitor.init()

const app = createApp(App)

app.use(pinia)
app.use(router)

app.component('van-area', VanArea)
app.component('van-popup', VanPopup)
app.component('van-field', VanField)
app.component('van-image-preview', VanImagePreview)

app.mount('#app')
