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
  <div class="min-h-screen">
    <div
      class="mx-auto grid h-screen w-full grid-rows-[auto_minmax(0,1fr)_auto] border-x border-slate-200 bg-white shadow-[0_10px_30px_rgba(26,50,90,0.08)] lg:w-[70vw] lg:max-w-[1440px]"
    >
      <header class="shrink-0 border-b border-slate-100 bg-white">
        <div class="flex h-14 items-center justify-between px-4">
          <h1 class="text-base font-extrabold tracking-tight text-slate-900">Edu Uni</h1>
          <button class="rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-600" @click="logout">로그아웃</button>
        </div>
      </header>

      <main class="page-enter min-h-0 overflow-y-auto px-4 py-5 md:px-6 md:py-6">
        <slot />
      </main>

      <nav class="shrink-0 grid h-14 grid-cols-3 border-t border-slate-100 bg-white text-xs">
        <RouterLink to="/join-list" class="flex items-center justify-center text-slate-600" active-class="font-bold text-[#3182f6]">행사 조회</RouterLink>
        <RouterLink to="/apply" class="flex items-center justify-center text-slate-600" active-class="font-bold text-[#3182f6]">배치도 조회</RouterLink>
        <RouterLink to="/mypage" class="flex items-center justify-center text-slate-600" active-class="font-bold text-[#3182f6]">마이페이지</RouterLink>
      </nav>

      <AppToast />
    </div>
  </div>
</template>
