<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import UiCard from '@/components/ui/UiCard.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import { fetchEventList } from '@/services/api/modules/events'

const router = useRouter()
const page = ref(1)
const rows = ref([])

async function loadEvents() {
  const { data } = await fetchEventList()
  rows.value = data.data
}

onMounted(loadEvents)
</script>

<template>
  <UiCard class="page-enter">
    <h2 class="mb-4 text-xl font-bold tracking-tight text-slate-900">행사 조회 / 홍보 이미지</h2>

    <div class="space-y-2">
      <button
        v-for="event in rows"
        :key="event.id"
        class="block w-full rounded-2xl border p-4 text-left transition duration-200"
        :class="'border-slate-100 bg-[#f8fbff] hover:border-slate-200'"
        @click="router.push(`/index/event/${event.id}`)"
      >
        <p class="font-semibold text-slate-900">{{ event.title }}</p>
        <p class="text-sm text-slate-500">{{ event.period }}</p>
      </button>
    </div>
    <AppPagination v-model:page="page" :total-pages="1" />
  </UiCard>
</template>
