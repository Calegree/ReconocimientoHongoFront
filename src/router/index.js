import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
    },
    {
      path: '/model-training',
      name: 'model-training',
      component: () => import('../views/ModelTrainingView.vue'),
    },
    {
      path: '/recognition',
      name: 'recognition',
      component: () => import('../views/RecognitionView.vue'),
    },
  ],
})

export default router
