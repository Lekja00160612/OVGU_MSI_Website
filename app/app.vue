<script setup lang="ts">
import { useLocaleHead, useHead } from '#imports'

const head = useLocaleHead({
  addDirAttribute: true,
  addSeoAttributes: true
})

useHead({
  htmlAttrs: {
    lang: () => head.value.htmlAttrs?.lang || 'en',
    dir: () => head.value.htmlAttrs?.dir || 'ltr'
  },
  link: () => head.value.link || [],
  meta: () => head.value.meta || []
})
</script>

<template>
  <UApp :toaster="{ expand: true }">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
