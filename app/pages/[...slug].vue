<script setup lang="ts">
const localePath = useLocalePath()
const route = useRoute()

// Check if route is a static document file mistakenly intercepted by vue-router
const isDocPath = computed(() => {
  const p = route.path.toLowerCase()
  return p.startsWith('/documents/') || p.endsWith('.pdf') || p.endsWith('.pptx') || p.endsWith('.xlsx')
})

if (isDocPath.value) {
  if (import.meta.client) {
    window.location.replace(route.fullPath)
  }
}

// Resolve content page based on current route path
const { data: page } = await useAsyncData('page-' + route.path, () =>
  queryCollection('content').path(route.path).first()
)

// Dynamic SEO metadata targeting prospective Master's students
useSeoMeta({
  title: () => page.value?.title ? `${page.value.title} - Materials Science & Innovation | VGU & OVGU` : 'Materials Science and Innovation (MSI) Master Program | VGU',
  ogTitle: () => page.value?.title ? `${page.value.title} - Materials Science & Innovation | VGU & OVGU` : 'Materials Science and Innovation (MSI) Master Program | VGU',
  description: () => page.value?.meta?.description || 'Earn a prestigious German-standard Master of Science joint degree in Materials Science and Innovation at VGU. High-tech research, study in Germany opportunities, and fully English-taught curriculum.',
  ogDescription: () => page.value?.meta?.description || 'Earn a prestigious German-standard Master of Science joint degree in Materials Science and Innovation at VGU. High-tech research, study in Germany opportunities, and fully English-taught curriculum.',
})
</script>

<template>
  <main class="min-h-[80vh] bg-slate-50 pb-20 font-sans">
    <template v-if="page">
      <!-- Premium Hero Banner -->
      <PageHeader :title="page.title" :description="page.meta?.description" />

      <!-- Main Body Container -->
      <div class="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
        <div class="bg-white p-6 sm:p-10 md:p-12 rounded-3xl border border-slate-200 shadow-xs">
          <ContentRenderer :value="page" class="prose max-w-none text-slate-700" />
        </div>
      </div>
    </template>
    <template v-else>
      <div class="flex items-center justify-center min-h-[50vh] px-4 py-16">
        <div class="text-center max-w-md p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <UIcon name="i-lucide-file-text" class="size-12 text-slate-300 mb-4" />
          <h1 class="text-2xl font-bold text-slate-900 mb-2">Content not found</h1>
          <p class="text-slate-600 mb-6 text-sm">This page hasn't been set up yet, or the translation is missing.</p>
          <UButton :to="localePath('/')" color="primary" variant="solid" size="md" icon="i-lucide-arrow-left" class="font-bold rounded-xl shadow-xs">
            Back to Home
          </UButton>
        </div>
      </div>
    </template>
  </main>
</template>
