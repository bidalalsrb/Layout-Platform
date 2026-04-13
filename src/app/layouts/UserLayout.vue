<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/app/store/auth'
import AppToast from '@/components/common/AppToast.vue'
import AppModal from '@/components/common/AppModal.vue'
import UiButton from '@/components/ui/UiButton.vue'
import { useUserProfileStore } from '@/app/store/userProfile'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const authStore = useAuthStore()
const profileStore = useUserProfileStore()
const { pushToast } = useToast()

const signupOpen = ref(!profileStore.hasOnboarded)
const signupForm = reactive({
  userId: '',
  name: '',
  phone: '',
})

function logout() {
  authStore.clearSession()
  router.push('/')
}

function openSignup() {
  signupOpen.value = true
}

function submitSignup() {
  if (!signupForm.userId.trim() || !signupForm.name.trim() || !signupForm.phone.trim()) {
    pushToast('아이디, 이름, 전화번호를 입력해 주세요.', 'error')
    return
  }

  profileStore.registerProfile({
    userId: signupForm.userId.trim(),
    name: signupForm.name.trim(),
    phone: signupForm.phone.trim(),
  })

  signupOpen.value = false
  pushToast('회원가입이 완료되었습니다.')
}

function browseOnly() {
  profileStore.chooseBrowse()
  signupOpen.value = false
  pushToast('둘러보기 모드로 이용 중입니다.')
}
</script>

<template>
  <div class="min-h-screen">
    <div
      class="mx-auto grid h-screen w-full grid-rows-[auto_minmax(0,1fr)_auto] border-x border-slate-200 bg-white shadow-[0_10px_30px_rgba(26,50,90,0.08)] lg:w-[70vw] lg:max-w-[1440px]"
    >
      <header class="shrink-0 border-b border-slate-100 bg-white">
        <div class="flex h-14 items-center justify-between px-4">
          <div class="flex items-center gap-2">
            <h1 class="text-base font-extrabold tracking-tight text-slate-900">Edu Uni</h1>
            <span v-if="profileStore.isBrowseOnly" class="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">둘러보기</span>
          </div>
          <div class="flex items-center gap-2">
            <UiButton v-if="!profileStore.isRegistered" variant="secondary" @click="openSignup">회원가입</UiButton>
            <button class="rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-600" @click="logout">로그아웃</button>
          </div>
        </div>
      </header>

      <main class="page-enter min-h-0 overflow-y-auto px-4 py-5 md:px-6 md:py-6">
        <slot />
      </main>

      <nav class="shrink-0 grid h-14 grid-cols-3 border-t border-slate-100 bg-white text-xs">
        <RouterLink to="/index" class="flex items-center justify-center text-slate-600" exact-active-class="font-bold text-[#3182f6]">행사 조회</RouterLink>
        <RouterLink to="/index/apply" class="flex items-center justify-center text-slate-600" exact-active-class="font-bold text-[#3182f6]">배치도 조회</RouterLink>
        <RouterLink to="/index/mypage" class="flex items-center justify-center text-slate-600" exact-active-class="font-bold text-[#3182f6]">마이페이지</RouterLink>
      </nav>

      <AppToast />
    </div>
  </div>

  <AppModal :open="signupOpen" title="회원가입" @close="signupOpen = false">
    <p class="mb-3 text-sm text-slate-500">회원가입 후 서비스를 이용할 수 있습니다. 회원가입하지 않아도 둘러보기는 가능합니다.</p>
    <div class="space-y-2">
      <input v-model="signupForm.userId" class="toss-input w-full" type="text" placeholder="아이디" />
      <input v-model="signupForm.name" class="toss-input w-full" type="text" placeholder="이름" />
      <input v-model="signupForm.phone" class="toss-input w-full" type="text" placeholder="전화번호" />
    </div>
    <div class="mt-3 flex justify-between">
      <UiButton variant="secondary" @click="browseOnly">둘러보기</UiButton>
      <UiButton @click="submitSignup">회원가입 완료</UiButton>
    </div>
  </AppModal>
</template>
