<script setup>
import { computed, reactive, ref, watch } from 'vue'
import UiCard from '@/components/ui/UiCard.vue'
import UiButton from '@/components/ui/UiButton.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import AppModal from '@/components/common/AppModal.vue'
import { useUserProfileStore } from '@/app/store/userProfile'
import { cancelMyApplication, fetchMyApplications, fetchMyAttendance } from '@/services/api/modules/mypage'
import { useToast } from '@/composables/useToast'

const { pushToast } = useToast()
const profileStore = useUserProfileStore()

const tab = ref('attendance')
const attendanceRows = ref([])
const attendanceSummary = ref({ total: 0, upcoming: 0, completed: 0 })
const applyRows = ref([])
const isTempData = ref(false)
const cancelModalOpen = ref(false)
const selectedCancelItem = ref(null)
const attendancePage = ref(1)
const applyPage = ref(1)
const pageSize = 5

const accountForm = reactive({
  name: '',
  userId: '',
  phone: '',
})

const isRegistered = computed(() => profileStore.isRegistered)

const pagedAttendanceRows = computed(() => {
  const start = (attendancePage.value - 1) * pageSize
  return attendanceRows.value.slice(start, start + pageSize)
})

const pagedApplyRows = computed(() => {
  const start = (applyPage.value - 1) * pageSize
  return applyRows.value.slice(start, start + pageSize)
})

const attendanceTotalPages = computed(() => Math.max(1, Math.ceil(attendanceRows.value.length / pageSize)))
const applyTotalPages = computed(() => Math.max(1, Math.ceil(applyRows.value.length / pageSize)))

watch(
  () => profileStore.profile,
  async () => {
    await loadMyPageData()
  },
  { immediate: true },
)

async function loadMyPageData() {
  const profile = profileStore.profile
  const userId = profile?.userId || 'TEMP_USER'
  isTempData.value = !profile?.userId
  accountForm.name = profile?.name || '홍길동'
  accountForm.userId = profile?.userId || 'hong_demo'
  accountForm.phone = profile?.phone || '01012345678'

  const [attendanceRes, applyRes] = await Promise.all([fetchMyAttendance(userId), fetchMyApplications(userId)])

  attendanceRows.value = attendanceRes.data.data
  attendanceSummary.value = attendanceRes.data.summary
  applyRows.value = applyRes.data.data

  attendancePage.value = 1
  applyPage.value = 1
}

