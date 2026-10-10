<script setup lang="ts">
import { ref, computed, inject, watch, nextTick } from 'vue'

const { t } = useI18n()
const { activities, highlightedActivities, localePath, pageData } = inject('pageData') as any

const categories = ['All', 'Academic Lectures', 'Industrial Visits', 'Lab Trainings', 'Achievements & Events']

const activeCategory = ref('All')
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 6
const filterBarRef = ref<HTMLElement | null>(null)

// Reset page on filter changes & scroll to grid
watch([activeCategory, searchQuery], () => {
  currentPage.value = 1
})

watch(currentPage, () => {
  scrollToStart()
})

function scrollToStart() {
  nextTick(() => {
    if (filterBarRef.value) {
      const header = document.querySelector('.site-header')
      const headerHeight = header ? (header as HTMLElement).offsetHeight : 120
      const top = filterBarRef.value.getBoundingClientRect().top + window.scrollY - headerHeight - 24
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
    let normalizedCat = cat
    if (cat === 'Industry Adventures') normalizedCat = 'Industrial Visits'
    if (cat === 'Lab Works') normalizedCat = 'Lab Trainings'
    if (cat === 'Scientific Seminars') normalizedCat = 'Academic Lectures'

    const matchCat = activeCategory.value === 'All' || normalizedCat === activeCategory.value

    const q = searchQuery.value.toLowerCase()
    if (!q) return matchCat
    const titleMatch = (a.title || '').toLowerCase().includes(q)
    const descMatch = (a.meta?.description || a.description || '').toLowerCase()
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
  <div class="min-h-[80vh] bg-slate-50 pb-16 font-sans">
    <!-- ── Header Banner ── -->
    <PageHeader :title="pageData?.title || t('activities.title')" :description="pageData?.description || t('activities.subtitle')" />

    <!-- ── Featured Highlights ── -->
    <div v-if="showHighlights" class="max-w-6xl mx-auto px-4 sm:px-6 my-10">
      <div class="flex items-center gap-4 mb-6">
        <h2 class="text-sm font-extrabold uppercase tracking-widest text-slate-900 whitespace-nowrap">
          {{ t('activities.featured') }}
        </h2>
        <div class="flex-1 h-0.5 bg-slate-200" />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NuxtLink
          v-for="act in highlightedActivities"
          :key="act.path"
          :to="localePath(act.path.replace('/_activities', '/academic-activities'))"
          class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
        >
          <div class="relative h-60 overflow-hidden bg-slate-100">
            <NuxtImg :src="act.meta?.image || act.image" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
            <UBadge color="primary" variant="subtle" size="xs" class="absolute top-4 right-4 font-semibold backdrop-blur-md bg-white/90">
              {{ act.meta?.category || act.category }}
            </UBadge>
          </div>
          <div class="p-6 flex flex-col flex-1 justify-between gap-3">
            <div>
              <div class="text-xs font-semibold text-slate-400 mb-1">{{ act.meta?.date || act.date }}</div>
              <h3 class="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
                {{ act.title }}
              </h3>
              <p class="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                {{ act.meta?.description || act.description }}
              </p>
            </div>
            <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-primary-600">
              <span>Read Story</span>
              <UIcon name="i-lucide-arrow-right" class="size-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- ── Search + Filter Bar ── -->
    <div ref="filterBarRef" class="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 my-8">
      <div class="w-full md:w-80">
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          size="md"
          :placeholder="t('activities.search_placeholder')"
          class="w-full"
        />
      </div>
      <div class="flex flex-wrap gap-1.5">
        <UButton
          v-for="cat in categories"
          :key="cat"
          :variant="activeCategory === cat ? 'solid' : 'outline'"
          color="primary"
          size="sm"
          class="rounded-full font-semibold shadow-xs"
          @click="selectCategory(cat)"
        >
          {{ t('activities.cat_' + cat.toLowerCase().replace(/ /g, '_')) }}
        </UButton>
      </div>
    </div>

    <!-- ── Activities Grid ── -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="act in paginatedActivities"
        :key="act.path"
        :to="localePath(act.path.replace('/_activities', '/academic-activities'))"
        class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col group"
      >
        <div class="relative h-48 overflow-hidden bg-slate-100">
          <NuxtImg :src="act.meta?.image || act.image" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
          <UBadge color="primary" variant="subtle" size="xs" class="absolute top-3 right-3 font-semibold backdrop-blur-md bg-white/85">
            {{ act.meta?.category || act.category }}
          </UBadge>
        </div>
        <div class="p-5 flex flex-col flex-1 justify-between gap-2">
          <div>
            <div class="text-xs font-semibold text-slate-400 mb-1">{{ act.meta?.date || act.date }}</div>
            <h3 class="text-base font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
              {{ act.title }}
            </h3>
            <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {{ act.meta?.description || act.description }}
            </p>
          </div>
          <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-primary-600">
            <span>Read Story</span>
            <UIcon name="i-lucide-arrow-right" class="size-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- ── No Results ── -->
    <div v-if="filteredActivities.length === 0" class="max-w-6xl mx-auto px-4 sm:px-6 text-center py-12 bg-white rounded-2xl border border-slate-200 my-8">
      <p class="text-slate-500 mb-4 text-sm">{{ t('activities.no_results') }}</p>
      <UButton color="primary" variant="solid" size="sm" class="font-bold rounded-xl" @click="clearFilters">
        {{ t('activities.clear_filters') }}
      </UButton>
    </div>

    <!-- ── Pagination Bar ── -->
    <div v-if="totalPages > 1" class="max-w-6xl mx-auto px-4 sm:px-6 flex justify-center py-8">
      <UPagination
        v-model:page="currentPage"
        :total="filteredActivities.length"
        :items-per-page="itemsPerPage"
        color="primary"
        variant="subtle"
        size="md"
      />
    </div>
  </div>
</template>
