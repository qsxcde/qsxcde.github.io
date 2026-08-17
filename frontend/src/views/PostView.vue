<template>
  <div class="post-view">
    <div class="page-container">
      <!-- 文章不存在 -->
      <div v-if="!post" class="not-found">
        <p>这篇文章不存在或已被移除。</p>
        <router-link to="/" class="back-link">返回首页</router-link>
      </div>

      <!-- 文章正文 -->
      <article v-else class="post-detail">
        <router-link to="/" class="back-link">← 返回列表</router-link>

        <header class="post-header">
          <h1 class="post-title">{{ post.title }}</h1>
          <div class="post-meta">
            <span class="date">{{ post.date }}</span>
            <span class="dot">·</span>
            <span class="views">{{ formatViews(post.views) }} 阅读</span>
            <span class="dot">·</span>
            <router-link :to="`/tags?active=${post.tag}`" class="tag"># {{ post.tag }}</router-link>
          </div>
        </header>

        <!-- 正文：v-html 渲染 posts.js 中的 HTML 字符串 -->
        <div class="post-content" v-html="post.content"></div>

        <footer class="post-footer">
          <router-link
            v-if="adjacent.prev"
            :to="`/post/${adjacent.prev.id}`"
            class="nav-post prev"
          >
            <span class="nav-label">← 上一篇</span>
            <span class="nav-title">{{ adjacent.prev.title }}</span>
          </router-link>
          <span v-else class="nav-post placeholder"></span>

          <router-link
            v-if="adjacent.next"
            :to="`/post/${adjacent.next.id}`"
            class="nav-post next"
          >
            <span class="nav-label">下一篇 →</span>
            <span class="nav-title">{{ adjacent.next.title }}</span>
          </router-link>
          <span v-else class="nav-post placeholder"></span>
        </footer>
      </article>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getPostById, getAdjacentPosts, formatViews } from '@/data/posts'

const route = useRoute()

const post = computed(() => getPostById(route.params.id))
const adjacent = computed(() => getAdjacentPosts(route.params.id))
</script>

<style lang="scss" scoped>
.post-view {
  // 正文页为阅读场景，允许正常滚动（不套用首页的单屏缩放）
  min-height: calc(100vh - 152px);
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;

  @media (max-width: 768px) {
    padding-left: 16px;
    padding-right: 16px;
  }
}

.not-found {
  text-align: center;
  color: $color-muted;
  padding: 80px 0;

  .back-link {
    display: inline-block;
    margin-top: 16px;
    color: $color-accent;
  }
}

.post-detail {
  max-width: 820px;
  margin: 0 auto;
  background-color: $color-card;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  padding: 40px;
  box-shadow: $shadow-card;

  @media (max-width: 768px) {
    padding: 24px;
  }
}

.back-link {
  display: inline-block;
  font-size: 13px;
  color: $color-muted;
  margin-bottom: 24px;
  transition: color 0.2s ease;

  &:hover {
    color: $color-accent;
  }
}

.post-header {
  margin-bottom: 24px;

  .post-title {
    font-family: $font-serif;
    font-size: 30px;
    font-weight: 700;
    line-height: 1.35;
    color: $color-primary;

    @media (max-width: 768px) {
      font-size: 24px;
    }
  }

  .post-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 14px;
    font-size: 13px;
    color: $color-muted;

    .dot {
      opacity: 0.5;
    }

    .tag {
      color: $color-accent;
      font-weight: 500;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

// 正文排版：作用于 v-html 内部的标签
.post-content {
  font-size: 16px;
  line-height: 1.9;
  color: $color-secondary;

  :deep(p) {
    margin: 0 0 18px;
  }

  :deep(h2) {
    font-family: $font-serif;
    font-size: 21px;
    font-weight: 700;
    color: $color-primary;
    margin: 32px 0 14px;
    line-height: 1.4;
  }

  :deep(blockquote) {
    margin: 22px 0;
    padding: 12px 18px;
    border-left: 3px solid $color-accent;
    background-color: $color-accent-light;
    border-radius: 0 $radius-md $radius-md 0;
    color: $color-primary;
    font-style: italic;
  }

  :deep(pre) {
    margin: 22px 0;
    padding: 16px 18px;
    background-color: #2b2622;
    color: #f4ece6;
    border-radius: $radius-md;
    overflow-x: auto;
    font-size: 14px;
    line-height: 1.6;
  }

  :deep(code) {
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
  }

  // 行内 code（非 pre 内）使用浅底
  :deep(p code) {
    background-color: $color-accent-light;
    color: $color-accent;
    padding: 2px 6px;
    border-radius: $radius-sm;
    font-size: 14px;
  }
}

.post-footer {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid $color-border;

  .nav-post {
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-width: 48%;

    &.next {
      text-align: right;
      align-items: flex-end;
    }

    &.placeholder {
      border: none;
    }

    .nav-label {
      font-size: 12px;
      color: $color-muted;
    }

    .nav-title {
      font-size: 14px;
      font-weight: 500;
      color: $color-primary;
      line-height: 1.5;
    }

    &:hover .nav-title {
      color: $color-accent;
    }
  }
}
</style>
