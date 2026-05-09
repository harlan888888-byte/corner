import request from '@/utils/request'

// 添加管理员
export const createAdmin = (data) =>
  request.post('/admin/login/create_admin', data)

// 更新管理员信息
export const updateAdmin = (data) =>
  request.post('/admin/login/update_admin', data)

// 上传管理员头像
export const uploadAdminImage = (formData) =>
  request.post('/admin/login/upload_admin_image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
