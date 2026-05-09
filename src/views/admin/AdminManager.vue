<template>
  <div class="admin-manager-container">
    <!-- 头部 -->
    <div class="header">
      <div class="back-btn" @click="goBack">‹</div>
      <div class="title">新建管理员</div>
      <div class="save-btn" @click="handleAddAdmin">添加</div>
    </div>

    <!-- 内容区域 -->
    <div class="content">
      <!-- 添加管理员表单 -->
      <div class="form-card">
        <div class="card-title">添加管理员</div>

        <div class="form-item">
          <label class="form-label">账号</label>
          <input
            v-model="formData.username"
            type="text"
            class="form-input"
            placeholder="请输入管理员账号"
          />
        </div>

        <div class="form-item">
          <label class="form-label">密码</label>
          <input
            v-model="formData.password"
            type="password"
            class="form-input"
            placeholder="请输入管理员密码"
          />
        </div>

        <div class="form-item">
          <label class="form-label">昵称</label>
          <input
            v-model="formData.name"
            type="text"
            class="form-input"
            placeholder="请输入昵称（默认为账号名）"
          />
        </div>

        <div class="form-item">
          <label class="form-label">头像</label>
          <ImageUpload
            v-model="formData.user_img"
            :upload-api="uploadAdminImage"
            @success="handleUploadSuccess"
            @error="handleUploadError"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { createAdmin, uploadAdminImage } from '@/api/admin/admin'
import { showSuccessToast, showFailToast } from 'vant'
import ImageUpload from '@/components/upload/ImageUpload.vue'

const router = useRouter()

const formData = reactive({
  username: '',
  password: '',
  name: '',
  user_img: ''
})

const goBack = () => {
  router.back()
}

const handleUploadSuccess = () => {
  showSuccessToast('头像上传成功')
}

const handleUploadError = (msg) => {
  showFailToast(msg)
}

const handleAddAdmin = async () => {
  if (!formData.username || !formData.password) {
    showFailToast('请输入账号和密码')
    return
  }

  try {
    const res = await createAdmin({
      username: formData.username,
      password: formData.password,
      name: formData.name,
      user_img: formData.user_img
    })

    if (res.data.code === 200) {
      showSuccessToast('添加成功')
      router.push('/mine')
    } else {
      showFailToast(res.data.message || '添加失败')
    }
  } catch (error) {
    const errMsg = error.response?.data?.message || error.message || '添加失败'
    showFailToast(errMsg)
  }
}
</script>

<style scoped>
.admin-manager-container {
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

.card-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 15px;
  color: #333;
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
