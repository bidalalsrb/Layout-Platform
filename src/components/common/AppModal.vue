<script setup>
defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" @click.self="emit('close')">
      <div class="w-full max-w-lg rounded-xl bg-white p-5 shadow-lg">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-slate-900">{{ title }}</h2>
          <button class="text-sm text-slate-500" @click="emit('close')">닫기</button>
        </div>
        <slot />
      </div>
    </div>
  </Teleport>
</template>
