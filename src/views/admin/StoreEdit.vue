<template>
  <div class="store-edit-panel">
    <div class="edit-header">
      <div class="back-btn" @click="handleBack">‹</div>
      <div class="title">{{ isAdd ? '添加店铺' : '编辑店铺' }}</div>
      <div class="save-btn" @click="handleSave">保存</div>
    </div>

    <div v-if="loading" class="edit-loading">加载中...</div>

    <div v-if="!loading" class="edit-content">
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
        <div class="category-select-wrapper">
          <div class="category-select" @click="showCategoryPicker = true">
            <span>{{ formData.category || '请选择分类' }}</span>
            <span class="arrow">▼</span>
          </div>
        </div>
      </div>

      <div class="form-item">
        <label>神评</label>
        <input
          v-model="formData.title"
          type="text"
          placeholder="请输入神评"
          maxlength="10"
        />
        <span class="char-count">{{ formData.title.length }}/10</span>
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

      <div class="form-item-row">
        <div class="form-item-half">
          <label>评分</label>
          <input
            v-model.number="formData.rating"
            type="number"
            placeholder="请输入评分"
            min="0"
            max="5"
            step="0.1"
          />
        </div>
        <div class="form-item-half">
          <label>人均消费</label>
          <input
            v-model.number="formData.average_cost"
            type="number"
            placeholder="请输入人均消费"
          />
        </div>
      </div>

      <div class="form-item">
        <label>省/市</label>
        <div class="picker-select" @click="openAreaPicker">
          <span>{{
            formData.province
              ? formData.city
                ? formData.province + ' ' + formData.city
                : formData.province
              : '请选择省/市'
          }}</span>
          <span class="arrow">▼</span>
        </div>
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
        <label>描述标题</label>
        <input
          v-model="formData.description_title"
          type="text"
          placeholder="请输入描述标题"
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

      <div class="form-item">
        <label>详情图片</label>
        <MultiImageUpload
          v-model="goodsImages"
          :upload-api="uploadGoodsImage"
          :store-id="storeId"
          @success="showSuccessToast('上传成功')"
          @error="showFailToast($event)"
          @delete="handleDeleteGoodsImage"
        />
      </div>

      <!-- 删除店铺按钮 -->
      <div v-if="!isAdd" class="delete-section">
        <button class="delete-btn" @click="handleDelete">删除店铺</button>
      </div>

      <!-- 分类选择弹窗 -->
      <van-popup
        v-model:show="showCategoryPicker"
        position="bottom"
        :style="{ height: '45%' }"
        round
      >
        <div class="category-picker">
          <div class="picker-header">
            <span class="picker-title">选择分类</span>
            <span class="picker-close" @click="showCategoryPicker = false"
              >×</span
            >
          </div>
          <div class="category-grid">
            <div
              v-for="category in categories"
              :key="category"
              class="category-item"
              :class="{ active: formData.category === category }"
              @click="selectCategory(category)"
            >
              {{ category }}
            </div>
          </div>
        </div>
      </van-popup>
    </div>

    <!-- 省市区选择器弹出层 -->
    <van-popup
      v-model:show="showAreaPicker"
      position="bottom"
      :style="{ height: '60%' }"
    >
      <van-area
        title="选择省市区"
        :area-list="areaList"
        :columns-num="2"
        confirm-button-text="确定"
        cancel-button-text="取消"
        @confirm="onAreaConfirm"
        @cancel="showAreaPicker = false"
      />
    </van-popup>

    <!-- 保存中遮罩 -->
    <div v-if="saving" class="saving-overlay">
      <div class="saving-content">
        <div class="saving-spinner"></div>
        <span class="saving-text">保存中...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { showToast, showSuccessToast, showFailToast } from 'vant'
import { areaList } from '@vant/area-data'
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
import { storeCategories } from '@/data/categories'

