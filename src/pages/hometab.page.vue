<template>
  <!-- 首页选项卡组件 -->
  <div class="home-tab-container">
    <div class="tab-top-item">
      <div class="top-item">
        <div class="title-item">
          <h1>街角</h1>
        </div>
        <div class="city-selector">
          <button class="select-city-btn" @click="showCityPicker = true">
            {{ selectedCity ? selectedCity.name : '选择城市' }}
          </button>

          <CityPicker
            v-if="showCityPicker"
            @select="handleCitySelect"
            @close="closeCityPicker"
          />
        </div>
      </div>
      <SearchBar
        placeholder="请输入店名关键词"
        :value="searchValue"
        @input="handleInput"
        @search="onSearch"
      />
    </div>

    <LoadingToast v-if="btnLoading" :text="btnLoadingText" />
    <EmptyState v-if="!btnLoading && storeInfoList.length === 0" />

    <StoreList
      v-else
      :storeList="storeInfoList"
      :loading="btnLoading"
      :hasMore="hasMoreData"
      :loadingText="loadingText"
      :noMoreText="noMoreText"
      @loadMore="getStoreInfoList"
    >
      <template #default="{ item }">
        <StoreItem :item="item" />
      </template>
    </StoreList>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getStoreInfo } from '@/api/home/store'
import { useBackButton } from '@/utils/hooks/useBackButton'
import CityPicker from '@/components/business/CityPicker.vue'
import SearchBar from '@/components/base/SearchBar.vue'
import LoadingToast from '@/components/base/LoadingToast.vue'
import EmptyState from '@/components/base/EmptyState.vue'
import StoreList from '@/components/business/StoreList.vue'
import StoreItem from '@/components/page/home/StoreItem.vue'

const route = useRoute()
const router = useRouter()

// ========== 1. 核心变量（无报错） ==========
const showCityPicker = ref(false)
const selectedCity = ref(null)

// 使用回退功能 hook
const {
  pushHistory,
  popHistory,
  resetHistoryCount,
  getAddedHistoryCount,
  handlePopState,
  pushDialog,
  dialogStackStore,
  resetRouteState
} = useBackButton()

// 保存事件监听器引用
const popStateHandler = handlePopState(router, route)

// 加载/分页/搜索相关
const btnLoading = ref(false)
const btnLoadingText = ref('正在加载...')
const loadingText = ref('加载中...')
const noMoreText = ref('滑到底啦！暂无更多数据~')
const searchValue = ref('')
const storeInfoList = ref([])
const currentPage = ref(1)
const pageSize = ref(8)
const hasMoreData = ref(true)
const total = ref(0)
const storeid = ref(route.query.storeid || '')
const showEnterAnimation = ref(false)
const isMounted = ref(false)

// ========== 2. 使用路由参数管理历史记录 ==========
// 历史记录管理功能已封装到 historyStack store 中

// 关闭城市选择器
const closeCityPicker = () => {
  popHistory(router, route)
}

// 监听城市选择器的显示状态
watch(showCityPicker, (newValue) => {
  if (newValue) {
    pushHistory(router, route) // 当城市选择器打开时，添加历史记录
    // 使用 useBackButton 提供的 pushDialog 方法
    pushDialog(route, () => {
      showCityPicker.value = false
    })
  }
})

// ========== 4. 业务逻辑（修复DOM/API请求异常） ==========
// 初始化城市选择
const initSelectedCity = () => {
  try {
    const city = localStorage.getItem('selectedCity')
    if (city) {
      selectedCity.value = JSON.parse(city)
    }
  } catch (error) {
    console.error('初始化城市失败：', error)
    selectedCity.value = null // 兜底
  }
}

// 保存城市选择
const saveSelectedCity = (city) => {
  try {
    if (city && city.name !== '所有城市') {
      localStorage.setItem('selectedCity', JSON.stringify(city))
    } else {
      localStorage.removeItem('selectedCity')
    }
  } catch (error) {
    console.error('保存城市失败：', error)
  }
}

