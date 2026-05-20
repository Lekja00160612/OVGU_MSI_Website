<script setup lang="ts">
const route = useRoute()
const localePath = useLocalePath()
const { locale } = useI18n()

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
  return Math.max(0, electiveModules.value.length - 2)
})

const prevElectives = () => {
  if (carouselIndex.value > 0) {
    carouselIndex.value--
  }
}

const nextElectives = () => {
  if (carouselIndex.value < maxCarouselIndex.value) {
    carouselIndex.value++
  }
}

// Mobile Accordion & Styling Helpers
const activeMobileModule = ref<string | null>(null)
const toggleMobileModule = (path: string) => {
  activeMobileModule.value = activeMobileModule.value === path ? null : path
}

const getSemesterColor = (sem: number | string) => {
  const s = Number(sem)
  if (s === 1) return '#E87722'
  if (s === 2) return '#1E3A5F'
  if (s === 3) return '#10B981'
  return '#8B5CF6'
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
      <div class="cta-wrapper">
        <a href="/Documents/MODULE CATALOGUE MSI.pdf" target="_blank" class="btn btn-primary cta-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
          {{ page.cta_handbook || 'Explore Full Module Handbook' }}
        </a>
      </div>
    </div>

    <!-- CORE MODULES -->
    <div class="container modules-container">
      <h2 class="section-title text-center mb-4">{{ page.core_title || 'Core Modules' }}</h2>
      
      <!-- German Lecturer Legend -->
      <div class="legend-container text-center mb-8">
        <span class="legend-item legend-item--highlighted bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm inline-flex items-center text-sm font-semibold">
          <span class="german-indicator-dot-legend mr-2" />
          Taught by Visiting German Professors
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
                <span v-if="selectedModule.meta?.german_lecturer || selectedModule.german_lecturer" class="badge-german">🟢 Taught by German Lecturer</span>
              </div>
              <div class="mod-details-content prose max-w-none">
                <ContentRenderer :value="selectedModule" />
              </div>
              <a href="/Documents/MODULE CATALOGUE MSI.pdf" target="_blank" class="btn btn-outline mt-6">{{ page.view_handbook || 'View in Handbook &rarr;' }}</a>
            </div>
            <div v-else class="module-details-empty fade-in">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="empty-icon"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.671zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-5.407l-1.59-1.59" /></svg>
              <span>Select a module to view details</span>
            </div>
          </div>
        </div>
      </div>

      <!-- MOBILE MODULES LAYOUT (CUSTOM PREMIUM ACCORDION) -->
      <div class="mobile-only w-full">
        <div class="mobile-accordion-list">
          <div 
            v-for="mod in coreModules" 
            :key="mod.path"
            class="mobile-accordion-card"
            :class="{ 'mobile-accordion-card--active': activeMobileModule === mod.path }"
            :style="{ borderLeft: `5px solid ${getSemesterColor(mod.semester || mod.meta?.semester || 1)}` }"
          >
            <div class="mobile-accordion-header" @click="toggleMobileModule(mod.path)">
              <div class="mobile-accordion-header-left">
                <span class="mobile-sem-badge">Sem {{ mod.semester || mod.meta?.semester || 1 }}</span>
                <span class="mobile-accordion-title">{{ mod.title }}</span>
                <span v-if="mod.meta?.german_lecturer || mod.german_lecturer" class="german-indicator-dot-accordion ml-2" />
              </div>
              <span class="mobile-chevron-icon" :class="{ 'mobile-chevron-icon--rotated': activeMobileModule === mod.path }">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
              </span>
            </div>

            <!-- Detail expansion -->
            <div v-show="activeMobileModule === mod.path" class="mobile-accordion-content fade-in">
              <div class="mobile-detail-inner mt-3">
                <!-- German Lecturer Indicator -->
                <div v-if="mod.meta?.german_lecturer || mod.german_lecturer" class="badge-german mb-3 inline-block">
                  🟢 Taught by Visiting German Professors
                </div>

                <!-- Lecturers names -->
                <div v-if="mod.lecturers || mod.meta?.lecturers" class="mobile-lecturers-info mb-4">
                  <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Lecturer(s)</h4>
                  <p class="text-sm font-semibold text-primary-dark">
                    {{ Array.isArray(mod.lecturers || mod.meta?.lecturers) ? (mod.lecturers || mod.meta?.lecturers).join(', ') : (mod.lecturers || mod.meta?.lecturers) }}
                  </p>
                </div>

                <!-- Course Description -->
                <div class="mobile-module-desc prose prose-sm max-w-none text-gray-600">
                  <p class="text-sm mb-3 font-medium text-gray-700">{{ mod.description }}</p>
                  <ContentRenderer :value="mod" />
                </div>

                <!-- Download handbook CTA -->
                <a href="/Documents/MODULE CATALOGUE MSI.pdf" target="_blank" class="btn btn-outline w-full mt-4 text-center justify-center">
                  View in Handbook &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ELECTIVE COURSES -->
    <div v-if="electiveModules.length > 0" class="container electives-container">
      <div class="electives-header flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div class="text-center sm:text-left">
          <h2 class="section-title mb-2">{{ page.electives_title || 'Elective Courses' }}</h2>
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
            <span>🎠 Carousel View</span>
          </button>
          <button 
            type="button"
            class="toggle-btn"
            :class="{ 'toggle-btn--active': electiveViewMode === 'compact' }"
            @click="electiveViewMode = 'compact'"
          >
            <span>📋 Compact Titles</span>
          </button>
        </div>
      </div>

      <!-- VIEW 1: CAROUSEL VIEW -->
      <div v-if="electiveViewMode === 'carousel'" class="carousel-view-wrapper relative">
        <div class="electives-carousel-grid">
          <!-- Slide item 1 -->
          <div 
            v-if="electiveModules[carouselIndex]" 
            class="elective-card-slide fade-in"
          >
            <div class="elective-content">
              <span class="elective-card-sem-badge">Sem {{ electiveModules[carouselIndex].semester || 3 }}</span>
              <h3 class="elective-title">{{ electiveModules[carouselIndex].title }}</h3>
              <div class="prose elective-desc-body">
                <p class="text-sm font-medium text-gray-700 mb-3">{{ electiveModules[carouselIndex].description }}</p>
                <ContentRenderer :value="electiveModules[carouselIndex]" />
              </div>
            </div>
          </div>
          
          <!-- Slide item 2 -->
          <div 
            v-if="electiveModules[carouselIndex + 1]" 
            class="elective-card-slide fade-in"
          >
            <div class="elective-content">
              <span class="elective-card-sem-badge">Sem {{ electiveModules[carouselIndex + 1].semester || 3 }}</span>
              <h3 class="elective-title">{{ electiveModules[carouselIndex + 1].title }}</h3>
              <div class="prose elective-desc-body">
                <p class="text-sm font-medium text-gray-700 mb-3">{{ electiveModules[carouselIndex + 1].description }}</p>
                <ContentRenderer :value="electiveModules[carouselIndex + 1]" />
              </div>
            </div>
          </div>
        </div>

        <!-- Carousel navigation buttons at bottom -->
        <div class="carousel-nav-controls mt-6 flex justify-between items-center max-w-xs mx-auto">
          <button 
            type="button"
            class="carousel-nav-btn"
            :disabled="carouselIndex === 0"
            @click="prevElectives"
            :style="{ opacity: carouselIndex === 0 ? 0.35 : 1, cursor: carouselIndex === 0 ? 'not-allowed' : 'pointer' }"
          >
            &larr; Prev
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
            Next &rarr;
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
              <span class="compact-semester-tag">Semester {{ mod.semester || 3 }}</span>
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

.intro-section { max-width: 800px; margin: 0 auto 5rem auto; }
.intro-text { font-size: 1.1rem; color: var(--color-gray-700); line-height: 1.8; margin-bottom: 2.5rem; }
.cta-wrapper { display: flex; justify-content: center; width: 100%; margin: 3rem 0; }
.cta-btn { padding: 1rem 2rem; font-size: 1.1rem; }
.btn-icon { width: 22px; height: 22px; margin-right: 10px; display: inline-block; vertical-align: middle; }

.modules-container { margin-bottom: 5rem; }
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
  background: var(--color-accent);
  color: #fff;
  padding: 1.25rem 1rem;
  border-radius: var(--radius-md);
  border: 2px solid transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: all 200ms;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  min-height: 110px;
  position: relative;
}
.module-card:hover { transform: translateY(-4px); box-shadow: 0 8px 15px rgba(0,0,0,0.15); border-color: #fff; }
.module-card--active { background: var(--color-primary); box-shadow: 0 0 0 2px var(--color-gray-50), 0 0 0 4px var(--color-primary); }

.mod-name { font-size: 0.95rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; line-height: 1.3; }

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
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  height: 550px;
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
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}
@media (min-width: 768px) {
  .electives-carousel-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
.elective-card-slide {
  background: #ffffff;
  padding: 2.25rem 2rem;
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-gray-200);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  position: relative;
}
.elective-card-slide:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary-light);
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
  padding: 1rem 0;
}
.carousel-nav-btn {
  padding: 0.5rem 1.25rem;
  background: #ffffff;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}
.carousel-nav-btn:hover:not(:disabled) {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}
.carousel-bullets {
  display: flex;
  gap: 0.5rem;
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

/* MOBILE ACCORDION CARD STYLES */
.mobile-accordion-list {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  margin-top: 1.5rem;
}
.mobile-accordion-card {
  background: #ffffff;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-gray-200);
  padding: 1.25rem;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.mobile-accordion-card--active {
  box-shadow: var(--shadow-md);
  background: #ffffff;
}
.mobile-accordion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
}
.mobile-accordion-header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}
.mobile-sem-badge {
  font-size: 0.65rem;
  font-weight: 800;
  color: #fff;
  background: var(--color-primary-dark);
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
  white-space: nowrap;
}
.mobile-accordion-card:nth-child(even) .mobile-sem-badge {
  background: var(--color-primary);
}
.mobile-accordion-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-primary-dark);
  line-height: 1.35;
}
.mobile-chevron-icon {
  color: var(--color-gray-400);
  transition: transform 0.3s ease;
  flex-shrink: 0;
}
.mobile-chevron-icon--rotated {
  transform: rotate(180deg);
  color: var(--color-accent);
}
.mobile-accordion-content {
  border-top: 1px solid var(--color-gray-100);
  margin-top: 1rem;
  padding-top: 1rem;
}
.mobile-detail-inner {
  display: flex;
  flex-direction: column;
}
.mobile-lecturers-info h4 {
  font-size: 0.65rem;
  font-weight: 800;
  color: var(--color-gray-400);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.mobile-lecturers-info p {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-primary-dark);
}
.mobile-module-desc {
  font-size: 0.85rem;
  color: var(--color-gray-600);
  line-height: 1.6;
}
</style>
