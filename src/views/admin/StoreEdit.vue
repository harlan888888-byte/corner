<template>
  <div class="store-edit-panel">
    <div class="edit-header">
      <div class="back-btn" @click="handleBack">‹</div>
      <div class="title">{{ isAdd ? '添加店铺' : '编辑店铺' }}</div>
      <div class="save-btn" @click="handleSave">保存</div>
    </div>

    <div v-if="loading" class="edit-loading">加载中...</div>

    <div v-else class="edit-content">
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
        <ImageUpload
          v-model="formData.store_img"
          :upload-api="uploadStoreImage"
          @success="showSuccessToast('上传成功')"
          @error="showFailToast($event)"
        />
      </div>

      <div class="form-item">
        <label>详情图片 ({{ goodsImages.length }}/9)</label>
        <MultiImageUpload
          v-model="goodsImages"
          :max-count="9"
          :upload-api="uploadGoodsImage"
          @delete="handleDeleteGoodsImage"
          @success="showSuccessToast('上传成功')"
          @error="showFailToast($event)"
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

      <div v-if="!isAdd" class="delete-section">
        <button class="delete-btn" @click="handleDelete">删除店铺</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { showToast, showSuccessToast, showFailToast } from 'vant'
import ImageUpload from '@/components/upload/ImageUpload.vue'
import MultiImageUpload from '@/components/upload/MultiImageUpload.vue'
import {
  getStoreDetail,
  addStore,
  editStore,
  deleteStore,
  addGoods,
  uploadStoreImage,
  uploadGoodsImage
} from '@/api/admin/store'

const props = defineProps({
  storeId: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['close', 'saved', 'deleted'])

const loading = ref(true)
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

const isAdd = computed(() => props.storeId === 'add' || props.storeId === null)

const fetchStoreData = async () => {
  if (isAdd.value) {
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
    loading.value = false
    return
  }

  loading.value = true
  try {
    const res = await getStoreDetail(props.storeId)
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
    }
  } catch (error) {
    console.error('获取店铺详情失败:', error)
  } finally {
    loading.value = false
  }
}

const handleBack = () => {
  emit('close')
}

const handleDeleteGoodsImage = async ({ storeid, number }) => {
  // 如果 number 为 0，表示图片是新上传的，还没保存到数据库，不需要调用后端接口
  if (number === 0) {
    return
  }
  try {
    const { deleteStoreGoods } = await import('@/api/admin/store')
    const res = await deleteStoreGoods({ storeid, number })
    if (res.data.code === 200) {
      showToast('删除成功')
    } else {
      showFailToast('删除失败')
    }
  } catch (error) {
    console.error('删除图片失败:', error)
    showFailToast('删除失败')
  }
}

const handleSave = async () => {
  if (!formData.value.name) {
    showToast('请输入店铺名称')
    return
  }

  try {
    let currentStoreId = formData.value.id

    if (isAdd.value) {
      const res = await addStore(formData.value)
      currentStoreId = res.data.data.id
    } else {
      await editStore(formData.value)
    }

    for (const img of goodsImages.value) {
      if (img.number === 0) {
        const res = await addGoods({
          storeid: currentStoreId,
          goods_img: img.filename,
          goods_name: ''
        })
        if (res.data.code === 200) {
          img.number = res.data.data.number
        }
      }
    }

    showSuccessToast('保存成功')
    emit('saved')
  } catch (error) {
    showFailToast('保存失败')
  }
}

const handleDelete = async () => {
  if (!confirm('确定要删除这个店铺吗？')) return

  try {
    await deleteStore(formData.value.id)
    showSuccessToast('删除成功')
    emit('deleted')
  } catch (error) {
    showFailToast('删除失败')
  }
}

onMounted(() => {
  fetchStoreData()
})
</script>

<style scoped>
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

.edit-header .save-btn {
  padding: 4px 12px;
  background: linear-gradient(to right, #667eea, #764ba2);
  color: white;
  border-radius: 4px;
  font-size: 14px;
}

.edit-loading {
  text-align: center;
  padding: 50px 20px;
  color: #999;
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
</style>
