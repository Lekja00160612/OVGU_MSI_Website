<script setup lang="ts">
const route = useRoute()
const localePath = useLocalePath()
const { locale, t } = useI18n()

// Fetch localized page content
const pagePath = locale.value === 'vi' ? '/vi/program-structure' : '/program-structure'
const { data: pageData } = await useAsyncData(`ps-page-${locale.value}`, () =>
  queryCollection('content').path(pagePath).first()
)
const page = computed(() => pageData.value?.meta ?? {})

// Fetch all modules
const { data: allModules } = await useAsyncData('all-modules', () =>
  queryCollection('modules').all()
)

const coreModules = computed(() => {
  return allModules.value?.filter(m => !(m.is_elective || m.meta?.is_elective)) || []
})

const electiveModules = computed(() => {
  return allModules.value?.filter(m => m.is_elective || m.meta?.is_elective) || []
})

const selectedModule = ref<any | null>(null)
const isDrawerOpen = ref(false)

watch(selectedModule, (newVal) => {
  isDrawerOpen.value = !!newVal
})
watch(isDrawerOpen, (newVal) => {
  if (!newVal) {
    selectedModule.value = null
  }
})

// Electives Carousel & View Toggle States
const electiveViewMode = ref('carousel') // 'carousel' or 'compact'
const carouselIndex = ref(0)

const maxCarouselIndex = computed(() => {
  return Math.max(0, electiveModules.value.length - 1)
})

const prevElectives = () => {
  if (carouselIndex.value > 0) {
    carouselIndex.value--
  }
}

const nextElectives = () => {
  if (carouselIndex.value < maxCarouselIndex.value) {
    carouselIndex.value++
  } else {
    carouselIndex.value = 0 // loop back
  }
}

// Auto-play interval
let autoplayTimer: any = null
onMounted(() => {
  autoplayTimer = setInterval(() => {
    nextElectives()
  }, 4000)
})

onUnmounted(() => {
  if (autoplayTimer) clearInterval(autoplayTimer)
})

// Mobile Accordion & Styling Helpers
const activeMobileModule = ref<string | null>(null)
const toggleMobileModule = (path: string) => {
  activeMobileModule.value = activeMobileModule.value === path ? null : path
}

const getSemesterColor = (sem: number | string) => {
  const s = Number(sem)
  if (s === 1) return 'var(--color-primary)'
  if (s === 2) return 'var(--color-primary-light)'
  if (s === 3) return 'var(--color-accent)'
  return 'var(--color-accent-dark)'
}
</script>

