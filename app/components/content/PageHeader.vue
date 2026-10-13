<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="bg-gradient-to-b from-msi-dark via-msi-dark/95 to-msi-navy text-white py-12 sm:py-16 px-4 sm:px-6 mb-8 border-b-4 border-primary-500 shadow-md relative overflow-hidden">
    <!-- Ambient Depth Glows -->
    <div class="absolute -right-20 -top-20 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
    <div class="absolute -left-20 -bottom-20 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl pointer-events-none" />

    <div class="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
      <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-3 drop-shadow-xs">
        {{ title }}
      </h1>
      <p v-if="description" class="text-sm sm:text-base lg:text-lg text-slate-200/90 max-w-2xl leading-relaxed">
        {{ description }}
      </p>
    </div>
  </div>
</template>
