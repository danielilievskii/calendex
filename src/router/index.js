import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'calendar',
      component: () => import('../views/CalendarView.vue')
    },
    {
      path: '/agenda',
      name: 'agenda',
      component: () => import('../views/AgendaView.vue'),
    },
    {
      path: '/calendar-import',
      name: 'calendar-import',
      component: () => import('../views/ImportCalendarView.vue'),
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('../views/FaqView.vue'),
    },
    {
      path: '/guides',
      name: 'guides',
      component: () => import('../views/GuidesView.vue'),
    },
  ],
})

export default router
