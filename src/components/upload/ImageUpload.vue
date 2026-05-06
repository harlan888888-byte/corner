<template>
  <div class="image-upload">
    <div class="upload-area" @click="triggerUpload">
      <img v-if="imageUrl" :src="imageUrl" class="upload-preview" />
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
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  maxSize: {
    type: Number,
    default: 1 * 1024 * 1024
  },
  uploadApi: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'success', 'error'])

const fileInput = ref(null)
const imageUrl = ref(props.modelValue)

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
</style>
