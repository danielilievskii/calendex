import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'calendar',
      component: () => import('@/pages/CalendarPage.vue')
    },
    {
      path: '/agenda',
      name: 'agenda',
      component: () => import('@/pages/AgendaPage.vue'),
    },
    {
      path: '/calendar-import',
      name: 'calendar-import',
      component: () => import('@/pages/ImportCalendarPage.vue'),
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('@/pages/FaqPage.vue'),
    },
    {
      path: '/guides',
      name: 'guides',
      component: () => import('@/pages/GuidesPage.vue'),
    },
  ],
})

export default router
