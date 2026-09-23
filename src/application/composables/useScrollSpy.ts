import { onMounted, onUnmounted, ref } from 'vue'

export function useScrollSpy(sectionIds: string[]) {
  const activeId = ref(sectionIds[0] ?? '')
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    const visibleRatios = new Map<string, number>()

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibleRatios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0)
        }
        let bestId = activeId.value
        let bestRatio = 0
        for (const [id, ratio] of visibleRatios) {
          if (ratio > bestRatio) {
            bestRatio = ratio
            bestId = id
          }
        }
        if (bestRatio > 0) activeId.value = bestId
      },
      { rootMargin: '-15% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    )

    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
  })

  onUnmounted(() => observer?.disconnect())

  return { activeId }
}
