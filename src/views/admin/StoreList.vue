<template>
  <div class="store-list-container">
    <div class="header">
      <div class="back-btn" @click="goBack">‹</div>
      <div class="title">店铺管理</div>
      <div class="add-btn" @click="goAdd">+</div>
    </div>

    <div class="store-list">
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="stores.length === 0" class="empty">暂无店铺</div>
      <template v-else>
        <div
          v-for="store in stores"
          :key="store.id"
          class="store-item"
          @click="goDetail(store.id)"
        >
          <img
            v-if="store.store_img"
            :src="store.store_img"
            class="store-img"
          />
          <div v-else class="store-img placeholder">🏪</div>
          <div class="store-info">
            <div class="store-name">{{ store.name }}</div>
            <div class="store-meta">
              <span class="store-category">{{
                store.category || '未分类'
              }}</span>
              <span class="store-rating">★{{ store.rating || 0 }}</span>
            </div>
          </div>
          <div class="store-arrow">›</div>
        </div>
      </template>
    </div>

    <!-- 编辑页 - 从右边滑入 -->
    <transition name="slide-right">
      <div v-if="showEdit" class="store-edit-panel">
        <div class="edit-header">
          <div class="back-btn" @click="closeEdit">‹</div>
          <div class="title">{{ isEdit ? '编辑店铺' : '添加店铺' }}</div>
          <div class="save-btn" @click="handleSave">保存</div>
        </div>

        <div class="edit-content">
          <div class="form-item">
            <label>店铺名称</label>
            <input
              v-model="formData.name"
              type="text"
              placeholder="请输入店铺名称"
            />
          </div>

          <div class="form-item">
            <label>分类</label>
            <input
              v-model="formData.category"
              type="text"
              placeholder="请输入分类"
            />
          </div>

          <div class="form-item">
            <label>店铺头像</label>
            <div class="upload-area" @click="triggerStoreImgUpload">
              <img
                v-if="formData.store_img"
                :src="formData.store_img"
                class="upload-preview"
              />
              <div v-else class="upload-placeholder">
                <span class="upload-icon">+</span>
                <span class="upload-text">点击上传</span>
              </div>
            </div>
            <input
              ref="storeImgInput"
              type="file"
              accept="image/*"
              style="display: none"
              @change="handleStoreImgChange"
            />
          </div>

          <div class="form-item">
            <label>详情图片 ({{ goodsImages.length }}/9)</label>
            <div class="goods-images-grid">
              <div
                v-for="(img, idx) in goodsImages"
                :key="idx"
                class="goods-img-item"
              >
                <img :src="img.img" />
                <span class="goods-img-delete" @click="removeGoodsImage(idx)"
                  >×</span
                >
              </div>
              <div
                v-if="goodsImages.length < 9"
                class="goods-img-add"
                @click="triggerGoodsImgUpload"
              >
                <span>+</span>
              </div>
            </div>
            <input
              ref="goodsImgInput"
              type="file"
              accept="image/*"
              style="display: none"
              @change="handleGoodsImgChange"
            />
          </div>

          <div class="form-item">
            <label>评分</label>
            <input
              v-model.number="formData.rating"
              type="number"
              placeholder="请输入评分"
            />
          </div>

          <div class="form-item">
            <label>地址</label>
            <input
              v-model="formData.address"
              type="text"
              placeholder="请输入地址"
            />
          </div>

          <div class="form-item">
            <label>营业时间</label>
            <input
              v-model="formData.business_hours"
              type="text"
              placeholder="请输入营业时间"
            />
          </div>

          <div class="form-item">
            <label>人均消费</label>
            <input
              v-model.number="formData.average_cost"
              type="number"
              placeholder="请输入人均消费"
            />
          </div>

          <div class="form-item">
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
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, showFailToast, showSuccessToast } from 'vant'
import {
  getAdminStoreList,
  getStoreDetail,
  deleteStoreGoods,
  addStore,
  editStore,
  deleteStore,
  uploadStoreImage,
  uploadGoodsImage,
  addGoods
} from '@/api/admin/store'
import { useAdminStore } from '@/stores/modules/adminStore'

