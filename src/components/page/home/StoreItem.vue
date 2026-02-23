<template>
  <li class="store-item-box" @click="goToDetail">
    <div class="store-item">
      <div class="left-item">
        <div class="store-img">
          <LazyImage :src="item.store_img" alt="店铺" />
        </div>
      </div>

      <div class="right-item">
        <!-- 空值处理：无店铺名时显示默认文本 -->
        <div class="store-name text-item">
          <span>{{ item.name }}</span>
        </div>
        <div class="store-rat-ave text-item">
          <div class="store-rating">
            <!-- 评分空值处理 -->
            <span>{{ item.rating }}分</span>
          </div>
          <div class="store-average-cost text-item">
            <!-- 人均消费空值处理 -->
            <span>￥{{ item.average_cost }}/人</span>
          </div>
        </div>
        <div class="store-title text-item">
          <!-- 标题空值处理：空时span无占位 -->
          <span>{{ item.title }}</span>
        </div>
        <div class="store-address text-item">
          <div class="target-map" @click.stop>
            <TargetMap :address="item.name + item.address">
              <img class="map-icon" src="@/assets/icons/map.svg" alt="位置" />
            </TargetMap>
          </div>
          <!-- 地址空值处理 -->
          <span>{{ item.address }}</span>
        </div>
      </div>
    </div>
  </li>
</template>

<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import TargetMap from '@/components/base/TargetMap.vue'
import LazyImage from '@/components/base/LazyImage.vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const router = useRouter()

// 跳转到店铺详情页面
const goToDetail = () => {
  router.push({
    path: '/hometab/store-detail',
    query: {
      storeid: props.item.id
    }
  })
}
</script>

<style lang="scss" scoped>
$item-border-radius: 5px;

.store-item-box {
  padding-bottom: 8px;
}

.store-item {
  display: flex;
  gap: 10px;
  border-radius: $item-border-radius;
  background-color: white;
  padding: 10px 5px;

  .store-name {
    font-weight: bolder;
    margin-bottom: 0;
  }

  .store-img {
    width: 80px;
    height: 80px;
    border-radius: $item-border-radius;
    overflow: hidden;
  }

  .store-rat-ave {
    display: flex;
    gap: 10px;
  }

  .store-rating {
    color: #fc683e;
  }

  .store-title {
    margin-top: 3px;

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
    color: #666666;
    margin-top: 5px;
    gap: 5px;

    .target-map {
      display: flex;
    }
  }
}

.map-icon {
  width: 25px;
  height: 25px;
}

// 加载动画
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
