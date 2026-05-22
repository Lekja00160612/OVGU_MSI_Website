<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'

const { locale, t } = useI18n()

// ── Nuxt Content fetches ──────────────────────────────────────────────────────
const pagePath = computed(() => locale.value === 'vi' ? '/vi/laboratories-research' : '/laboratories-research')
const { data: pageData } = await useAsyncData(`labs-page-${locale.value}`, () =>
  queryCollection('content').path(pagePath.value).first()
)

const { data: equipments } = await useAsyncData('all-equipments', () =>
  queryCollection('equipments').all()
)

const { data: activities } = await useAsyncData('labs-activities', () =>
  queryCollection('activities').all()
)

// SEO Metadata targeting high-tech research labs, AFM, SEM, XRD characterization, and advanced material analysis
useSeoMeta({
  title: () => pageData.value?.title ? `${pageData.value.title} - High-Tech Research Labs | MSI VGU` : 'State-of-the-Art Research Laboratories - Materials Science & Innovation | VGU',
  ogTitle: () => pageData.value?.title ? `${pageData.value.title} - High-Tech Research Labs | MSI VGU` : 'State-of-the-Art Research Laboratories - Materials Science & Innovation | VGU',
  description: () => pageData.value?.description || 'Explore the premium materials characterization laboratories at VGU. Fully equipped with XRD, SEM, AFM, and optical spectroscopy instruments for advanced materials research.',
  ogDescription: () => pageData.value?.description || 'Explore the premium materials characterization laboratories at VGU. Fully equipped with XRD, SEM, AFM, and optical spectroscopy instruments for advanced materials research.',
})

// Fetch research chairs dynamically from Nuxt Content
const { data: researchChairs } = await useAsyncData('research-chairs', () =>
  queryCollection('research').all()
)


// ── State ────────────────────────────────────────────────────────────────────
const activeCategory = ref('All')
const currentPage = ref(1)
const itemsPerPage = 6
const gridRef = ref<HTMLElement | null>(null)
const filterBarRef = ref<HTMLElement | null>(null)

const isDetailModalOpen = ref(false)
const selectedMachine = ref<any | null>(null)

// Search
const searchQuery = ref('')

// Lightbox (inside modal)
const lightboxOpen = ref(false)
const lightboxImages = ref<string[]>([])
const lightboxActiveIndex = ref(0)

// ── Category helpers ─────────────────────────────────────────────────────────
const categories = computed(() => {
  if (!equipments.value) return ['All']
  const unique = new Set(equipments.value.map((e: any) => e.category))
  return ['All', ...Array.from(unique)]
})

// Reset to page 1 on filter/search change
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

function clearFilters() {
  activeCategory.value = 'All'
  searchQuery.value = ''
  scrollToStart()
}

// ── Filtered + paginated list ────────────────────────────────────────────────
const filteredEquipments = computed(() => {
  if (!equipments.value) return []
  return equipments.value.filter((e: any) => {
    const matchCat = activeCategory.value === 'All' || e.category === activeCategory.value
    if (!matchCat) return false
    const q = searchQuery.value.trim().toLowerCase()
    if (!q) return true
    const inName = (e.name || '').toLowerCase().includes(q)
    const inDesc = (e.description || '').toLowerCase().includes(q)
    return inName || inDesc
  })
})

const totalPages = computed(() =>
  Math.ceil(filteredEquipments.value.length / itemsPerPage)
)

const paginatedEquipments = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredEquipments.value.slice(start, start + itemsPerPage)
})

// ── Modal helpers ────────────────────────────────────────────────────────────
function openModal(machine: any) {
  selectedMachine.value = machine
  isDetailModalOpen.value = true
}

function getImages(m: any) { return m?.images || [] }
function getPdfs(m: any)   { return m?.pdfs   || [] }
function getLinks(m: any)  { return m?.links   || [] }

function getRelatedActivities(machine: any) {
  if (!activities.value || !machine) return []
  return activities.value.filter((act: any) => {
    const titleMatch = act.title?.toLowerCase().includes(machine.name.toLowerCase()) ||
                       act.title?.toLowerCase().includes(machine.id.toLowerCase())
    const descMatch  = (act.meta?.description || act.description || '').toLowerCase().includes(machine.name.toLowerCase()) ||
                       (act.meta?.description || act.description || '').toLowerCase().includes(machine.id.toLowerCase())
    return titleMatch || descMatch
  })
}

