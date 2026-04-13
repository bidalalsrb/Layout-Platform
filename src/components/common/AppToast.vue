<script setup>
import { useToast } from '@/composables/useToast'

const { messages } = useToast()
</script>

<template>
  <div class="pointer-events-none fixed right-3 top-3 z-[60] space-y-2">
    <div
      v-for="item in messages"
      :key="item.id"
      class="page-enter rounded-xl border bg-white/95 px-3 py-2 text-sm text-slate-900 shadow-[0_10px_22px_rgba(36,70,120,0.18)]"
      :class="item.type === 'error' ? 'border-rose-300' : 'border-[#d7e5ff]'"
    >
      {{ item.message }}
    </div>
  </div>
</template>
