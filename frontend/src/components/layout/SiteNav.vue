<template>
  <header class="site-nav">
    <div class="nav-inner page-container">
      <router-link to="/" class="brand">
        <div class="brand-logo">
          <span>{{ site.brand }}</span>
        </div>
        <span class="brand-name">{{ site.name }}</span>
      </router-link>

      <nav class="nav-menu">
        <router-link
          v-for="item in navMenus"
          :key="item.path"
          :to="item.path"
          class="nav-link"
          :class="{ active: $route.path === item.path }"
        >
          {{ item.label }}
        </router-link>
      </nav>

      <div class="nav-actions">
        <el-input
          v-if="searchVisible"
          v-model="searchKeyword"
          class="search-input"
          placeholder="搜索文章..."
          size="small"
          clearable
          @blur="searchVisible = false"
          @keyup.enter="handleSearch"
        />
        <el-button
          v-else
          class="icon-btn"
          text
          :icon="Search"
          @click="searchVisible = true"
        />
        <el-button
          class="icon-btn"
          text
          :icon="isDark ? Sunny : Moon"
          @click="toggleTheme"
        />
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, Moon, Sunny } from '@element-plus/icons-vue'
import { site, navMenus } from '@/config'

const route = useRoute()
const router = useRouter()

const searchVisible = ref(false)
const searchKeyword = ref('')
const isDark = ref(false)

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({ path: '/', query: { q: searchKeyword.value.trim() } })
    searchVisible.value = false
  }
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}
</script>

<style lang="scss" scoped>
.site-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: rgba($color-bg, 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid $color-border;
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;

  &-logo {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background-color: $color-logo;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 18px;
    font-weight: 700;
  }

  &-name {
    font-size: 20px;
    font-weight: 700;
    color: $color-primary;
    font-family: $font-serif;
  }
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 28px;

  @media (max-width: 768px) {
    display: none;
  }
}

.nav-link {
  font-size: 15px;
  font-weight: 500;
  color: $color-secondary;
  transition: color 0.2s ease;
  position: relative;

  &:hover {
    color: $color-accent;
  }

  &.active {
    color: $color-accent;
    font-weight: 600;

    &::after {
      content: '';
      position: absolute;
      bottom: -6px;
      left: 0;
      right: 0;
      height: 2px;
      background-color: $color-accent;
      border-radius: 1px;
    }
  }
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;

  .icon-btn {
    color: $color-secondary;
    font-size: 18px;

    &:hover {
      color: $color-accent;
    }
  }

  .search-input {
    width: 180px;

    :deep(.el-input__wrapper) {
      border-radius: $radius-pill;
    }
  }
}
</style>