// Lightbox
function openLightbox(imgs: string[], idx: number) {
  lightboxImages.value = imgs
  lightboxActiveIndex.value = idx
  lightboxOpen.value = true
}
function nextLightboxImage() {
  if (!lightboxImages.value.length) return
  lightboxActiveIndex.value = (lightboxActiveIndex.value + 1) % lightboxImages.value.length
}
function prevLightboxImage() {
  if (!lightboxImages.value.length) return
  lightboxActiveIndex.value = (lightboxActiveIndex.value - 1 + lightboxImages.value.length) % lightboxImages.value.length
}

const nextSlide = () => { activeSlideIndex.value = (activeSlideIndex.value + 1) % ovguChairs.length }
const prevSlide = () => { activeSlideIndex.value = (activeSlideIndex.value - 1 + ovguChairs.length) % ovguChairs.length }
</script>

<template>
  <div class="page-labs">

    <!-- ── Header Banner ── -->
    <PageHeader :title="pageData?.title || t('labs.title')" :description="pageData?.description || t('labs.subtitle')" />

    <!-- ── Search + Filter Bar ── -->
    <div ref="filterBarRef" class="container filter-bar">
      <!-- Search box -->
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="t('labs.search_placeholder')"
          class="search-input"
        />
        <button
          v-if="searchQuery"
          class="search-clear"
          @click="searchQuery = ''"
          aria-label="Clear search"
        >✕</button>
      </div>

      <!-- Category pills -->
      <div class="category-filters">
        <button
          v-for="cat in categories"
          :key="cat"
          class="cat-btn"
          :class="{ 'cat-btn--active': activeCategory === cat }"
          @click="selectCategory(cat)"
        >
          {{ cat === 'All' ? t('labs.filter_all') : cat }}
        </button>
      </div>
    </div>

    <!-- ── Equipment Grid ── -->
    <div ref="gridRef" class="container equipment-grid">
      <div
        v-for="machine in paginatedEquipments"
        :key="machine.id"
        class="equipment-card"
        @click="openModal(machine)"
      >
        <!-- Image area -->
        <div class="card-img-wrap">
          <img
            v-if="machine.images && machine.images.length > 0"
            :src="machine.images[0]"
            :alt="machine.name"
            class="card-img"
          />
          <div v-else class="img-placeholder">🔬</div>
          <span class="card-room">📍 {{ machine.room }}</span>
          <span class="card-category-badge">{{ machine.category }}</span>
        </div>

        <!-- Card body: name + fixed-height scrollable description -->
        <div class="card-body">
          <h3 class="card-name">{{ machine.name }}</h3>
          <div class="card-desc-scroll">
            <p class="card-desc">{{ machine.description }}</p>
          </div>
          <button class="card-cta" @click.stop="openModal(machine)">
            <svg class="cta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {{ t('labs.view_details') }}
          </button>
        </div>
      </div>
    </div>

    <!-- ── No Results ── -->
    <div v-if="filteredEquipments.length === 0" class="container no-results">
      <p class="no-results-text">{{ t('labs.no_results') }}</p>
      <button class="clear-btn" @click="clearFilters">{{ t('labs.clear_filters') }}</button>
    </div>

    <!-- ── Pagination Bar ── -->
    <div v-if="totalPages > 1" class="container pagination-container">
      <div class="pagination-bar">
        <button class="pag-btn" :disabled="currentPage === 1" @click="currentPage--">
          &larr; {{ t('labs.prev') }}
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
        <button class="pag-btn" :disabled="currentPage === totalPages" @click="currentPage++">
          {{ t('labs.next') }} &rarr;
        </button>
      </div>
    </div>

    <!-- ── OVGU Research Slides ── -->
    <div class="container section-lg research-section">
      <div class="section-header text-center">
        <span class="badge badge-primary">OVGU Collaboration</span>
        <h2 class="section-title mt-2">Research Areas at Partner Chairs (OVGU)</h2>
        <p class="section-subtitle max-w-2xl mx-auto">
          Explore the focus areas of the 6 partner Chairs at Otto von Guericke University Magdeburg.
        </p>
      </div>
      <div class="slides-carousel-wrapper">
        <ResearchChairs :chairs="researchChairs || []" />
      </div>
    </div>

    <!-- ── Equipment Detail Modal ── -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="isDetailModalOpen && selectedMachine"
          class="modal-overlay"
          @click.self="isDetailModalOpen = false"
        >
          <div class="modal-content">
            <!-- Modal Header -->
            <div class="modal-header">
              <div class="modal-header-info">
                <span class="modal-room">📍 {{ selectedMachine.room }}</span>
                <h3 class="modal-title">{{ selectedMachine.name }}</h3>
                <span class="modal-cat-badge">{{ selectedMachine.category }}</span>
              </div>
              <button class="modal-close" @click="isDetailModalOpen = false" title="Close">&times;</button>
            </div>

            <!-- Modal Body -->
            <div class="modal-body">

              <!-- Gallery -->
              <div v-if="getImages(selectedMachine).length" class="modal-section">
                <h4 class="section-label">{{ t('labs.modal_gallery') }}</h4>
                <div class="gallery-scroll">
                  <div
                    v-for="(img, idx) in getImages(selectedMachine)"
                    :key="idx"
                    class="gallery-item"
                    @click="openLightbox(getImages(selectedMachine), idx)"
                  >
                    <img :src="img" :alt="selectedMachine.name + ' image ' + (idx+1)" draggable="false" />
                    <div class="gallery-item-overlay">
                      <span class="zoom-label">🔍 View Large</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Full description + body content -->
              <div class="modal-section modal-desc">
                <h4 class="section-label">{{ t('labs.modal_materials') }}</h4>
                <p class="desc-text">{{ selectedMachine.description }}</p>
                <ContentRenderer v-if="selectedMachine.body" :value="selectedMachine" class="prose-content" />
              </div>

              <!-- Documents / PDFs -->
              <div v-if="getPdfs(selectedMachine).length" class="modal-section">
                <h4 class="section-label">{{ t('labs.modal_documents') }}</h4>
                <div class="doc-list">
                  <a
                    v-for="(pdf, idx) in getPdfs(selectedMachine)"
                    :key="idx"
                    :href="pdf.url"
                    target="_blank"
                    rel="noopener"
                    class="doc-link"
                  >
                    <div class="doc-icon">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span class="doc-title">{{ pdf.title }}</span>
                    <svg class="doc-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

              <!-- Links -->
              <div v-if="getLinks(selectedMachine).length" class="modal-section">
                <h4 class="section-label">{{ t('labs.modal_links') }}</h4>
                <div class="links-list">
                  <a
                    v-for="(link, idx) in getLinks(selectedMachine)"
                    :key="idx"
                    :href="link.url"
                    target="_blank"
                    rel="noopener"
                    class="link-item"
                  >
                    <div class="link-icon">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <div class="link-body">
                      <span class="link-title">{{ link.title }}</span>
                      <span v-if="link.description" class="link-desc">{{ link.description }}</span>
                    </div>
                    <svg class="link-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

              <!-- Related Activities -->
              <div v-if="getRelatedActivities(selectedMachine).length" class="modal-section">
                <h4 class="section-label">{{ t('labs.modal_activities') }}</h4>
                <div class="activity-list">
                  <NuxtLink
                    v-for="act in getRelatedActivities(selectedMachine)"
                    :key="act.path"
                    :to="act.path.replace('/_activities', '/academic-activities')"
                    class="activity-link"
                    @click="isDetailModalOpen = false"
                  >
                    <span class="activity-link-icon">🔗</span>
                    <span class="activity-link-text">{{ act.title }}</span>
                    <span v-if="act.meta?.date || act.date" class="activity-link-date">{{ act.meta?.date || act.date }}</span>
                  </NuxtLink>
                </div>
              </div>

            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ── Lightbox ── -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="lightboxOpen" class="lightbox-overlay" @click.self="lightboxOpen = false">
          <button class="lightbox-close" @click="lightboxOpen = false">✕</button>
          <img v-if="lightboxImages.length > 0" :src="lightboxImages[lightboxActiveIndex]" class="lightbox-img" />
          <div class="lightbox-controls">
            <span class="lightbox-counter">{{ lightboxActiveIndex + 1 }} / {{ lightboxImages.length }}</span>
            <div class="lightbox-nav">
              <button v-if="lightboxImages.length > 1" @click="prevLightboxImage" class="lightbox-nav-btn">&larr; Prev</button>
              <button v-if="lightboxImages.length > 1" @click="nextLightboxImage" class="lightbox-nav-btn">Next &rarr;</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<style scoped>
