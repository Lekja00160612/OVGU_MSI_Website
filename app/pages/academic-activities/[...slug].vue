<script setup lang="ts">
const route = useRoute()
const localePath = useLocalePath()
const { locale } = useI18n()

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
  title: activity.value?.title || 'Academic Activity',
  description: activity.value?.meta?.description || activity.value?.description
})
</script>

<template>
  <div class="activity-detail-page">
    <div class="container py-12">
      <NuxtLink :to="localePath('/academic-activities')" class="back-link">&larr; Back to Activities</NuxtLink>

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
  padding-top: 3rem;
  padding-bottom: 5rem;
}
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
  margin-bottom: 2rem;
  transition: color 200ms, transform 200ms;
}
.back-link:hover {
  color: var(--color-accent);
  transform: translateX(-4px);
}
.activity-content-card {
  background: #fff;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-gray-200);
  padding: 3rem;
  max-width: 900px;
  margin: 0 auto;
}
.activity-header {
  margin-bottom: 2rem;
  text-align: center;
}
.activity-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.activity-category {
  background: var(--color-accent);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.35rem 1rem;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.activity-date {
  color: var(--color-gray-500);
  font-size: 0.95rem;
  font-weight: 600;
}
.activity-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--color-primary-dark);
  line-height: 1.2;
}
.activity-hero-image {
  margin: 0 -3rem 3rem -3rem;
  height: 400px;
  background: var(--color-gray-100);
}
.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.activity-body {
  font-size: 1.1rem;
  color: var(--color-gray-800);
  line-height: 1.8;
}
</style>
