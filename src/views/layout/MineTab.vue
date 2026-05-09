<template>
  <div class="mine-tab-container">
    <!-- 如果是管理员，显示用户信息和管理入口 -->
    <template v-if="userStore.isAdmin && userStore.token">
      <div class="user-info-card" @click="goToAdminEdit">
        <div class="avatar" :class="{ 'has-image': userStore.user.user_img }">
          <img
            v-if="userStore.user.user_img"
            :src="getAvatarUrl()"
            class="avatar-img"
          />
          <span v-else>{{
            userStore.user.username?.charAt(0)?.toUpperCase() || 'A'
          }}</span>
        </div>
        <div class="info">
          <div class="name">
            {{ userStore.user.name || userStore.user.username }}
          </div>
          <div class="role">管理员</div>
        </div>
        <div class="arrow">›</div>
      </div>

      <div class="menu-list">
        <div class="menu-item" @click="goToAdminList">
          <span class="menu-icon">🏪</span>
          <span class="menu-text">店铺管理</span>
          <span class="menu-arrow">›</span>
        </div>

        <div class="menu-item" @click="goToAdminManager">
          <span class="menu-icon">👥</span>
          <span class="menu-text">新建管理员</span>
          <span class="menu-arrow">›</span>
        </div>
      </div>

      <div class="logout-section">
        <button class="logout-btn" @click="handleLogout">退出登录</button>
      </div>
    </template>

    <!-- 如果不是管理员，显示登录页面 -->
    <template v-else>
      <AdminLogin @login-success="handleLoginSuccess" />
    </template>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'
import { getAdminInfo } from '@/api/user'
import AdminLogin from '@/components/business/AdminLogin.vue'

const router = useRouter()
const userStore = useUserStore()

const checkTokenAndLoadUserInfo = async () => {
  if (userStore.token) {
    try {
      await getAdminInfo()
    } catch (error) {
      userStore.clearUser()
    }
  }
}

onMounted(() => {
  checkTokenAndLoadUserInfo()
})

const handleLoginSuccess = () => {
  checkTokenAndLoadUserInfo()
}

const goToAdminList = () => {
  router.push('/admin')
}

const goToAdminEdit = () => {
  router.push('/admin-edit')
}

const goToAdminManager = () => {
  router.push('/admin-manager')
}

const getAvatarUrl = () => {
  return userStore.user.user_img || ''
}

const handleLogout = () => {
  userStore.logout()
}
</script>

<style scoped>
.mine-tab-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.user-info-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: white;
  margin-bottom: 10px;
  cursor: pointer;
}

.arrow {
  font-size: 20px;
  color: #ccc;
  margin-left: auto;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
  margin-right: 15px;
  overflow: hidden;
}

.avatar.has-image {
  background: none;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info {
  flex: 1;
}

.name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.role {
  font-size: 14px;
  color: #667eea;
}

.menu-list {
  background: white;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}

.menu-item:active {
  background: #f5f5f5;
}

.menu-icon {
  font-size: 20px;
  margin-right: 12px;
}

.menu-text {
  flex: 1;
  font-size: 16px;
  color: #333;
}

.menu-arrow {
  font-size: 20px;
  color: #ccc;
}

.logout-section {
  padding: 30px 20px;
}

.logout-btn {
  width: 100%;
  padding: 14px;
  background: #ff4d4f;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

.logout-btn:active {
  background: #ff7875;
}
</style>
