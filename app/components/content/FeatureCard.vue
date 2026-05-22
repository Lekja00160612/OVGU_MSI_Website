<script setup lang="ts">
defineProps<{
  title: string
  description: string
  icon: string
}>()
</script>

<template>
  <UCard class="h-full flex flex-col transition-transform hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-rose-900/20">
    <template #header>
      <div class="flex items-center gap-4">
        <div class="p-2 rounded-lg bg-[var(--color-primary-50)] dark:bg-blue-900/50 text-[var(--color-primary)] dark:text-blue-400">
          <UIcon :name="icon" class="w-8 h-8" />
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">{{ title }}</h3>
      </div>
    </template>
    <p class="text-gray-600 dark:text-gray-300 flex-grow">{{ description }}</p>
  </UCard>
</template>
