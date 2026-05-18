<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <div class="relative py-24 sm:py-32 overflow-hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
    <div class="absolute inset-0 bg-[url('https://ui.nuxt.com/bg-grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
    <UContainer class="relative text-center">
      <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#7a0026] dark:text-rose-400 mb-6 drop-shadow-sm">
        {{ title }}
      </h1>
      <p class="mt-6 text-xl sm:text-2xl leading-8 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
        {{ description }}
      </p>
      <div class="mt-10 flex items-center justify-center gap-x-6">
        <slot name="actions" />
      </div>
    </UContainer>
  </div>
</template>
