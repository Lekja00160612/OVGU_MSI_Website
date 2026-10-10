<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="bg-[#0f2240] text-white py-12 sm:py-16 px-4 sm:px-6 mb-8 border-b-4 border-orange-500 shadow-md">
    <div class="max-w-4xl mx-auto text-center flex flex-col items-center">
      <h1 class="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-3">
        {{ title }}
      </h1>
      <p v-if="description" class="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl leading-relaxed">
        {{ description }}
      </p>
    </div>
  </div>
</template>