/* ── Page ── */
.page-labs {
  min-height: 80vh;
  background: var(--color-gray-50);
  padding-bottom: 5rem;
}

/* ── Container ── */
.container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }

/* ── Filter Bar ── */
.filter-bar {
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
@media (min-width: 768px) {
  .filter-bar {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

/* Search box */
.search-box {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 340px;
}
.search-icon {
  position: absolute;
  left: 1rem;
  color: var(--color-gray-400);
  font-size: 0.9rem;
  pointer-events: none;
}
.search-input {
  width: 100%;
  padding: 0.65rem 2.5rem 0.65rem 2.5rem;
  font-size: 0.9rem;
  font-family: inherit;
  color: var(--color-gray-800);
  background: #fff;
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-full);
  outline: none;
  transition: border-color 250ms, box-shadow 250ms;
}
.search-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(30, 58, 95, 0.1);
}
.search-clear {
  position: absolute;
  right: 0.85rem;
  background: var(--color-gray-200);
  border: none;
  color: var(--color-gray-600);
  font-size: 0.75rem;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 150ms;
  line-height: 1;
}
.search-clear:hover { background: var(--color-gray-300); color: var(--color-gray-900); }

/* Category filters */
.category-filters {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 0.5rem;
  padding-bottom: 0.5rem;
  scrollbar-width: none;
}
.category-filters::-webkit-scrollbar { display: none; }
@media (min-width: 768px) {
  .category-filters { flex-wrap: wrap; overflow-x: visible; padding-bottom: 0; justify-content: flex-end; }
}
.cat-btn {
  white-space: nowrap;
  padding: 0.55rem 1.15rem;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: inherit;
  color: var(--color-gray-700);
  background: #fff;
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all 200ms;
}
.cat-btn:hover { color: var(--color-primary); border-color: var(--color-primary); }
.cat-btn--active {
  background: var(--color-primary) !important;
  color: #fff !important;
  border-color: var(--color-primary) !important;
}


/* ── Equipment Grid ── */
.equipment-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}
@media (min-width: 640px) { .equipment-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .equipment-grid { grid-template-columns: repeat(3, 1fr); } }

