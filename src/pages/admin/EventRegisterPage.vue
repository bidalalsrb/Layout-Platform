<script setup>
import UiCard from '@/components/ui/UiCard.vue'
import UiButton from '@/components/ui/UiButton.vue'
</script>

<template>
  <UiCard>
    <h2 class="mb-4 text-xl font-semibold text-slate-900">행사 등록</h2>
    <div class="grid gap-3 md:grid-cols-2">
      <input class="rounded border px-3 py-2" type="text" placeholder="행사명" />
      <input class="rounded border px-3 py-2" type="text" placeholder="기간" />
      <input class="rounded border px-3 py-2 md:col-span-2" type="file" accept="image/*" />
      <textarea class="min-h-24 rounded border px-3 py-2 md:col-span-2" placeholder="행사 설명" />
    </div>
    <div class="mt-4 flex justify-end">
      <UiButton>저장</UiButton>
    </div>
  </UiCard>
</template>