const props = defineProps({
  storeId: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['close', 'saved', 'deleted'])

const loading = ref(true)
const saving = ref(false)
const showCategoryPicker = ref(false)
const showAreaPicker = ref(false)

const openAreaPicker = () => {
  showAreaPicker.value = true
}
// 使用共享的分类数据，与首页保持同步
const categories = storeCategories

const formData = ref({
  name: '',
  category: '',
  title: '',
  store_img: '',
  rating: 0,
  address: '',
  business_hours: '',
  average_cost: 0,
  description_title: '',
  description: '',
  province: '',
  city: ''
})

const goodsImages = ref([])

const isAdd = computed(() => props.storeId === 'add' || props.storeId === null)

const fetchStoreData = async () => {
  if (isAdd.value) {
    formData.value = {
      name: '',
      category: '',
      title: '',
      store_img: '',
      rating: 0,
      address: '',
      business_hours: '',
      average_cost: 0,
      description_title: '',
      description: '',
      province: '',
      city: ''
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
        title: data.title || '',
        store_img: data.store_img || '',
        rating: data.rating || 0,
        address: data.address || '',
        business_hours: data.business_hours || '',
        average_cost: data.average_cost || 0,
        description: (data.description || '').replace(/<br\s*\/?>/gi, '\n'),
        province: data.province || '',
        city: data.city || '',
        description_title: data.description_title || ''
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

const selectCategory = (category) => {
  formData.value.category = category
  showCategoryPicker.value = false
}

const handleDeleteGoodsImage = async ({ storeid, number }) => {
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

  // 如果正在保存中，直接返回
  if (saving.value) {
    return
  }

  saving.value = true

  try {
    // 将描述中的换行符转成 <br>
    const saveData = {
      ...formData.value,
      description: formData.value.description.replace(/\n/g, '<br>')
    }

    let currentStoreId = formData.value.id

    if (isAdd.value) {
      const res = await addStore(saveData)
      currentStoreId = res.data.data.id
    } else {
      await editStore(saveData)
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
  } finally {
    saving.value = false
  }
}

const handleDelete = async () => {
  showDialog({
    title: '',
    message: '确定要删除这个店铺吗？',
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#666666',
    messageAlign: 'center',
    closeOnClickOverlay: false,
    transition: 'scale',
    round: true,
    showCancelButton: true
  })
    .then(async () => {
      try {
        await deleteStore(formData.value.id)
        showSuccessToast('删除成功')
        emit('deleted')
      } catch (error) {
        showFailToast('删除失败')
      }
    })
    .catch(() => {
      // 用户取消删除
    })
}

const onAreaConfirm = ({ selectedOptions }) => {
  let province = selectedOptions[0]?.text || ''
  let city = selectedOptions[1]?.text || ''

  // 去掉省份的后缀：省、市、自治区、特别行政区等（按长度从长到短排列）
  const provinceSuffixes = [
    '维吾尔自治区',
    '壮族自治区',
    '回族自治区',
    '特别行政区',
    '自治区',
    '省',
    '市'
  ]
  for (const suffix of provinceSuffixes) {
    if (province.endsWith(suffix)) {
      province = province.slice(0, -suffix.length)
      break
    }
  }

  // 去掉城市的后缀：市、区、县等
  const citySuffixes = [
    '市',
    '区',
    '县',
    '自治县',
    '旗',
    '自治旗',
    '盟',
    '自治州'
  ]
  for (const suffix of citySuffixes) {
    if (city.endsWith(suffix)) {
      city = city.slice(0, -suffix.length)
      break
    }
  }

  formData.value.province = province
  formData.value.city = city

  showAreaPicker.value = false
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

.char-count {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  font-size: 14px;
  color: #666;
  margin-top: 4px;
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

/* 分类选择器 */
.category-select-wrapper {
  width: 100%;
}

.category-select {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 15px;
  color: #333;
  background: white;
  cursor: pointer;
}

.category-select .arrow {
  font-size: 12px;
  color: #999;
}

/* 分类选择弹窗 */
.category-picker {
  width: 100%;
  height: 100%;
  background: white;
  padding-bottom: env(safe-area-inset-bottom);
}

.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.picker-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.picker-close {
  font-size: 24px;
  color: #999;
  cursor: pointer;
}

.category-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 15px;
  gap: 10px;
}

.category-item {
  padding: 8px 16px;
  background: #f5f5f5;
  border-radius: 20px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.category-item.active {
  background: linear-gradient(to right, #667eea, #764ba2);
  color: white;
}

/* 并排布局 */
.form-item-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.form-item-half {
  flex: 1;
}

.form-item-half label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.form-item-half input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 15px;
  outline: none;
  box-sizing: border-box;
}

.form-item-half input:focus {
  border-color: #667eea;
}

/* 选择器样式 */
.picker-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  box-sizing: border-box;
}

.picker-select .arrow {
  font-size: 12px;
  color: #999;
}

.saving-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.saving-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  padding: 30px 50px;
  border-radius: 12px;
}

.saving-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #eee;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.saving-text {
  margin-top: 12px;
  font-size: 16px;
  color: #333;
}
</style>
