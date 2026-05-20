<script setup lang="ts">
const { activities, highlightedActivities, localePath } = inject('pageData') as any

const categories = ['All', 'Academic Lectures', 'Industry Adventures', 'Lab Works', 'Other Activities']
const activeCategory = ref('All')
const searchQuery = ref('')

const filteredActivities = computed(() => {
  if (!activities?.value) return []
  return activities.value.filter((a: any) => {
    const cat = a.meta?.category || a.category || ''

    let matchCat = false
    if (activeCategory.value === 'All') {
      matchCat = true
    } else if (activeCategory.value === 'Other Activities') {
      matchCat = !['Academic Lectures', 'Industry Adventures', 'Lab Works'].includes(cat)
    } else {
      matchCat = cat === activeCategory.value
    }

    const q = searchQuery.value.toLowerCase()
    if (!q) return matchCat
    const titleMatch = (a.title || '').toLowerCase().includes(q)
    const descMatch = (a.meta?.description || a.description || '').toLowerCase().includes(q)
    return matchCat && (titleMatch || descMatch)
  })
})

const showHighlights = computed(
  () =>
    activeCategory.value === 'All' &&
    !searchQuery.value &&
    highlightedActivities?.value?.length > 0
)

function clearFilters() {
  activeCategory.value = 'All'
  searchQuery.value = ''
}
</script>

<template>
  <div class="activities-explorer">
    <!-- ── Header Banner ── -->
    <div class="header-banner">
      <div class="banner-inner">
        <h1 class="page-title">Academic Activities</h1>
        <p class="page-subtitle">Explore our latest seminars, industry visits, and campus events.</p>
      </div>
    </div>

    <!-- ── Featured Highlights ── -->
    <div v-if="showHighlights" class="container highlights-section">
      <div class="highlights-header">
        <h2 class="highlights-title">Featured Highlights</h2>
        <div class="highlights-line" />
      </div>
      <div class="activities-grid">
        <NuxtLink
          v-for="act in highlightedActivities.value"
          :key="act.path"
          :to="localePath(act.path.replace('/_activities', '/academic-activities'))"
          class="activity-card activity-card--featured"
        >
          <div class="act-img-wrap">
            <NuxtImg :src="act.meta?.image || act.image" class="act-img" loading="lazy" />
            <span class="act-category">{{ act.meta?.category || act.category }}</span>
          </div>
          <div class="act-content">
            <div class="act-date">{{ act.meta?.date || act.date }}</div>
            <h3 class="act-title">{{ act.title }}</h3>
            <p class="act-desc">{{ act.meta?.description || act.description }}</p>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- ── Search + Filter Bar ── -->
    <div class="container filter-bar" :class="{ 'mt-lg': showHighlights }">
      <UInput
        v-model="searchQuery"
        icon="i-heroicons-magnifying-glass"
        placeholder="Search activities..."
        class="search-input"
        size="md"
      />
      <div class="category-filters">
        <UButton
          v-for="cat in categories"
          :key="cat"
          :variant="activeCategory === cat ? 'solid' : 'outline'"
          :color="activeCategory === cat ? 'primary' : 'gray'"
          size="sm"
          class="cat-btn"
          @click="activeCategory = cat"
        >
          {{ cat }}
        </UButton>
      </div>
    </div>

    <!-- ── Activities Grid ── -->
    <div class="container activities-grid main-grid">
      <NuxtLink
        v-for="act in filteredActivities"
        :key="act.path"
        :to="localePath(act.path.replace('/_activities', '/academic-activities'))"
        class="activity-card"
      >
        <div class="act-img-wrap">
          <NuxtImg :src="act.meta?.image || act.image" class="act-img" loading="lazy" />
          <span class="act-category">{{ act.meta?.category || act.category }}</span>
        </div>
        <div class="act-content" style="max-height: 420px; overflow-y: auto;">
          <div class="act-date">{{ act.meta?.date || act.date }}</div>
          <h3 class="act-title">{{ act.title }}</h3>
          <p class="act-desc" style="max-height: 120px; overflow: hidden;">
            {{ act.meta?.description || act.description }}
          </p>
        </div>
      </NuxtLink>
    </div>

    <!-- ── No Results ── -->
    <div v-if="filteredActivities.length === 0" class="container no-results">
      <p class="no-results-text">No activities found matching your criteria.</p>
      <UButton variant="outline" color="primary" @click="clearFilters">
        Clear Filters
      </UButton>
    </div>
  </div>
