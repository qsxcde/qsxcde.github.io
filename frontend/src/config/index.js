// 站点级常量与配置集中管理，避免在组件内硬编码

export const site = {
  name: '来点芥末',
  brand: '芥',
  description: '用 Markdown 与静态站点生成器搭建的小角落，记录技术笔记、读书摘抄与日常随笔。'
}

// 顶部导航菜单
export const navMenus = [
  { label: '首页', path: '/' },
  { label: '时间线', path: '/timeline' },
  { label: '标签', path: '/tags' }
]

// 列表分页大小（单屏每页展示的卡片数）
export const pageSize = 5
