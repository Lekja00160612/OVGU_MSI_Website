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
  title: computed(() => `${t('nav.academic_activities')} | MSI`),
  description: computed(() => pageData.value?.description || t('activities.subtitle'))
})
</script>

<template>
  <div class="page-activities">
    <ContentRenderer v-if="pageData" :value="pageData" />
    <div v-else class="container" style="min-height:60vh;display:flex;align-items:center;justify-content:center">
      <p>Loading…</p>
    </div>
  </div>
</template>

<style scoped>
.page-activities { min-height: 80vh; background: var(--color-gray-50); padding-bottom: 4rem; }
</style>
