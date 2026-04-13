<script setup>
import UiCard from '@/components/ui/UiCard.vue'
import UiButton from '@/components/ui/UiButton.vue'
</script>

<template>
  <UiCard>
    <h2 class="mb-4 text-xl font-semibold text-slate-900">엑셀 다운로드</h2>
    <div class="grid grid-cols-1 gap-2 md:grid-cols-3">
      <input class="rounded border px-3 py-2" type="date" />
      <select class="rounded border px-3 py-2">
        <option>행사 선택</option>
      </select>
      <UiButton>다운로드</UiButton>
    </div>
  </UiCard>
</template>
