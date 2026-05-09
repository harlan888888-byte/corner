<template>
  <div class="store-list-container" ref="containerRef">
    <div class="header">
      <div class="back-btn" @click="goBack">‹</div>
      <div class="title">店铺管理</div>
      <div class="add-btn" @click="goAdd">+</div>
    </div>

    <!-- 搜索框 -->
    <div class="search-bar">
      <input
        v-model="searchKeyword"
        type="text"
        placeholder="搜索店铺名称"
        class="search-input"
        @input="handleSearch"
      />
      <span v-if="searchKeyword" class="search-clear" @click="clearSearch"
        >×</span
      >
    </div>

    <div class="store-list">
      <div v-if="loading && stores.length === 0" class="loading">加载中...</div>
      <div v-else-if="!loading && stores.length === 0" class="empty">
        暂无店铺
      </div>
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
      <!-- 加载更多提示 -->
      <div v-if="loadingMore" class="loading">加载中...</div>
      <div v-if="!loading && !hasMore && stores.length > 0" class="no-more">
        已加载全部
      </div>
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
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAdminStoreList } from '@/api/admin/store'
import { useAdminStore } from '@/stores/modules/adminStore'
import StoreEdit from './StoreEdit.vue'

const route = useRoute()
const router = useRouter()
const adminStore = useAdminStore()

const containerRef = ref(null)
const stores = ref([])
const loading = ref(true)
const loadingMore = ref(false)
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const hasMore = computed(() => currentPage.value * pageSize.value < total.value)

const showEdit = computed(() => !!route.query.edit)
const isEdit = computed(() => route.query.edit !== 'add')

const fetchStores = async (page = 1, keyword = '', append = false) => {
  const loadMore = append
  if (loadMore) {
    loadingMore.value = true
  } else {
    loading.value = true
  }

  try {
    const params = {
      page,
      pageSize: pageSize.value,
      keyword
    }
    const res = await getAdminStoreList(params)
    if (res.data.code === 200) {
      if (loadMore) {
        stores.value = [...stores.value, ...res.data.data]
      } else {
        stores.value = res.data.data
      }
      total.value = res.data.count || 0
      currentPage.value = page
    }
  } catch (error) {
    console.error('获取店铺列表失败:', error)
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchStores(1, searchKeyword.value, false)
}

const clearSearch = () => {
  searchKeyword.value = ''
  currentPage.value = 1
  fetchStores(1, '', false)
}

const loadMore = () => {
  if (!hasMore.value || loadingMore.value) return
  fetchStores(currentPage.value + 1, searchKeyword.value, true)
}

// 滚动加载更多
const handleScroll = () => {
  const container = containerRef.value
  if (!container) return

  const scrollTop = container.scrollTop
  const windowHeight = container.clientHeight
  const scrollHeight = container.scrollHeight

  if (
    scrollTop + windowHeight >= scrollHeight - 50 &&
    hasMore.value &&
    !loadingMore.value &&
    !loading.value
  ) {
    loadMore()
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
  currentPage.value = 1
  fetchStores(1, searchKeyword.value, false)
  closeEdit()
}

const handleDeleted = () => {
  currentPage.value = 1
  fetchStores(1, searchKeyword.value, false)
  closeEdit()
}

onMounted(() => {
  fetchStores(1, '', false)
  // 绑定滚动事件到容器
  if (containerRef.value) {
    containerRef.value.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  // 解绑滚动事件
  if (containerRef.value) {
    containerRef.value.removeEventListener('scroll', handleScroll)
  }
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

.search-bar {
  position: relative;
  padding: 10px 15px;
  background: #f6f6f6;
}

.search-input {
  width: 100%;
  height: 40px;
  padding: 0 40px 0 15px;
  border: none;
  border-radius: 20px;
  background: white;
  font-size: 14px;
  box-sizing: border-box;
}

.search-clear {
  position: absolute;
  right: 25px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  line-height: 18px;
  text-align: center;
  font-size: 18px;
  color: #999;
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

.no-more {
  text-align: center;
  padding: 15px;
  color: #ccc;
  font-size: 13px;
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
