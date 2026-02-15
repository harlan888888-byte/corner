import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { VantResolver } from '@vant/auto-import-resolver';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver(), VantResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver(), VantResolver()]
    })
  ],
  base: '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // 新增：开发服务器配置（核心是 proxy 代理）
  server: {
    port: 3000, // 可选：指定开发服务器端口，避免端口冲突
    open: true, // 可选：启动后自动打开浏览器
    proxy: {
      // 配置1：匹配以 /api 开头的请求，转发到后端接口地址
      // '/api': {
      //   // target: 'https://corner.ntotl.cn', // 你的后端接口域名（替换为实际地址）
      //   target: 'http://192.168.0.183:82/api', // 本地后端服务地址（开发常用）
      //   changeOrigin: true, // 必须开启：修改请求头中的 Origin，解决跨域
      //   // 可选：重写路径（如果后端接口没有 /api 前缀，需要去掉）
      //   // rewrite: (path) => path.replace(/^\/api/, ''),
      //   // 可选：配置 HTTPS 证书忽略（如果后端是自签证书）
      //   // secure: false
      // },
      // 配置2：可添加多个代理（比如静态资源代理）
      // '/static': {
      //   target: 'http://192.168.0.183:82/static',
      //   changeOrigin: true
      // }
    }
  }
})
