import request from '@/utils/request'
// 获取店铺信息
export const getStoreInfo = (params) =>
  request.get('/home/get_store_info', { params })

// // 添加文章分类
// export const artAddChannelService = (data) => request.post('/my/cate/add', data)
// // 编辑文章分类
// export const artEditChannelService = (data) =>
//   request.put('/my/cate/info', data)
// // 删除文章分类
// export const artDelChannelService = (id) =>
//   request.delete('/my/cate/del', {
//     params: { id }
//   })
