<script setup>
import { computed } from 'vue'

const props = defineProps({
  page: { type: Number, default: 1 },
  totalPages: { type: Number, default: 1 },
})

const emit = defineEmits(['update:page'])

const pageNumbers = computed(() => {
  const total = Math.max(1, props.totalPages)
  return Array.from({ length: total }, (_, index) => index + 1)
})

function moveTo(page) {
  if (page < 1 || page > props.totalPages || page === props.page) return
  emit('update:page', page)
}
</script>

<template>
  <div class="mt-4 flex items-center gap-1">
    <button class="rounded border px-2 py-1 text-sm" @click="moveTo(page - 1)">이전</button>
    <button
      v-for="num in pageNumbers"
      :key="num"
      class="rounded border px-2 py-1 text-sm"
      :class="num === page ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'"
      @click="moveTo(num)"
    >
      {{ num }}
    </button>
    <button class="rounded border px-2 py-1 text-sm" @click="moveTo(page + 1)">다음</button>
  </div>
</template>
