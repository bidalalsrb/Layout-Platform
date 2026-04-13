import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN'
const ROLE_KEY = 'USER_ROLE'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(localStorage.getItem(ACCESS_TOKEN_KEY) || '')
  const role = ref(localStorage.getItem(ROLE_KEY) || '')

  const isAuthenticated = computed(() => Boolean(accessToken.value))
  const isAdmin = computed(() => role.value === 'ADMIN')

  function setSession({ token, userRole }) {
    accessToken.value = token
    role.value = userRole

    localStorage.setItem(ACCESS_TOKEN_KEY, token)
    localStorage.setItem(ROLE_KEY, userRole)
  }

  function clearSession() {
    accessToken.value = ''
    role.value = ''

    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(ROLE_KEY)
  }

  return {
    accessToken,
    role,
    isAuthenticated,
    isAdmin,
    setSession,
    clearSession,
  }
})
