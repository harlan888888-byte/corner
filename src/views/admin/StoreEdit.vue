<template>
  <div class="store-edit-container">
    <div class="header">
      <div class="back-btn" @click="goBack">‹</div>
      <div class="title">{{ isEdit ? '编辑店铺' : '添加店铺' }}</div>
      <div class="save-btn" @click="handleSave">保存</div>
    </div>

    <div class="form-container">
      <div class="form-group">
        <label>店铺名称</label>
        <input
          v-model="formData.name"
          type="text"
          placeholder="请输入店铺名称"
        />
      </div>

      <div class="form-group">
        <label>店铺分类</label>
        <input
          v-model="formData.category"
          type="text"
          placeholder="请输入店铺分类"
        />
      </div>

      <div class="form-group">
        <label>店铺图片</label>
        <input
          v-model="formData.store_img"
          type="text"
          placeholder="请输入图片URL"
        />
      </div>

      <div class="form-group">
        <label>评分</label>
        <input
          v-model.number="formData.rating"
          type="number"
          min="0"
          max="5"
          step="0.1"
          placeholder="0-5"
        />
      </div>

      <div class="form-group">
        <label>店铺地址</label>
        <input
          v-model="formData.address"
          type="text"
          placeholder="请输入店铺地址"
        />
      </div>

      <div class="form-group">
        <label>营业时间</label>
        <input
          v-model="formData.business_hours"
          type="text"
          placeholder="请输入营业时间"
        />
      </div>

      <div class="form-group">
        <label>人均消费</label>
        <input
          v-model.number="formData.average_cost"
          type="number"
          placeholder="请输入人均消费"
        />
      </div>

      <div class="form-group">
        <label>店铺描述</label>
        <textarea
          v-model="formData.description"
          rows="4"
          placeholder="请输入店铺描述"
        ></textarea>
      </div>

      <div v-if="isEdit" class="delete-section">
        <button class="delete-btn" @click="handleDelete">删除店铺</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  getAdminStoreList,
  addStore,
  editStore,
  deleteStore
} from '@/api/admin/store'
import { useAdminStore } from '@/stores/modules/adminStore'

const router = useRouter()
const route = useRoute()
const adminStore = useAdminStore()

const isEdit = ref(false)
const formData = ref({
  name: '',
  category: '',
  store_img: '',
  rating: 0,
  address: '',
  business_hours: '',
  average_cost: 0,
  description: ''
})

const goBack = () => {
  router.back()
}

const handleSave = async () => {
  if (!formData.value.name) {
    alert('请输入店铺名称')
    return
  }

  try {
    if (isEdit.value) {
      await editStore(formData.value)
      // 更新缓存中的店铺
      adminStore.updateStoreItem(formData.value)
    } else {
      const res = await addStore(formData.value)
      if (res.data.code === 200) {
        // 添加成功后需要刷新整个列表，清空缓存让列表页重新获取
        adminStore.clearStoreList()
      }
    }
    alert('保存成功')
    goBack()
  } catch (error) {
    alert('保存失败')
  }
}

const handleDelete = async () => {
  if (!confirm('确定要删除这个店铺吗？')) return

  try {
    await deleteStore(formData.value.id)
    // 从缓存中删除
    adminStore.removeStoreItem(formData.value.id)
    alert('删除成功')
    goBack()
  } catch (error) {
    alert('删除失败')
  }
}

onMounted(async () => {
  const id = route.query.id
  if (id) {
    isEdit.value = true
    // 先尝试从缓存获取
    const cachedStore = adminStore.storeList.find((s) => s.id == id)
    if (cachedStore) {
      formData.value = { ...cachedStore }
    } else {
      // 缓存没有则从接口获取
      try {
        const res = await getAdminStoreList()
        if (res.data.code === 200) {
          // 先更新缓存
          adminStore.setStoreList(res.data.data)
          const store = res.data.data.find((s) => s.id == id)
          if (store) {
            formData.value = { ...store }
          }
        }
      } catch (error) {
        console.error('获取店铺详情失败:', error)
      }
    }
  }
})
</script>

<style scoped>
.store-edit-container {
  background-color: #f6f6f6;
  min-height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  z-index: 1000;
  -webkit-overflow-scrolling: touch;
}

.header {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background: white;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  z-index: 10;
}

.back-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #333;
  cursor: pointer;
}

.title {
  flex: 1;
  text-align: center;
  font-size: 17px;
  font-weight: 600;
  color: #333;
}

.save-btn {
  padding: 8px 16px;
  font-size: 15px;
  color: #667eea;
  cursor: pointer;
}

.form-container {
  padding: 15px;
}

.form-group {
  background: white;
  margin-bottom: 10px;
  padding: 15px;
  border-radius: 8px;
}

.form-group label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 15px;
  box-sizing: border-box;
}

.form-group textarea {
  resize: vertical;
}

.delete-section {
  margin-top: 30px;
}

.delete-btn {
  width: 100%;
  padding: 14px;
  background: #ff4d4f;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

.delete-btn:active {
  background: #ff7875;
}
</style>
