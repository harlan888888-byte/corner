<template>
  <div class="plan-tab-container">
    <div class="tab-top-item">
      <h1>计划</h1>
    </div>

    <div class="plan-content">
      <div class="city-selector">
        <button
          class="select-city-btn"
          @click="showCityPicker = !showCityPicker"
        >
          {{ selectedCity ? selectedCity.name : '选择城市' }}
        </button>

        <div v-if="showCityPicker" class="city-picker-modal">
          <CityPicker @select="handleCitySelect" />
        </div>
      </div>

      <div class="plan-info">
        <h2>计划-开发中...</h2>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CityPicker from '@/components/business/CityPicker.vue'

// 城市选择相关状态
const showCityPicker = ref(false)
const selectedCity = ref(null)

// 处理城市选择
const handleCitySelect = (city) => {
  selectedCity.value = city
  // 选择城市后自动关闭模态框
  showCityPicker.value = false
}
</script>

<style scoped>
.plan-tab-container {
  background-color: #f6f6f6;
  min-height: 100vh;
}

.tab-top-item {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to right, #4fc08d, #38a169);
  padding: 10px;
  margin-bottom: 5px;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  color: white;
}

.tab-top-item h1 {
  font-size: 24px;
  margin: 0;
}

.plan-content {
  padding: 20px;
}

.city-selector {
  position: relative;
  margin-bottom: 20px;
}

.select-city-btn {
  width: 100%;
  padding: 12px;
  background-color: white;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 16px;
  color: #333;
  cursor: pointer;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.select-city-btn::after {
  content: '▼';
  font-size: 12px;
  color: #999;
}

.city-picker-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  z-index: 2000;
}

.city-picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  border-bottom: 1px solid #e5e5e5;
  background-color: white;
  position: sticky;
  top: 0;
  z-index: 10;
}

.city-picker-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.close-btn,
.confirm-btn {
  border: none;
  background: transparent;
  font-size: 14px;
  color: #4fc08d;
  cursor: pointer;
  padding: 0 10px;
}

.selected-city {
  margin-bottom: 20px;
  padding: 10px;
  background-color: rgba(79, 192, 141, 0.1);
  border-radius: 8px;
  font-size: 14px;
  color: #38a169;
}

.plan-info {
  text-align: center;
  padding: 40px 0;
}

.plan-info h2 {
  font-size: 20px;
  color: #999;
  margin: 0;
}
</style>
