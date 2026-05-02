// 分类颜色配置
// 根据分类名称返回对应的背景色和文字色

// 定义各类别的颜色配置
const categoryColors = {
  // 美食类
  美食: {
    backgroundColor: '#fff3e0',
    color: '#e65100'
  },
  餐厅: {
    backgroundColor: '#fff3e0',
    color: '#e65100'
  },
  小吃: {
    backgroundColor: '#fff3e0',
    color: '#e65100'
  },
  火锅: {
    backgroundColor: '#ffebee',
    color: '#c62828'
  },
  烧烤: {
    backgroundColor: '#fff3e0',
    color: '#e65100'
  },

  // 风景类
  风景: {
    backgroundColor: '#e3f2fd',
    color: '#1565c0'
  },
  景点: {
    backgroundColor: '#e3f2fd',
    color: '#1565c0'
  },
  旅游: {
    backgroundColor: '#e3f2fd',
    color: '#1565c0'
  },
  公园: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32'
  },
  自然: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32'
  },
  露营: {
    backgroundColor: '#dcedc8',
    color: '#33691e'
  },
  兜风: {
    backgroundColor: '#e3f2fd',
    color: '#0288d1'
  },
  出片: {
    backgroundColor: '#fce4ec',
    color: '#c2185b'
  },

  // 购物类
  购物: {
    backgroundColor: '#f3e5f5',
    color: '#7b1fa2'
  },
  商场: {
    backgroundColor: '#f3e5f5',
    color: '#7b1fa2'
  },
  超市: {
    backgroundColor: '#f3e5f5',
    color: '#7b1fa2'
  },

  // 娱乐类
  娱乐: {
    backgroundColor: '#fff8e1',
    color: '#f57c00'
  },
  电影: {
    backgroundColor: '#e0e0e0',
    color: '#424242'
  },
  KTV: {
    backgroundColor: '#fce4ec',
    color: '#c2185b'
  },

  // 文化类
  文化: {
    backgroundColor: '#e0f2f1',
    color: '#00695c'
  },
  博物馆: {
    backgroundColor: '#e0f2f1',
    color: '#00695c'
  },
  艺术: {
    backgroundColor: '#fce4ec',
    color: '#880e4f'
  },

  // 酒店类
  酒店: {
    backgroundColor: '#e3f2fd',
    color: '#0d47a1'
  },
  住宿: {
    backgroundColor: '#e3f2fd',
    color: '#0d47a1'
  },

  // 默认颜色
  default: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32'
  }
}

// 获取分类颜色
export const getCategoryColor = (categoryName) => {
  if (!categoryName || typeof categoryName !== 'string') {
    return categoryColors['default']
  }

  // 移除前后空格
  const trimmedName = categoryName.trim()

  // 精确匹配
  if (categoryColors[trimmedName]) {
    return categoryColors[trimmedName]
  }

  // 模糊匹配（包含关键词）
  for (const [key, value] of Object.entries(categoryColors)) {
    if (key !== 'default' && trimmedName.includes(key)) {
      return value
    }
  }

  // 默认颜色
  return categoryColors['default']
}

export default categoryColors
