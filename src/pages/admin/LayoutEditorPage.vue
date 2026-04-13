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
})

function defaultCells() {
  return Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    label: `S-${String(i + 1).padStart(2, '0')}`,
    name: '',
    content: '',
  }))
}

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
  open.value = true
}

function saveCell() {
  if (!selectedCellId.value) return

  cells.value = cells.value.map((cell) =>
    cell.id === selectedCellId.value
      ? { ...cell, name: editor.name.trim(), content: editor.content.trim() }
      : cell,
  )

  open.value = false
}

function resetCell() {
  if (!selectedCellId.value) return

  cells.value = cells.value.map((cell) =>
    cell.id === selectedCellId.value ? { ...cell, name: '', content: '' } : cell,
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
        class="aspect-square rounded border text-[11px] transition"
        :class="cell.name ? 'border-sky-700 bg-sky-50 text-sky-900' : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'"
        @click="openEditor(cell)"
      >
        <span class="line-clamp-2 block px-1 font-medium">{{ cell.name || cell.label }}</span>
      </button>
    </VueDraggable>

    <AppModal :open="open" title="셀 정보 작성/수정" @close="closeEditor">
      <div class="space-y-3">
        <input v-model="editor.name" class="toss-input w-full" type="text" placeholder="이름" />
        <textarea v-model="editor.content" class="toss-input min-h-24 w-full" placeholder="내용" />
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
