import { defineStore } from 'pinia'
import { ref } from 'vue'
import { adminLogin, getAdminInfo, adminLogout } from '@/api/user'

export const useUserStore = defineStore(
  'user',
  () => {
    // 用户token
    const token = ref('')
    // 用户信息
    const user = ref({})
    // 是否是管理员
    const isAdmin = ref(false)

    // 设置token
    const setToken = (newToken) => {
      token.value = newToken
    }

    // 移除token
    const removeToken = () => {
      token.value = ''
    }

    // 设置用户信息
    const setUser = (obj) => {
      user.value = obj
      isAdmin.value = obj.role === 'admin' || false
    }

    // 清空用户信息
    const clearUser = () => {
      user.value = {}
      isAdmin.value = false
      token.value = ''
    }

    // 管理员登录
    const login = async (username, password) => {
      try {
        const res = await adminLogin({ username, password })
        if (res.data.code === 200) {
          const data = res.data.data
          token.value = data.token
          user.value = data.user
          isAdmin.value = true
          return true
        }
        return false
      } catch (error) {
        return false
      }
    }

    // 获取管理员信息
    const getUserInfo = async () => {
      try {
        const res = await getAdminInfo()
        if (res.data.code === 200) {
          user.value = res.data.data
          isAdmin.value = true
          return user.value
        }
        return null
      } catch (error) {
        return null
      }
    }

    // 退出登录
    const logout = async () => {
      try {
        await adminLogout()
      } catch (error) {
        // 忽略退出错误
      } finally {
        clearUser()
      }
    }

    return {
      token,
      user,
      isAdmin,
      setToken,
      removeToken,
      setUser,
      clearUser,
      login,
      getUserInfo,
      logout
    }
  },
  {
    persist: true
  }
)
