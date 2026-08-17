// 文章数据源：从 src/content/posts/*.md 自动加载
// 每篇 Markdown 用 frontmatter 写元信息，正文为标准 Markdown，构建/加载时转成 HTML。
// 写新文章 = 在 content/posts 下新增一个 .md 文件，无需改动任何组件。

import { marked } from 'marked'
import { load as yamlLoad } from 'js-yaml'

// 批量读入所有文章 Markdown（原始文本）
const mdModules = import.meta.glob('../content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
})

// 解析 frontmatter（--- 包裹的 YAML）与正文
function parseFrontmatter(raw) {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/)
  if (!match) return { data: {}, body: raw }
  const data = yamlLoad(match[1]) || {}
  return { data, body: match[2] }
}

// 由正文生成摘要（去除 Markdown 标记后取前若干字）
function deriveExcerpt(body, fallback = '') {
  const text = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[#>*_`~\-]/g, '')
    .replace(/\n+/g, ' ')
    .trim()
  return text.slice(0, 60) + (text.length > 60 ? '…' : '')
}

// 文件名（去扩展名）作为稳定且 SEO 友好的 id
function slugFromPath(path) {
  return path.split('/').pop().replace(/\.md$/, '')
}

export const posts = Object.entries(mdModules)
  .map(([path, raw]) => {
    const { data, body } = parseFrontmatter(raw)
    const id = slugFromPath(path)
    return {
      id,
      title: data.title || id,
      date: data.date || '1970-01-01',
      tag: data.tag || '未分类',
      category: data.category || '其他',
      views: Number(data.views) || 0,
      excerpt: data.excerpt || deriveExcerpt(body),
      // 正文：Markdown → HTML，详情页通过 v-html 渲染
      content: marked.parse(body)
    }
  })
  // 按日期倒序（新文章在前）
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))

// 分类：由真实数据动态统计
export const categories = (() => {
  const map = new Map()
  for (const p of posts) {
    map.set(p.category, (map.get(p.category) || 0) + 1)
  }
  return [...map.entries()].map(([name, count]) => ({ name, count }))
})()

// 标签：去重后的列表
export const tags = [...new Set(posts.map((p) => p.tag))]

// 阅读数格式化：1200 → 1.2k
export function formatViews(n) {
  const num = Number(n) || 0
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  return String(num)
}

// 按 id 查询单篇文章；返回 null 表示不存在
export function getPostById(id) {
  return posts.find((p) => p.id === id) || null
}

// 返回某篇文章在列表中的上一篇 / 下一篇（按当前排序）
export function getAdjacentPosts(id) {
  const idx = posts.findIndex((p) => p.id === id)
  if (idx === -1) return { prev: null, next: null }
  return {
    prev: idx > 0 ? posts[idx - 1] : null,
    next: idx < posts.length - 1 ? posts[idx + 1] : null
  }
}
