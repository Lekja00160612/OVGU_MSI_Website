<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="header-banner">
    <div class="container text-center">
      <h1 class="page-title">{{ title }}</h1>
      <p v-if="description" class="page-subtitle">{{ description }}</p>
    </div>
  </div>
</template>
