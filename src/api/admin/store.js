import request from '@/utils/request'

// 获取店铺列表（管理员）
export const getAdminStoreList = (params) =>
  request.get('/admin/store/list', { params })

// 获取店铺详情（包含详情图片）
export const getStoreDetail = (storeid) =>
  request.get('/admin/store/get', { params: { storeid } })

// 添加店铺
export const addStore = (data) => request.post('/admin/store/add', data)

// 编辑店铺
export const editStore = (data) => request.put('/admin/store/edit', data)

// 删除店铺
export const deleteStore = (storeid) =>
  request.delete('/admin/store/delete', { params: { storeid } })

// 删除店铺详情图片
export const deleteStoreGoods = (data) =>
  request.post('/admin/store/delete_goods', data)

// 添加店铺详情图片
export const addGoods = (data) => request.post('/admin/store/add_goods', data)

// 上传店铺头像
export const uploadStoreImage = (formData) =>
  request.post('/admin/store/upload_image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

// 上传店铺详情图片
export const uploadGoodsImage = (formData) =>
  request.post('/admin/store/upload_goods_image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
