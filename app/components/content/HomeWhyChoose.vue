<script setup lang="ts">
const { page, localePath } = inject('pageData') as any

const iconMap: Record<string, string> = {
  diploma:    'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
  lab:        'M9 3v10.5a3 3 0 003 3h0a3 3 0 003-3V3 M6.5 3h11 M8 12H5a2 2 0 00-2 2v1a4 4 0 004 4h10a4 4 0 004-4v-1a2 2 0 00-2-2h-3',
  faculty:    'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  hybrid:     'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  industry:   'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  scholarship:'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
}
</script>

<template>
  <section class="section features-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">{{ page.whyChoose?.headline }}</h2>
        <p class="section-subtitle">{{ page.whyChoose?.subtitle }}</p>
      </div>
      <div class="features-grid">
        <div v-for="f in page.whyChoose?.features" :key="f.id" class="feature-card card">
          <div class="feature-icon-wrap">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path :d="iconMap[f.icon] ?? iconMap.diploma" />
            </svg>
          </div>
          <h3 class="feature-title">{{ f.title }}</h3>
          <p class="feature-desc">{{ f.description }}</p>
          <NuxtLink v-if="f.link" :to="localePath(f.link)" class="feature-link">View {{ f.title }} &rarr;</NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ══ FEATURES / WHY CHOOSE ══ */
.features-section { background: var(--color-gray-50); }
.features-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}
@media (min-width: 640px) { .features-grid { grid-template-columns: repeat(2,1fr); } }
@media (min-width: 1024px) { .features-grid { grid-template-columns: repeat(3,1fr); } }

.feature-card {
  padding: 1.75rem;
  max-height: 420px;
  overflow-y: auto;
}
.feature-icon-wrap {
  width: 48px; height: 48px;
  border-radius: var(--radius-md);
  background: var(--color-primary-50);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 1.125rem;
  color: var(--color-primary);
  transition: background 250ms;
}
.feature-card:hover .feature-icon-wrap { background: var(--color-primary); color: #fff; }
.feature-icon-svg { width: 24px; height: 24px; }
.feature-title { font-size: 1rem; font-weight: 700; color: var(--color-primary); margin-bottom: 0.625rem; }
.feature-desc { font-size: 0.875rem; color: var(--color-gray-600); line-height: 1.65; margin-bottom: 1rem; }
.feature-link { font-size: 0.85rem; font-weight: 700; color: var(--color-primary); text-decoration: none; }
.feature-link:hover { text-decoration: underline; color: var(--color-ovgu-blue); }
</style>
