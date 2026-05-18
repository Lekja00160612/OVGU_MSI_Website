<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <div class="bg-gray-100 dark:bg-gray-800 py-16 mb-12 border-b border-gray-200 dark:border-gray-700">
    <UContainer>
      <h1 class="text-3xl md:text-5xl font-bold text-[#7a0026] dark:text-rose-400 mb-4">{{ title }}</h1>
      <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl">{{ description }}</p>
    </UContainer>
  </div>
</template>
