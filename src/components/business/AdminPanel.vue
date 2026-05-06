<template>
  <div class="admin-panel">
    <!-- 顶部导航 -->
    <div class="admin-header">
      <h2>店铺管理系统</h2>
      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </div>

    <!-- 操作按钮 -->
    <div class="action-bar">
      <button class="add-btn" @click="openAddModal">+ 添加店铺</button>
    </div>

    <!-- 店铺列表 -->
    <div class="store-list">
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="stores.length === 0" class="empty-state">
        <p>暂无店铺数据</p>
      </div>
      <div v-else class="store-grid">
        <div v-for="store in stores" :key="store.id" class="store-card">
          <img :src="store.store_img || defaultImg" alt="店铺图片" class="store-img" />
          <div class="store-info">
            <h3 class="store-name">{{ store.name }}</h3>
            <p class="store-category">{{ store.category }}</p>
            <p class="store-rating">评分：{{ store.rating }}分</p>
            <p class="store-address">{{ store.address }}</p>
          </div>
          <div class="store-actions">
            <button class="edit-btn" @click="openEditModal(store)">编辑</button>
            <button class="delete-btn" @click="handleDelete(store.id)">删除</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑弹窗 -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h3>{{ isEdit ? '编辑店铺' : '添加店铺' }}</h3>
        <form @submit.prevent="handleSubmit" class="modal-form">
          <div class="form-row">
            <div class="form-group">
              <label>店铺名称</label>
              <input v-model="formData.name" type="text" required placeholder="请输入店铺名称" />
            </div>
            <div class="form-group">
              <label>店铺分类</label>
              <input v-model="formData.category" type="text" placeholder="请输入店铺分类" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>店铺图片</label>
              <input v-model="formData.store_img" type="text" placeholder="请输入图片URL" />
            </div>
            <div class="form-group">
              <label>评分</label>
              <input v-model.number="formData.rating" type="number" min="0" max="5" step="0.1" placeholder="0-5" />
            </div>
          </div>
          <div class="form-group">
            <label>店铺地址</label>
            <input v-model="formData.address" type="text" placeholder="请输入店铺地址" />
          </div>
          <div class="form-group">
            <label>营业时间</label>
            <input v-model="formData.business_hours" type="text" placeholder="请输入营业时间" />
          </div>
          <div class="form-group">
            <label>人均消费</label>
            <input v-model.number="formData.average_cost" type="number" placeholder="请输入人均消费" />
          </div>
          <div class="form-group">
            <label>店铺描述</label>
            <textarea v-model="formData.description" rows="3" placeholder="请输入店铺描述"></textarea>
          </div>
          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="closeModal">取消</button>
            <button type="submit" class="submit-btn">保存</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/modules/user'
import { getAdminStoreList, addStore, editStore, deleteStore } from '@/api/admin/store'
import defaultImg from '@/assets/icons/miss_store.svg'

const userStore = useUserStore()

const stores = ref([])
const loading = ref(true)
const showModal = ref(false)
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

// 获取店铺列表
const fetchStores = async () => {
  loading.value = true
  try {
    const res = await getAdminStoreList()
    if (res.data.code === 200) {
      stores.value = res.data.data
    }
  } catch (error) {
    console.error('获取店铺列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 打开添加弹窗
const openAddModal = () => {
  isEdit.value = false
  formData.value = {
    name: '',
    category: '',
    store_img: '',
    rating: 0,
    address: '',
    business_hours: '',
    average_cost: 0,
    description: ''
  }
  showModal.value = true
}

// 打开编辑弹窗
const openEditModal = (store) => {
  isEdit.value = true
  formData.value = {
    id: store.id,
    name: store.name,
    category: store.category || '',
    store_img: store.store_img || '',
    rating: store.rating || 0,
    address: store.address || '',
    business_hours: store.business_hours || '',
    average_cost: store.average_cost || 0,
    description: store.description || ''
  }
  showModal.value = true
}

// 关闭弹窗
const closeModal = () => {
  showModal.value = false
}

// 提交表单
const handleSubmit = async () => {
  try {
    if (isEdit.value) {
      await editStore(formData.value)
    } else {
      await addStore(formData.value)
    }
    closeModal()
    await fetchStores()
    alert(isEdit.value ? '编辑成功' : '添加成功')
  } catch (error) {
    alert(isEdit.value ? '编辑失败' : '添加失败')
  }
}

// 删除店铺
const handleDelete = async (id) => {
  if (!confirm('确定要删除这个店铺吗？')) return
  try {
    await deleteStore(id)
    await fetchStores()
    alert('删除成功')
  } catch (error) {
    alert('删除失败')
  }
}

// 退出登录
const handleLogout = () => {
  userStore.logout()
}

onMounted(() => {
  fetchStores()
})
</script>

<style scoped>
.admin-panel {
  padding: 20px;
  min-height: 100vh;
  background: #f5f5f5;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.admin-header h2 {
  margin: 0;
  color: #333;
}

.logout-btn {
  padding: 8px 16px;
  background: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.logout-btn:hover {
  background: #ff7875;
}

.action-bar {
  margin-bottom: 20px;
}

.add-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.add-btn:hover {
  opacity: 0.9;
}

.loading, .empty-state {
  text-align: center;
  padding: 50px;
  color: #999;
}

.store-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.store-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.store-img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.store-info {
  padding: 15px;
}

.store-name {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #333;
}

.store-category {
  margin: 0 0 5px 0;
  font-size: 12px;
  color: #666;
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
}

.store-rating {
  margin: 5px 0;
  font-size: 14px;
  color: #ff9500;
}

.store-address {
  margin: 5px 0 0 0;
  font-size: 13px;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.store-actions {
  display: flex;
  gap: 10px;
  padding: 15px;
  border-top: 1px solid #eee;
}

.edit-btn, .delete-btn {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.edit-btn {
  background: #1890ff;
  color: white;
}

.edit-btn:hover {
  background: #40a9ff;
}

.delete-btn {
  background: #ff4d4f;
  color: white;
}

.delete-btn:hover {
  background: #ff7875;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 25px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h3 {
  margin: 0 0 20px 0;
  color: #333;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  font-size: 14px;
  color: #666;
}

.form-group input, .form-group textarea {
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
}

.form-group textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.cancel-btn, .submit-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.cancel-btn {
  background: #f5f5f5;
  color: #666;
}

.cancel-btn:hover {
  background: #eee;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.submit-btn:hover {
  opacity: 0.9;
}
</style>
