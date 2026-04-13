<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { VueDraggable } from 'vue-draggable-plus'
import UiCard from '@/components/ui/UiCard.vue'
import UiButton from '@/components/ui/UiButton.vue'
import AppModal from '@/components/common/AppModal.vue'
import { useToast } from '@/composables/useToast'
import { fetchLayout, saveLayout } from '@/services/api/modules/admin'

const route = useRoute()
const { pushToast } = useToast()

const eventId = computed(() => Number(route.query.eventId || 0))
const eventTitle = ref('')
const layoutCode = ref('')
const open = ref(false)
const cells = ref([])

const selectedCellId = ref(null)
const editor = reactive({
  name: '',
  content: '',
  counselorName: '',
  slots: [],
})

function createSlot(time = '', capacity = 1) {
  return {
    id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    time,
    capacity: Number(capacity) || 1,
    reservations: [],
  }
}

function defaultCells() {
  return Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    label: `S-${String(i + 1).padStart(2, '0')}`,
    name: '',
    content: '',
    counselor: {
      name: '',
      slots: [],
    },
  }))
}

const selectedCell = computed(() =>
  cells.value.find((cell) => cell.id === selectedCellId.value) || null,
)

async function loadLayout() {
  if (!eventId.value) {
    cells.value = defaultCells()
    return
  }

  try {
    const { data } = await fetchLayout(eventId.value)
    eventTitle.value = data.data.title
    layoutCode.value = data.data.layoutCode || ''
    cells.value = data.data.cells?.length ? data.data.cells : defaultCells()
  } catch {
    cells.value = defaultCells()
    pushToast('행사를 찾을 수 없습니다.', 'error')
  }
}

function openEditor(cell) {
  selectedCellId.value = cell.id
  editor.name = cell.name || ''
  editor.content = cell.content || ''
  editor.counselorName = cell.counselor?.name || ''
  editor.slots = (cell.counselor?.slots || []).map((slot) => ({
    id: slot.id,
    time: slot.time,
    capacity: slot.capacity,
    reservations: slot.reservations || [],
  }))
  open.value = true
}

function addSlot() {
  editor.slots.push(createSlot())
}

function removeSlot(slotId) {
  editor.slots = editor.slots.filter((slot) => slot.id !== slotId)
}

function saveCell() {
  if (!selectedCellId.value) return

  cells.value = cells.value.map((cell) =>
    cell.id === selectedCellId.value
      ? {
          ...cell,
          name: editor.name.trim(),
          content: editor.content.trim(),
          counselor: {
            name: editor.counselorName.trim(),
            slots: editor.slots.map((slot) => ({
              id: slot.id,
              time: slot.time,
              capacity: Number(slot.capacity) || 1,
              reservations: slot.reservations || [],
            })),
          },
        }
      : cell,
  )

  open.value = false
}

function resetCell() {
  if (!selectedCellId.value) return

  cells.value = cells.value.map((cell) =>
    cell.id === selectedCellId.value
      ? {
          ...cell,
          name: '',
          content: '',
          counselor: { name: '', slots: [] },
        }
      : cell,
  )

  open.value = false
}

async function submitLayout() {
  if (!eventId.value) {
    pushToast('먼저 행사에서 배치도 편집으로 진입해 주세요.', 'error')
    return
  }

  const { data } = await saveLayout(eventId.value, {
    rows: 3,
    cols: 10,
    cells: cells.value,
  })

  layoutCode.value = data.data.layoutCode
  pushToast(`배치 저장 완료 · 코드 ${layoutCode.value}`)
}

function closeEditor() {
  open.value = false
}

loadLayout()
</script>

