// postcss.config.js (ES模块版本)
export default {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: [
        'last 2 versions',
        '> 1%',
        'iOS >= 8',
        'Android >= 4.4'
      ]
    },
    'postcss-preset-env': {
      stage: 3,
      features: {
        'nesting-rules': true
      }
    },
    // 其他插件配置保持不变
    'postcss-px-to-viewport': {
      viewportWidth: 375,
      unitPrecision: 5,
      viewportUnit: 'vw',
      selectorBlackList: ['ignore-'],
      minPixelValue: 1,
      mediaQuery: false
    }
  }
}
