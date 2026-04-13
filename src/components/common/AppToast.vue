<script setup>
import { useToast } from '@/composables/useToast'

const { messages } = useToast()
</script>

<template>
  <div class="pointer-events-none fixed right-3 top-3 z-[60] space-y-2">
    <div
      v-for="item in messages"
      :key="item.id"
      class="rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow"
      :class="item.type === 'error' ? 'border-rose-300' : 'border-slate-200'"
    >
      {{ item.message }}
    </div>
  </div>
</template>
