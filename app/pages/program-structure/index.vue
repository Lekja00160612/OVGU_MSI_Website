<script setup lang="ts">
import { computed, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()
const { locale } = useI18n()

// Handle legacy query tabs (?tab=timetable, ?tab=modules, ?tab=electives, ?tab=thesis)
onMounted(() => {
  const tab = route.query.tab as string
  if (tab === 'timetable') {
    router.replace(localePath('/program-structure/timetable'))
  } else if (tab === 'modules' || tab === 'electives') {
    router.replace(localePath('/program-structure/modules'))
  } else if (tab === 'thesis') {
    router.replace(localePath('/program-structure/thesis'))
  }
})

// Fetch localized page content from content/program-structure.md
const pagePath = computed(() => locale.value === 'vi' ? '/vi/program-structure' : '/program-structure')
const { data: page } = await useAsyncData(`ps-page-${locale.value}`, () =>
  queryCollection('content').path(pagePath.value).first()
)

useSeoMeta({
  title: () => page.value?.title ? `${page.value.title} | MSI VGU` : 'Degree Blueprint & 120 ECTS Framework - Materials Science & Innovation | VGU',
  ogTitle: () => page.value?.title ? `${page.value.title} | MSI VGU` : 'Degree Blueprint & 120 ECTS Framework - Materials Science & Innovation | VGU',
  description: () => page.value?.meta?.description || 'Explore the German-standard dual-degree framework (120 ECTS) awarded by OVGU Magdeburg and VGU. Flexible block-modular study model for working engineers.',
  ogDescription: () => page.value?.meta?.description || 'Explore the German-standard dual-degree framework (120 ECTS) awarded by OVGU Magdeburg and VGU. Flexible block-modular study model for working engineers.',
})
</script>

<template>
  <main class="min-h-[80vh] bg-slate-50 pb-20 font-sans">
    <PageHeader
      :title="page?.title || 'Program Structure & Degree Blueprint'"
      :description="page?.meta?.description || page?.meta?.subtitle"
    />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 mt-8 flex flex-col gap-10">
      <!-- Intro Markdown from content/program-structure.md -->
      <div v-if="page" class="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs">
        <ContentRenderer :value="page" class="prose max-w-none text-slate-700" />
      </div>

      <!-- Core Degree Blueprint MDC Component -->
      <DegreeBlueprint />
    </div>
  </main>
</template>
