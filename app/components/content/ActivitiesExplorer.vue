<script setup lang="ts">
import { ref, computed, inject, watch, nextTick } from 'vue'

const { t } = useI18n()
const { activities, highlightedActivities, localePath, pageData } = inject('pageData') as any

const categories = ['All', 'Academic Lectures', 'Industry Adventures', 'Lab Works', 'Other Activities']
const activeCategory = ref('All')
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 6
const filterBarRef = ref<HTMLElement | null>(null)

// Reset page on filter changes & scroll to grid
watch([activeCategory, searchQuery], () => {
  currentPage.value = 1
})

function scrollToStart() {
  nextTick(() => {
    if (filterBarRef.value) {
      const top = filterBarRef.value.getBoundingClientRect().top + window.scrollY - 96
      window.scrollTo({ top, behavior: 'smooth' })
    }
  })
}

function selectCategory(cat: string) {
  activeCategory.value = cat
  scrollToStart()
}

const filteredActivities = computed(() => {
  if (!activities?.value) return []
  return activities.value.filter((a: any) => {
    // Exclude template
    if (a.path && (a.path.endsWith('00-template') || a.path.includes('template'))) return false

    const cat = a.meta?.category || a.category || ''

    let matchCat = false
    if (activeCategory.value === 'All') {
      matchCat = true
    } else if (activeCategory.value === 'Other Activities') {
      matchCat = !['Academic Lectures', 'Scientific Seminars', 'Industry Adventures', 'Lab Works', 'Lab Trainings'].includes(cat)
    } else if (activeCategory.value === 'Lab Works') {
      matchCat = cat === 'Lab Works' || cat === 'Lab Trainings'
    } else if (activeCategory.value === 'Academic Lectures') {
      matchCat = cat === 'Academic Lectures' || cat === 'Scientific Seminars'
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

const totalPages = computed(() => {
  return Math.ceil(filteredActivities.value.length / itemsPerPage)
})

const paginatedActivities = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredActivities.value.slice(start, end)
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
  scrollToStart()
}
</script>

<template>
  <div class="activities-explorer">
    <!-- ── Header Banner ── -->
    <div class="header-banner">
      <div class="banner-inner">
        <h1 class="page-title">{{ pageData?.title || t('activities.title') }}</h1>
        <p class="page-subtitle">{{ pageData?.description || t('activities.subtitle') }}</p>
      </div>
    </div>

    <!-- ── Featured Highlights ── -->
    <div v-if="showHighlights" class="container highlights-section">
      <div class="highlights-header">
        <h2 class="highlights-title">{{ t('activities.featured') }}</h2>
        <div class="highlights-line" />
      </div>
      <div class="highlights-grid">
        <NuxtLink
          v-for="act in highlightedActivities"
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
    <div ref="filterBarRef" class="container filter-bar" :class="{ 'mt-lg': showHighlights }">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="t('activities.search_placeholder')"
          class="custom-search-input"
        />
      </div>
      <div class="category-filters">
        <button
          v-for="cat in categories"
          :key="cat"
          class="custom-cat-btn"
          :class="{ 'custom-cat-btn--active': activeCategory === cat }"
          @click="selectCategory(cat)"
        >
          {{ t('activities.cat_' + cat.toLowerCase().replace(/ /g, '_')) }}
        </button>
      </div>
    </div>

    <!-- ── Activities Grid ── -->
    <div ref="gridRef" class="container activities-grid main-grid">
      <NuxtLink
        v-for="act in paginatedActivities"
        :key="act.path"
        :to="localePath(act.path.replace('/_activities', '/academic-activities'))"
        class="activity-card"
      >
        <div class="act-img-wrap">
          <NuxtImg :src="act.meta?.image || act.image" class="act-img" loading="lazy" />
          <span class="act-category">{{ act.meta?.category || act.category }}</span>
        </div>
        <div class="act-content">
          <div class="act-date">{{ act.meta?.date || act.date }}</div>
          <h3 class="act-title">{{ act.title }}</h3>
          <p class="act-desc">
            {{ act.meta?.description || act.description }}
          </p>
        </div>
      </NuxtLink>
    </div>

    <!-- ── No Results ── -->
    <div v-if="filteredActivities.length === 0" class="container no-results">
      <p class="no-results-text">{{ t('activities.no_results') }}</p>
      <button class="custom-clear-btn" @click="clearFilters">
        {{ t('activities.clear_filters') }}
      </button>
    </div>

    <!-- ── Pagination Bar ── -->
    <div v-if="totalPages > 1" class="container pagination-container">
      <div class="pagination-bar">
        <button
          class="pag-btn"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          &larr; {{ t('activities.prev') }}
        </button>
        <button
          v-for="p in totalPages"
          :key="p"
          class="pag-num"
          :class="{ 'pag-num--active': currentPage === p }"
          @click="currentPage = p"
        >
          {{ p }}
        </button>
        <button
          class="pag-btn"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          {{ t('activities.next') }} &rarr;
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── Explorer wrapper ── */
.activities-explorer {
  min-height: 80vh;
  background: var(--color-gray-50, #f9fafb);
  padding-bottom: 3rem;
}

/* ── Header Banner ── */
.header-banner {
  background: var(--color-primary-dark, #102a43);
  padding: 3.5rem 1.5rem;
  color: #fff;
  margin-bottom: 2rem;
  text-align: center;
}
.banner-inner {
  max-width: 1200px;
  margin: 0 auto;
}
.page-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-family: var(--font-display, inherit);
  font-weight: 800;
  margin-bottom: 0.75rem;
  color: #fff;
  position: relative;
  display: inline-block;
}
.page-title::after {
  content: "";
  display: block;
  width: 60px;
  height: 4px;
  background: var(--color-accent, #e87722);
  margin: 0.5rem auto 0;
  border-radius: var(--radius-full, 9999px);
}
.page-subtitle {
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.85);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.5;
}

/* ── Container ── */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* ── Highlights ── */
.highlights-section {
  margin-bottom: 2rem;
}
.highlights-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.highlights-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-primary-dark, #102a43);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
  white-space: nowrap;
}
.highlights-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(to right, var(--color-primary, #1e3a5f) 0%, transparent 100%);
  opacity: 0.3;
}

/* ── Filter bar ── */
.filter-bar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}
@media (min-width: 768px) {
  .filter-bar {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

/* Custom Search Box */
.search-box {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 360px;
}
.search-icon {
  position: absolute;
  left: 1rem;
  color: var(--color-gray-400, #9ca3af);
  font-size: 0.95rem;
}
.custom-search-input {
  width: 100%;
  padding: 0.65rem 1rem 0.65rem 2.5rem;
  font-size: 0.9rem;
  font-family: inherit;
  color: var(--color-gray-800, #1f2937);
  background-color: #fff;
  border: 1px solid var(--color-gray-300, #d1d5db);
  border-radius: var(--radius-full, 9999px);
  outline: none;
  transition: border-color 250ms, box-shadow 250ms;
}
.custom-search-input:focus {
  border-color: var(--color-primary, #1e3a5f);
  box-shadow: 0 0 0 3px rgba(30, 58, 95, 0.12);
}

/* Custom Category Buttons */
.category-filters {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 0.5rem;
  padding-bottom: 0.5rem;
  margin-bottom: -0.5rem;
  scrollbar-width: none; /* Firefox */
}
.category-filters::-webkit-scrollbar {
  display: none; /* Safari + Chrome */
}
@media (min-width: 768px) {
  .category-filters {
    flex-wrap: wrap;
    overflow-x: visible;
    padding-bottom: 0;
    margin-bottom: 0;
  }
}
.custom-cat-btn {
  white-space: nowrap;
  padding: 0.5rem 1.15rem;
  font-size: 0.825rem;
  font-weight: 600;
  font-family: inherit;
  color: var(--color-gray-700, #4b5563);
  background-color: #fff;
  border: 1px solid var(--color-gray-300, #d1d5db);
  border-radius: var(--radius-full, 9999px);
  cursor: pointer;
  transition: all 200ms;
}
.custom-cat-btn:hover {
  color: var(--color-primary, #1e3a5f);
  border-color: var(--color-primary, #1e3a5f);
  background-color: rgba(30, 58, 95, 0.03);
}
.custom-cat-btn--active {
  color: #fff !important;
  background-color: var(--color-primary, #1e3a5f) !important;
  border-color: var(--color-primary, #1e3a5f) !important;
  box-shadow: var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05));
}
.mt-lg {
  margin-top: 2rem;
}

/* ── Highlights Horizontal Scroll ── */
.highlights-grid {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 1.5rem;
  padding-bottom: 1rem;
  margin-bottom: -0.5rem;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
  scrollbar-color: var(--color-gray-300, #d1d5db) transparent;
}
.highlights-grid .activity-card--featured {
  flex: 0 0 280px;
  scroll-snap-align: start;
}
@media (min-width: 768px) {
  .highlights-grid .activity-card--featured {
    flex: 0 0 340px;
  }
}
@media (min-width: 1024px) {
  .highlights-grid .activity-card--featured {
    flex: 0 0 360px;
  }
}
.highlights-grid::-webkit-scrollbar {
  height: 6px;
}
.highlights-grid::-webkit-scrollbar-track {
  background: transparent;
}
.highlights-grid::-webkit-scrollbar-thumb {
  background-color: var(--color-gray-300, #d1d5db);
  border-radius: var(--radius-full, 9999px);
}
.highlights-grid::-webkit-scrollbar-thumb:hover {
  background-color: var(--color-gray-400, #9ca3af);
}

/* ── Activities Grid ── */
.activities-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
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
  margin-bottom: 2.5rem;
}

/* ── Activity Card ── */
.activity-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: var(--radius-xl, 16px);
  overflow: hidden;
  box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.06));
  border: 1px solid var(--color-gray-100, #f3f4f6);
  transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms;
  text-decoration: none;
  color: inherit;
}
.activity-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md, 0 6px 16px rgba(0,0,0,0.08));
  border-color: var(--color-gray-200, #e5e7eb);
}
.activity-card--featured {
  border: 1px solid var(--color-gray-200, #e5e7eb);
  box-shadow: var(--shadow-sm);
}

/* ── Card image ── */
.act-img-wrap {
  position: relative;
  height: 200px;
  overflow: hidden;
  background-color: var(--color-gray-100, #f3f4f6);
}
.act-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 400ms ease;
}
.activity-card:hover .act-img {
  transform: scale(1.04);
}
.act-category {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: var(--color-accent, #e87722);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.3rem 0.75rem;
  border-radius: var(--radius-sm, 4px);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
  z-index: 2;
}

/* ── Card content ── */
.act-content {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.act-date {
  font-size: 0.78rem;
  color: var(--color-gray-500, #6b7280);
  font-weight: 600;
  margin-bottom: 0.4rem;
}
.act-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-primary-dark, #102a43);
  margin-bottom: 0.5rem;
  line-height: 1.35;
  transition: color 200ms;
}
.activity-card:hover .act-title {
  color: var(--color-accent, #e87722);
}
.act-desc {
  font-size: 0.85rem;
  color: var(--color-gray-600, #4b5563);
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

/* ── No results ── */
.no-results {
  padding: 3rem 1.5rem;
  text-align: center;
}
.no-results-text {
  font-size: 1rem;
  color: var(--color-gray-600, #4b5563);
  margin-bottom: 1.25rem;
}
.custom-clear-btn {
  padding: 0.55rem 1.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: inherit;
  color: var(--color-primary, #1e3a5f);
  background-color: transparent;
  border: 2px solid var(--color-primary, #1e3a5f);
  border-radius: var(--radius-full, 9999px);
  cursor: pointer;
  transition: all 250ms;
}
.custom-clear-btn:hover {
  color: #fff;
  background-color: var(--color-primary, #1e3a5f);
}

/* ── Pagination Bar ── */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}
.pagination-bar {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background-color: #fff;
  padding: 0.4rem 0.6rem;
  border-radius: var(--radius-full, 9999px);
  box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.05));
  border: 1px solid var(--color-gray-200, #e5e7eb);
}
.pag-btn {
  background: transparent;
  border: none;
  color: var(--color-gray-600, #4b5563);
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  border-radius: var(--radius-full, 9999px);
  transition: all 200ms;
}
.pag-btn:hover:not(:disabled) {
  color: var(--color-primary, #1e3a5f);
  background-color: var(--color-gray-100, #f3f4f6);
}
.pag-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.pag-num {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-gray-700, #374151);
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 200ms;
}
.pag-num:hover:not(.pag-num--active) {
  background-color: var(--color-gray-100, #f3f4f6);
  color: var(--color-primary, #1e3a5f);
}
.pag-num--active {
  background-color: var(--color-accent, #e87722) !important;
  color: #fff !important;
  box-shadow: 0 2px 6px rgba(232, 119, 34, 0.3);
}
</style>
