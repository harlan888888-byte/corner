<template>
  <!-- 店铺详情页面 -->
  <div class="store-detail-container">
    <!-- 顶部导航栏 -->
    <div class="nav-bar">
      <button class="back-btn" @click="goBack">
        <img src="@/assets/icons/back.svg" alt="返回" class="back-icon" />
      </button>
      <span class="nav-title">{{ storeInfo.name }}</span>
    </div>

    <!-- 店铺详情内容 -->
    <div class="store-detail-content">
      <!-- 图片卡片组件 -->
      <div class="img-preview-box">
        <ImageCard v-if="hasGoods" :images="images" />
        <!-- 店铺图片 -->
        <div v-else class="store-image">
          <img
            :src="storeInfo.store_img || defaultImgSrc"
            :alt="storeInfo.name"
            :images="images"
            @click="vanImageHandleClick(0)"
            @dblclick="vanImageHandleDblClick(0)"
          />
        </div>
        <van-image-preview
          v-if="vanImageModalShow"
          v-model:show="vanImageModalShow"
          :images="images"
          :start-position="vanImageCurrentIndex"
          @close="vanImageClose"
          teleport="body"
          show-indicators
          :show-index="false"
        />
      </div>
      <!-- 店铺信息 -->
      <div class="store-info">
        <h2 class="store-name">{{ storeInfo.name }}</h2>
        <!-- 营业时间 -->
        <div class="store-hours" v-if="storeInfo.business_hours">
          <p class="hours-content">{{ storeInfo.business_hours }}</p>
        </div>

        <div class="store-rating-average">
          <span class="rating">{{ storeInfo.rating }}分</span>
          <span class="average-cost">￥{{ storeInfo.average_cost }}/人</span>
        </div>
        <div class="store-title" v-if="storeInfo.title">
          <span>{{ storeInfo.title }}</span>
        </div>
        <div class="store-address">
          <TargetMap
            :address="
              (storeInfo.province || '') +
              (storeInfo.city || '') +
              (storeInfo.name || '') +
              (storeInfo.address || '')
            "
          >
            <img class="map-icon" src="@/assets/icons/map.svg" alt="位置" />
          </TargetMap>
          <span>{{ storeInfo.address }}</span>
        </div>

        <!-- 省份和城市 -->
        <div class="store-location" v-if="storeInfo.province || storeInfo.city">
          <span>{{ storeInfo.province }}{{ storeInfo.city }}</span>
        </div>

        <!-- 店铺描述 -->
        <div class="store-description" v-if="storeInfo.description">
          <h3 class="description-title">
            {{ storeInfo.description_title || '店铺描述' }}
          </h3>
          <p class="description-content" v-html="storeInfo.description"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getStoreDetail } from '@/api/home/store'
import defaultImgSrc from '@/assets/icons/miss_store.svg'
import { useVanImagePreview } from '@/utils/vant-utils/useVanImagePreview'

const route = useRoute()
const router = useRouter()

const images = ref([])

// 使用 van-image-preview 组合式函数
const {
  vanImageModalShow,
  vanImageCurrentIndex,
  vanImageHandleClick,
  vanImageHandleDblClick,
  vanImageClose
} = useVanImagePreview()

// 店铺信息
const storeInfo = ref({})
// 加载状态
const loading = ref(true)
// 错误信息
const error = ref('')

const hasGoods = ref(false)

// 返回首页
const goBack = () => {
  router.back()
}

// 获取店铺详情
const getStoreDetailInfo = async () => {
  // 获取 storeid 参数
  const storeid = route.params.storeid

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
      if (storeInfo.value.goods.length > 0) {
        images.value = [...storeInfo.value.goods.map((good) => good.goods_img)]
        hasGoods.value = true
      } else {
        hasGoods.value = false
        images.value = [storeInfo.value.store_img]
      }
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
    // object-fit: cover;
  }
}

.store-info {
  background-color: white;
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
    margin-bottom: 15px;

    span {
      display: inline-block;
      background-color: #ffe2bf;
      color: #7e2700;
      padding: 3px 6px;
      border-radius: 3px;
      font-size: 14px;

      // 空标题时span无占位（已通过v-if控制，此处兜底）
      &:empty {
        line-height: 0 !important;
        font-size: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
        background-color: transparent !important;
      }
    }
  }

  .store-address {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    color: #666;
    margin-bottom: 15px;

    .map-icon {
      width: 30px;
      height: 30px;
    }
  }

  .store-location {
    margin-bottom: 15px;
    color: #666;
  }

  .store-hours {
    margin-bottom: 10px;
  }

  .hours-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 5px;
    color: #333;
  }

  .hours-content {
    font-size: 14px;
    color: #666;
    margin: 0;
  }

  .store-description {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid #f0f0f0;
  }

  .description-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #333;
  }

  .description-content {
    font-size: 18px;
    line-height: 1.5;
    color: #505050;
    margin: 0;
  }
}
</style>