<template>
  <div class="page-structure">
    <div class="header-banner">
      <div class="container text-center">
        <h1 class="page-title">{{ page.headline || 'Program Structure' }}</h1>
        <p class="page-subtitle">{{ page.subtitle }}</p>
      </div>
    </div>
    
    <div class="container intro-section text-center">
      <p class="intro-text">
        {{ page.intro_text }}
      </p>
      <div class="cta-wrapper mt-12 mb-16">
        <a href="/Documents/MODULE CATALOGUE MSI.pdf" target="_blank" class="btn btn-primary cta-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
          {{ page.cta_handbook || t('program.handbook_btn') }}
        </a>
      </div>
    </div>

    <!-- CORE MODULES -->
    <div class="container modules-container">
      <h2 class="section-title text-center mb-4">{{ page.core_title || t('program.core_title') }}</h2>
      
      <!-- German Lecturer Legend -->
      <div class="legend-container text-center mb-26">
        <span class="legend-item legend-item--highlighted bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm inline-flex items-center text-sm font-semibold">
          <span class="german-indicator-dot-legend mr-2" />
          {{ t('program.german_indicator_legend') }}
        </span>
      </div>

      <!-- DESKTOP MODULES LAYOUT -->
      <div class="desktop-only w-full">
        <div class="modules-layout">
          <div class="modules-grid">
            <button 
              v-for="mod in coreModules" 
              :key="mod.path" 
              class="module-card"
              :class="{ 'module-card--active': selectedModule?.path === mod.path }"
              :style="{ '--mod-color': getSemesterColor(mod.semester || mod.meta?.semester || 1) }"
              @click="selectedModule = mod"
            >
              <span class="mod-name">{{ mod.title }}</span>
              <span v-if="mod.meta?.german_lecturer || mod.german_lecturer" class="german-indicator-dot" title="Taught by German Lecturer" />
            </button>
          </div>
          
          <!-- Desktop Details View -->
          <div class="module-details">
            <div v-if="selectedModule" class="module-details-inner fade-in">
              <div class="mod-details-header">
                <h3 class="mod-details-title">{{ selectedModule.title }}</h3>
                <span v-if="selectedModule.meta?.german_lecturer || selectedModule.german_lecturer" class="badge-german">🟢 {{ t('program.german_badge') }}</span>
              </div>
              <div class="mod-details-content prose max-w-none">
                <ContentRenderer v-if="selectedModule.body" :value="selectedModule" />
                <p v-else>{{ selectedModule.description }}</p>
              </div>
              <a href="/Documents/MODULE CATALOGUE MSI.pdf" target="_blank" class="btn btn-outline mt-6">{{ page.view_handbook || t('program.view_in_handbook') }}</a>
            </div>
            <div v-else class="module-details-empty fade-in">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="empty-icon"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.671zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-5.407l-1.59-1.59" /></svg>
              <span>{{ t('program.select_module') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- MOBILE MODULES LAYOUT (COMPACT SCROLLABLE) -->
      <div class="mobile-only w-full">
        <div class="mobile-modules-scroll-container mb-6">
          <div class="mobile-modules-rows">
            <button
              v-for="mod in coreModules"
              :key="mod.path"
              class="mobile-mod-chip"
              :class="{ 'mobile-mod-chip--active': selectedModule?.path === mod.path }"
              :style="{ '--mod-color': getSemesterColor(mod.semester || mod.meta?.semester || 1) }"
              @click="selectedModule = mod"
            >
              {{ mod.title }}
            </button>
          </div>
        </div>

        <div v-if="selectedModule" class="mobile-mod-detail-box fade-in">
          <div class="mobile-mod-detail-header" :style="{ borderBottomColor: getSemesterColor(selectedModule.semester || selectedModule.meta?.semester || 1) }">
            <h3 class="mobile-mod-detail-title">{{ selectedModule.title }}</h3>
            <span v-if="selectedModule.meta?.german_lecturer || selectedModule.german_lecturer" class="badge-german text-[10px]">🟢 {{ t('program.german_badge') }}</span>
          </div>
          <div class="mobile-module-desc prose prose-sm max-w-none text-gray-600 mt-4">
            <ContentRenderer v-if="selectedModule.body" :value="selectedModule" />
            <p v-else class="text-sm mb-3 font-medium text-gray-700">{{ selectedModule.description }}</p>
          </div>
          <a href="/Documents/MODULE CATALOGUE MSI.pdf" target="_blank" class="btn btn-outline w-full mt-6 text-center justify-center">
            {{ t('program.view_in_handbook') }} &rarr;
          </a>
        </div>
      </div>
    </div>

    <!-- ELECTIVE COURSES -->
    <div v-if="electiveModules.length > 0" class="container electives-container">
      <div class="electives-header flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div class="text-center sm:text-left">
          <h2 class="section-title mb-2">{{ page.electives_title || t('program.electives_title') }}</h2>
          <p class="text-gray-600 text-sm max-w-xl">{{ page.electives_intro }}</p>
        </div>
        
        <!-- Toggle Switcher -->
        <div class="toggle-group bg-gray-100 p-1 rounded-full flex gap-1 border border-gray-200">
          <button 
            type="button"
            class="toggle-btn"
            :class="{ 'toggle-btn--active': electiveViewMode === 'carousel' }"
            @click="electiveViewMode = 'carousel'"
          >
            <span>🎠 {{ t('program.carousel_view') }}</span>
          </button>
          <button 
            type="button"
            class="toggle-btn"
            :class="{ 'toggle-btn--active': electiveViewMode === 'compact' }"
            @click="electiveViewMode = 'compact'"
          >
            <span>📋 {{ t('program.compact_view') }}</span>
          </button>
        </div>
      </div>

      <!-- VIEW 1: CAROUSEL VIEW -->
      <div v-if="electiveViewMode === 'carousel'" class="carousel-view-wrapper relative">
        <div class="electives-carousel-grid">
          <Transition name="carousel-slide" mode="out-in">
            <div 
              :key="carouselIndex"
              class="carousel-pair-container"
            >
              <!-- Slide item 1 -->
              <div 
                v-if="electiveModules[carouselIndex]" 
                class="elective-card-slide"
              >
                <div class="elective-content">
                  <span class="elective-card-sem-badge">{{ t('program.sem') }} {{ electiveModules[carouselIndex].semester || 3 }}</span>
                  <h3 class="elective-title">{{ electiveModules[carouselIndex].title }}</h3>
                  <div class="prose elective-desc-body">
                    <ContentRenderer v-if="electiveModules[carouselIndex].body" :value="electiveModules[carouselIndex]" />
                    <p v-else class="text-sm font-medium text-gray-700 mb-3">{{ electiveModules[carouselIndex].description }}</p>
                  </div>
                </div>
              </div>
              
              <!-- Slide item 2 (if available and screened is wide enough) -->
              <div 
                v-if="electiveModules[carouselIndex + 1]" 
                class="elective-card-slide desktop-only-inline"
              >
                <div class="elective-content">
                  <span class="elective-card-sem-badge">{{ t('program.sem') }} {{ electiveModules[carouselIndex + 1].semester || 3 }}</span>
                  <h3 class="elective-title">{{ electiveModules[carouselIndex + 1].title }}</h3>
                  <div class="prose elective-desc-body">
                    <ContentRenderer v-if="electiveModules[carouselIndex + 1].body" :value="electiveModules[carouselIndex + 1]" />
                    <p v-else class="text-sm font-medium text-gray-700 mb-3">{{ electiveModules[carouselIndex + 1].description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Carousel navigation controls at bottom -->
        <div class="carousel-nav-controls mt-16 flex justify-between items-center w-full">
          <button 
            type="button"
            class="carousel-nav-btn"
            :disabled="carouselIndex === 0"
            @click="prevElectives"
            :style="{ opacity: carouselIndex === 0 ? 0.35 : 1, cursor: carouselIndex === 0 ? 'not-allowed' : 'pointer' }"
          >
            &larr; {{ t('program.prev') }}
          </button>
          
          <div class="carousel-bullets">
            <span 
              v-for="idx in maxCarouselIndex + 1"
              :key="idx"
              class="carousel-bullet"
              :class="{ 'carousel-bullet--active': carouselIndex === idx - 1 }"
              @click="carouselIndex = idx - 1"
            />
          </div>

          <button 
            type="button"
            class="carousel-nav-btn"
            :disabled="carouselIndex >= maxCarouselIndex"
            @click="nextElectives"
            :style="{ opacity: carouselIndex >= maxCarouselIndex ? 0.35 : 1, cursor: carouselIndex >= maxCarouselIndex ? 'not-allowed' : 'pointer' }"
          >
            {{ t('program.next') }} &rarr;
          </button>
        </div>
      </div>

      <!-- VIEW 2: COMPACT VIEW (TITLES ONLY) -->
      <div v-else class="compact-view-wrapper fade-in">
        <div class="compact-grid">
          <div 
            v-for="mod in electiveModules" 
            :key="mod.path" 
            class="compact-elective-card"
          >
            <div class="compact-elective-info">
              <span class="compact-semester-tag">{{ t('program.semester_long') }} {{ mod.semester || 3 }}</span>
              <h3 class="compact-elective-title">{{ mod.title }}</h3>
            </div>
            <!-- Handdrawn styling detail view or simple info -->
            <div class="compact-elective-hover-desc mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
              {{ mod.description }}
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.page-structure { min-height: 80vh; background: var(--color-gray-50); padding-bottom: 5rem; }

.intro-section { max-width: 800px; margin: 0 auto 3rem auto; }
.intro-text { font-size: 1.05rem; color: var(--color-gray-700); line-height: 1.75; margin-bottom: 2rem; }
.cta-wrapper { display: flex; justify-content: center; width: 100%; margin: 2rem 0; }
.cta-btn { padding: 0.85rem 1.75rem; font-size: 1rem; }
.btn-icon { width: 22px; height: 22px; margin-right: 10px; display: inline-block; vertical-align: middle; }

.modules-container { margin-bottom: 3rem; }
.modules-layout {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: flex-start;
}
@media (min-width: 900px) { .modules-layout { flex-direction: row; } }

.modules-grid {
  flex: 1.2;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  width: 100%;
}

.module-card {
  background: #fff;
  color: var(--color-primary);
  padding: 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-gray-200);
  border-left: 5px solid var(--mod-color); /* use semester color */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: all 300ms var(--ease-out);
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  min-height: 100px;
  position: relative;
}
.module-card:hover { 
  transform: translateY(-5px); 
  box-shadow: var(--shadow-md); 
  border-color: var(--mod-color); 
}
.module-card--active { 
  background: var(--color-gray-50); 
  border-color: var(--mod-color); 
  border-width: 2px;
  border-left-width: 8px; /* Extra strong emphasize */
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
  transform: scale(1.02);
}

.mod-name { font-size: 0.9rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; line-height: 1.3; }

.german-indicator-dot {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 10px;
  height: 10px;
  background-color: var(--color-german-taught, #10B981);
  border-radius: 50%;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.4);
}

.german-indicator-dot-legend {
  display: inline-block;
  width: 12px;
  height: 12px;
  background-color: var(--color-german-taught, #10B981);
  border-radius: 50%;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.4);
  animation: pulse-green 2s infinite;
}

.german-indicator-dot-accordion {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: var(--color-german-taught, #10B981);
  border-radius: 50%;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.4);
}

@keyframes pulse-green {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

.legend-item--highlighted {
  background-color: #ecfdf5 !important;
  border-color: #a7f3d0 !important;
  color: #065f46 !important;
  box-shadow: 0 4px 10px rgba(16, 185, 129, 0.15) !important;
}

/* Mobile-Desktop Toggling */
.desktop-only { display: none; }
.mobile-only { display: block; }
@media (min-width: 900px) {
  .desktop-only { display: block; }
  .mobile-only { display: none; }
}

.module-details {
  flex: 1;
  width: 100%;
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background: #fff;
  border: 1px solid var(--color-primary-100);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  min-height: 480px;
  max-height: 80vh;
  position: sticky;
  top: 100px;
  overflow-y: auto;
}
.module-details-inner { display: flex; flex-direction: column; gap: 1rem; align-items: flex-start; }
.mod-details-header { display: flex; flex-direction: column; gap: 0.75rem; align-items: flex-start; margin-bottom: 0.5rem; border-bottom: 1px solid var(--color-gray-100); padding-bottom: 1rem; width: 100%; }
.mod-details-title { font-size: 1.75rem; font-weight: 800; color: var(--color-primary); line-height: 1.2; }
.badge-german { background: #ecfdf5; color: #065f46; font-size: 0.75rem; padding: 4px 8px; border-radius: 4px; font-weight: 600; border: 1px solid #a7f3d0; }
.mod-details-content { font-size: 1rem; color: var(--color-gray-600); line-height: 1.7; width: 100%; }

.module-details-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: var(--color-gray-400); gap: 1rem; padding: 2rem; }
.empty-icon { width: 64px; height: 64px; opacity: 0.3; }
.fade-in { animation: fadeIn 300ms ease forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.drawer-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-primary-dark);
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

/* ELECTIVES VIEW SWITCHER & LAYOUTS */
.electives-container { max-width: 1050px; margin: 0 auto; }
.toggle-group {
  display: inline-flex;
}
.toggle-btn {
  padding: 0.5rem 1.15rem;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-gray-600);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.toggle-btn:hover {
  color: var(--color-primary-dark);
}
.toggle-btn--active {
  background: #ffffff;
  color: var(--color-primary) !important;
  box-shadow: var(--shadow-sm);
  border-color: rgba(0,0,0,0.05);
}

/* Slide Styles */
.electives-carousel-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.elective-card-slide {
  background: #ffffff;
  padding: 2.25rem 2rem;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-gray-100);
  transition: all 0.4s var(--ease-out);
  display: flex;
  flex-direction: column;
  position: relative;
  flex: 1;
  height: 420px; /* Fix height */
  overflow-y: auto; /* Scrollable content */
}
.carousel-pair-container {
  display: flex;
  gap: 2rem; /* more space between elective cards */
  width: 100%;
}
.desktop-only-inline { display: none; }
@media (min-width: 1024px) { .desktop-only-inline { display: flex; } }

/* Modern Carousel Slide Animation */
.carousel-slide-enter-active,
.carousel-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.carousel-slide-enter-from {
  opacity: 0;
  transform: translateX(40px) scale(0.98);
}
.carousel-slide-leave-to {
  opacity: 0;
  transform: translateX(-40px) scale(0.98);
}
.elective-card-sem-badge {
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-accent-dark);
  background: var(--color-accent-50);
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-sm);
  display: inline-block;
  align-self: flex-start;
  margin-bottom: 0.75rem;
}
.elective-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--color-primary-dark);
  margin-bottom: 1rem;
}
.elective-desc-body {
  font-size: 0.95rem;
  color: var(--color-gray-600);
  line-height: 1.7;
}

