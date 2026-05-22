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

// SEO Metadata optimized for prospective MSI students (curriculum, modules, German teaching standards)
useSeoMeta({
  title: () => pageData.value?.title ? `${pageData.value.title} - Curriculum & Modules | MSI VGU` : 'Master Program Structure & Modules - Materials Science and Innovation | VGU',
  ogTitle: () => pageData.value?.title ? `${pageData.value.title} - Curriculum & Modules | MSI VGU` : 'Master Program Structure & Modules - Materials Science and Innovation | VGU',
  description: () => pageData.value?.description || 'Explore our comprehensive German-standard curriculum, featuring modules in computational mechanics, advanced materials engineering, and wide-bandgap semiconductor devices taught by premier German lecturers.',
  ogDescription: () => pageData.value?.description || 'Explore our comprehensive German-standard curriculum, featuring modules in computational mechanics, advanced materials engineering, and wide-bandgap semiconductor devices taught by premier German lecturers.',
})

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
const isDetailModalOpen = ref(false)

function getImages(mod: any) {
  return mod?.images || mod?.meta?.images || []
}

function getPdfs(mod: any) {
  return mod?.pdfs || mod?.meta?.pdfs || []
}

function getLinks(mod: any) {
  return mod?.links || mod?.meta?.links || []
}

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
    <PageHeader :title="pageData?.title || 'Program Structure'" :description="pageData?.description" />
    
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
              <div class="module-actions">
                <a href="/Documents/MODULE CATALOGUE MSI.pdf" target="_blank" class="action-btn">{{ page.view_handbook || t('program.view_in_handbook') }}</a>
                <button
                  v-if="getImages(selectedModule).length || getPdfs(selectedModule).length || getLinks(selectedModule).length"
                  class="more-detail-btn"
                  @click="isDetailModalOpen = true"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  <span>{{ t('program.more_detail') }}</span>
                </button>
              </div>
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
          <div class="module-actions">
            <a href="/Documents/MODULE CATALOGUE MSI.pdf" target="_blank" class="action-btn shrink-0">
              {{ t('program.view_in_handbook') }} &rarr;
            </a>
            <button
              v-if="getImages(selectedModule).length || getPdfs(selectedModule).length || getLinks(selectedModule).length"
              class="more-detail-btn"
              @click="isDetailModalOpen = true"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              <span>{{ t('program.more_detail') }}</span>
            </button>
          </div>
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

    <!-- ── Media Detail Modal (Native Implementation) ── -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="isDetailModalOpen" class="custom-modal-overlay" @click.self="isDetailModalOpen = false">
          <div class="custom-modal-content">
            <!-- Header -->
            <div class="custom-modal-header">
              <h3 class="custom-modal-title">
                {{ selectedModule?.title }} - Materials
              </h3>
              <button @click="isDetailModalOpen = false" class="custom-modal-close" title="Close">
                &times;
              </button>
            </div>

            <!-- Body -->
            <div class="custom-modal-body">
              <!-- Gallery -->
              <div v-if="getImages(selectedModule).length" class="gallery-section">
                <h4 class="section-label">Image Gallery</h4>
                <div class="gallery-scroll">
                  <div 
                    v-for="(img, idx) in getImages(selectedModule)" 
                    :key="idx"
                    class="gallery-item"
                  >
                    <img :src="img" draggable="false" />
                  </div>
                </div>
              </div>

              <!-- Documents -->
              <div v-if="getPdfs(selectedModule).length" class="documents-section">
                <h4 class="section-label">Documents</h4>
                <div class="doc-list">
                  <a
                    v-for="(pdf, idx) in getPdfs(selectedModule)"
                    :key="idx"
                    :href="pdf.url"
                    target="_blank"
                    class="doc-link"
                  >
                    <div class="doc-icon">
                      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:24px;height:24px;">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span class="doc-title">{{ pdf.title }}</span>
                    <svg class="w-5 h-5 doc-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:20px;height:20px;margin-left:auto;">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

              <!-- Links -->
              <div v-if="getLinks(selectedModule).length" class="documents-section">
                <h4 class="section-label">{{ t('program.links_label') || 'Related Links' }}</h4>
                <div class="doc-list">
                  <a
                    v-for="(link, idx) in getLinks(selectedModule)"
                    :key="idx"
                    :href="link.url.startsWith('/') ? localePath(link.url) : link.url"
                    :target="link.url.startsWith('/') ? undefined : '_blank'"
                    rel="noopener"
                    class="doc-link doc-link--link"
                  >
                    <div class="doc-icon doc-icon--link">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:22px;height:22px;">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <div class="link-body-text">
                      <span class="doc-title">{{ link.title }}</span>
                      <span v-if="link.description" class="link-sub">{{ link.description }}</span>
                    </div>
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="doc-arrow" style="width:18px;height:18px;margin-left:auto;">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
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
  background-color: var(--color-german-taught, var(--color-success-main));
  border-radius: 50%;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.4);
}