function formatDateTime(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function savePhone() {
  if (!isRegistered.value) {
    pushToast('회원가입 후 전화번호를 수정할 수 있습니다.', 'error')
    return
  }

  const compactPhone = accountForm.phone.replace(/\s/g, '')
  const isValidPhone = /^01\d-?\d{3,4}-?\d{4}$/.test(compactPhone)

  if (!isValidPhone) {
    pushToast('전화번호 형식이 올바르지 않습니다.', 'error')
    return
  }

  profileStore.updatePhone(compactPhone)
  accountForm.phone = compactPhone
  pushToast('전화번호를 수정했습니다.')
}

function canCancel(item) {
  return item.status === 'APPLIED'
}

function openCancelModal(item) {
  selectedCancelItem.value = item
  cancelModalOpen.value = true
}

function closeCancelModal() {
  cancelModalOpen.value = false
  selectedCancelItem.value = null
}

async function confirmCancelApplication() {
  if (!selectedCancelItem.value) return

  const userId = profileStore.profile?.userId || 'TEMP_USER'
  const { data } = await cancelMyApplication({
    reservationId: selectedCancelItem.value.reservationId,
    userId,
  })

  if (!data.success) {
    pushToast(data.reason || '신청 취소에 실패했습니다.', 'error')
    return
  }

  pushToast('신청이 취소되었습니다.')
  closeCancelModal()
  await loadMyPageData()
}
</script>

<template>
  <UiCard class="page-enter">
    <h2 class="mb-4 text-xl font-bold tracking-tight text-slate-900">마이페이지</h2>

    <div class="mb-4 flex flex-wrap gap-2">
      <UiButton :variant="tab === 'attendance' ? 'primary' : 'secondary'" @click="tab = 'attendance'">참석현황</UiButton>
      <UiButton :variant="tab === 'account' ? 'primary' : 'secondary'" @click="tab = 'account'">계정정보</UiButton>
      <UiButton :variant="tab === 'apply' ? 'primary' : 'secondary'" @click="tab = 'apply'">신청현황</UiButton>
    </div>

    <div v-if="isTempData" class="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
      현재 임시 데이터로 표시 중입니다. 회원가입 후 실제 내역이 연동됩니다.
    </div>

    <template v-if="tab === 'attendance'">
      <div class="mb-4 grid gap-2 md:grid-cols-3">
        <div class="rounded-2xl border border-slate-200 bg-white p-4">
          <p class="text-xs text-slate-500">전체 참석 신청</p>
          <p class="mt-1 text-2xl font-bold text-slate-900">{{ attendanceSummary.total }}</p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-4">
          <p class="text-xs text-slate-500">참석 예정</p>
          <p class="mt-1 text-2xl font-bold text-[#2d7ef7]">{{ attendanceSummary.upcoming }}</p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-4">
          <p class="text-xs text-slate-500">참석 완료</p>
          <p class="mt-1 text-2xl font-bold text-emerald-600">{{ attendanceSummary.completed }}</p>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-4">
        <p class="mb-3 text-sm font-semibold text-slate-900">참석 리스트</p>

        <div v-if="!attendanceRows.length" class="text-sm text-slate-500">참석 신청 내역이 없습니다.</div>

        <div v-else class="space-y-2">
          <div v-for="item in pagedAttendanceRows" :key="item.reservationId" class="rounded-xl border border-slate-100 bg-[#f8fbff] p-3 text-sm">
            <div class="flex items-start justify-between gap-2">
              <p class="font-semibold text-slate-900">{{ item.eventTitle }}</p>
              <span class="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-600">{{ item.statusLabel }}</span>
            </div>
            <p class="mt-1 text-slate-600">기간: {{ item.eventPeriod || '-' }}</p>
            <p class="text-slate-600">상담자: {{ item.counselorName || '-' }} / 시간: {{ item.slotTime || '-' }}</p>
            <p class="text-xs text-slate-500">신청일: {{ formatDateTime(item.createdAt) }}</p>
          </div>
        </div>

        <AppPagination v-model:page="attendancePage" :total-pages="attendanceTotalPages" />
      </div>
    </template>

    <div v-else-if="tab === 'account'" class="rounded-2xl border border-slate-200 bg-white p-4">
      <p class="mb-3 text-sm font-semibold text-slate-900">계정정보</p>

      <div class="grid gap-3 md:grid-cols-2">
        <label class="text-sm">
          <span class="mb-1 block text-slate-600">이름</span>
          <input :value="accountForm.name" type="text" disabled class="toss-input w-full bg-slate-50" />
        </label>

        <label class="text-sm">
          <span class="mb-1 block text-slate-600">아이디</span>
          <input :value="accountForm.userId" type="text" disabled class="toss-input w-full bg-slate-50" />
        </label>
      </div>

      <label class="mt-3 block text-sm">
        <span class="mb-1 block text-slate-600">전화번호</span>
        <input v-model="accountForm.phone" type="text" class="toss-input w-full" placeholder="01012345678" />
      </label>

      <div class="mt-3 flex justify-end">
        <UiButton @click="savePhone">전화번호 수정</UiButton>
      </div>
    </div>

    <div v-else class="rounded-2xl border border-slate-200 bg-white p-4">
      <p class="mb-3 text-sm font-semibold text-slate-900">신청현황</p>

      <div v-if="!applyRows.length" class="text-sm text-slate-500">상담 신청 내역이 없습니다.</div>

      <div v-else class="space-y-2">
        <div v-for="item in pagedApplyRows" :key="item.reservationId" class="rounded-xl border border-slate-100 bg-[#f8fbff] p-3 text-sm">
          <div class="flex items-start justify-between gap-2">
            <p class="font-semibold text-slate-900">{{ item.eventTitle }}</p>
            <span class="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-600">{{ item.statusLabel }}</span>
          </div>
          <p class="mt-1 text-slate-600">행사 기간: {{ item.eventPeriod || '-' }}</p>
          <p class="text-slate-600">상담자: {{ item.counselorName || '-' }} / 상담 시간: {{ item.slotTime || '-' }}</p>
          <p class="text-xs text-slate-500">신청일: {{ formatDateTime(item.appliedAt) }}</p>
          <div v-if="canCancel(item)" class="mt-2 flex justify-end">
            <UiButton variant="secondary" @click="openCancelModal(item)">신청 취소</UiButton>
          </div>
        </div>
      </div>

      <AppPagination v-model:page="applyPage" :total-pages="applyTotalPages" />
    </div>

    <AppModal :open="cancelModalOpen" title="신청 취소" @close="closeCancelModal">
      <p class="text-sm text-slate-700">정말 취소하시겠습니까?</p>
      <p v-if="selectedCancelItem" class="mt-2 text-xs text-slate-500">
        {{ selectedCancelItem.eventTitle }} / {{ selectedCancelItem.slotTime || '-' }}
      </p>
      <div class="mt-4 flex justify-end gap-2">
        <UiButton variant="secondary" @click="closeCancelModal">닫기</UiButton>
        <UiButton @click="confirmCancelApplication">취소하기</UiButton>
      </div>
    </AppModal>
  </UiCard>
</template>
