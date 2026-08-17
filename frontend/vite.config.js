import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// GitHub Pages 路径处理：
// - 本地构建（无 GITHUB_REPOSITORY 变量）用相对路径 './'，本地预览正常；
// - CI 中自动推导：仓库名为 <user>.github.io 的 User/Org 页 → base '/'
//   其余 Project 页 → base '/<仓库名>/'。
// 同时 vue-router 用 createWebHistory(import.meta.env.BASE_URL) 跟随此 base。
const repo = process.env.GITHUB_REPOSITORY
  ? process.env.GITHUB_REPOSITORY.split('/')[1]
  : ''
const base = repo
  ? repo.endsWith('.github.io')
    ? '/'
    : `/${repo}/`
  : './'

export default defineConfig({
  base,
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
        additionalData: `@use "@/styles/variables.scss" as *;`
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          element: ['element-plus', '@element-plus/icons-vue']
        }
      }
    }
  }
})
