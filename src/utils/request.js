import axios from 'axios'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router'

// 根据环境自动切换 baseURL
const getBaseURL = () => {
  // 开发模式：使用相对路径，通过 Vite 代理转发
  if (import.meta.env.MODE === 'development') {
    return 'http://192.168.0.183:82/api'
  }
  // 生产模式：使用线上后端地址
  else if (import.meta.env.MODE === 'production') {
    return 'https://corner.ntotl.cn/api'
  }
  // 默认情况：使用相对路径
  return '/api'
}

const baseURL = getBaseURL()

const instance = axios.create({
  baseURL,
  timeout: 10000
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const useStore = useUserStore()
    if (useStore.token) {
      config.headers.Authorization = useStore.token
    }
    return config
  },
  (err) => Promise.reject(err)
)

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    if (res.data.code === 200) {
      return res
    }
    ElMessage.error(res.data.message || '服务异常')
    return Promise.reject(res.data)
  },
  (err) => {
    if (err.response?.status === 401) {
      router.push('/login')
    }
    ElMessage.error(err.response?.data?.message || '服务异常')
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }
