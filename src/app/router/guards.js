import { useAuthStore } from '@/app/store/auth'

export function authGuard(to) {
  const authStore = useAuthStore()
  const isLoggedIn = authStore.isAuthenticated
  const requiredRole = to.meta.role

  if (to.meta.guestOnly && isLoggedIn) {
    return authStore.isAdmin ? '/index/admin/event-list' : '/join-list'
  }

  if (to.meta.requiresAuth && !isLoggedIn) {
    return '/'
  }

  if (requiredRole === 'ADMIN' && !authStore.isAdmin) {
    return '/join-list'
  }

  if (requiredRole === 'USER' && authStore.isAdmin) {
    return '/index/admin/event-list'
  }

  return true
}
