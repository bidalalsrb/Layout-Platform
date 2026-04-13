import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const PROFILE_KEY = 'USER_PROFILE'
const ACCESS_MODE_KEY = 'USER_ACCESS_MODE' // '' | 'browse' | 'registered'

function readJson(key, fallback) {
  const raw = localStorage.getItem(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export const useUserProfileStore = defineStore('userProfile', () => {
  const profile = ref(readJson(PROFILE_KEY, null))
  const accessMode = ref(localStorage.getItem(ACCESS_MODE_KEY) || '')

  const isRegistered = computed(() => accessMode.value === 'registered' && !!profile.value)
  const isBrowseOnly = computed(() => accessMode.value === 'browse')
  const hasOnboarded = computed(() => accessMode.value === 'browse' || accessMode.value === 'registered')
  const canUseService = computed(() => isRegistered.value)

  function registerProfile(payload) {
    profile.value = {
      userId: payload.userId,
      name: payload.name,
      phone: payload.phone,
      joinedAt: new Date().toISOString(),
    }
    accessMode.value = 'registered'

    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile.value))
    localStorage.setItem(ACCESS_MODE_KEY, accessMode.value)
  }

  function chooseBrowse() {
    accessMode.value = 'browse'
    localStorage.setItem(ACCESS_MODE_KEY, accessMode.value)
  }

  function resetProfile() {
    profile.value = null
    accessMode.value = ''
    localStorage.removeItem(PROFILE_KEY)
    localStorage.removeItem(ACCESS_MODE_KEY)
  }

  function updatePhone(phone) {
    if (!profile.value) return
    profile.value = {
      ...profile.value,
      phone,
    }
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile.value))
  }

  return {
    profile,
    accessMode,
    isRegistered,
    isBrowseOnly,
    hasOnboarded,
    canUseService,
    registerProfile,
    updatePhone,
    chooseBrowse,
    resetProfile,
  }
})