const router = useRouter()
const route = useRoute()
const adminStore = useAdminStore()

const stores = ref([])
const loading = ref(true)
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

const goodsImages = ref([])
const storeImgInput = ref(null)
const goodsImgInput = ref(null)
const uploadingStoreImg = ref(false)
const uploadingGoodsImg = ref(false)

const triggerStoreImgUpload = () => storeImgInput.value.click()

const handleStoreImgChange = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  uploadingStoreImg.value = true
  try {
    const data = new FormData()
    data.append('image', file)
    const res = await uploadStoreImage(data)
    if (res.data.code === 200) {
      formData.value.store_img = res.data.data.url
      showSuccessToast('上传成功')
    } else {
      showFailToast('上传失败')
    }
  } catch (error) {
    showFailToast('上传失败')
  } finally {
    uploadingStoreImg.value = false
    e.target.value = ''
  }
}

const triggerGoodsImgUpload = () => goodsImgInput.value.click()

const handleGoodsImgChange = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  if (goodsImages.value.length >= 9) {
    showToast('最多上传9张图片')
    return
  }
  uploadingGoodsImg.value = true
  try {
    const data = new FormData()
    data.append('image', file)
    const res = await uploadGoodsImage(data)
    if (res.data.code === 200) {
      showSuccessToast('上传成功')
      goodsImages.value.push({
        number: 0,
        img: res.data.data.url,
        filename: res.data.data.filename
      })
    }
  } catch (error) {
    showFailToast('上传失败')
  } finally {
    uploadingGoodsImg.value = false
    e.target.value = ''
  }
}

const removeGoodsImage = async (idx) => {
  const img = goodsImages.value[idx]
  if (img.number > 0) {
    await deleteStoreGoods({ storeid: formData.value.id, number: img.number })
  }
  goodsImages.value.splice(idx, 1)
}

const loadGoodsImages = async (storeid) => {
  if (!storeid) return
  try {
    const res = await getStoreDetail(storeid)
    if (res.data.code === 200) {
      goodsImages.value = res.data.data.goodsImages || []
    }
  } catch (error) {
    console.error('获取详情图片失败:', error)
  }
}

// 是否显示编辑页
const showEdit = computed(() => {
  return !!route.query.edit
})

const fetchStores = async (force = false) => {
  if (!force && adminStore.listLoaded && adminStore.storeList.length > 0) {
    stores.value = adminStore.storeList
    loading.value = false
    return
  }

  loading.value = true
  try {
    const res = await getAdminStoreList()
    if (res.data.code === 200) {
      stores.value = res.data.data
      adminStore.setStoreList(res.data.data)
    }
  } catch (error) {
    console.error('获取店铺列表失败:', error)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  if (showEdit.value) {
    closeEdit()
  } else {
    router.back()
  }
}

const goAdd = () => {
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
  goodsImages.value = []
  router.push({ path: '/admin', query: { edit: 'add' } })
}

const goDetail = (id) => {
  const store = stores.value.find((s) => s.id === id)
  if (store) {
    isEdit.value = true
    formData.value = { ...store }
    loadGoodsImages(id)
    router.push({ path: '/admin', query: { edit: id } })
  }
}

const closeEdit = () => {
  router.back()
}

const handleSave = async () => {
  if (!formData.value.name) {
    showToast('请输入店铺名称')
    return
  }

  try {
    let storeId = formData.value.id
    if (isEdit.value) {
      await editStore(formData.value)
      adminStore.updateStoreItem(formData.value)
      const index = stores.value.findIndex((s) => s.id === formData.value.id)
      if (index !== -1) {
        stores.value[index] = { ...formData.value }
      }
    } else {
      const res = await addStore(formData.value)
      storeId = res.data.data.id
      await fetchStores(true)
    }

    // 保存详情图片（只有新上传的 number=0 的图片需要保存）
    for (const img of goodsImages.value) {
      if (img.number === 0) {
        const res = await addGoods({
          storeid: storeId,
          goods_img: img.filename,
          goods_name: ''
        })
        if (res.data.code === 200) {
          img.number = res.data.data.number
        }
      }
    }

    showSuccessToast('保存成功')
    closeEdit()
  } catch (error) {
    showFailToast('保存失败')
  }
}

const handleDelete = async () => {
  if (!confirm('确定要删除这个店铺吗？')) return

  try {
    await deleteStore(formData.value.id)
    adminStore.removeStoreItem(formData.value.id)
    const index = stores.value.findIndex((s) => s.id === formData.value.id)
    if (index !== -1) {
      stores.value.splice(index, 1)
    }
    showSuccessToast('删除成功')
    closeEdit()
  } catch (error) {
    showFailToast('删除失败')
  }
}

onMounted(async () => {
  await fetchStores()
  const editId = route.query.edit
  if (editId) {
    if (editId === 'add') {
      openAdd()
    } else {
      try {
        const res = await getStoreDetail(editId)
        if (res.data.code === 200) {
          const data = res.data.data
          formData.value = {
            id: data.id,
            name: data.name,
            category: data.category || '',
            store_img: data.store_img || '',
            rating: data.rating || 0,
            address: data.address || '',
            business_hours: data.business_hours || '',
            average_cost: data.average_cost || 0,
            description: data.description || ''
          }
          goodsImages.value = data.goodsImages || []
          isEdit.value = true
        }
      } catch (error) {
        console.error('获取店铺详情失败:', error)
      }
    }
  }
})
</script>

<style scoped>
.store-list-container {
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

.add-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #667eea;
  cursor: pointer;
}

.store-list {
  background: white;
}

.store-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  touch-action: manipulation;
}

