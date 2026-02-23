<template>
  <div class="home-tab-container">
    <div class="tab-top-item">
      <div class="top-item">
        <div class="title-item">
          <h1>街角</h1>
        </div>

        <div class="city-selector">
          <button
            class="select-city-btn"
            @click="showCityPicker = !showCityPicker"
          >
            {{ selectedCity ? selectedCity.name : '选择城市' }}
          </button>

          <CityPicker
            v-if="showCityPicker"
            @select="handleCitySelect"
            @close="showCityPicker = false"
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

    <!-- 无数据时显示空状态图片 -->
    <EmptyState v-if="!btnLoading && storeInfoList.length === 0" />

    <ul v-else ref="storeList">
      <StoreItem v-for="item in storeInfoList" :key="item.id" :item="item" />
      <!-- 使用封装的 LoadMore 组件，放在 ul 内部作为最后一个子元素，只有当数据不为空时才显示 -->
      <li v-if="storeInfoList.length > 0" class="load-more-item">
        <LoadMore
          :loading="btnLoading"
          :hasMore="hasMoreData"
          :loadingText="loadingText"
          :noMoreText="noMoreText"
        />
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getStoreInfo } from '@/api/home/store'
import StoreItem from '@/components/business/StoreItem.vue'
import LoadMore from '@/components/base/LoadMore.vue'
import SearchBar from '@/components/base/SearchBar.vue'
import CityPicker from '@/components/business/CityPicker.vue'
import EmptyState from '@/components/base/EmptyState.vue'

// 加载状态
const btnLoading = ref(false)
const btnLoadingText = ref('正在加载...')

// 加载更多组件的文本
const loadingText = ref('加载中...')
const noMoreText = ref('滑到底啦！暂无更多数据~')

// 搜索相关
const searchValue = ref('')

// 数据列表
const storeInfoList = ref([])

// 搜索事件处理
const onSearch = (val) => {
  searchValue.value = val
  // 重置分页，重新获取数据
  resetPaginationAndFetchData()
}

// 搜索输入事件处理
const handleInput = (val) => {
  searchValue.value = val
}

// ul 元素的引用
const storeList = ref(null)

// 城市选择相关状态
const showCityPicker = ref(false)
const selectedCity = ref(null)

// 初始化城市选择
const initSelectedCity = () => {
  const city = localStorage.getItem('selectedCity')
  if (city) {
    selectedCity.value = JSON.parse(city)
  }
}

// 保存城市选择
const saveSelectedCity = (city) => {
  if (city && city.name !== '所有城市') {
    localStorage.setItem('selectedCity', JSON.stringify(city))
  } else {
    localStorage.removeItem('selectedCity')
  }
}

// 初始化城市选择
initSelectedCity()

// 处理城市选择
const handleCitySelect = (city) => {
  if (city.name === '所有城市') {
    selectedCity.value = null
  } else {
    selectedCity.value = city
  }
  // 保存城市选择
  saveSelectedCity(selectedCity.value)
  // 选择城市后自动关闭模态框
  showCityPicker.value = false
  // 重置分页，重新获取数据
  resetPaginationAndFetchData()
}

// 重置分页并重新获取数据
const resetPaginationAndFetchData = () => {
  currentPage.value = 1
  hasMoreData.value = true
  storeInfoList.value = []
  getStoreInfoList()
}

// 分页相关状态
const currentPage = ref(1)
const pageSize = ref(8)
const hasMoreData = ref(true)
const total = ref(0)

const getStoreInfoList = async () => {
  // 已无更多数据或正在加载中，不再请求
  if (!hasMoreData.value || btnLoading.value) {
    return
  }

  btnLoading.value = true
  try {
    // 构建请求参数
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchValue.value
    }

    // 如果选择了城市且不是"所有城市"，添加城市参数
    if (selectedCity.value && selectedCity.value.name !== '所有城市') {
      params.city = selectedCity.value.name
    }

    const res = await getStoreInfo(params)

    // 响应拦截器返回的是整个响应对象，所以需要使用 res.data
    if (res.data.code === 200) {
      // 第一页数据直接替换，后续页面数据追加
      if (currentPage.value === 1) {
        storeInfoList.value = res.data.data
      } else {
        storeInfoList.value = [...storeInfoList.value, ...res.data.data]
      }
      total.value = res.data.count
      // 判断是否还有更多数据
      hasMoreData.value = storeInfoList.value.length < total.value
      // 页码自增
      currentPage.value++
    }
  } catch (error) {
    console.error('获取店铺信息失败:', error)
  } finally {
    btnLoading.value = false
  }
}

// 滚动事件处理函数
const handleScroll = (event) => {
  // 确定滚动容器
  const target = event.target === window ? window : event.target
  const scrollTop =
    target.scrollTop ||
    document.documentElement.scrollTop ||
    document.body.scrollTop
  const scrollHeight =
    target.scrollHeight ||
    document.documentElement.scrollHeight ||
    document.body.scrollHeight
  const clientHeight =
    target.clientHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight

  // 检测滚动到底部
  if (scrollTop + clientHeight >= scrollHeight - 30) {
    getStoreInfoList()
  }
}

// 滚动容器引用
const scrollContainer = ref(null)

// 组件挂载时添加滚动事件监听
onMounted(() => {
  getStoreInfoList()

  // 查找父级的 .page-container 滚动容器
  setTimeout(() => {
    let container = storeList.value
    while (container && !container.classList.contains('page-container')) {
      container = container.parentElement
    }

    if (container) {
      scrollContainer.value = container
      container.addEventListener('scroll', handleScroll)
    }
  }, 100)
})

// 组件卸载时移除滚动事件监听
onUnmounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', handleScroll)
  }
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>
.home-tab-container {
  background-color: #f6f6f6;
  min-height: 100vh;

  ul {
    padding: 0 5px;
  }
}

.tab-top-item {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to right, #673ab7, #d154ff);
  padding: 10px;
  margin-bottom: 5px;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加阴影，提升视觉效果 */
  box-sizing: border-box; /* 确保 padding 不会影响宽度 */
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

.load-more-item {
  display: flex;
  justify-content: center;
}

/* 空状态样式 */
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
