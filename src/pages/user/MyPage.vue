<script setup>
import { ref } from 'vue'
import UiCard from '@/components/ui/UiCard.vue'
import UiButton from '@/components/ui/UiButton.vue'

const tab = ref('attendance')
</script>

<template>
  <UiCard>
    <h2 class="mb-4 text-xl font-semibold text-slate-900">마이페이지</h2>
    <div class="mb-4 flex gap-2">
      <UiButton :variant="tab === 'attendance' ? 'primary' : 'secondary'" @click="tab = 'attendance'">참석현황</UiButton>
      <UiButton :variant="tab === 'account' ? 'primary' : 'secondary'" @click="tab = 'account'">계정정보</UiButton>
      <UiButton :variant="tab === 'apply' ? 'primary' : 'secondary'" @click="tab = 'apply'">신청현황</UiButton>
    </div>

    <div v-if="tab === 'attendance'" class="rounded border p-3 text-sm">참석현황 목록 스캐폴드</div>
    <div v-else-if="tab === 'account'" class="rounded border p-3 text-sm">계정정보 수정 스캐폴드</div>
    <div v-else class="rounded border p-3 text-sm">상담 취소/신청 취소 스캐폴드</div>
  </UiCard>
</template>