/* Carousel Nav Controls */
.carousel-nav-controls {
  padding: 1.5rem 0;
  border-top: 1px solid var(--color-gray-100);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap; /* Keep on one line */
  gap: 0.5rem;
}
.carousel-nav-btn {
  padding: 0.75rem 1rem; /* slightly less padding for tighter fit on mobile */
  background: #ffffff;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-full);
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-primary);
  cursor: pointer;
  transition: all 300ms var(--ease-out);
  box-shadow: var(--shadow-sm);
  min-width: 90px;
  text-align: center;
}
.carousel-nav-btn:hover:not(:disabled) {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}
.carousel-bullets {
  display: flex;
  flex-wrap: wrap; /* allow dots to wrap on small screens (doubles) */
  justify-content: center;
  gap: 0.5rem;
  max-width: 140px; /* constrain width to force wrapping before pushing buttons */
}
.carousel-bullet {
  width: 8px;
  height: 8px;
  background: var(--color-gray-300);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}
.carousel-bullet--active {
  background: var(--color-primary);
  transform: scale(1.3);
}

/* Compact view */
.compact-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
@media (min-width: 768px) {
  .compact-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
.compact-elective-card {
  background: #ffffff;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
}
.compact-elective-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary-light);
}
.compact-elective-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.compact-semester-tag {
  font-size: 0.65rem;
  font-weight: 800;
  color: var(--color-primary);
  background: var(--color-primary-50);
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
  white-space: nowrap;
}
.compact-elective-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-primary-dark);
}

