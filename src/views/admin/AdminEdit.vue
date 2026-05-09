<template>
  <div class="admin-edit-container">
    <!-- 头部 -->
    <div class="header">
      <div class="back-btn" @click="goBack">‹</div>
      <div class="title">编辑管理员信息</div>
      <div class="save-btn" @click="handleSave">保存</div>
    </div>

    <!-- 内容区域 -->
    <div class="content">
      <div class="form-card">
        <div class="form-item">
          <label class="form-label">头像</label>
          <ImageUpload
            v-model="formData.user_img"
            :upload-api="uploadAdminImage"
            @success="handleUploadSuccess"
            @error="handleUploadError"
          />
        </div>

        <div class="form-item">
          <label class="form-label">昵称</label>
          <input
            v-model="formData.name"
            type="text"
            class="form-input"
            placeholder="请输入昵称"
          />
        </div>

        <div class="form-item">
          <label class="form-label">账号</label>
          <input
            v-model="formData.username"
            type="text"
            class="form-input"
            placeholder="请输入账号"
          />
        </div>

        <div class="form-item">
          <label class="form-label">密码</label>
          <input
            v-model="formData.password"
            type="password"
            class="form-input"
            placeholder="请输入密码（不填则不修改）"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'
import { updateAdmin, uploadAdminImage } from '@/api/admin/admin'
import { showSuccessToast, showFailToast } from 'vant'
import ImageUpload from '@/components/upload/ImageUpload.vue'

const router = useRouter()
const userStore = useUserStore()

const formData = reactive({
  id: '',
  username: '',
  password: '',
  name: '',
  user_img: ''
})

onMounted(() => {
  // 初始化表单数据
  formData.id = userStore.user.id || ''
  formData.username = userStore.user.username || ''
  formData.name = userStore.user.name || ''
  formData.user_img = userStore.user.user_img
    ? getAvatarUrl(userStore.user.user_img)
    : ''
})

const getAvatarUrl = (user_img) => {
  if (!user_img) return ''
  if (user_img.includes('http')) {
    return user_img
  }
  return `${import.meta.env.VITE_APP_API_URL}/static/admin/${user_img}`
}

const goBack = () => {
  router.back()
}

const handleUploadSuccess = () => {
  showSuccessToast('头像上传成功')
}

const handleUploadError = (msg) => {
  showFailToast(msg)
}

const handleSave = async () => {
  if (!formData.username) {
    showFailToast('请输入账号')
    return
  }

  try {
    const res = await updateAdmin({
      id: formData.id,
      username: formData.username,
      password: formData.password,
      name: formData.name,
      user_img: formData.user_img
    })

    if (res.data.code === 200) {
      showSuccessToast('修改成功')
      // 刷新用户信息到 Pinia
      await userStore.getUserInfo()
      router.back()
    } else {
      showFailToast(res.data.message || '修改失败')
    }
  } catch (error) {
    const errMsg = error.response?.data?.message || error.message || '修改失败'
    showFailToast(errMsg)
  }
}
</script>

<style scoped>
.admin-edit-container {
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
  padding: 0 10px;
}

.header .save-btn {
  padding: 4px 12px;
  background: linear-gradient(to right, #667eea, #764ba2);
  color: white;
  border-radius: 4px;
  font-size: 14px;
}

.content {
  padding: 15px;
}

.form-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.form-item {
  margin-bottom: 15px;
}

.form-label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #673ab7;
  }
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #673ab7;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #7e57c2;
  }
}
</style>
