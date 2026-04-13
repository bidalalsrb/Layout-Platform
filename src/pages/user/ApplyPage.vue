<script setup>
import { reactive, ref } from 'vue'
import UiCard from '@/components/ui/UiCard.vue'
import UiButton from '@/components/ui/UiButton.vue'
import AppModal from '@/components/common/AppModal.vue'
import { fetchApplyLayoutByCode } from '@/services/api/modules/apply'
import { useToast } from '@/composables/useToast'

const { pushToast } = useToast()

const form = reactive({
  layoutCode: '',
})

const layout = ref(null)
const codeModalOpen = ref(true)
const detailModalOpen = ref(false)
const selectedCell = ref(null)

async function searchLayout() {
  const code = form.layoutCode.trim()

  if (!/^\d{4}$/.test(code)) {
    pushToast('배치 코드는 4자리 숫자입니다.', 'error')
    return
  }

  try {
    const { data } = await fetchApplyLayoutByCode(code)
    layout.value = data.data
    codeModalOpen.value = false
    pushToast('배치도를 불러왔습니다.')
  } catch (error) {
    layout.value = null
    const message = error?.response?.data?.message || '배치 정보를 찾지 못했습니다.'
    pushToast(message, 'error')
  }
}

function openCodeModal() {
  codeModalOpen.value = true
}

function openCellDetail(cell) {
  selectedCell.value = cell
  detailModalOpen.value = true
}
</script>

<template>
  <UiCard class="page-enter">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-lg font-bold tracking-tight text-slate-900">배치도 조회</h2>
      <UiButton variant="secondary" @click="openCodeModal">코드 입력</UiButton>
    </div>

    <div v-if="layout" class="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
      <p class="font-semibold text-slate-900">{{ layout.title }}</p>
      <p class="text-sm text-slate-500">{{ layout.period }}</p>
      <p class="mt-1 text-sm text-slate-700">{{ layout.description || '설명 없음' }}</p>
      <p class="mt-2 text-sm font-semibold text-[#2d7ef7]">배치 코드: {{ layout.layoutCode }}</p>
    </div>

    <div v-if="layout" class="grid grid-cols-5 gap-2 md:grid-cols-10">
      <button
        v-for="cell in layout.cells"
        :key="cell.id"
        class="aspect-square rounded-xl border text-[11px]"
        :class="cell.name ? 'border-[#2d7ef7] bg-[#eaf2ff] text-[#1e5ebf]' : 'border-slate-200 bg-white text-slate-500'"
        @click="openCellDetail(cell)"
      >
        <span class="line-clamp-2 block px-1 font-medium">{{ cell.name || cell.label }}</span>
      </button>
    </div>

    <p v-else class="text-sm text-slate-500">코드 입력을 눌러 4자리 배치 코드를 입력해 주세요.</p>

    <AppModal :open="codeModalOpen" title="배치 코드 조회" @close="codeModalOpen = false">
      <div class="mb-3 space-y-2">
        <p class="text-sm text-slate-500">4자리 코드를 입력하면 해당 배치도와 정보를 조회합니다.</p>
        <input
          v-model="form.layoutCode"
          class="toss-input w-full"
          type="text"
          maxlength="4"
          placeholder="배치 코드 4자리 입력"
        />
      </div>
      <div class="flex justify-end">
        <UiButton @click="searchLayout">조회</UiButton>
      </div>
    </AppModal>

    <AppModal :open="detailModalOpen" title="셀 정보" @close="detailModalOpen = false">
      <div v-if="selectedCell" class="space-y-2 text-sm">
        <p><span class="font-semibold">셀:</span> {{ selectedCell.label }}</p>
        <p><span class="font-semibold">이름:</span> {{ selectedCell.name || '미입력' }}</p>
        <p><span class="font-semibold">내용:</span> {{ selectedCell.content || '미입력' }}</p>
      </div>
    </AppModal>
  </UiCard>
</template>