/* MOBILE SCROLLABLE CHIPS (2 ROWS) */
.mobile-modules-scroll-container {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding: 0.5rem 0 1rem 0;
}
.mobile-modules-rows {
  display: grid;
  grid-template-rows: repeat(2, auto); /* Strictly 2 rows */
  grid-auto-flow: column;
  gap: 0.75rem;
  width: max-content;
  padding-right: 2rem;
}
.mobile-mod-chip {
  padding: 0.75rem 1.25rem;
  background: #fff;
  border: 1px solid var(--color-gray-200);
  border-left: 4px solid var(--mod-color);
  border-radius: var(--radius-md);
  font-size: 0.95rem; /* Larger, more visible chips */
  font-weight: 700;
  color: var(--color-primary-dark);
  white-space: nowrap;
  transition: all 200ms;
  text-align: left;
}
.mobile-mod-chip--active {
  background: var(--mod-color);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.mobile-mod-detail-box {
  background: #fff;
  border-radius: var(--radius-xl);
  padding: 1.25rem;
  border: 1px solid var(--color-gray-200);
  box-shadow: var(--shadow-md);
  max-height: 45vh; /* Fix height for single length of phone view */
  overflow-y: auto;
}
.mobile-mod-detail-header {
  border-bottom: 2px solid;
  padding-bottom: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.mobile-mod-detail-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-primary-dark);
  line-height: 1.2;
}
.mobile-mod-detail-content {
  color: var(--color-gray-600);
  line-height: 1.6;
}
</style>
