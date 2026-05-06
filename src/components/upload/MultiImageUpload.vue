<template>
  <div class="multi-image-upload">
    <div class="images-grid">
      <div v-for="(img, idx) in imageList" :key="idx" class="image-item">
        <img :src="img.img" />
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
      style="display: none"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

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
    default: 1 * 1024 * 1024
  },
  uploadApi: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'delete', 'success', 'error'])

const fileInput = ref(null)
const imageList = ref([...props.modelValue])

const triggerUpload = () => {
  fileInput.value.click()
}

const handleFileChange = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  if (imageList.value.length >= props.maxCount) {
    emit('error', `最多上传${props.maxCount}张图片`)
    e.target.value = ''
    return
  }

  try {
    const formData = new FormData()
    formData.append('image', file)
    const res = await props.uploadApi(formData)
  if (file.size > props.maxSize) {
    emit('error', '图片大小不能超过1MB')
    e.target.value = ''
    return
  }

    if (res.data.code === 200) {
      const newImg = {
        number: 0,
        img: res.data.data.url,
        filename: res.data.data.filename
      }
      imageList.value.push(newImg)
      emit('update:modelValue', imageList.value)
      emit('success', newImg)
    } else {
      emit('error', '上传失败')
    }
  } catch (error) {
    emit('error', '上传失败')
  } finally {
    e.target.value = ''
  }
}

const handleDelete = (idx) => {
  const img = imageList.value[idx]
  if (img.number > 0) {
    emit('delete', { storeid: img.storeid, number: img.number })
  }
  imageList.value.splice(idx, 1)
  emit('update:modelValue', imageList.value)
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
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
