<script setup lang="ts">
const localePath = useLocalePath()
const route = useRoute()

// Resolve content page based on current route path
const { data: page } = await useAsyncData('page-' + route.path, () =>
  queryCollection('content').path(route.path).first()
)
</script>

<template>
  <main class="page-container">
    <template v-if="page">
      <!-- Premium Hero Banner -->
      <div class="header-banner">
        <div class="container text-center">
          <h1 class="page-title">{{ page.title }}</h1>
          <p v-if="page.description" class="page-subtitle">{{ page.description }}</p>
        </div>
      </div>

      <!-- Main Body Container -->
      <div class="container content-section">
        <div class="prose-wrapper">
          <ContentRenderer :value="page" class="prose" />
        </div>
      </div>
    </template>
    <template v-else>
      <div class="not-found container section">
        <div class="not-found-inner">
          <div class="not-found-icon">📄</div>
          <h1>Content not found</h1>
          <p>This page hasn't been set up yet, or the translation is missing.</p>
          <NuxtLink :to="localePath('/')" class="btn btn-primary">← Back to Home</NuxtLink>
        </div>
      </div>
    </template>
  </main>
</template>

<style scoped>
.page-container {
  min-height: 80vh;
  background: var(--color-gray-50);
  padding-bottom: 5rem;
}

.header-banner {
  background: var(--color-primary-dark);
  padding: 5rem 1.5rem;
  color: #fff;
  margin-bottom: 4rem;
}

.page-title {
  font-size: 3rem;
  font-family: var(--font-display);
  font-weight: 800;
  margin-bottom: 1rem;
  background-color: var(--color-accent);
  padding: 0rem 0.5rem;
  display: inline-block;
}

.page-subtitle {
  font-size: 1.1rem;
  color: rgba(255,255,255,0.8);
}

.content-section {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.prose-wrapper {
  background: #ffffff;
  padding: 3rem;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-gray-200);
}

.prose :deep(h2) {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-top: 2.5rem;
  margin-bottom: 1.25rem;
  border-bottom: 2px solid var(--color-gray-100);
  padding-bottom: 0.5rem;
}

.prose :deep(h3) {
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-gray-800);
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.prose :deep(p) {
  font-size: 1.05rem;
  color: var(--color-gray-600);
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.prose :deep(ul), .prose :deep(ol) {
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
}

.prose :deep(li) {
  font-size: 1.05rem;
  color: var(--color-gray-600);
  line-height: 1.7;
  margin-bottom: 0.75rem;
}

.prose :deep(strong) {
  color: var(--color-primary);
}

.prose :deep(blockquote) {
  border-left: 4px solid var(--color-accent);
  background: var(--color-gray-50);
  padding: 1.25rem 1.5rem;
  margin: 2rem 0;
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
}

.prose :deep(blockquote p) {
  font-style: italic;
  font-size: 1.1rem;
  color: var(--color-gray-700);
  margin: 0;
}

.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
}

.not-found-inner {
  text-align: center;
  padding: 4rem 2rem;
  max-width: 480px;
}

.not-found-icon {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
}

.not-found-inner h1 {
  font-size: 1.75rem;
  color: var(--color-gray-900);
  margin-bottom: 0.75rem;
}

.not-found-inner p {
  color: var(--color-gray-600);
  margin-bottom: 2rem;
  line-height: 1.6;
}
</style>
