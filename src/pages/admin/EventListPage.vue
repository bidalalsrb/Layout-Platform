<script setup>
import { ref } from 'vue'
import UiCard from '@/components/ui/UiCard.vue'
import AppPagination from '@/components/common/AppPagination.vue'

const page = ref(1)
const rows = ref([
  { id: 101, name: '2026 봄 박람회', status: '운영중' },
  { id: 102, name: '기업 채용 설명회', status: '대기' },
])
</script>

<template>
  <UiCard>
    <h2 class="mb-4 text-xl font-semibold text-slate-900">행사 목록 / 검색 / 필터</h2>
    <div class="mb-3 grid grid-cols-1 gap-2 md:grid-cols-3">
      <input class="rounded border px-3 py-2" type="text" placeholder="행사명 검색" />
      <select class="rounded border px-3 py-2">
        <option>전체 상태</option>
      </select>
      <input class="rounded border px-3 py-2" type="date" />
    </div>

    <table class="w-full border-collapse text-sm">
      <thead>
        <tr class="border-b bg-slate-50 text-left">
          <th class="p-2">ID</th>
          <th class="p-2">행사명</th>
          <th class="p-2">상태</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id" class="border-b">
          <td class="p-2">{{ row.id }}</td>
          <td class="p-2">{{ row.name }}</td>
          <td class="p-2">{{ row.status }}</td>
        </tr>
      </tbody>
    </table>

    <AppPagination v-model:page="page" :total-pages="9" />
  </UiCard>
</template>
