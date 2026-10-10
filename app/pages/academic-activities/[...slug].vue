<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const route = useRoute()
const localePath = useLocalePath()
const { locale, t } = useI18n()

// Construct the actual CMS path to query from '_activities'
const slug = Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug
const contentPath = `/_activities/${slug}`

const { data: activity } = await useAsyncData(`activity-${contentPath}`, () =>
  queryCollection('activities').path(contentPath).first()
)

if (!activity.value) {
  throw createError({ statusCode: 404, statusMessage: 'Activity not found', fatal: true })
}

const resolvedPoster = computed(() => {
  const componentName = activity.value?.posterComponent
  if (!componentName) return null
  return defineAsyncComponent(() => import(`../../components/content/posters/${componentName}.vue`))
})

useSeoMeta({
  title: () => activity.value?.title ? `${activity.value.title} - Academic Activities | MSI VGU` : 'Academic Activity | MSI VGU',
  ogTitle: () => activity.value?.title ? `${activity.value.title} - Academic Activities | MSI VGU` : 'Academic Activity | MSI VGU',
  description: () => activity.value?.meta?.description || activity.value?.description || 'Read about the latest academic activities, field trips, guest lectures, and lab trainings in the Materials Science & Innovation program.',
  ogDescription: () => activity.value?.meta?.description || activity.value?.description || 'Read about the latest academic activities, field trips, guest lectures, and lab trainings in the Materials Science & Innovation program.',
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => {
        if (!activity.value) return ''
        const act = activity.value
        const isEvent = !!act.invitation || !!act.meta?.invitation || !!act.eventDate
        const fullUrl = `https://msi.vgu.edu.vn${route.path}`
        const imgUrl = (act.meta?.image || act.image) 
          ? `https://msi.vgu.edu.vn${act.meta?.image || act.image}`
          : 'https://msi.vgu.edu.vn/Thumbnail/MATERIALS%20SCIENCE_THUMB.png'

        if (isEvent) {
          return JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Event',
            'name': act.title,
            'url': fullUrl,
            'startDate': act.eventDate || act.date,
            'description': act.meta?.description || act.description,
            'image': imgUrl,
            'eventStatus': 'https://schema.org/EventScheduled',
            'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
            'location': {
              '@type': 'Place',
              'name': 'Vietnamese-German University (VGU)',
              'address': {
                '@type': 'PostalAddress',
                'streetAddress': 'Ring road 4, Quarter 4, Thoi Hoa Ward',
                'addressLocality': 'Ben Cat City',
                'addressRegion': 'Binh Duong Province',
                'addressCountry': 'VN'
              }
            },
            'organizer': {
              '@type': 'CollegeOrUniversity',
              'name': 'Materials Science and Innovation Program, VGU & OVGU',
              'url': 'https://msi.vgu.edu.vn'
            }
          })
        }

        return JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          'headline': act.title,
          'url': fullUrl,
          'datePublished': act.meta?.date || act.date,
          'image': [imgUrl],
          'description': act.meta?.description || act.description,
          'publisher': {
            '@type': 'CollegeOrUniversity',
            'name': 'Vietnamese-German University',
            'logo': {
              '@type': 'ImageObject',
              'url': 'https://msi.vgu.edu.vn/Logo/VGU_Logo.png'
            }
          }
        })
      })
    }
  ]
})
</script>

<template>
  <div class="activity-detail-page" :class="{ 'invitation-detail-page': activity?.invitation }">
    <!-- If invitation flag is true and custom component exists, render the poster -->
    <component 
      v-if="activity?.invitation && resolvedPoster" 
      :is="resolvedPoster" 
      :activity="activity" 
    />
    
    <!-- Fallback standard blog-style layout -->
    <div v-else class="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-16">
      <UButton
        :to="localePath('/academic-activities')"
        color="primary"
        variant="ghost"
        size="sm"
        icon="i-lucide-arrow-left"
        class="mb-6 font-semibold"
      >
        {{ t('activities.back_to_activities') }}
      </UButton>

      <div v-if="activity" class="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10 md:p-12">
        <div class="mb-8 text-center max-w-2xl mx-auto">
          <div class="flex items-center justify-center gap-2 mb-4">
            <UBadge color="primary" variant="subtle" size="sm" class="font-bold">
              {{ activity.meta?.category || activity.category }}
            </UBadge>
            <span class="text-xs text-slate-400 font-medium">{{ activity.meta?.date || activity.date }}</span>
          </div>
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">{{ activity.title }}</h1>
        </div>

        <div v-if="activity.meta?.image || activity.image" class="w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden mb-8 bg-slate-100 border border-slate-100">
          <NuxtImg :src="activity.meta?.image || activity.image" :alt="activity.title" class="w-full h-full object-cover" />
        </div>

        <div class="prose max-w-none text-slate-700">
          <ContentRenderer :value="activity" />
        </div>
      </div>
    </div>
  </div>
</template>
