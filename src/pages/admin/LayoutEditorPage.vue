<script setup>
import { reactive, ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import UiCard from '@/components/ui/UiCard.vue'
import UiButton from '@/components/ui/UiButton.vue'
import AppModal from '@/components/common/AppModal.vue'

const open = ref(false)
const cells = ref(
  Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    label: `S-${String(i + 1).padStart(2, '0')}`,
    name: '',
    content: '',
  })),
)

const selectedCellId = ref(null)
const editor = reactive({
  name: '',
  content: '',
})

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
      ? {
          ...cell,
          name: editor.name.trim(),
          content: editor.content.trim(),
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
        }
      : cell,
  )
  open.value = false
}

function closeEditor() {
  open.value = false
}
</script>

<template>
  <UiCard>
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-xl font-semibold text-slate-900">배치도 생성/편집</h2>
      <div class="flex gap-2">
        <UiButton variant="secondary" @click="open = true">행/열 조정</UiButton>
        <UiButton>배치 저장</UiButton>
      </div>
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
        <span class="line-clamp-2 block px-1 font-medium">
          {{ cell.name || cell.label }}
        </span>
      </button>
    </VueDraggable>

    <AppModal :open="open" title="셀 정보 작성/수정" @close="closeEditor">
      <div class="space-y-3">
        <input
          v-model="editor.name"
          class="w-full rounded border px-3 py-2"
          type="text"
          placeholder="이름"
        />
        <textarea
          v-model="editor.content"
          class="min-h-24 w-full rounded border px-3 py-2"
          placeholder="내용"
        />
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
