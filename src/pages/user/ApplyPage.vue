<script setup>
import UiCard from '@/components/ui/UiCard.vue'
import UiButton from '@/components/ui/UiButton.vue'

const placeholderCells = Array.from({ length: 18 }, (_, index) => ({
  id: index + 1,
  status: index % 4 === 0 ? 'selected' : 'available',
}))
</script>

<template>
  <UiCard>
    <h2 class="mb-4 text-xl font-semibold text-slate-900">배치도 기반 신청</h2>
    <div class="grid grid-cols-6 gap-2">
      <button
        v-for="cell in placeholderCells"
        :key="cell.id"
        class="aspect-square rounded border text-xs"
        :class="cell.status === 'selected' ? 'border-sky-700 bg-sky-100 text-sky-800' : 'bg-white text-slate-700'
        "
      >
        {{ cell.id }}
      </button>
    </div>
    <div class="mt-4 flex justify-end">
      <UiButton>신청하기</UiButton>
    </div>
  </UiCard>
</template>