/* ── Equipment Card ── */
.equipment-card {
  background: #fff;
  border: 1px solid var(--color-gray-100);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}
.equipment-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-gray-200);
}

/* Card image area */
.card-img-wrap {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: var(--color-gray-100);
  flex-shrink: 0;
}
.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 400ms ease;
}
.equipment-card:hover .card-img { transform: scale(1.04); }
.img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 3.5rem; opacity: 0.4; }
.card-room {
  position: absolute;
  bottom: 0.75rem;
  left: 0.75rem;
  background: rgba(15, 34, 64, 0.85);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-sm);
  backdrop-filter: blur(4px);
}
.card-category-badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background: var(--color-accent);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-sm);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* Card body */
.card-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.card-name {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-primary-dark);
  margin-bottom: 0.75rem;
  line-height: 1.35;
  transition: color 200ms;
}
.equipment-card:hover .card-name { color: var(--color-accent); }

/* Fixed-height scrollable description */
.card-desc-scroll {
  height: 80px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--color-gray-300) transparent;
  margin-bottom: 1rem;
  padding-right: 0.25rem;
}
.card-desc-scroll::-webkit-scrollbar { width: 4px; }
.card-desc-scroll::-webkit-scrollbar-thumb { background: var(--color-gray-300); border-radius: 4px; }
.card-desc {
  font-size: 0.85rem;
  color: var(--color-gray-600);
  line-height: 1.6;
  margin: 0;
}

/* CTA button */
.card-cta {
  margin-top: auto;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 1rem;
  font-size: 0.8rem;
  font-weight: 700;
  font-family: inherit;
  color: var(--color-accent-dark);
  background: var(--color-accent-50);
  border: 1.5px solid rgba(232, 119, 34, 0.25);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all 0.25s;
  align-self: flex-start;
  white-space: nowrap;
}
.card-cta:hover {
  background: var(--color-accent);
  color: #fff;
  border-color: var(--color-accent);
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(232, 119, 34, 0.3);
}
.cta-icon { width: 16px; height: 16px; }