// 处理城市选择
const handleCitySelect = (city) => {
  try {
    if (city.name === '所有城市') {
      selectedCity.value = null
    } else {
      selectedCity.value = city
    }
    saveSelectedCity(selectedCity.value)
    closeCityPicker()
    resetPaginationAndFetchData()
  } catch (error) {
    console.error('选择城市失败：', error)
  }
}

// 搜索事件
const onSearch = (val) => {
  searchValue.value = val
  resetPaginationAndFetchData()
}

// 搜索输入
const handleInput = (val) => {
  searchValue.value = val
}

// 关闭店铺详情（修复路由跳转异常）
const closeStoreDetail = async () => {
  try {
    // 修复3：路由跳转用await，确保完成后再执行其他操作
    await router.push({
      path: '/hometab',
      query: {}
    })
  } catch (error) {
    console.error('关闭店铺详情跳转失败：', error)
  }
}

// 重置分页（修复DOM操作异常）
const resetPaginationAndFetchData = () => {
  try {
    currentPage.value = 1
    hasMoreData.value = true
    storeInfoList.value = []
    getStoreInfoList()

    // 修复4：DOM元素可能找不到，先判断再操作
    const scrollContainer = document.querySelector('.page-container')
    if (scrollContainer) {
      scrollContainer.scrollTop = 0
    }
  } catch (error) {
    console.error('重置分页失败：', error)
  }
}

// 获取店铺列表（修复API请求异常）
const getStoreInfoList = async () => {
  if (!hasMoreData.value || btnLoading.value) return

  btnLoading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchValue.value
    }

    if (selectedCity.value && selectedCity.value.name !== '所有城市') {
      params.city = selectedCity.value.name
    }

    const res = await getStoreInfo(params)
    // 修复5：API返回可能异常，逐层判断
    if (res && res.data && res.data.code === 200) {
      if (currentPage.value === 1) {
        storeInfoList.value = res.data.data || []
      } else {
        storeInfoList.value = [...storeInfoList.value, ...(res.data.data || [])]
      }
      total.value = res.data.count || 0
      hasMoreData.value = storeInfoList.value.length < total.value
      currentPage.value++
    }
  } catch (error) {
    console.error('获取店铺列表失败：', error)
    hasMoreData.value = false // 兜底
  } finally {
    btnLoading.value = false
  }
}

// ========== 5. 生命周期（使用Vue Router控制后退事件） ==========
onMounted(() => {
  try {
    isMounted.value = true
    initSelectedCity()
    getStoreInfoList()

    // 添加后退按钮事件监听器
    window.addEventListener('popstate', popStateHandler)
  } catch (error) {
    console.error('组件挂载失败：', error)
  }
})

// 监听路由变化，当路由切换到当前组件时重置状态
watch(
  () => route.path,
  (newPath, oldPath) => {
    const currentRouteKey = route.name || route.path || 'default'
    const isCurrentRoute = currentRouteKey.includes('/hometab')

    if (isCurrentRoute) {
      // 重置当前路由的状态
      resetRouteState(currentRouteKey)
    }
  }
)

// 卸载时移除事件监听器
onUnmounted(() => {
  try {
    // 移除事件监听器
    window.removeEventListener('popstate', popStateHandler)
    // 清理新增的历史记录
    while (getAddedHistoryCount() > 0) {
      popHistory(router, route)
    }
    // 重置历史记录计数
    resetHistoryCount()
  } catch (error) {
    console.error('组件卸载失败：', error)
  }
})
</script>

<style lang="scss" scoped>
/* 样式不变，省略 */
.home-tab-container {
  background-color: #f6f6f6;
  min-height: 100vh;
  min-height: 100vh;
}

.tab-top-item {
  position: sticky;
  top: 0;
  left: 0;
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to right, #673ab7, #d154ff);
  background: linear-gradient(to right, #673ab7, #d154ff);
  padding: 10px;
  margin-bottom: 5px;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  color: white;

  .top-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .select-city-btn {
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 4px;
  }

  h1 {
    font-size: 24px;
    margin-bottom: 8px;
  }
  h1 {
    font-size: 24px;
    margin-bottom: 8px;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 20px;
  text-align: center;
}

.empty-state-img {
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
}

.empty-state-text {
  font-size: 16px;
  color: #999;
  margin: 0;
}
</style>
