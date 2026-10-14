<script setup lang="ts">
const { locale, t } = useI18n()
const localePath = useLocalePath()

const pathPrefix = computed(() => locale.value === 'en' ? '/' : `/${locale.value}`)

const { data: raw } = await useAsyncData(`msi-home-page-${locale.value}`, () =>
  queryCollection('content').path(pathPrefix.value).first(),
  { watch: [locale] }
)
const { data: allActivities } = await useAsyncData(`msi-all-activities-${locale.value}`, () =>
  queryCollection('activities').all(),
  { watch: [locale] }
)
const { data: allModules } = await useAsyncData(`msi-all-modules-${locale.value}`, () =>
  queryCollection('modules').all(),
  { watch: [locale] }
)

// @nuxt/content v3: pass the full raw document so injected child components
// (HomeCurriculum, HomeActivities, etc.) can access both .meta and top-level fields.
const page = computed(() => raw.value ?? {})

// SEO Metadata for the homepage targeting prospective Master's students
useSeoMeta({
  title: () => raw.value?.title ? `${raw.value.title} | VGU & OVGU` : 'Master of Science in Materials Science and Innovation (MSI) | VGU & OVGU Magdeburg',
  ogTitle: () => raw.value?.title ? `${raw.value.title} | VGU & OVGU` : 'Master of Science in Materials Science and Innovation (MSI) | VGU & OVGU Magdeburg',
  description: () => raw.value?.meta?.description || 'Study Materials Science & Innovation at VGU. Earn a German-standard joint degree from Otto von Guericke University Magdeburg & VGU with computational mechanics and wide-bandgap semiconductor specialties.',
  ogDescription: () => raw.value?.meta?.description || 'Study Materials Science & Innovation at VGU. Earn a German-standard joint degree from Otto von Guericke University Magdeburg & VGU with computational mechanics and wide-bandgap semiconductor specialties.',
})

const recentActivities = computed(() => {
  if (!allActivities.value) return []

  // Get highlighted activities and sort by date descending
  const highlighted = allActivities.value.filter(a => a.highlighted === true || a.meta?.highlighted === true)
  
  const sortByDateDesc = (a: any, b: any) => {
    const dateA = a.date || a.meta?.date || ''
    const dateB = b.date || b.meta?.date || ''
    return dateB.localeCompare(dateA)
  }

  const sortedHighlighted = [...highlighted].sort(sortByDateDesc)

  if (sortedHighlighted.length >= 4) {
    return sortedHighlighted.slice(0, 4)
  }

  // Fallback / fill the rest with recent non-highlighted activities
  const nonHighlighted = allActivities.value.filter(a => !(a.highlighted === true || a.meta?.highlighted === true))
  const sortedNonHighlighted = [...nonHighlighted].sort(sortByDateDesc)

  return [...sortedHighlighted, ...sortedNonHighlighted].slice(0, 4)
})

provide('pageData', { page, allModules, recentActivities, localePath })
</script>

<template>
  <div v-if="raw">
    <ContentRenderer :value="raw" />
  </div>
  <div v-else class="max-w-7xl mx-auto px-4 min-h-[60vh] flex items-center justify-center">
    <p class="text-slate-500 font-medium">{{ t('home.loading') }}</p>
  </div>
</template>
