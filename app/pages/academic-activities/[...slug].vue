<script setup lang="ts">
import { useRoute, useI18n, useAsyncData, createError, useSeoMeta } from '#imports'

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

useSeoMeta({
  title: () => activity.value?.title ? `${activity.value.title} - Academic Activities | MSI VGU` : 'Academic Activity | MSI VGU',
  ogTitle: () => activity.value?.title ? `${activity.value.title} - Academic Activities | MSI VGU` : 'Academic Activity | MSI VGU',
  description: () => activity.value?.meta?.description || activity.value?.description || 'Read about the latest academic activities, field trips, guest lectures, and lab trainings in the Materials Science & Innovation program.',
  ogDescription: () => activity.value?.meta?.description || activity.value?.description || 'Read about the latest academic activities, field trips, guest lectures, and lab trainings in the Materials Science & Innovation program.',
})
</script>

<template>
  <div class="activity-detail-page">
    <div class="container py-12">
      <NuxtLink :to="localePath('/academic-activities')" class="back-link">
        &larr; {{ t('activities.back_to_activities') }}
      </NuxtLink>

      <div v-if="activity" class="activity-content-card">
        <div class="activity-header">
          <div class="activity-meta">
            <span class="activity-category">{{ activity.meta?.category || activity.category }}</span>
            <span class="activity-date">{{ activity.meta?.date || activity.date }}</span>
          </div>
          <h1 class="activity-title">{{ activity.title }}</h1>
        </div>

        <div v-if="activity.meta?.image || activity.image" class="activity-hero-image">
          <NuxtImg :src="activity.meta?.image || activity.image" :alt="activity.title" class="hero-img" />
        </div>

        <div class="activity-body prose max-w-none">
          <ContentRenderer :value="activity" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.activity-detail-page {
  background: var(--color-gray-50);
  min-height: 80vh;
}
.py-12 {
  padding-top: 2rem;
  padding-bottom: 4rem;
}
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  transition: color 200ms, transform 200ms;
}
.back-link:hover {
  color: var(--color-accent);
  transform: translateX(-4px);
}

.activity-content-card {
  --card-padding-x: 3rem;
  --card-padding-y: 3rem;
  background: #fff;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-gray-200);
  padding: var(--card-padding-y) var(--card-padding-x);
  max-width: 900px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .activity-content-card {
    --card-padding-x: 1rem;
    --card-padding-y: 1.25rem;
  }
}

.activity-header {
  margin-bottom: 2rem;
  text-align: center;
}

@media (max-width: 768px) {
  .activity-header {
    margin-bottom: 1.25rem;
  }
}

.activity-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.activity-category {
  background: var(--color-accent);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.3rem 0.85rem;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.activity-date {
  color: var(--color-gray-500);
  font-size: 0.9rem;
  font-weight: 600;
}

.activity-title {
  font-size: clamp(1.5rem, 5vw, 2.5rem);
  font-weight: 800;
  color: var(--color-primary-dark);
  line-height: 1.2;
}

.activity-hero-image {
  margin: 0 calc(-1 * var(--card-padding-x)) 2.5rem calc(-1 * var(--card-padding-x));
  height: 400px;
  background: var(--color-gray-100);
  overflow: hidden;
}

@media (max-width: 768px) {
  .activity-hero-image {
    height: 220px;
    margin-bottom: 1.5rem;
  }
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.activity-body {
  font-size: 1.05rem;
  color: var(--color-gray-800);
  line-height: 1.75;
}

@media (max-width: 768px) {
  .activity-body {
    font-size: 0.95rem;
    line-height: 1.6;
  }
}
</style>