/* ── No Results ── */
.no-results { padding: 3rem 1.5rem; text-align: center; }
.no-results-text { font-size: 1rem; color: var(--color-gray-600); margin-bottom: 1.25rem; }
.clear-btn {
  padding: 0.55rem 1.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: inherit;
  color: var(--color-primary);
  background: transparent;
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all 250ms;
}
.clear-btn:hover { color: #fff; background: var(--color-primary); }

/* ── Pagination ── */
.pagination-container { display: flex; justify-content: center; margin-top: 1rem; }
.pagination-bar {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: #fff;
  padding: 0.4rem 0.6rem;
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-gray-200);
}
.pag-btn {
  background: transparent;
  border: none;
  color: var(--color-gray-600);
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  border-radius: var(--radius-full);
  transition: all 200ms;
}
.pag-btn:hover:not(:disabled) { color: var(--color-primary); background: var(--color-gray-100); }
.pag-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.pag-num {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-gray-700);
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 200ms;
}
.pag-num:hover:not(.pag-num--active) { background: var(--color-gray-100); color: var(--color-primary); }
.pag-num--active {
  background: var(--color-accent) !important;
  color: #fff !important;
  box-shadow: 0 2px 6px rgba(232, 119, 34, 0.3);
}

/* ── Research Slides ── */
.research-section { border-top: 1px solid var(--color-gray-200); margin-top: 5rem; }
.section-header { margin-bottom: 2rem; }
.section-title { font-size: 1.75rem; font-weight: 800; color: var(--color-primary-dark); margin-bottom: 0.5rem; }
.section-subtitle { font-size: 1rem; color: var(--color-gray-600); line-height: 1.6; }
.badge-primary {
  display: inline-block;
  padding: 0.25rem 0.85rem;
  background: var(--color-primary-50);
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-radius: var(--radius-full);
  margin-bottom: 0.5rem;
}
.slides-carousel-wrapper { max-width: 800px; margin: 2rem auto 0; display: flex; flex-direction: column; gap: 1.5rem; }

/* ── Modal Transition ── */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

/* ── Detail Modal ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 34, 64, 0.6);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  box-sizing: border-box;
}
.modal-content {
  background: #fff;
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 680px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 48px rgba(0,0,0,0.22);
  overflow: hidden;
  animation: modalScaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes modalScaleIn {
  from { opacity: 0; transform: scale(0.95) translateY(12px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

/* Modal header */
.modal-header {
  padding: 1.5rem 1.75rem 1.25rem;
  border-bottom: 1px solid var(--color-gray-100);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  background: #fff;
}
.modal-header-info { display: flex; flex-direction: column; gap: 0.35rem; flex: 1; min-width: 0; }
.modal-room { font-size: 0.72rem; font-weight: 700; color: var(--color-accent); text-transform: uppercase; letter-spacing: 0.05em; }
.modal-title { font-size: 1.35rem; font-weight: 800; color: var(--color-primary-dark); line-height: 1.25; margin: 0; }
.modal-cat-badge {
  display: inline-block;
  background: var(--color-primary-50);
  color: var(--color-primary);
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.65rem;
  border-radius: var(--radius-full);
  align-self: flex-start;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.modal-close {
  background: transparent;
  border: none;
  font-size: 1.75rem;
  line-height: 1;
  cursor: pointer;
  color: var(--color-gray-500);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  transition: all 0.2s;
  flex-shrink: 0;
}
.modal-close:hover { background: var(--color-gray-100); color: var(--color-gray-900); }

/* Modal body */
.modal-body {
  padding: 1.75rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  flex: 1;
}

/* Section label */
.section-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  font-weight: 800;
  color: var(--color-gray-400);
  letter-spacing: 0.07em;
  margin-bottom: 0.75rem;
}

/* Modal description */
.modal-desc {}
.desc-text { font-size: 0.95rem; color: var(--color-gray-700); line-height: 1.7; margin: 0 0 0.75rem; }
.prose-content { font-size: 0.95rem; color: var(--color-gray-600); line-height: 1.7; }

