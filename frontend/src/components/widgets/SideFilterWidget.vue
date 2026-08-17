<template>
  <section class="widget">
    <h4 class="widget-title">{{ title }}</h4>
    <ul class="filter-list">
      <li v-for="item in items" :key="String(item.key)">
        <button
          class="filter-item"
          type="button"
          :class="{ active: modelValue === item.key }"
          @click="$emit('select', item.key)"
        >
          <span>{{ item.label }}</span>
          <span class="filter-count">· {{ item.count }} 篇</span>
        </button>
      </li>
    </ul>
  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  // 每一项：{ key, label, count }
  items: {
    type: Array,
    required: true
  },
  // 当前选中项的 key（用于高亮）
  modelValue: {
    default: null
  }
})

defineEmits(['select'])
</script>

<style lang="scss" scoped>
.filter-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filter-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  font-size: 13px;
  font-family: $font-sans;
  color: $color-secondary;
  transition: color 0.2s ease;

  .filter-count {
    color: $color-muted;
  }

  &:hover {
    color: $color-accent;
  }

  &.active {
    color: $color-accent;
    font-weight: 600;
  }
}
</style>
