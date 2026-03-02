import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'  // 只保留 Vite 的 defineConfig
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'  // Vite 插件
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { VantResolver } from '@vant/auto-import-resolver';
import path from 'path'
import viteCompression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dts: 'src/types/auto-imports.d.ts',
      include: [/\.vue$/, /\.vue\?vue/, /\.ts$/, /\.tsx$/],
      resolvers: [ElementPlusResolver(), VantResolver()],
    }),
    Components({
      // 指定需要自动导入的组件目录
      dirs: [
        'src/components' // 主组件目录
      ],
      extensions: ['vue'],// 组件文件扩展名（默认：['.vue']）
      deep: true,// 是否深度扫描子目录（默认：true）
      resolvers: [ElementPlusResolver(), VantResolver()],
      // 生成组件类型声明文件
      dts: 'src/types/components.d.ts',
    }),
    viteCompression({
      algorithm: 'gzip',
      threshold: 10240, // 大于 10KB 的文件才进行压缩
      deleteOriginFile: false, // 不删除源文件
      compress: true, // 启用压缩
      verbose: true // 显示压缩信息
    }),
  ],
  base: '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // 构建配置
  build: {
    // Vite 的打包配置都在 build 下，而非顶层 output
    outDir: 'dist', // 输出目录（默认 dist）
    assetsDir: 'assets', // 静态资源根目录（基础，后续分类基于此）
    rollupOptions: {
      // Rollup 的输出配置（对应 Webpack 的 output）
      output: {
        // 1. 配置非 CSS 类静态资源（图片、字体、其他二进制文件）
        assetFileNames: (assetInfo) => {
          // 按文件后缀分类
          const extname = path.extname(assetInfo.name).toLowerCase()
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(extname)) {
            return 'images/[name]-[hash][extname]' // 图片：assets/images/xxx.png
          } else if (/\.(woff2?|eot|ttf|otf)$/.test(extname)) {
            return 'fonts/[name]-[hash][extname]' // 字体：assets/fonts/xxx.ttf
          } else if (/\.(css|less|scss|sass|styl)$/.test(extname)) {
            return 'style/[name]-[hash][extname]'
          }
          // 其他资源：assets/others/xxx.xxx
          return 'others/[name]-[hash][extname]'
        },
        // 2. 配置 JS 分块（对应 Webpack 的 chunkFileNames）
        chunkFileNames: 'js/[name]-[hash].js', // 异步 chunk：assets/js/xxx.js
        // 3. 配置入口 JS（对应 Webpack 的 entryFileNames）
        entryFileNames: 'js/[name]-[hash].js' // 其他入口 JS：assets/js/xxx.js
      }
    }
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
