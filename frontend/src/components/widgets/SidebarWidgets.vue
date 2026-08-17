<template>
  <aside class="sidebar">
    <!-- 分类 -->
    <section class="widget">
      <h4 class="widget-title">分类</h4>
      <ul class="category-list">
        <li v-for="cat in categories" :key="cat.name">
          <router-link :to="`/tags?category=${cat.name}`" class="category-item">
            <span>{{ cat.name }}</span>
            <span class="count">· {{ cat.count }}</span>
          </router-link>
        </li>
      </ul>
    </section>
  </aside>
</template>

<script setup>
import { categories } from '@/data/posts'
</script>

<style lang="scss" scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.category-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: $color-secondary;
  transition: color 0.2s ease;

  &:hover {
    color: $color-accent;
  }

  .count {
    color: $color-muted;
  }
}
</style>
