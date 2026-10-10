<!--
  Page: AdminIndex
  Description: Portal redirect to Nuxt Studio CMS for authorized editors.
  Nuxt UI Primitives: UCard, UButton, UIcon.
-->
<script setup lang="ts">
useSeoMeta({
  title: 'Admin Dashboard | MSI',
  robots: 'noindex, nofollow'
})
</script>

<template>
  <div class="min-h-[80vh] bg-slate-50 flex items-center justify-center p-4 sm:p-8 font-sans">
    <div class="w-full max-w-xl text-center">
      <UCard class="p-6 md:p-10 rounded-2xl shadow-xl ring-1 ring-slate-200 text-center">
        <div class="size-20 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <UIcon name="i-lucide-sliders" class="size-10" />
        </div>
        <h1 class="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3">Content Management System</h1>
        <p class="text-slate-600 leading-relaxed mb-8 text-sm md:text-base">
          The MSI Website content (Curriculum, Activities, Partners) is fully managed through Nuxt Studio. Click below to launch the editor and modify the live content.
        </p>
        <UButton
          as="a"
          href="https://nuxt.studio"
          target="_blank"
          external
          rel="noopener noreferrer"
          icon="i-lucide-pencil"
          color="primary"
          variant="solid"
          size="xl"
          block
          class="font-bold justify-center rounded-xl cursor-pointer"
        >
          Launch Nuxt Studio Editor
        </UButton>
      </UCard>
    </div>
  </div>
</template>
