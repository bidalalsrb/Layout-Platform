<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/app/store/auth'
import AppToast from '@/components/common/AppToast.vue'

const router = useRouter()
const authStore = useAuthStore()

function logout() {
  authStore.clearSession()
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-slate-100">
    <header class="border-b bg-white">
      <div class="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <h1 class="text-lg font-semibold text-slate-900">Edu Uni - User</h1>
        <nav class="flex items-center gap-4 text-sm">
          <RouterLink to="/join-list" class="text-slate-700 hover:text-slate-900">행사 조회</RouterLink>
          <RouterLink to="/apply" class="text-slate-700 hover:text-slate-900">배치도 신청</RouterLink>
          <RouterLink to="/mypage" class="text-slate-700 hover:text-slate-900">마이페이지</RouterLink>
          <button class="rounded bg-slate-900 px-3 py-1.5 text-white" @click="logout">로그아웃</button>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-6">
      <slot />
    </main>

    <footer class="border-t bg-white py-4 text-center text-sm text-slate-500">
      Layout Platform · User Portal
    </footer>

    <AppToast />
  </div>
</template>
