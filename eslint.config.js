// eslint.config.js - Vue3 + TS/JS 通用默认配置
import vueParser from 'vue-eslint-parser';
import pluginVue from 'eslint-plugin-vue';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import pluginPrettier from 'eslint-plugin-prettier';
import globals from 'globals';
import { defineConfig } from 'eslint'
import autoImport from 'unplugin-auto-import/eslint'

// 调试：打印解析器是否存在
console.log('eslint-plugin-vue 插件是否加载成功：', !!pluginVue);
console.log('插件完整内容（简化）：', Object.keys(pluginVue));

// 关闭与 Prettier 冲突的 ESLint 原生规则
const disablePrettierConflicts = {
  'arrow-body-style': 'off',
  'prefer-arrow-callback': 'off',
  'no-tabs': 'off',
  'indent': 'off',
  'max-len': 'off',
  'no-mixed-spaces-and-tabs': 'off',
  'quotes': 'off',
  'semi': 'off',
  'comma-dangle': 'off',
  'space-before-function-paren': 'off'
};

// 基础通用规则（适用于所有文件）
const baseRules = {
  ...disablePrettierConflicts,
  'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  'no-unused-vars': 'warn', // 未使用变量警告
  'no-undef': 'error', // 未定义变量报错
  'no-empty': 'warn', // 空代码块警告
  'no-extra-semi': 'warn', // 多余分号警告
  'eqeqeq': ['error', 'always'], // 强制使用 === 而非 ==
  'curly': ['error', 'all'], // 强制所有条件语句加花括号
  'no-var': 'error' // 禁止使用 var，强制 let/const
};

// Vue3 核心规则（精简版，保留关键规范）
const vueCoreRules = {
  'vue/no-dupe-keys': 'error',
  'vue/no-duplicate-attributes': 'error',
  'vue/no-unused-components': 'warn',
  'vue/no-unused-vars': 'error',
  'vue/require-v-for-key': 'error',
  'vue/valid-template-root': 'error',
  'vue/valid-v-for': 'error',
  'vue/valid-v-model': 'error',
  'vue/valid-v-bind': 'error',
  'vue/valid-v-on': 'error',
  'vue/multi-word-component-names': ['error', { ignores: ['index'] }], // 组件名多单词（忽略index）
  'vue/no-setup-props-destructure': 'off', // 允许props解构
  'vue/script-setup-uses-vars': 'off' // 兼容新版 Vue 规则
};

// TS 核心规则（精简版）
const tsCoreRules = {
  '@typescript-eslint/no-explicit-any': 'warn', // any 类型警告
  '@typescript-eslint/explicit-module-boundary-types': 'off', // 关闭函数返回值类型强制声明
  '@typescript-eslint/no-unused-vars': 'warn' // TS 未使用变量警告
};

// Prettier 格式化默认规则
const prettierDefaultRules = {
  'prettier/prettier': [
    'warn',
    {
      singleQuote: true, // 单引号
      semi: false, // 无分号
      tabWidth: 2, // 缩进2空格
      trailingComma: 'none', // 无尾逗号
      printWidth: 80, // 每行最多80字符
      endOfLine: 'auto', // 换行符自动适配
      vueIndentScriptAndStyle: false, // 不缩进Vue的script/style
      bracketSameLine: false,
      htmlAttributeWrap: 'force',
      htmlWhitespaceSensitivity: 'ignore',
      // 可选：强制所有标签属性每行一个
      attributeGroups: ['*']
    }
  ]
};

// 最终导出配置
export default [
  // 配置 unplugin-auto-import/eslint 插件，识别自动导入的变量
  autoImport({
    imports: ['vue', 'vue-router', 'pinia'],
  }),
  // 1. 忽略无需检测的文件/目录
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      'coverage/',
      'public/',
      '*.config.js', // 忽略配置文件（如vite.config.js）
      '*.config.ts'
    ]
  },

  // 2. 基础配置（所有文件通用）
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx', '**/*.vue'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2025,
        // Vue 全局变量
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        withDefaults: 'readonly'
      },
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    rules: { ...baseRules }
  },

  // 3. Vue 文件专属配置（解决解析问题）
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser, // 解析Vue中的TS
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
        vueFeatures: {
          setupScript: true,
          propsDestructure: true
        }
      }
    },
    plugins: {
      vue: pluginVue,
      prettier: pluginPrettier
    },
    rules: { ...vueCoreRules, ...prettierDefaultRules },
    settings: {
      vue: {
        version: '3.4' // 适配Vue3最新版本，可根据项目修改
      }
    }
  },

  // 4. TS/JS 文件专属配置
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: pluginPrettier
    },
    rules: { ...tsCoreRules, ...prettierDefaultRules }
  },

  // 5. 纯JS文件专属配置
  {
    files: ['**/*.js', '**/*.jsx'],
    plugins: {
      prettier: pluginPrettier
    },
    rules: { ...prettierDefaultRules }
  }
];
