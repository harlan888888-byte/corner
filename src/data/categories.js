// 店铺分类配置 - 包含名称和颜色
// 使用数组统一管理，避免冗余
const categories = [
  { name: '美食', backgroundColor: '#fff3e0', color: '#e65100' },
  { name: '风景', backgroundColor: '#e3f2fd', color: '#1565c0' },
  { name: '露营', backgroundColor: '#dcedc8', color: '#33691e' },
  { name: '兜风', backgroundColor: '#e3f2fd', color: '#0288d1' },
  { name: '商场', backgroundColor: '#f3e5f5', color: '#7b1fa2' },
  { name: '娱乐', backgroundColor: '#fff8e1', color: '#f57c00' },
  { name: '文化', backgroundColor: '#e0f2f1', color: '#00695c' },
  { name: '酒店', backgroundColor: '#e3f2fd', color: '#0d47a1' },
  { name: '出片', backgroundColor: '#fce4ec', color: '#c2185b' }
]

// 店铺分类列表 - 用于首页搜索和编辑窗口
export const storeCategories = categories.map((cat) => cat.name)

// 首页分类（包含"全部"选项）
export const homeCategories = ['全部', ...storeCategories]

// 默认颜色
const defaultColor = { backgroundColor: '#e8f5e9', color: '#2e7d32' }

// 获取分类颜色
export const getCategoryColor = (categoryName) => {
  if (!categoryName || typeof categoryName !== 'string') {
    return defaultColor
  }

  // 移除前后空格
  const trimmedName = categoryName.trim()

  // 精确匹配
  const matched = categories.find((cat) => cat.name === trimmedName)
  if (matched) {
    return { backgroundColor: matched.backgroundColor, color: matched.color }
  }

  // 默认颜色
  return defaultColor
}

export default categories
