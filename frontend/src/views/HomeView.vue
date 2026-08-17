<template>
  <div ref="viewRef" class="page-container home-view">
    <div ref="stageRef" class="stage" :style="stageStyle">
      <h2 class="section-title">最新文章</h2>

      <el-row :gutter="40" class="content-row">
        <!-- 文章列表：单屏每页 5 张，其余通过分页加载 -->
        <el-col :xs="24" :sm="24" :md="17" :lg="17" :xl="17">
          <div class="article-list">
            <article-card
              v-for="post in pagedPosts"
              :key="post.id"
              :post="post"
              compact
            />
          </div>

          <div v-if="pagedPosts.length === 0" class="empty-state">
            <el-empty description="没有找到相关文章" />
          </div>
        </el-col>

        <!-- 侧边栏：移除“标签”“归档”与“热门文章”卡片，仅保留分类 -->
        <el-col :xs="24" :sm="24" :md="7" :lg="7" :xl="7" class="sidebar-col">
          <sidebar-widgets />
        </el-col>
      </el-row>

      <!-- 分页控件：上一页 / 页码 / 下一页 / 指定页码跳转 -->
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next, jumper"
          :page-size="pageSize"
          :total="filteredPosts.length"
          :current-page="currentPage"
          :prev-text="'上一页'"
          :next-text="'下一页'"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import ArticleCard from '@/components/common/ArticleCard.vue'
import SidebarWidgets from '@/components/widgets/SidebarWidgets.vue'
import { posts } from '@/data/posts'
import { pageSize } from '@/config'
import { useFitScale } from '@/composables/useFitScale'

const route = useRoute()

const currentPage = ref(1)

// 搜索筛选：与已有查询参数保持一致
const filteredPosts = computed(() => {
  const q = route.query.q
  if (!q) return posts
  const keyword = String(q).toLowerCase()
  return posts.filter(
    p =>
      p.title.toLowerCase().includes(keyword) ||
      p.excerpt.toLowerCase().includes(keyword) ||
      p.tag.toLowerCase().includes(keyword)
  )
})

// 当前页文章：每次仅取 5 张
const pagedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredPosts.value.slice(start, start + pageSize)
})

const handlePageChange = page => {
  currentPage.value = page
}

// 筛选条件变化时回到第一页
watch(filteredPosts, () => {
  currentPage.value = 1
})

// 单屏自适应缩放
const viewRef = ref(null)
const stageRef = ref(null)
const { scale, refit } = useFitScale(viewRef, stageRef)
const stageStyle = computed(() => ({
  transform: `scale(${scale.value})`,
  transformOrigin: 'top center'
}))

// 内容数量变化（翻页/筛选）后重新适配高度
watch(() => pagedPosts.value.length, refit)
watch(() => route.query.q, refit)
</script>

<style lang="scss" scoped>
.home-view {
  height: calc(100vh - 152px);
  overflow: hidden;

  // 移动端单屏放不下，恢复自然高度与滚动
  @media (max-width: 991px) {
    height: auto;
    overflow: visible;
  }
}

.stage {
  // 自然设计尺寸排版，由 useFitScale 统一等比缩放
}

.section-title {
  font-size: 22px;
  font-weight: 700;
  color: $color-primary;
  font-family: $font-serif;
  margin-bottom: 24px;
}

.content-row {
  align-items: flex-start;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.sidebar-col {
  @media (max-width: 991px) {
    margin-top: 32px;
  }
}

.empty-state {
  padding: 48px 0;
}

.pagination {
  display: flex;
  justify-content: center;
  padding: 20px 0 8px;
}
</style>
