<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Carousel, Slide, Navigation, Pagination } from 'vue3-carousel'
import 'vue3-carousel/carousel.css'
import UiCard from '@/components/ui/UiCard.vue'
import UiButton from '@/components/ui/UiButton.vue'
import { fetchEventDetail } from '@/services/api/modules/events'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const event = ref(null)
const eventId = computed(() => Number(route.params.eventId || 0))
const displayPosters = computed(() =>
  event.value?.posterImages?.length
    ? event.value.posterImages
    : ['sample-poster-1.png', 'sample-poster-2.png', 'sample-poster-3.png'],
)

function getPosterUrl(name, index) {
  const text = encodeURIComponent(name || `poster-${index + 1}`)
  return `https://dummyimage.com/1200x700/eaf2ff/1f2937&text=${text}`
}

async function loadDetail() {
  loading.value = true
  const { data } = await fetchEventDetail(eventId.value)
  event.value = data.data
  loading.value = false
}

onMounted(loadDetail)
</script>

<template>
  <UiCard class="page-enter">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-xl font-bold tracking-tight text-slate-900">행사 상세</h2>
      <UiButton variant="secondary" @click="router.push('/index')">목록으로</UiButton>
    </div>

    <div v-if="loading" class="text-sm text-slate-500">불러오는 중...</div>

    <div v-else-if="!event" class="text-sm text-slate-500">행사 정보를 찾을 수 없습니다.</div>

    <div v-else class="space-y-4">
      <div class="rounded-2xl border border-slate-200 bg-white p-4">
        <h3 class="text-lg font-bold text-slate-900">{{ event.title }}</h3>
        <p class="text-sm text-slate-500">{{ event.period }}</p>
        <p class="mt-1 text-sm text-slate-700">{{ event.content || event.description || '행사 설명이 없습니다.' }}</p>
        <p class="mt-1 text-xs text-slate-500">담당자: {{ event.manager || '미지정' }}</p>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-4">
        <Carousel :items-to-show="1" :wrap-around="displayPosters.length > 1">
          <Slide
            v-for="(poster, index) in displayPosters"
            :key="`${event.id}-${index}`"
          >
            <img
              :src="getPosterUrl(poster, index)"
              :alt="`${event.title}-poster-${index + 1}`"
              class="h-64 w-full rounded-xl border border-slate-200 object-cover"
            />
          </Slide>

          <template #addons>
            <Navigation v-if="displayPosters.length > 1" />
            <Pagination v-if="displayPosters.length > 1" />
          </template>
        </Carousel>
      </div>
    </div>
  </UiCard>
</template>
