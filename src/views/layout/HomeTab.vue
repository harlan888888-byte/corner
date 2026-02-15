<template>
  <div class="home-tab-container">
    <div class="tab-top-item">
      <h1>街角</h1>
    </div>

    <LoadingToast v-if="btnLoading" :text="btnLoadingText" />

    <ul>
      <StoreItem v-for="item in storeInfoList" :key="item.id" :item="item" />
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getStoreInfo } from '@/api/home/store'
import StoreItem from '@/components/business/StoreItem.vue'

const btnLoading = ref(false)
const btnLoadingText = ref('正在加载...')

const storeInfoList = ref([])

const getStoreInfoList = async () => {
  btnLoading.value = true
  const res = await getStoreInfo()
  storeInfoList.value = res.data.data
  btnLoading.value = false
}

getStoreInfoList()
</script>

<style lang="scss" scoped>
.home-tab-container {
  background-color: #f6f6f6;

  ul {
    padding: 0 5px;
  }
}

.tab-top-item {
  width: 100%;
  background-color: white;
  padding: 10px;
  margin-bottom: 5px;
}

h1 {
  font-size: 24px;
}

.loading-demo {
  margin: 30px 0;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.content-area {
  margin-top: 30px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.content-loading {
  margin-top: 30px;
  font-size: 16px;
}
</style>
