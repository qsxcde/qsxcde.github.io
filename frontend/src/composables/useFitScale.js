import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

/**
 * 单屏自适应缩放：以自然设计尺寸排版，按「可用高度 / 内容高度」整体等比缩放。
 * 仅缩小不放大（大屏保持原样），保证任何屏幕高度都能放下且不出现滚动条。
 *
 * @param {Ref<HTMLElement>} viewRef  外层固定高度容器（calc(100vh - 152px)，移动端 auto）
 * @param {Ref<HTMLElement>} stageRef 内层自然尺寸内容容器（会被 scale）
 * @param {number} reserved 底部为「固定分页条」预留的高度（px），避免缩放内容压住分页
 */
export function useFitScale(viewRef, stageRef, reserved = 0) {
  const scale = ref(1)
  let raf = null

  const fit = () => {
    if (!viewRef.value || !stageRef.value) return
    const avail = Math.max(0, viewRef.value.clientHeight - reserved)
    const natural = stageRef.value.offsetHeight
    if (!natural) return
    // 只缩小不放大；移动端容器高度为 auto，avail≈natural → scale=1
    scale.value = Math.min(1, avail / natural)
  }

  const refit = () => nextTick(fit)

  const lockScroll = () => {
    document.body.style.overflow = window.innerWidth >= 992 ? 'hidden' : ''
  }

  const onResize = () => {
    if (raf) cancelAnimationFrame(raf)
    raf = requestAnimationFrame(() => {
      lockScroll()
      fit()
    })
  }

  onMounted(() => {
    lockScroll()
    fit()
    // 网页字体（Noto Serif/Sans）异步加载后行高变化，重新适配一次
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fit)
    }
    window.addEventListener('resize', onResize)
  })

  onBeforeUnmount(() => {
    document.body.style.overflow = ''
    window.removeEventListener('resize', onResize)
    if (raf) cancelAnimationFrame(raf)
  })

  return { scale, refit }
}
