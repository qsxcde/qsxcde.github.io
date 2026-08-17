<template>
  <article class="article-card" :class="{ compact }" @click="goDetail">
    <div class="body">
      <h3 class="title">{{ post.title }}</h3>
      <p class="excerpt">{{ post.excerpt }}</p>
      <div class="meta">
        <span class="date">{{ post.date }}</span>
        <router-link
          :to="`/tags?active=${post.tag}`"
          class="tag"
          @click.stop
        >
          # {{ post.tag }}
        </router-link>
      </div>
    </div>
  </article>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  compact: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
function goDetail() {
  router.push(`/post/${props.post.id}`)
}
</script>

<style lang="scss" scoped>
.article-card {
  padding: 18px;
  background-color: $color-card;
  border-radius: $radius-lg;
  border: 1px solid $color-border;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-card;
  }

  // 紧凑模式：用于单屏首页，使每屏可容纳 5 张卡片
  &.compact {
    padding: 14px;

    .title {
      font-size: 16px;
    }

    .excerpt {
      font-size: 12px;
      line-height: 1.6;
    }
  }
}

.body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.title {
  font-size: 18px;
  font-weight: 700;
  color: $color-primary;
  font-family: $font-serif;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 17px;
  }
}

.excerpt {
  font-size: 13px;
  line-height: 1.7;
  color: $color-secondary;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: auto;

  .date {
    font-size: 12px;
    color: $color-muted;
  }

  .tag {
    font-size: 12px;
    font-weight: 500;
    color: $color-accent;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
