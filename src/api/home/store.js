import request from '@/utils/request'
// 获取店铺信息
export const getStoreInfo = (params) =>
  request.get('/home/get_store_info', { params })

// 获取店铺详情
export const getStoreDetail = (storeid) =>
  request.get('/home/get_store_detail', { params: { storeid } })
