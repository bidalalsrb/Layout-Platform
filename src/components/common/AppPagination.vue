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
  <div class="mt-4 flex items-center gap-1.5">
    <button class="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 transition hover:border-slate-300" @click="moveTo(page - 1)">이전</button>
    <button
      v-for="num in pageNumbers"
      :key="num"
      class="rounded-xl border px-2.5 py-1.5 text-sm font-medium transition"
      :class="num === page ? 'border-[#2d7ef7] bg-[#3182f6] text-white shadow-[0_8px_16px_rgba(49,130,246,0.3)]' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'"
      @click="moveTo(num)"
    >
      {{ num }}
    </button>
    <button class="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 transition hover:border-slate-300" @click="moveTo(page + 1)">다음</button>
  </div>
</template>
