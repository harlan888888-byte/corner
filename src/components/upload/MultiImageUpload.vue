<template>
  <div class="multi-image-upload">
    <div class="images-grid">
      <div v-for="(img, idx) in imageList" :key="idx" class="image-item">
        <img
          v-if="!img.loading"
          :src="img.img"
          @click="handlePreview(idx)"
          @dblclick="handlePreview(idx)"
        />
        <div v-else class="image-loading">
          <div class="loading-spinner"></div>
        </div>
        <span class="image-delete" @click.stop="handleDelete(idx)">×</span>
      </div>
      <div
        v-if="imageList.length < maxCount"
        class="image-add"
        @click="triggerUpload"
      >
        <span>+</span>
      </div>
    </div>
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      multiple
      style="display: none"
      @change="handleFileChange"
    />

    <!-- 图片预览弹窗 -->
    <van-image-preview
      v-if="vanImageModalShow"
      v-model:show="vanImageModalShow"
      :images="previewImages"
      :start-position="vanImageCurrentIndex"
      teleport="body"
      show-indicators
      :show-index="false"
      :loop="false"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { showDialog } from 'vant'
import { useVanImagePreview } from '@/composables/vant-utils/useVanImagePreview'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  maxCount: {
    type: Number,
    default: 9
  },
  maxSize: {
    type: Number,
    default: 50 * 1024 * 1024
  },
  uploadApi: {
    type: Function,
    required: true
  },
  storeId: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'delete', 'success', 'error'])

const fileInput = ref(null)
const imageList = ref([...props.modelValue])

// 监听 modelValue 变化，同步更新 imageList
watch(
  () => props.modelValue,
  (newVal) => {
    imageList.value = [...newVal]
  },
  { deep: true }
)

// 使用图片预览 composable
const {
  vanImageModalShow,
  vanImageCurrentIndex,
  vanImageHandleClick,
  vanImageHandleDblClick
} = useVanImagePreview()

// 预览图片列表（只包含已上传完成的图片）
const previewImages = computed(() => {
  return imageList.value
    .filter((img) => !img.loading && img.img)
    .map((img) => img.img)
})

const handlePreview = (idx) => {
  // 找到已上传完成的图片索引
  const uploadedImages = imageList.value.filter(
    (img) => !img.loading && img.img
  )
  const clickedImg = imageList.value[idx]

  if (clickedImg && !clickedImg.loading && clickedImg.img) {
    // 找到点击的图片在已上传列表中的位置
    const previewIdx = uploadedImages.findIndex(
      (img) => img.img === clickedImg.img
    )
    if (previewIdx !== -1) {
      vanImageHandleClick(previewIdx)
    }
  }
}

const triggerUpload = () => {
  fileInput.value.click()
}

const handleFileChange = async (e) => {
  const files = e.target.files
  if (!files || files.length === 0) return

  const remainingCount = props.maxCount - imageList.value.length
  if (files.length > remainingCount) {
    emit('error', `最多还能上传${remainingCount}张图片`)
    e.target.value = ''
    return
  }

  // 创建临时图片对象，标记为加载中
  const tempImages = []
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (file.size > props.maxSize) {
      emit('error', '图片大小不能超过1MB')
      continue
    }
    const tempImg = {
      number: 0,
      img: '',
      filename: '',
      loading: true,
      file: file
    }
    tempImages.push(tempImg)
    imageList.value.push(tempImg)
  }
  emit('update:modelValue', imageList.value)

  // 并行上传所有图片
  const uploadPromises = tempImages.map(async (tempImg, tempIndex) => {
    try {
      const formData = new FormData()
      formData.append('image', tempImg.file)
      const res = await props.uploadApi(formData)

      if (res.data.code === 200) {
        // 更新图片信息，移除加载状态
        // 使用文件名来查找图片，因为对象引用可能因为watch而改变
        const imgIndex = imageList.value.findIndex(
          (img) =>
            img.file === tempImg.file ||
            (img.filename && img.filename === tempImg.filename)
        )
        if (imgIndex !== -1) {
          imageList.value[imgIndex] = {
            number: 0,
            img: res.data.data.url,
            filename: res.data.data.filename,
            loading: false
          }
          emit('update:modelValue', imageList.value)
          emit('success', imageList.value[imgIndex])
        }
      } else {
        // 上传失败，移除临时图片
        const imgIndex = imageList.value.findIndex(
          (img) => img.file === tempImg.file
        )
        if (imgIndex !== -1) {
          imageList.value.splice(imgIndex, 1)
          emit('update:modelValue', imageList.value)
        }
        emit('error', '上传失败')
      }
    } catch (error) {
      // 上传失败，移除临时图片
      const imgIndex = imageList.value.findIndex(
        (img) => img.file === tempImg.file
      )
      if (imgIndex !== -1) {
        imageList.value.splice(imgIndex, 1)
        emit('update:modelValue', imageList.value)
      }
      emit('error', '上传失败')
    }
  })

  // 等待所有上传完成
  await Promise.all(uploadPromises)

  e.target.value = ''
}

const handleDelete = (idx) => {
  showDialog({
    title: '',
    message: '确定要删除这张图片吗？',
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
    .then(() => {
      const img = imageList.value[idx]
      if (img.number > 0 && props.storeId) {
        emit('delete', { storeid: props.storeId, number: img.number })
      }
      imageList.value.splice(idx, 1)
      emit('update:modelValue', imageList.value)
    })
    .catch(() => {
      // 用户取消删除
    })
}
</script>

<style scoped>
.multi-image-upload {
  width: 100%;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.image-item {
  position: relative;
  aspect-ratio: 1/1;
  border-radius: 6px;
  overflow: hidden;
  background: #f5f5f5;
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-loading {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #ddd;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.image-delete {
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

.image-add {
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

.image-add:active {
  border-color: #667eea;
  color: #667eea;
}
</style>
