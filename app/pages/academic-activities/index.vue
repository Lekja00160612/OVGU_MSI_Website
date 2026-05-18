<script setup lang="ts">
const { data: activities } = await useAsyncData('all-activities', () =>
  queryCollection('activities').order('date', 'DESC').all()
)

const { data: rawPage } = await useAsyncData('home-page-activities', () =>
  queryCollection('content').path('/').first()
)

const categories = ['All', 'Academic Lectures', 'Industry Adventures', 'Lab Works', 'Other Activities']
const activeCategory = ref('All')
const searchQuery = ref('')
const localePath = useLocalePath()

const highlightsList = computed(() => rawPage.value?.meta?.activities?.highlights || [])
const highlightedActivities = computed(() => {
  if (!activities.value || highlightsList.value.length === 0) return []
  return highlightsList.value.map((p: string) => activities.value?.find(a => a.path === p)).filter(Boolean)
})

const filteredActivities = computed(() => {
  if (!activities.value) return []
  return activities.value.filter(a => {
    const cat = a.meta?.category || a.category || ''
    
    let matchCat = false
    if (activeCategory.value === 'All') {
      matchCat = true
    } else if (activeCategory.value === 'Other Activities') {
      matchCat = !['Academic Lectures', 'Industry Adventures', 'Lab Works'].includes(cat)
    } else {
      matchCat = cat === activeCategory.value
    }
    const titleMatch = a.title?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const descMatch = (a.meta?.description || a.description || '').toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchCat && (titleMatch || descMatch)
  })
})
</script>

<template>
  <div class="page-activities">
    <div class="header-banner">
      <div class="container text-center">
        <h1 class="page-title">Academic Activities</h1>
        <p class="page-subtitle">Explore our latest seminars, industry visits, and campus events.</p>
      </div>
    </div>
    
    <div v-if="highlightedActivities.length > 0 && activeCategory === 'All' && !searchQuery" class="container highlights-section">
      <div class="highlights-header">
        <h2 class="highlights-title">Featured Highlights</h2>
        <div class="highlights-line"></div>
      </div>
      <div class="activities-grid highlights-grid">
        <NuxtLink v-for="act in highlightedActivities" :key="act.path" :to="localePath(act.path.replace('/_activities', '/academic-activities'))" class="activity-card activity-card--featured">
          <div class="act-img-wrap">
            <NuxtImg :src="act.meta?.image || act.image" class="act-img" loading="lazy" />
            <span class="act-category">{{ act.meta?.category || act.category }}</span>
          </div>
          <div class="act-content">
            <div class="act-date">{{ act.meta?.date || act.date }}</div>
            <h2 class="act-title">{{ act.title }}</h2>
            <p class="act-desc">{{ act.meta?.description || act.description }}</p>
          </div>
        </NuxtLink>
      </div>
    </div>
    
    <div class="container filter-bar" :class="{ 'mt-12': highlightedActivities.length > 0 && activeCategory === 'All' && !searchQuery }">
      <div class="search-wrap">
        <input v-model="searchQuery" type="text" placeholder="Search activities..." class="search-input" />
      </div>
      <div class="category-filters">
        <button 
          v-for="cat in categories" 
          :key="cat" 
          class="cat-btn"
          :class="{ 'cat-btn--active': activeCategory === cat }"
          @click="activeCategory = cat"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <div class="container activities-grid">
      <NuxtLink v-for="act in filteredActivities" :key="act.path" :to="localePath(act.path.replace('/_activities', '/academic-activities'))" class="activity-card">
        <div class="act-img-wrap">
          <NuxtImg :src="act.meta?.image || act.image" class="act-img" loading="lazy" />
          <span class="act-category">{{ act.meta?.category || act.category }}</span>
        </div>
        <div class="act-content">
          <div class="act-date">{{ act.meta?.date || act.date }}</div>
          <h2 class="act-title">{{ act.title }}</h2>
          <p class="act-desc">{{ act.meta?.description || act.description }}</p>
        </div>
      </NuxtLink>
    </div>
    
    <div v-if="filteredActivities.length === 0" class="container text-center no-results">
      <p>No activities found matching your criteria.</p>
      <button @click="activeCategory = 'All'; searchQuery = ''" class="btn btn-outline">Clear Filters</button>
    </div>
  </div>
