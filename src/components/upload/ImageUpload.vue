<template>
  <div class="image-upload">
    <div
      class="upload-area"
      :class="{ 'has-image': imageUrl && !loading }"
      @click="triggerUpload"
    >
      <img v-if="imageUrl && !loading" :src="imageUrl" class="upload-preview" />
      <div v-else-if="loading" class="upload-loading">
        <div class="loading-spinner"></div>
      </div>
      <div v-else class="upload-placeholder">
        <span class="upload-icon">+</span>
        <span class="upload-text">点击上传</span>
      </div>
    </div>
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      style="display: none"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  maxSize: {
    type: Number,
    default: 50 * 1024 * 1024
  },
  uploadApi: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'success', 'error'])

const fileInput = ref(null)
const imageUrl = ref(props.modelValue)
const loading = ref(false)

// 监听 modelValue 变化，同步更新 imageUrl
watch(
  () => props.modelValue,
  (newVal) => {
    imageUrl.value = newVal
  }
)

const triggerUpload = () => {
  fileInput.value.click()
}

const handleFileChange = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  if (file.size > props.maxSize) {
    emit('error', '图片大小不能超过1MB')
    e.target.value = ''
    return
  }

  loading.value = true

  try {
    const formData = new FormData()
    formData.append('image', file)
    const res = await props.uploadApi(formData)
    if (res.data.code === 200) {
      imageUrl.value = res.data.data.url
      emit('update:modelValue', res.data.data.url)
      emit('success', res.data.data)
    } else {
      emit('error', '上传失败')
    }
  } catch (error) {
    emit('error', '上传失败')
  } finally {
    loading.value = false
    e.target.value = ''
  }
}
</script>

<style scoped>
.image-upload {
  width: 100px;
  height: 100px;
}

.upload-area {
  width: 100%;
  height: 100%;
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

.upload-area.has-image {
  border: none;
}

.upload-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-loading {
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
</style>
