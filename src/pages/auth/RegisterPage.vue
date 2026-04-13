<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import UiCard from '@/components/ui/UiCard.vue'
import UiButton from '@/components/ui/UiButton.vue'
import { sendPhoneCode, signUpStudent, verifyPhoneCode } from '@/services/api/modules/auth'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { pushToast } = useToast()
const step = ref(1)
const verifiedUuid = ref('')

const form = reactive({
  phone: '',
  verificationCode: '',
  password: '',
  confirmPassword: '',
  name: '',
  batchCode: '',
  department: '',
  studentNumber: '',
  gender: '',
  grade: '',
})

const stepTitle = computed(() => ['휴대폰 인증', '비밀번호 설정', '추가 정보 입력'][step.value - 1])

async function sendCode() {
  await sendPhoneCode({ phoneNum: form.phone })
  pushToast('인증번호를 발송했습니다.')
}

async function verifyCode() {
  const { data } = await verifyPhoneCode({ phoneNum: form.phone, code: form.verificationCode })
  verifiedUuid.value = data?.data || ''
  step.value = 2
  pushToast('휴대폰 인증이 완료되었습니다.')
}

function goStep3() {
  if (!form.password || form.password !== form.confirmPassword) {
    pushToast('비밀번호를 확인해 주세요.', 'error')
    return
  }
  step.value = 3
}

async function submit() {
  const payload = {
    userId: form.phone,
    password: form.password,
    name: form.name,
    phoneNumber: form.phone,
    major: form.department,
    studentNumber: form.studentNumber,
    gender: form.gender,
    schoolCd: form.batchCode,
    username: form.name,
  }

  await signUpStudent(verifiedUuid.value, payload)
  pushToast('회원가입이 완료되었습니다.')
  router.push('/')
}
</script>

<template>
  <div class="mx-auto max-w-xl px-4 py-10">
    <UiCard class="space-y-4">
      <h1 class="text-2xl font-bold text-slate-900">회원가입</h1>
      <p class="text-sm text-slate-500">{{ step }}단계 · {{ stepTitle }}</p>

      <section v-if="step === 1" class="space-y-3">
        <input v-model="form.phone" class="w-full rounded border px-3 py-2" type="text" placeholder="휴대폰 번호" />
        <div class="grid grid-cols-2 gap-2">
          <UiButton @click="sendCode">인증번호 발송</UiButton>
          <input v-model="form.verificationCode" class="rounded border px-3 py-2" type="text" placeholder="인증번호" />
        </div>
        <UiButton class="w-full" @click="verifyCode">인증 확인</UiButton>
      </section>

      <section v-else-if="step === 2" class="space-y-3">
        <input v-model="form.password" class="w-full rounded border px-3 py-2" type="password" placeholder="비밀번호" />
        <input
          v-model="form.confirmPassword"
          class="w-full rounded border px-3 py-2"
          type="password"
          placeholder="비밀번호 확인"
        />
        <UiButton class="w-full" @click="goStep3">다음</UiButton>
      </section>

      <section v-else class="space-y-3">
        <input v-model="form.name" class="w-full rounded border px-3 py-2" type="text" placeholder="이름" />
        <input v-model="form.batchCode" class="w-full rounded border px-3 py-2" type="text" placeholder="학교 코드" />
        <input v-model="form.department" class="w-full rounded border px-3 py-2" type="text" placeholder="학과" />
        <input v-model="form.studentNumber" class="w-full rounded border px-3 py-2" type="text" placeholder="학번" />
        <input v-model="form.gender" class="w-full rounded border px-3 py-2" type="text" placeholder="성별" />
        <input v-model="form.grade" class="w-full rounded border px-3 py-2" type="text" placeholder="학년" />
        <UiButton class="w-full" @click="submit">가입 완료</UiButton>
      </section>
    </UiCard>
  </div>
</template>
