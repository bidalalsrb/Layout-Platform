<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/app/store/auth'
import { signIn } from '@/services/api/modules/auth'
import { useToast } from '@/composables/useToast'
import UiCard from '@/components/ui/UiCard.vue'
import UiButton from '@/components/ui/UiButton.vue'

const router = useRouter()
const authStore = useAuthStore()
const { pushToast } = useToast()

const form = reactive({
  userId: '',
  password: '',
})

async function submit() {
  try {
    const { data } = await signIn(form)
    const token = data?.data || ''
    const role = data?.role || 'USER'

    authStore.setSession({ token, userRole: role })
    pushToast('로그인되었습니다.')

    router.push(role === 'ADMIN' ? '/index/admin/event-list' : '/join-list')
  } catch (error) {
    const message = error?.response?.data?.message || '로그인에 실패했습니다.'
    pushToast(message, 'error')
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center px-4">
    <UiCard class="w-full max-w-md space-y-4">
      <h1 class="text-2xl font-bold text-slate-900">로그인</h1>
      <p class="text-sm text-slate-500">테스트 계정: admin / 1234</p>
      <div class="space-y-3">
        <input v-model="form.userId" class="w-full rounded border px-3 py-2" type="text" placeholder="아이디" />
        <input v-model="form.password" class="w-full rounded border px-3 py-2" type="password" placeholder="비밀번호" />
        <UiButton class="w-full" @click="submit">로그인</UiButton>
        <UiButton class="w-full" variant="secondary" @click="router.push('/register')">회원가입</UiButton>
      </div>
    </UiCard>
  </div>
</template>
