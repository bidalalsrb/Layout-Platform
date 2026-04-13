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
      'ui-button rounded-xl px-3.5 py-2.5 text-sm font-semibold transition duration-200 active:translate-y-px',
      variant === 'primary'
        ? 'bg-gradient-to-b from-[#4d98ff] to-[#2d7ef7] text-white shadow-[0_8px_18px_rgba(49,130,246,0.38)] hover:brightness-105'
        : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50',
    ]"
  >
    <slot />
  </button>
</template>
