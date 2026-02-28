import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import pinia from '@/stores'
import '@/style/base.css'
import '@/style/vant-common.css'
import '@/style/vue-common.css'


const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
