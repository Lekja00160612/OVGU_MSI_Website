<script setup lang="ts">
const { locale, t } = useI18n()
const localePath = useLocalePath()

const { data: activities } = await useAsyncData('all-activities', () =>
  queryCollection('activities').order('date', 'DESC').all()
)

const homePath = locale.value === 'vi' ? '/vi' : '/'
const { data: rawPage } = await useAsyncData(`home-page-for-activities-${locale.value}`, () =>
  queryCollection('content').path(homePath).first()
)

const activitiesPath = locale.value === 'vi' ? '/vi/academic-activities' : '/academic-activities'
const { data: pageData } = await useAsyncData(`activities-page-${locale.value}`, () =>
  queryCollection('content').path(activitiesPath).first()
)

const highlightsList = computed(() => rawPage.value?.meta?.activities?.highlights || [])
const highlightedActivities = computed(() => {
  if (!activities.value || highlightsList.value.length === 0) return []
  return highlightsList.value.map((p: string) => activities.value?.find((a: any) => a.path === p)).filter(Boolean)
})

provide('pageData', {
  activities,
  highlightedActivities,
  localePath,
  pageData
})

useSeoMeta({
  title: computed(() => `${t('nav.academic_activities')} - Field Trips & Seminars | MSI VGU`),
  ogTitle: computed(() => `${t('nav.academic_activities')} - Field Trips & Seminars | MSI VGU`),
  description: computed(() => pageData.value?.description || 'Discover our academic activities: scientific seminars, international workshops, high-tech industrial field trips, and advanced laboratory hands-on training for Master of Science students.'),
  ogDescription: computed(() => pageData.value?.description || 'Discover our academic activities: scientific seminars, international workshops, high-tech industrial field trips, and advanced laboratory hands-on training for Master of Science students.'),
})
</script>

<template>
  <div class="min-h-[80vh] bg-slate-50 pb-16">
    <ContentRenderer v-if="pageData" :value="pageData" />
    <div v-else class="max-w-7xl mx-auto px-4 min-h-[60vh] flex items-center justify-center">
      <p class="text-slate-500 font-medium">Loading…</p>
    </div>
  </div>
</template>
