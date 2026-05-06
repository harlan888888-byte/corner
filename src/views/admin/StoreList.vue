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
          @click="goEdit(store.id)"
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

    <transition name="slide-right">
      <StoreEdit
        v-if="showEdit"
        :store-id="route.query.edit"
        @close="closeEdit"
        @saved="handleSaved"
        @deleted="handleDeleted"
      />
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAdminStoreList } from '@/api/admin/store'
import { useAdminStore } from '@/stores/modules/adminStore'
import StoreEdit from './StoreEdit.vue'

const route = useRoute()
const router = useRouter()
const adminStore = useAdminStore()

const stores = ref([])
const loading = ref(true)

const showEdit = computed(() => !!route.query.edit)
const isEdit = computed(() => route.query.edit !== 'add')

const fetchStores = async () => {
  loading.value = true
  try {
    const res = await getAdminStoreList()
    if (res.data.code === 200) {
      stores.value = res.data.data
    }
  } catch (error) {
    console.error('获取店铺列表失败:', error)
  } finally {
    loading.value = false
  }
}

const goAdd = () => {
  router.push({ path: '/admin', query: { edit: 'add' } })
}

const goBack = () => {
  if (showEdit.value) {
    closeEdit()
  } else {
    router.back()
  }
}

const goEdit = (id) => {
  router.push({ path: '/admin', query: { edit: id } })
}

const closeEdit = () => {
  router.back()
}

const handleSaved = () => {
  fetchStores()
  closeEdit()
}

const handleDeleted = () => {
  fetchStores()
  closeEdit()
}

onMounted(() => {
  fetchStores()
})
</script>

<style scoped>
.store-list-container {
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

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
