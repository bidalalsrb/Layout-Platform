<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import UiCard from '@/components/ui/UiCard.vue'
import UiButton from '@/components/ui/UiButton.vue'
import { fetchEventList } from '@/services/api/modules/events'

const router = useRouter()
const rows = ref([])

async function load() {
  const { data } = await fetchEventList()
  rows.value = data.data
}

function moveToLayout(eventId) {
  router.push(`/index/admin/event-layout?eventId=${eventId}`)
}

onMounted(load)
</script>

<template>
  <UiCard>
    <h2 class="mb-4 text-xl font-semibold">행사 목록</h2>

    <table class="w-full border-collapse text-sm">
      <thead>
        <tr class="border-b text-left">
          <th class="p-2">ID</th>
          <th class="p-2">행사명</th>
          <th class="p-2">기간</th>
          <th class="p-2">배치 코드</th>
          <th class="p-2">작업</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id" class="border-b">
          <td class="p-2">{{ row.id }}</td>
          <td class="p-2">{{ row.title }}</td>
          <td class="p-2">{{ row.period || '-' }}</td>
          <td class="p-2">
            <span class="inline-flex min-w-14 justify-center rounded bg-slate-100 px-2 py-1 font-semibold">
              {{ row.layoutCode || '미발급' }}
            </span>
          </td>
          <td class="p-2">
            <UiButton variant="secondary" @click="moveToLayout(row.id)">배치도 편집</UiButton>
          </td>
        </tr>
      </tbody>
    </table>
  </UiCard>
</template>
