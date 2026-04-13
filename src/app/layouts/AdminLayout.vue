<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/app/store/auth'
import AppToast from '@/components/common/AppToast.vue'

const router = useRouter()
const authStore = useAuthStore()

const menu = [
  { to: '/index/admin/event-register', label: '행사 등록' },
  { to: '/index/admin/event-list', label: '행사 목록' },
  { to: '/index/admin/event-participants', label: '참여자 조회' },
  { to: '/index/admin/event-layout', label: '배치도 편집' },
  { to: '/index/admin/excel-download', label: '엑셀 다운로드' },
]

function logout() {
  authStore.clearSession()
  router.push('/')
}
</script>

<template>
  <div class="admin-shell min-h-screen">
    <div class="grid min-h-screen grid-cols-1 md:grid-cols-[240px_1fr]">
      <aside class="border-r border-black bg-black text-white">
        <div class="border-b border-[#1f1f1f] px-4 py-4 text-lg font-semibold tracking-tight">Admin</div>
        <nav class="space-y-1 p-3">
          <RouterLink
            v-for="item in menu"
            :key="item.to"
            :to="item.to"
            class="block rounded-xl px-3 py-2 text-sm text-slate-300"
            active-class="bg-[#232323] text-white"
          >
            {{ item.label }}
          </RouterLink>
        </nav>
      </aside>

      <div class="flex min-w-0 flex-col bg-white">
        <header class="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4">
          <p class="text-sm font-semibold tracking-tight text-slate-900">관리자 콘솔</p>
          <button class="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900" @click="logout">로그아웃</button>
        </header>
        <main class="flex-1 px-4 py-6">
          <slot />
        </main>
      </div>
    </div>

    <AppToast />
  </div>
</template>

<style scoped>
.admin-shell :deep(*) {
  animation: none !important;
}

.admin-shell :deep(.ui-card:hover) {
  transform: none;
}

.admin-shell :deep(.ui-button) {
  transition: none;
}
</style>
