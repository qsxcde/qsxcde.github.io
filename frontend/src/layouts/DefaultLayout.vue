<template>
  <div class="app-wrapper">
    <site-nav />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import SiteNav from '@/components/layout/SiteNav.vue'
</script>

<style lang="scss" scoped>
.app-wrapper {
  min-height: 100vh;
  background-color: $color-bg;
}

.main-content {
  padding-top: 24px;
  padding-bottom: 64px;
}
</style>
