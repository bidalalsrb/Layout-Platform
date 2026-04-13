import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from './guards'

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('@/pages/auth/LoginPage.vue'),
    meta: { layout: 'blank', guestOnly: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/pages/auth/RegisterPage.vue'),
    meta: { layout: 'blank', guestOnly: true },
  },
  {
    path: '/join-list',
    name: 'join-list',
    component: () => import('@/pages/user/EventsPage.vue'),
    meta: { layout: 'user', requiresAuth: true, role: 'USER' },
  },
  {
    path: '/apply',
    name: 'apply',
    component: () => import('@/pages/user/ApplyPage.vue'),
    meta: { layout: 'user', requiresAuth: true, role: 'USER' },
  },
  {
    path: '/mypage',
    name: 'mypage',
    component: () => import('@/pages/user/MyPage.vue'),
    meta: { layout: 'user', requiresAuth: true, role: 'USER' },
  },
  {
    path: '/index/admin',
    redirect: '/index/admin/event-list',
  },
  {
    path: '/index/admin/event-register',
    name: 'admin-event-register',
    component: () => import('@/pages/admin/EventRegisterPage.vue'),
    meta: { layout: 'admin', requiresAuth: true, role: 'ADMIN' },
  },
  {
    path: '/index/admin/event-list',
    name: 'admin-event-list',
    component: () => import('@/pages/admin/EventListPage.vue'),
    meta: { layout: 'admin', requiresAuth: true, role: 'ADMIN' },
  },
  {
    path: '/index/admin/event-participants',
    name: 'admin-event-participants',
    component: () => import('@/pages/admin/EventParticipantsPage.vue'),
    meta: { layout: 'admin', requiresAuth: true, role: 'ADMIN' },
  },
  {
    path: '/index/admin/event-layout',
    name: 'admin-event-layout',
    component: () => import('@/pages/admin/LayoutEditorPage.vue'),
    meta: { layout: 'admin', requiresAuth: true, role: 'ADMIN' },
  },
  {
    path: '/index/admin/excel-download',
    name: 'admin-excel-download',
    component: () => import('@/pages/admin/ExcelDownloadPage.vue'),
    meta: { layout: 'admin', requiresAuth: true, role: 'ADMIN' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(authGuard)

export default router
