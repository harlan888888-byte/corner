<template>
  <!-- 类型选择组件 -->
  <div class="category-selector">
    <!-- 头部：显示当前选中的类型 + 展开/收起按钮 -->
    <div class="selector-header" @click="toggleExpand">
      <div class="selected-category">
        <span class="label">类型：</span>
        <span
          class="value"
          :style="{
            backgroundColor: selectedCategoryColor.backgroundColor,
            color: selectedCategoryColor.color
          }"
          >{{ selectedCategory || '全部' }}</span
        >
      </div>
      <div class="expand-btn">
        <span class="expand-icon">{{ isExpanded ? '▲' : '▼' }}</span>
      </div>
    </div>

    <!-- 类型列表容器 -->
    <div class="category-list-container" :class="{ expanded: isExpanded }">
      <!-- 多行网格显示 -->
      <div class="category-grid">
        <button
          v-for="category in categories"
          :key="category"
          class="category-item"
          :class="{ active: selectedCategory === category }"
          :style="
            selectedCategory === category ? getCategoryColor(category) : {}
          "
          @click="handleCategoryClick(category)"
        >
          {{ category }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { homeCategories, getCategoryColor } from '@/data/categories'

// 定义 props
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  categories: {
    type: Array,
    default: () => homeCategories
  }
})

// 定义 emit
const emit = defineEmits(['update:modelValue'])

// 展开状态
const isExpanded = ref(false)

// 当前选中的类型（内部状态）
const selectedCategory = ref(props.modelValue)

// 获取选中分类的颜色
const selectedCategoryColor = computed(() => {
  if (!selectedCategory.value || selectedCategory.value === '全部') {
    return { backgroundColor: '#f3e5f5', color: '#673ab7' }
  }
  return getCategoryColor(selectedCategory.value)
})

// 从 localStorage 加载保存的类型
const loadSavedCategory = () => {
  try {
    const saved = localStorage.getItem('selectedCategory')
    if (saved) {
      selectedCategory.value = saved
      emit('update:modelValue', saved)
    }
  } catch (error) {
    console.error('加载保存的类型失败：', error)
  }
}

// 保存类型到 localStorage
const saveCategory = (category) => {
  try {
    if (category) {
      localStorage.setItem('selectedCategory', category)
    } else {
      localStorage.removeItem('selectedCategory')
    }
  } catch (error) {
    console.error('保存类型失败：', error)
  }
}

// 监听外部值变化
watch(
  () => props.modelValue,
  (newValue) => {
    selectedCategory.value = newValue
  }
)

// 组件挂载时加载保存的类型
onMounted(() => {
  // 如果外部没有传入值，则从 localStorage 加载
  if (!props.modelValue) {
    loadSavedCategory()
  }
})

// 切换展开/收起
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

// 处理类型点击
const handleCategoryClick = (category) => {
  if (category === '全部') {
    // 点击"全部"，取消选择
    selectedCategory.value = ''
    saveCategory('')
    emit('update:modelValue', '')
  } else if (selectedCategory.value === category) {
    // 再次点击已选中的类型，取消选择（相当于选择全部）
    selectedCategory.value = ''
    saveCategory('')
    emit('update:modelValue', '')
  } else {
    // 选择新类型
    selectedCategory.value = category
    saveCategory(category)
    emit('update:modelValue', category)
  }
  // 点击分类后收起下拉框
  isExpanded.value = false
}
</script>

<style lang="scss" scoped>
.category-selector {
  background-color: white;
  margin-bottom: 5px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  cursor: pointer;
  background-color: white;
  border-bottom: 1px solid #f0f0f0;

  .selected-category {
    display: flex;
    align-items: center;
    gap: 8px;

    .label {
      font-size: 14px;
      color: #666;
    }

    .value {
      font-size: 14px;
      font-weight: 500;
      color: #673ab7;
      background-color: #f3e5f5;
      padding: 4px 12px;
      border-radius: 20px;
    }
  }

  .expand-btn {
    .expand-icon {
      font-size: 12px;
      color: #999;
      transition: transform 0.3s ease;
    }
  }
}

.category-list-container {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;

  &.expanded {
    max-height: 200px;
    overflow-y: auto;
  }
}

/* 多行网格布局 */
.category-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 12px 15px;

  .category-item {
    flex: 0 0 auto;
    min-width: 70px;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    background-color: #f5f5f5;
    color: #666;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;

    &.active {
      font-weight: 500;
    }

    &:hover {
      background-color: #e8e8e8;

      &.active {
        opacity: 0.9;
      }
    }
  }
}
</style>
