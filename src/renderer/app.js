import { createSSRApp } from 'vue'
import App from './App.vue'

export function createApp(pageContext) {
  const app = createSSRApp(App, pageContext)
  return app
}
