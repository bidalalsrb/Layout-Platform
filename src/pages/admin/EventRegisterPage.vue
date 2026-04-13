<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import UiCard from '@/components/ui/UiCard.vue'
import UiButton from '@/components/ui/UiButton.vue'
import { registerEvent } from '@/services/api/modules/events'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { pushToast } = useToast()

const form = reactive({
  title: '',
  startDate: '',
  endDate: '',
  manager: '',
  posters: [],
  content: '',
})

function onPosterChange(event) {
  const files = Array.from(event.target.files || [])
  form.posters = files
}

async function submit() {
  if (
    !form.title.trim() ||
    !form.startDate.trim() ||
    !form.endDate.trim() ||
    !form.manager.trim() ||
    !form.content.trim()
  ) {
    pushToast('행사명, 기간, 담당자, 행사 내용은 필수입니다.', 'error')
    return
  }

  const period = `${form.startDate} ~ ${form.endDate}`

  const { data } = await registerEvent({
    title: form.title.trim(),
    startDate: form.startDate,
    endDate: form.endDate,
    period,
    manager: form.manager.trim(),
    posterImages: form.posters.map((file) => file.name),
    content: form.content.trim(),
    description: form.content.trim(),
  })

  pushToast('행사가 생성되었습니다.')
  router.push(`/index/admin/event-layout?eventId=${data.data.id}`)
}
</script>

<template>
  <UiCard>
    <h2 class="mb-4 text-xl font-semibold">행사 등록</h2>
    <div class="grid gap-3 md:grid-cols-4">
      <input v-model="form.title" class="toss-input md:col-span-4" type="text" placeholder="행사명" />
      <input v-model="form.startDate" class="toss-input md:col-span-2" type="date" placeholder="행사기간 시작일" />
      <input v-model="form.endDate" class="toss-input md:col-span-2" type="date" placeholder="행사기간 종료일" />
      <input v-model="form.manager" class="toss-input md:col-span-4" type="text" placeholder="담당자" />
      <input class="toss-input md:col-span-4" type="file" multiple accept="image/*" @change="onPosterChange" />
      <p class="md:col-span-4 text-xs text-slate-500">
        포스터 {{ form.posters.length }}개 선택됨
      </p>
      <textarea v-model="form.content" class="toss-input min-h-24 md:col-span-4" placeholder="행사 내용" />
    </div>
    <div class="mt-4 flex justify-end">
      <UiButton @click="submit">저장</UiButton>
    </div>
  </UiCard>
</template>
