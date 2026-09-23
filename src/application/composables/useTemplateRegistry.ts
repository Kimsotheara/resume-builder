import { type Component, defineAsyncComponent } from 'vue'

import { templateDefinitions } from '@/application/templates/templateThemes'
import type { TemplateDefinition, TemplateFamily } from '@/domain/resume.types'

const familyComponents: Record<TemplateFamily, Component> = {
  minimal: defineAsyncComponent(() => import('@/presentation/components/resume-templates/MinimalTemplate.vue')),
  sidebar: defineAsyncComponent(() => import('@/presentation/components/resume-templates/SidebarTemplate.vue')),
  'bold-header': defineAsyncComponent(
    () => import('@/presentation/components/resume-templates/BoldHeaderTemplate.vue'),
  ),
  timeline: defineAsyncComponent(() => import('@/presentation/components/resume-templates/TimelineTemplate.vue')),
  plain: defineAsyncComponent(() => import('@/presentation/components/resume-templates/PlainTemplate.vue')),
  'photo-sidebar': defineAsyncComponent(
    () => import('@/presentation/components/resume-templates/PhotoSidebarTemplate.vue'),
  ),
  'banner-header': defineAsyncComponent(
    () => import('@/presentation/components/resume-templates/BannerHeaderTemplate.vue'),
  ),
}

export function useTemplateRegistry() {
  function getAll(): TemplateDefinition[] {
    return templateDefinitions
  }

  function getById(id: string): TemplateDefinition | undefined {
    return templateDefinitions.find((t) => t.id === id)
  }

  function getComponent(family: TemplateFamily): Component {
    return familyComponents[family]
  }

  return { getAll, getById, getComponent }
}
