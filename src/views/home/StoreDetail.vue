<template>
  <teleport to="body">
    <div
      class="store-detail-container"
      :class="{ 'enter-active': isEnterActive, 'leave-active': isLeaveActive }"
    >
      <!-- 顶部导航栏 -->
      <div class="nav-bar">
        <button class="back-btn" @click="goBack">
          <img src="@/assets/icons/back.svg" alt="返回" class="back-icon" />
        </button>
        <span class="nav-title">{{ storeInfo.name }}</span>
      </div>

      <!-- 店铺详情内容 -->
      <div class="store-detail-content">
        <!-- 店铺图片 -->
        <div class="store-image">
          <img :src="storeInfo.store_img" :alt="storeInfo.name" />
        </div>

        <!-- 店铺信息 -->
        <div class="store-info">
          <h2 class="store-name">{{ storeInfo.name }}</h2>
          <div class="store-rating-average">
            <span class="rating">{{ storeInfo.rating }}分</span>
            <span class="average-cost">￥{{ storeInfo.average_cost }}/人</span>
          </div>
          <div class="store-title" v-if="storeInfo.title">
            <span>{{ storeInfo.title }}</span>
          </div>
          <div class="store-address">
            <TargetMap
              :address="(storeInfo.name || '') + (storeInfo.address || '')"
            >
              <img class="map-icon" src="@/assets/icons/map.svg" alt="位置" />
            </TargetMap>
            <span>{{ storeInfo.address }}</span>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import TargetMap from '@/components/base/TargetMap.vue'
import { getStoreDetail } from '@/api/home/store'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

// 店铺信息
const storeInfo = ref({})
// 加载状态
const loading = ref(true)
// 错误信息
const error = ref('')
// 动画状态
const isEnterActive = ref(false)
const isLeaveActive = ref(false)

// 返回首页
const goBack = () => {
  // 触发离开动画
  isLeaveActive.value = true

  setTimeout(() => {
    router.back()
  }, 300)
}

// 获取店铺详情
const getStoreDetailInfo = async () => {
  // 获取 storeid 参数
  const storeid = route.params.storeid
  console.log(storeid)

  if (!storeid) {
    error.value = '店铺 ID 不存在'
    loading.value = false
    return
  }

  try {
    loading.value = true
    error.value = ''

    // 调用 API 获取店铺详情
    const res = await getStoreDetail(storeid)

    // 处理响应
    if (res.data.code === 200) {
      storeInfo.value = res.data.data
    } else {
      error.value = res.data.message || '获取店铺详情失败'
    }
  } catch (err) {
    console.error('获取店铺详情失败:', err)
    error.value = '获取店铺详情失败'
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取店铺详情
onMounted(() => {
  getStoreDetailInfo()

  // 检查是否是通过其他组件进入
  const isFromOtherComponent = sessionStorage.getItem('isFromOtherComponent')

  if (isFromOtherComponent) {
    // 通过其他组件进入，执行滑入动画
    setTimeout(() => {
      isEnterActive.value = true
    }, 10)

    // 清除标记，避免下次刷新时误判
    sessionStorage.removeItem('isFromOtherComponent')
  } else {
    // 不是通过其他组件进入（可能是直接访问或刷新），不执行滑入动画
    // 直接设置组件在屏幕内，禁用过渡效果
    const container = document.querySelector('.store-detail-container')
    if (container) {
      container.style.transform = 'translateX(0)'
      container.style.transition = 'none'
    }
    // 然后设置 isEnterActive 为 true
    isEnterActive.value = true
  }
})
</script>

<style lang="scss" scoped>
.store-detail-container {
  background-color: #f6f6f6;
  min-height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  z-index: 1000;
  transition: transform 0.3s ease;
  transform: translateX(100%);
}

.store-detail-container.enter-active {
  transform: translateX(0);
}

.store-detail-container.leave-active {
  transform: translateX(100%);
}

/* 阻止背景滚动 */
:global(body:has(.store-detail-container)) {
  overflow: hidden;
}

.nav-bar {
  display: flex;
  align-items: center;
  background: linear-gradient(to right, #673ab7, #d154ff);
  padding: 10px 15px;
  color: white;
  position: sticky;
  top: 0;
  z-index: 1000;

  .back-btn {
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    padding: 5px;
    margin-right: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .back-icon {
    width: 20px;
    height: 20px;
    color: white;
  }

  .nav-title {
    font-size: 20px;
    font-weight: 500;
    margin: 0;
  }
}

.store-detail-content {
  padding: 10px;
}

.store-image {
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 15px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.store-info {
  background-color: white;
  border-radius: 8px;
  padding: 15px;

  .store-name {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 10px;
  }

  .store-rating-average {
    display: flex;
    gap: 15px;
    margin-bottom: 10px;

    .rating {
      color: #fc683e;
      font-weight: 500;
    }

    .average-cost {
      color: #666;
    }
  }

  .store-title {
    display: inline-block;
    background-color: #ffe2bf;
    color: #7e2700;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 14px;
    margin-bottom: 15px;
  }

  .store-address {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #666;

    .map-icon {
      width: 20px;
      height: 20px;
    }
  }
}
</style>