</template>

<style scoped>
/* ── Explorer wrapper ── */
.activities-explorer {
  min-height: 80vh;
  background: var(--color-gray-50, #f9fafb);
  padding-bottom: 4rem;
}

/* ── Header Banner ── */
.header-banner {
  background: var(--color-primary-dark, #1a1a4e);
  padding: 5rem 1.5rem;
  color: #fff;
  margin-bottom: 3rem;
}
.banner-inner {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}
.page-title {
  font-size: 3rem;
  font-family: var(--font-display, inherit);
  font-weight: 800;
  margin-bottom: 1rem;
  background-color: var(--color-accent, #e63946);
  padding: 0 0.5rem;
  display: inline-block;
}
.page-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
}

/* ── Container ── */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* ── Highlights ── */
.highlights-section {
  margin-bottom: 3rem;
}
.highlights-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}
.highlights-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-primary-dark, #1a1a4e);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
  white-space: nowrap;
}
.highlights-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(to right, var(--color-primary, #7a0026) 0%, transparent 100%);
  opacity: 0.3;
}

/* ── Filter bar ── */
.filter-bar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 3rem;
}
@media (min-width: 768px) {
  .filter-bar {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
.search-input {
  width: 100%;
  max-width: 320px;
}
.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.cat-btn {
  border-radius: var(--radius-full, 9999px) !important;
  font-size: 0.85rem !important;
  font-weight: 600 !important;
}
.mt-lg {
  margin-top: 3rem;
}

/* ── Activities Grid ── */
.activities-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}
@media (min-width: 640px) {
  .activities-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1024px) {
  .activities-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
.main-grid {
  margin-bottom: 2rem;
}

/* ── Activity Card ── */
.activity-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: var(--radius-lg, 12px);
  overflow: hidden;
  box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.1));
  transition: transform 250ms, box-shadow 250ms;
  text-decoration: none;
  color: inherit;
}
.activity-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md, 0 4px 12px rgba(0,0,0,0.12));
}
.activity-card--featured {
  border: 1px solid var(--color-gray-200, #e5e7eb);
  box-shadow: var(--shadow-md, 0 4px 12px rgba(0,0,0,0.12));
}
.activity-card--featured:hover {
  box-shadow: var(--shadow-lg, 0 8px 24px rgba(0,0,0,0.14));
  border-color: var(--color-gray-300, #d1d5db);
}

/* ── Card image ── */
.act-img-wrap {
  position: relative;
  height: 200px;
  overflow: hidden;
}
.act-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 400ms ease;
}
.activity-card:hover .act-img {
  transform: scale(1.05);
}
.act-category {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: var(--color-accent, #e63946);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-sm, 4px);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

/* ── Card content ── */
.act-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.act-date {
  font-size: 0.8rem;
  color: var(--color-gray-500, #6b7280);
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.act-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-primary, #7a0026);
  padding: 0.4rem 0.6rem;
  border-radius: var(--radius-sm, 4px);
  display: inline-block;
  margin-bottom: 0.75rem;
  line-height: 1.4;
  transition: background 200ms;
}
.activity-card:hover .act-title {
  background: var(--color-accent, #e63946);
  color: #fff;
  text-decoration: none;
}
.act-desc {
  font-size: 0.9rem;
  color: var(--color-gray-600, #4b5563);
  line-height: 1.6;
}

/* ── No results ── */
.no-results {
  padding: 4rem 1.5rem;
  text-align: center;
}
.no-results-text {
  font-size: 1.1rem;
  color: var(--color-gray-600, #4b5563);
  margin-bottom: 1.5rem;
}
</style>