<template>
  <UiCard>
    <div class="mb-4 flex items-center justify-between">
      <div>
        <h2 class="text-xl font-semibold">배치도 생성/편집</h2>
        <p class="mt-1 text-sm text-slate-500">
          행사: {{ eventTitle || '선택되지 않음' }}
          <span class="ml-2 inline-flex rounded bg-slate-100 px-2 py-0.5 font-semibold">코드: {{ layoutCode || '미발급' }}</span>
        </p>
      </div>
      <UiButton @click="submitLayout">배치 저장</UiButton>
    </div>

    <VueDraggable
      v-model="cells"
      item-key="id"
      class="grid grid-cols-5 gap-1 rounded border bg-slate-50 p-3 md:grid-cols-10"
      :animation="180"
      ghost-class="drag-ghost"
      chosen-class="drag-chosen"
    >
      <button
        v-for="cell in cells"
        :key="cell.id"
        class="aspect-square rounded border p-1 text-[11px] transition"
        :class="cell.name ? 'border-sky-700 bg-sky-50 text-sky-900' : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'"
        @click="openEditor(cell)"
      >
        <span class="line-clamp-1 block font-medium">{{ cell.name || cell.label }}</span>
        <span class="line-clamp-1 block text-[10px] text-slate-500">{{ cell.counselor?.name || '상담자 미지정' }}</span>
      </button>
    </VueDraggable>

    <AppModal :open="open" title="셀 정보 / 상담 예약 설정" @close="closeEditor">
      <div class="space-y-3">
        <input v-model="editor.name" class="toss-input w-full" type="text" placeholder="셀 이름" />
        <textarea v-model="editor.content" class="toss-input min-h-20 w-full" placeholder="셀 내용" />

        <div class="rounded-xl border border-slate-200 p-3">
          <p class="mb-2 text-sm font-semibold">상담자 설정</p>
          <input v-model="editor.counselorName" class="toss-input w-full" type="text" placeholder="상담자 이름" />
        </div>

        <div class="rounded-xl border border-slate-200 p-3">
          <div class="mb-2 flex items-center justify-between">
            <p class="text-sm font-semibold">상담 시간별 정원</p>
            <UiButton variant="secondary" @click="addSlot">시간 추가</UiButton>
          </div>

          <div v-if="editor.slots.length === 0" class="text-xs text-slate-500">등록된 상담 시간이 없습니다.</div>

          <div v-for="slot in editor.slots" :key="slot.id" class="mb-2 rounded-lg border p-2">
            <div class="grid grid-cols-[1fr_1fr_auto] gap-2">
              <input v-model="slot.time" class="toss-input" type="time" />
              <input v-model.number="slot.capacity" class="toss-input" type="number" min="1" placeholder="정원" />
              <UiButton variant="secondary" @click="removeSlot(slot.id)">삭제</UiButton>
            </div>
            <p class="mt-1 text-xs text-slate-500">신청 {{ slot.reservations?.length || 0 }} / 정원 {{ slot.capacity }}</p>
          </div>
        </div>

        <div class="rounded-xl border border-slate-200 p-3">
          <p class="mb-2 text-sm font-semibold">상담 신청 리스트</p>
          <div v-if="!selectedCell?.counselor?.slots?.length" class="text-xs text-slate-500">상담 시간이 없어 신청 내역이 없습니다.</div>

          <div v-for="slot in selectedCell?.counselor?.slots || []" :key="slot.id" class="mb-2 rounded-lg border p-2 text-xs">
            <p class="font-semibold">{{ slot.time || '시간 미지정' }} ({{ slot.reservations?.length || 0 }}/{{ slot.capacity }})</p>
            <ul v-if="slot.reservations?.length" class="mt-1 list-disc pl-4">
              <li v-for="item in slot.reservations" :key="item.id">{{ item.name }} / {{ item.phone }}</li>
            </ul>
            <p v-else class="mt-1 text-slate-500">신청자 없음</p>
          </div>
        </div>
      </div>

      <div class="mt-3 flex justify-between">
        <UiButton variant="secondary" @click="resetCell">초기화</UiButton>
        <UiButton @click="saveCell">저장</UiButton>
      </div>
    </AppModal>
  </UiCard>
</template>

<style scoped>
.drag-ghost {
  opacity: 0.5;
}

.drag-chosen {
  transform: scale(0.96);
}
</style>
