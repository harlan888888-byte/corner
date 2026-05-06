import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAdminStore = defineStore('admin', () => {
  // 缓存的店铺列表
  const storeList = ref([])
  // 列表是否已加载过
  const listLoaded = ref(false)

  // 设置店铺列表
  const setStoreList = (list) => {
    storeList.value = list
    listLoaded.value = true
  }

  // 清空店铺列表
  const clearStoreList = () => {
    storeList.value = []
    listLoaded.value = false
  }

  // 更新单个店铺
  const updateStoreItem = (item) => {
    const index = storeList.value.findIndex(s => s.id === item.id)
    if (index !== -1) {
      storeList.value[index] = item
    }
  }

  // 删除单个店铺
  const removeStoreItem = (id) => {
    const index = storeList.value.findIndex(s => s.id === id)
    if (index !== -1) {
      storeList.value.splice(index, 1)
    }
  }

  return {
    storeList,
    listLoaded,
    setStoreList,
    clearStoreList,
    updateStoreItem,
    removeStoreItem
  }
})