/* Gallery in modal */
.gallery-scroll {
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  scroll-snap-type: x mandatory;
  padding-bottom: 0.75rem;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: var(--color-gray-300) transparent;
}
.gallery-scroll::-webkit-scrollbar { height: 4px; }
.gallery-scroll::-webkit-scrollbar-thumb { background: var(--color-gray-300); border-radius: 4px; }
.gallery-item {
  position: relative;
  scroll-snap-align: center;
  flex: 0 0 100%;
  background: var(--color-gray-50);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-gray-200);
  overflow: hidden;
  cursor: pointer;
}
.gallery-item img { width: 100%; height: 300px; object-fit: contain; display: block; }
.gallery-item-overlay {
  position: absolute;
  inset: 0;
  background: rgba(30, 58, 95, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 250ms;
}
.gallery-item:hover .gallery-item-overlay { opacity: 1; }
.zoom-label {
  color: #fff;
  font-size: 0.85rem;
  font-weight: 700;
  background: var(--color-accent);
  padding: 0.35rem 0.85rem;
  border-radius: var(--radius-sm);
}

/* Documents */
.doc-list { display: flex; flex-direction: column; gap: 0.75rem; }
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

.doc-link:hover { background: var(--color-primary-50); border-color: var(--color-primary-100); transform: translateY(-2px); box-shadow: var(--shadow-sm); }
.doc-icon { background: var(--color-primary-50); color: var(--color-primary); padding: 0.6rem; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.doc-icon svg { width: 22px; height: 22px; }
.doc-title { flex: 1; font-size: 0.9rem; }
.doc-arrow { width: 18px; height: 18px; color: var(--color-gray-400); transition: transform 0.2s; }
.doc-link:hover .doc-arrow { color: var(--color-primary); transform: translateX(4px); }

/* Links */
.links-list { display: flex; flex-direction: column; gap: 0.75rem; }
.link-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-gray-200);
  text-decoration: none;
  color: var(--color-primary-dark);
  transition: all 0.2s;
}
.link-item:hover { background: var(--color-accent-50); border-color: rgba(232,119,34,0.25); transform: translateY(-2px); box-shadow: var(--shadow-sm); }
.link-icon { background: var(--color-accent-50); color: var(--color-accent); padding: 0.6rem; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.link-icon svg { width: 22px; height: 22px; }
.link-body { display: flex; flex-direction: column; gap: 0.2rem; flex: 1; min-width: 0; }
.link-title { font-size: 0.9rem; font-weight: 700; color: var(--color-primary-dark); }
.link-desc { font-size: 0.78rem; color: var(--color-gray-500); }
.link-arrow { width: 18px; height: 18px; color: var(--color-gray-400); flex-shrink: 0; transition: transform 0.2s; }
.link-item:hover .link-arrow { color: var(--color-accent); transform: translateX(4px); }

/* Related activities */
.activity-list { display: flex; flex-direction: column; gap: 0.5rem; }
.activity-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-gray-200);
  text-decoration: none;
  color: var(--color-primary-dark);
  transition: all 0.2s;
}
.activity-link:hover { background: var(--color-primary-50); border-color: var(--color-primary-100); transform: translateX(4px); }
.activity-link-icon { font-size: 1rem; flex-shrink: 0; }
.activity-link-text { flex: 1; font-size: 0.9rem; font-weight: 600; }
.activity-link-date { font-size: 0.75rem; color: var(--color-gray-500); white-space: nowrap; }

/* ── Lightbox ── */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.92);
  z-index: 10000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.lightbox-close {
  position: absolute;
  top: 1.25rem;
  right: 1.5rem;
  background: rgba(255,255,255,0.15);
  border: none;
  color: #fff;
  font-size: 1.5rem;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  z-index: 10001;
}
.lightbox-close:hover { background: rgba(255,255,255,0.3); }
.lightbox-img { max-width: 100%; max-height: 80vh; object-fit: contain; border-radius: var(--radius-lg); }
.lightbox-controls {
  margin-top: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}
.lightbox-counter { color: rgba(255,255,255,0.7); font-size: 0.85rem; font-weight: 600; }
.lightbox-nav { display: flex; gap: 1rem; }
.lightbox-nav-btn {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
  font-size: 0.9rem;
  font-weight: 700;
  padding: 0.5rem 1.25rem;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all 0.2s;
}
.lightbox-nav-btn:hover { background: rgba(255,255,255,0.25); }

/* Utility */
.text-center { text-align: center; }
.mt-2 { margin-top: 0.5rem; }
.max-w-2xl { max-width: 42rem; }
.mx-auto { margin-left: auto; margin-right: auto; }
.section-lg { padding: 4rem 0 2rem; }
.mt-12 { margin-top: 3rem; }
.mb-16 { margin-bottom: 4rem; }
</style>
