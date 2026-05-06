import request from '@/utils/request'

// 管理员登录
export const adminLogin = (data) =>
  request.post('/admin/login/login', data)

// 获取管理员信息
export const getAdminInfo = () =>
  request.get('/admin/login/info')

// 管理员退出登录
export const adminLogout = () =>
  request.post('/admin/login/logout')
