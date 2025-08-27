import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'recognition',
      component: () => import('../views/RecognitionView.vue'),
    },
  ],
})

export default router
