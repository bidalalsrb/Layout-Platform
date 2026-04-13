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
  <div class="min-h-screen bg-slate-100">
    <div class="grid min-h-screen grid-cols-1 md:grid-cols-[240px_1fr]">
      <aside class="border-r bg-slate-900 text-slate-100">
        <div class="border-b border-slate-700 px-4 py-4 text-lg font-semibold">Admin</div>
        <nav class="space-y-1 p-3">
          <RouterLink
            v-for="item in menu"
            :key="item.to"
            :to="item.to"
            class="block rounded px-3 py-2 text-sm hover:bg-slate-800"
            active-class="bg-slate-700"
          >
            {{ item.label }}
          </RouterLink>
        </nav>
      </aside>

      <div class="flex min-w-0 flex-col">
        <header class="flex h-14 items-center justify-between border-b bg-white px-4">
          <p class="text-sm font-medium text-slate-800">관리자 콘솔</p>
          <button class="rounded bg-slate-900 px-3 py-1.5 text-sm text-white" @click="logout">로그아웃</button>
        </header>
        <main class="flex-1 px-4 py-6">
          <slot />
        </main>
      </div>
    </div>

    <AppToast />
  </div>
</template>
