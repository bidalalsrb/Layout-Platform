<script setup>
defineProps({
  type: {
    type: String,
    default: 'button',
  },
  variant: {
    type: String,
    default: 'primary',
  },
})
</script>

<template>
  <button
    :type="type"
    :class="[
      'rounded px-3 py-2 text-sm font-medium transition',
      variant === 'primary' ? 'bg-slate-900 text-white hover:bg-slate-800' : 'border bg-white text-slate-900 hover:bg-slate-50',
    ]"
  >
    <slot />
  </button>
</template>