.store-item:active {
  background: #f5f5f5;
}

.store-img {
  width: 50px;
  height: 50px;
  border-radius: 6px;
  object-fit: cover;
  margin-right: 12px;
  flex-shrink: 0;
}

.store-img.placeholder {
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.store-info {
  flex: 1;
  min-width: 0;
}

.store-name {
  font-size: 16px;
  color: #333;
  font-weight: 500;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.store-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.store-category {
  font-size: 13px;
  color: #999;
  background: #f5f5f5;
  padding: 2px 8px;
  border-radius: 4px;
}

.store-rating {
  font-size: 13px;
  color: #ff9500;
}

.store-arrow {
  font-size: 20px;
  color: #ccc;
  margin-left: 10px;
}

.loading,
.empty {
  text-align: center;
  padding: 50px 20px;
  color: #999;
  font-size: 14px;
}

/* 编辑面板样式 */
.store-edit-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  background: #f6f6f6;
  z-index: 1001;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.edit-header {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background: white;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  z-index: 10;
}

.edit-header .placeholder {
  width: 40px;
}

.edit-header .save-btn {
  padding: 4px 12px;
  background: linear-gradient(to right, #667eea, #764ba2);
  color: white;
  border-radius: 4px;
  font-size: 14px;
}

.edit-content {
  padding: 15px;
  padding-bottom: 100px;
}

.form-item {
  margin-bottom: 15px;
}

.form-item label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.form-item input,
.form-item textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 15px;
  outline: none;
  box-sizing: border-box;
}

.form-item input:focus,
.form-item textarea:focus {
  border-color: #667eea;
}

.delete-section {
  margin-top: 20px;
  margin-bottom: 20px;
}

.delete-btn {
  width: 100%;
  padding: 12px;
  background: #ff3b30;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

/* 右边滑入动画 */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

/* 上传区域 */
.upload-area {
  width: 100px;
  height: 100px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
}

.upload-area:active {
  border-color: #667eea;
}

.upload-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #999;
}

.upload-icon {
  font-size: 30px;
  line-height: 1;
}

.upload-text {
  font-size: 12px;
  margin-top: 5px;
}

/* 商品图片网格 */
.goods-images-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.goods-img-item {
  position: relative;
  aspect-ratio: 1/1;
  border-radius: 6px;
  overflow: hidden;
}

.goods-img-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.goods-img-delete {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 20px;
  height: 20px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: pointer;
}

.goods-img-add {
  aspect-ratio: 1/1;
  border: 2px dashed #ddd;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  color: #999;
  cursor: pointer;
}

.goods-img-add:active {
  border-color: #667eea;
  color: #667eea;
}
</style>
