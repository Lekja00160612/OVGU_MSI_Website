<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()
const localePath = useLocalePath()
const { locale } = useI18n()

// Fetch localized Future Students alumni content
const pagePath = computed(() => locale.value === 'vi' ? '/vi/future-students/alumni' : '/future-students/alumni')
const { data: page } = await useAsyncData('fs-page-alumni-' + locale.value, () =>
  queryCollection('content').path(pagePath.value).first()
)

// SEO Metadata optimized for student experience and prospective career pathways
useSeoMeta({
  title: () => page.value?.title ? `${page.value.title} | MSI VGU` : 'Student Experience & Career Pathways - Materials Science & Innovation | VGU',
  ogTitle: () => page.value?.title ? `${page.value.title} | MSI VGU` : 'Student Experience & Career Pathways - Materials Science & Innovation | VGU',
  description: () => page.value?.meta?.description || 'Read authentic experiences from MSI students and explore prospective career pathways across semiconductor packaging, automotive lightweighting, energy materials, and European Ph.D. pipelines.',
  ogDescription: () => page.value?.meta?.description || 'Read authentic experiences from MSI students and explore prospective career pathways across semiconductor packaging, automotive lightweighting, energy materials, and European Ph.D. pipelines.',
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        'name': page.value?.title || 'Student Experience & Career Pathways',
        'description': page.value?.meta?.description || 'Authentic student experiences and prospective career pathways from the MSI Master program.',
        'mainEntity': {
          '@type': 'Person',
          'name': 'Nguyễn Sơn Tùng',
          'alumniOf': {
            '@type': 'CollegeOrUniversity',
            'name': 'Vietnamese-German University & Otto von Guericke University Magdeburg'
          },
          'description': 'MSI Master Student (Intake 2024), DAAD Scholarship Recipient bridging computational intelligence with advanced materials science.'
        }
      }))
    }
  ]
})
</script>

<template>
  <main class="min-h-[80vh] bg-slate-50 pb-20 font-sans">
    <template v-if="page">
      <!-- Premium Hero Banner -->
      <PageHeader :title="page.title" :description="page.meta?.description" />

      <!-- Main Body Container -->
      <div class="max-w-4xl mx-auto px-4 sm:px-6 mt-8 flex flex-col gap-8">
        <div class="bg-white p-6 sm:p-10 md:p-12 rounded-3xl border border-slate-200 shadow-xs">
          <ContentRenderer :value="page" class="prose max-w-none text-slate-700" />
        </div>

        <!-- Navigation Bar Between Sub-pages -->
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200">
          <NuxtLink
            :to="localePath('/future-students/pathways')"
            class="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-orange-600 transition-colors"
          >
            <UIcon name="i-lucide-arrow-left" class="size-4 shrink-0" />
            <span>{{ locale === 'vi' ? 'Quay lại Sơ đồ lộ trình tuyển sinh' : 'Back to Application Pathways' }}</span>
          </NuxtLink>
          <NuxtLink
            :to="localePath('/tuition-scholarships')"
            class="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors"
          >
            <span>{{ locale === 'vi' ? 'Xem học bổng toàn phần DAAD Sur-Place →' : 'Explore DAAD Scholarships →' }}</span>
          </NuxtLink>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="flex items-center justify-center min-h-[50vh] px-4 py-16">
        <div class="text-center max-w-md p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <UIcon name="i-lucide-file-text" class="size-12 text-slate-300 mb-4" />
          <h1 class="text-2xl font-bold text-slate-900 mb-2">Content not found</h1>
          <p class="text-slate-600 mb-6 text-sm">This page hasn't been set up yet, or the translation is missing.</p>
          <UButton :to="localePath('/future-students')" color="primary" variant="solid" size="md" icon="i-lucide-arrow-left" class="font-bold rounded-xl shadow-xs">
            Back to Future Students
          </UButton>
        </div>
      </div>
    </template>
  </main>
</template>
