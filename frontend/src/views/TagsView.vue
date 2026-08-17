<template>
  <div ref="viewRef" class="page-container tags-view">
    <div class="stage">
      <div ref="stageRef" class="stage-inner" :style="stageStyle">
      <h2 class="section-title">标签</h2>

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
            <el-empty description="该标签下还没有文章" />
          </div>
        </el-col>

        <!-- 侧边栏：标签筛选卡片 -->
        <el-col :xs="24" :sm="24" :md="7" :lg="7" :xl="7" class="sidebar-col">
          <side-filter-widget
            title="标签"
            :items="tagItems"
            :model-value="activeTag"
            @select="selectTag"
          />
        </el-col>
      </el-row>
      </div>

      <!-- 分页控件：钉在容器底部，不随内容缩放移动 -->
      <div class="pagination">
        <el-pagination
          background
          layout="prev, next, jumper"
          :page-size="pageSize"
          :total="filteredPosts.length"
          :current-page="currentPage"
          :prev-text="'上一页'"
          :next-text="'下一页'"
          @current-change="handlePageChange"
        />
        <span class="page-indicator">第 <strong>{{ currentPage }}</strong> / {{ totalPages }} 页</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ArticleCard from '@/components/common/ArticleCard.vue'
import SideFilterWidget from '@/components/widgets/SideFilterWidget.vue'
import { posts, tags } from '@/data/posts'
import { pageSize } from '@/config'
import { useFitScale } from '@/composables/useFitScale'

const route = useRoute()

const currentPage = ref(1)
const activeTag = ref(null)

// 侧边栏标签导航：按实际文章聚合，与筛选结果一致
const tagNavList = computed(() =>
  tags.map(t => ({
    name: t,
    count: posts.filter(p => p.tag === t).length
  }))
)

// 标签筛选卡片数据（含「全部」项）
const tagItems = computed(() => [
  { key: null, label: '全部', count: posts.length },
  ...tagNavList.value.map(t => ({
    key: t.name,
    label: `# ${t.name}`,
    count: t.count
  }))
])

// 文章列表：默认展示全部，选中标签后仅展示该标签文章
const filteredPosts = computed(() => {
  if (!activeTag.value) return posts
  return posts.filter(p => p.tag === activeTag.value)
})

// 当前页文章：每次仅取 5 张
const pagedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredPosts.value.slice(start, start + pageSize)
})

// 总页数（仅用于展示「第 X / Y 页」，不渲染全部页码）
const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredPosts.value.length / pageSize))
)

const selectTag = tag => {
  activeTag.value = activeTag.value === tag ? null : tag
}

const handlePageChange = page => {
  currentPage.value = page
}

// 筛选条件（标签）变化时回到第一页
watch(filteredPosts, () => {
  currentPage.value = 1
})

onMounted(() => {
  const q = route.query.active
  if (q) activeTag.value = String(q)
})

watch(
  () => route.query.active,
  val => {
    activeTag.value = val ? String(val) : null
  }
)

// 单屏自适应缩放
const viewRef = ref(null)
const stageRef = ref(null)
const { scale, refit } = useFitScale(viewRef, stageRef, 64)
const stageStyle = computed(() => ({
  transform: `scale(${scale.value})`,
  transformOrigin: 'top center'
}))

// 内容数量变化（翻页/筛选/标签）后重新适配高度
watch(() => pagedPosts.value.length, refit)
watch(() => route.query.active, refit)
</script>

<style lang="scss" scoped>
.tags-view {
  position: relative;
  background-color: $color-bg;
  height: calc(100vh - 152px);
  overflow: hidden;

  // 移动端单屏放不下，恢复自然高度与滚动
  @media (max-width: 991px) {
    height: auto;
    overflow: visible;
  }
}

.stage {
  // 容器：撑满固定高度，承载缩放内容 + 底部固定分页条
  position: relative;
  height: 100%;

  @media (max-width: 991px) {
    height: auto;
  }
}

.stage-inner {
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
  position: absolute;
  left: 0;
  right: calc(100% * 7 / 24);
  bottom: 8px;
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 16px 0 8px;
  background-color: $color-bg;

  // 移动端没有固定高度，分页回到正常文档流
  @media (max-width: 991px) {
    position: static;
  }
}
</style>
