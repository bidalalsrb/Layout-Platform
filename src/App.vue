<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BlankLayout from '@/app/layouts/BlankLayout.vue'
import UserLayout from '@/app/layouts/UserLayout.vue'
import AdminLayout from '@/app/layouts/AdminLayout.vue'

const route = useRoute()

const layoutComponent = computed(() => {
  const layout = route.meta.layout || 'blank'
  if (layout === 'user') return UserLayout
  if (layout === 'admin') return AdminLayout
  return BlankLayout
})
</script>

<template>
  <component :is="layoutComponent">
    <RouterView />
  </component>
</template>
