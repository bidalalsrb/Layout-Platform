<script setup>
import { ref } from 'vue'
import UiCard from '@/components/ui/UiCard.vue'
import AppPagination from '@/components/common/AppPagination.vue'

const page = ref(1)
const events = ref([
  { id: 1, title: '2026 봄 박람회', period: '2026-05-10 ~ 2026-05-12' },
  { id: 2, title: '기업 채용 설명회', period: '2026-05-20 ~ 2026-05-21' },
])
</script>

<template>
  <UiCard>
    <h2 class="mb-4 text-xl font-semibold text-slate-900">행사 조회 / 홍보 이미지</h2>
    <ul class="space-y-2">
      <li v-for="event in events" :key="event.id" class="rounded border p-3">
        <p class="font-medium text-slate-900">{{ event.title }}</p>
        <p class="text-sm text-slate-500">{{ event.period }}</p>
      </li>
    </ul>
    <AppPagination v-model:page="page" :total-pages="5" />
  </UiCard>
</template>
