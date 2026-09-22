import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'landing',
    component: () => import('@/presentation/views/LandingView.vue'),
  },
  {
    path: '/upload',
    name: 'upload',
    component: () => import('@/presentation/views/UploadView.vue'),
  },
  {
    path: '/edit',
    name: 'edit',
    component: () => import('@/presentation/views/EditView.vue'),
  },
  {
    path: '/templates',
    name: 'templates',
    component: () => import('@/presentation/views/TemplatesView.vue'),
  },
  {
    path: '/preview',
    name: 'preview',
    component: () => import('@/presentation/views/PreviewView.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})