</template>

<style scoped>
.page-activities { min-height: 80vh; background: var(--color-gray-50); padding-bottom: 4rem; }
.header-banner { background: var(--color-primary-dark); padding: 5rem 1.5rem; color: #fff; margin-bottom: 3rem; }
.page-title { font-size: 3rem; font-family: var(--font-display); font-weight: 800; margin-bottom: 1rem; background-color: var(--color-accent); padding: 0rem 0.5rem; display: inline-block;}
.page-subtitle { font-size: 1.1rem; color: rgba(255,255,255,0.8); }

.filter-bar { display: flex; flex-direction: column; gap: 1.5rem; margin-bottom: 3rem; }
@media (min-width: 768px) { .filter-bar { flex-direction: row; justify-content: space-between; align-items: center; } }

.search-input { width: 100%; max-width: 300px; padding: 0.75rem 1rem; border: 1px solid var(--color-gray-200); border-radius: var(--radius-md); font-size: 0.95rem; }
.category-filters { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.cat-btn { padding: 0.5rem 1rem; background: #fff; border: 1px solid var(--color-gray-200); border-radius: var(--radius-full); font-size: 0.85rem; font-weight: 600; color: var(--color-gray-600); cursor: pointer; transition: all 200ms; }
.cat-btn:hover { border-color: var(--color-primary); color: var(--color-primary); }
.cat-btn--active { background: var(--color-primary); color: #fff; border-color: var(--color-primary); }
.cat-btn--active:hover { color: #fff; }

.activities-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
@media (min-width: 640px) { .activities-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .activities-grid { grid-template-columns: repeat(3, 1fr); } }

.highlights-section { margin-bottom: 3rem; }
.highlights-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
.highlights-title { font-size: 1.5rem; font-weight: 800; color: var(--color-primary-dark); text-transform: uppercase; letter-spacing: 0.05em; margin: 0; white-space: nowrap; }
.highlights-line { flex: 1; height: 2px; background: linear-gradient(to right, var(--color-primary) 0%, transparent 100%); opacity: 0.3; }

.activity-card { display: flex; flex-direction: column; background: #fff; border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-sm); transition: transform 250ms, box-shadow 250ms; text-decoration: none; color: inherit; }
.activity-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
.activity-card--featured { border: 1px solid var(--color-gray-200); box-shadow: var(--shadow-md); }
.activity-card--featured:hover { box-shadow: var(--shadow-lg); border-color: var(--color-gray-300); }

.act-img-wrap { position: relative; height: 200px; overflow: hidden; }
.act-img { width: 100%; height: 100%; object-fit: cover; transition: transform 400ms ease; }
.activity-card:hover .act-img { transform: scale(1.05); }

.act-category { position: absolute; top: 1rem; left: 1rem; background: var(--color-accent); color: #fff; font-size: 0.7rem; font-weight: 700; padding: 0.25rem 0.75rem; border-radius: var(--radius-sm); letter-spacing: 0.05em; text-transform: uppercase; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
.act-content { padding: 1.5rem; display: flex; flex-direction: column; flex: 1; }
.act-date { font-size: 0.8rem; color: var(--color-gray-500); font-weight: 600; margin-bottom: 0.5rem; }
.act-title { font-size: 1.2rem; font-weight: 700; color: var(--color-primary); padding: 0.5rem 0.75rem; border-radius: var(--radius-sm); display: inline-block; margin-bottom: 0.75rem; line-height: 1.4; transition: background 200ms; }
.activity-card:hover .act-title { background: var(--color-accent); text-decoration: none; }
.act-desc { font-size: 0.9rem; color: var(--color-gray-600); line-height: 1.6; }

.no-results { padding: 4rem 1rem; }
.no-results p { font-size: 1.1rem; color: var(--color-gray-600); margin-bottom: 1.5rem; }
.mt-12 { margin-top: 3rem; }
</style>