.german-indicator-dot-legend {
  display: inline-block;
  width: 12px;
  height: 12px;
  background-color: var(--color-german-taught, var(--color-success-main));
  border-radius: 50%;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.4);
  animation: pulse-green 2s infinite;
}

.german-indicator-dot-accordion {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: var(--color-german-taught, var(--color-success-main));
  border-radius: 50%;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.4);
}

@keyframes pulse-green {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

.legend-item--highlighted {
  background-color: var(--color-success-bg) !important;
  border-color: var(--color-success-border) !important;
  color: var(--color-success-text) !important;
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
.badge-german { background: var(--color-success-bg); color: var(--color-success-text); border: 1px solid var(--color-success-border); font-size: 0.75rem; padding: 4px 8px; border-radius: 4px; font-weight: 600; }
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

/* Module Action Row */
.module-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

/* Custom Action Button */
.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.4rem 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-primary-light);
  border: 1.5px solid var(--color-primary-100);
  border-radius: var(--radius-full);
  background: var(--color-primary-50);
  cursor: pointer;
  text-decoration: none;
  transition: all 0.25s var(--ease-out);
  white-space: nowrap;
  letter-spacing: 0.02em;
}
.action-btn:hover {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(30, 58, 95, 0.25);
}

.more-detail-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--color-accent-dark);
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  background: var(--color-accent-50);
  border: 1.5px solid rgba(232, 119, 34, 0.25);
  padding: 0.4rem 1rem;
  border-radius: var(--radius-full);
  transition: all 0.25s var(--ease-out);
  margin-left: auto;
  white-space: nowrap;
  letter-spacing: 0.02em;
  position: relative;
}
.more-detail-btn::before {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: var(--radius-full);
  border: 2px solid var(--color-accent);
  opacity: 0;
  animation: detailPulse 2s ease-in-out infinite;
}
@keyframes detailPulse {
  0%, 100% { opacity: 0; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(1.04); }
}
.more-detail-btn:hover {
  background: var(--color-accent);
  color: #fff;
  border-color: var(--color-accent);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(232, 119, 34, 0.35);
}
.more-detail-btn:hover::before {
  animation: none;
  opacity: 0;
}

/* Custom CSS Modal Overlay */
.custom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 34, 64, 0.6);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  box-sizing: border-box;
}
.custom-modal-content {
  background: #fff;
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 650px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  overflow: hidden;
  animation: modalScaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes modalScaleIn {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.custom-modal-header {
  padding: 1.25rem 1.75rem;
  border-bottom: 1px solid var(--color-gray-100);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
}
.custom-modal-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-primary-dark);
  margin: 0;
}
.custom-modal-close {
  background: transparent;
  border: none;
  font-size: 1.75rem;
  line-height: 1;
  cursor: pointer;
  color: var(--color-gray-500);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  transition: all 0.2s;
}
.custom-modal-close:hover {
  background: var(--color-gray-100);
  color: var(--color-gray-900);
}
.custom-modal-body {
  padding: 1.75rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 800;
  color: var(--color-gray-500);
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
}

.gallery-scroll {
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  scroll-snap-type: x mandatory;
  padding-bottom: 0.75rem;
  -webkit-overflow-scrolling: touch;
}
.gallery-item {
  scroll-snap-align: center;
  flex: 0 0 100%;
  background: var(--color-gray-50);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-gray-200);
  overflow: hidden;
}
.gallery-item img {
  width: 100%;
  height: 350px;
  object-fit: contain;
  display: block;
}

.doc-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.doc-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-gray-200);
  text-decoration: none;
  color: var(--color-primary-dark);
  font-weight: 700;
  transition: all 0.2s;
}
.doc-link:hover {
  background: var(--color-primary-50);
  border-color: var(--color-primary-100);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}
.doc-icon {
  background: var(--color-danger-bg);
  color: var(--color-danger-text);
  padding: 0.6rem;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}
.doc-title {
  flex: 1;
}
.doc-arrow {
  color: var(--color-gray-400);
  transition: transform 0.2s;
}
.doc-link:hover .doc-arrow {
  color: var(--color-primary);
  transform: translateX(4px);
}

/* Link row variant */
.doc-link--link:hover {
  background: var(--color-accent-50);
  border-color: rgba(232, 119, 34, 0.25);
}
.doc-icon--link {
  background: var(--color-accent-50);
  color: var(--color-accent);
}
.doc-link--link:hover .doc-arrow {
  color: var(--color-accent);
}
.link-body-text {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  flex: 1;
  min-width: 0;
}
.link-sub {
  font-size: 0.75rem;
  color: var(--color-gray-500);
  font-weight: 400;
}
</style>
