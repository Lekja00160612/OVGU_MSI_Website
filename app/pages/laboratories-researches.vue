<script setup lang="ts">
import { ref, computed } from 'vue'

const { locale } = useI18n()

// Fetch localized intro/header data
const pagePath = '/laboratories-researches'
const { data: pageData } = await useAsyncData(`labs-page-${locale.value}`, () =>
  queryCollection('content').path(pagePath).first()
)

// Fetch all structured equipments
const { data: equipments } = await useAsyncData('all-equipments', () =>
  queryCollection('equipments').all()
)

// Fetch all academic activities for dynamic reference matching
const { data: activities } = await useAsyncData('labs-activities', () =>
  queryCollection('activities').all()
)

const activeCategory = ref('All')
const selectedMachine = ref<any | null>(null)
const activeImageIndex = ref(0)
const isDrawerOpen = ref(false)

// Lightbox states
const lightboxOpen = ref(false)
const lightboxImages = ref<string[]>([])
const lightboxActiveIndex = ref(0)

const openLightbox = (imgs: string[], idx: number) => {
  lightboxImages.value = imgs
  lightboxActiveIndex.value = idx
  lightboxOpen.value = true
}

const nextLightboxImage = () => {
  if (lightboxImages.value.length === 0) return
  lightboxActiveIndex.value = (lightboxActiveIndex.value + 1) % lightboxImages.value.length
}

const prevLightboxImage = () => {
  if (lightboxImages.value.length === 0) return
  lightboxActiveIndex.value = (lightboxActiveIndex.value - 1 + lightboxImages.value.length) % lightboxImages.value.length
}

watch(selectedMachine, (newVal) => {
  isDrawerOpen.value = !!newVal
})
watch(isDrawerOpen, (newVal) => {
  if (!newVal) {
    selectedMachine.value = null
  }
})

const categories = computed(() => {
  if (!equipments.value) return ['All']
  const unique = new Set(equipments.value.map(e => e.category))
  return ['All', ...Array.from(unique)]
})

const filteredEquipments = computed(() => {
  if (!equipments.value) return []
  let list = equipments.value
  if (activeCategory.value !== 'All') {
    list = list.filter(e => e.category === activeCategory.value)
  }
  return list
})

const getRelatedActivities = (machine: any) => {
  if (!activities.value || !machine) return []
  return activities.value.filter(act => {
    const titleMatch = act.title?.toLowerCase().includes(machine.name.toLowerCase()) || 
                       act.title?.toLowerCase().includes(machine.id.toLowerCase())
    const descMatch = (act.meta?.description || act.description || '').toLowerCase().includes(machine.name.toLowerCase()) ||
                      (act.meta?.description || act.description || '').toLowerCase().includes(machine.id.toLowerCase())
    return titleMatch || descMatch
  })
}

const selectMachine = (machine: any) => {
  selectedMachine.value = machine
  activeImageIndex.value = 0
}

// Research slides data for OVGU Chairs
const activeSlideIndex = ref(0)
const ovguChairs = [
  {
    id: 'comp-mech',
    title: 'Chair of Computational Mechanics',
    head: 'Prof. Dr.-Ing. Daniel Juhre',
    themeColor: 'var(--color-primary)',
    bgGradient: 'linear-gradient(135deg, #1e3a5f 0%, #2e5280 100%)',
    icon: '⚙️',
    topics: [
      'Constitutive modeling of polymers and elastomers',
      'Finite Element Method (FEM) code developments',
      'Multi-physical field couplings (electro-viscoelasticity)',
      'Anisotropic fracture behaviors in biological tissues'
    ],
    projects: 'DFG projects on rubber fatigue; polymer aging simulations.'
  },
  {
    id: 'solid-state',
    title: 'Chair of Solid State Physics',
    head: 'Prof. Dr. rer. nat. Jürgen Christen',
    themeColor: 'var(--color-ovgu-blue)',
    bgGradient: 'linear-gradient(135deg, #009fdf 0%, #007bb5 100%)',
    icon: '⚛️',
    topics: [
      'Micro-photoluminescence and cathodoluminescence spectroscopy',
      'Optical properties of wide-bandgap semiconductors (GaN, AlN)',
      'Spatial characterization of nanostructures and quantum wells',
      'High-resolution scanning electron microscopy (SEM) characterization'
    ],
    projects: 'Nanowire LED optoelectronic structures; quantum emitter tracking.'
  },
  {
    id: 'hi-temp',
    title: 'Chair of High Temperature Materials',
    head: 'Prof. Dr.-Ing. Mania Krüger',
    themeColor: 'var(--color-accent)',
    bgGradient: 'linear-gradient(135deg, #e87722 0%, #c95e0a 100%)',
    icon: '🔥',
    topics: [
      'Development of multi-component refractory silicide alloys',
      'Powder metallurgical processing (Sintering, Spark Plasma Sintering)',
      'Oxidation resistance coatings for high-temperature turbines',
      'Mechanical testing at temperatures up to 1500°C'
    ],
    projects: 'Mo-Si-B gas turbine blade testing; ultra-high temperature ceramics.'
  },
  {
    id: 'metallic',
    title: 'Chair of Metallic Materials',
    head: 'Prof. Dr.-Ing. Thorsten Halle',
    themeColor: '#495057',
    bgGradient: 'linear-gradient(135deg, #495057 0%, #212529 100%)',
    icon: '🔩',
    topics: [
      'Design of advanced high-strength steels and metal matrix composites',
      'Dynamic mechanical behavior (split-Hopkinson pressure bar)',
      'Microstructural changes during severe plastic deformation',
      'Additive manufacturing post-processing treatments'
    ],
    projects: 'High-strain-rate impact testing; metallic phase transformations.'
  },
  {
    id: 'non-metallic',
    title: 'Chair of Non-Metallic Materials',
    head: 'Prof. Dr. rer. nat. Michael Scheffler',
    themeColor: '#0b5229',
    bgGradient: 'linear-gradient(135deg, #0b5229 0%, #1e703f 100%)',
    icon: '🏺',
    topics: [
      'Polymer-derived ceramics (PDCs) and porous cellular structures',
      'Recycling of industrial wastes into functional insulation components',
      'Surface coating and functionalization of structural ceramic filters',
      'Bio-compatible ceramic scaffoldings for bone engineering'
    ],
    projects: 'Waste-to-ceramic thermal barriers; filter systems for molten steel.'
  },
  {
    id: 'eng-mechanics',
    title: 'Chair of Engineering Mechanics',
    head: 'Prof. Dr.-Ing. habil. Holm Altenbach (Emeritus)',
    themeColor: '#7b1fa2',
    bgGradient: 'linear-gradient(135deg, #7b1fa2 0%, #4a148c 100%)',
    icon: '📐',
    topics: [
      'Viscoelasticity, creep, and damage modeling of structures',
      'Theory of plates and shells under complex loadings',
      'Non-linear mechanics of composites and smart structural materials',
      'Mathematical modeling in classical continuum mechanics'
    ],
    projects: 'Creep behavior of thin-walled vessels; composite panel load optimization.'
  }
]

const nextSlide = () => {
  activeSlideIndex.value = (activeSlideIndex.value + 1) % ovguChairs.length
}
const prevSlide = () => {
  activeSlideIndex.value = (activeSlideIndex.value - 1 + ovguChairs.length) % ovguChairs.length
}
</script>

<template>
  <div class="page-labs">
    <!-- Header -->
    <div class="header-banner">
      <div class="container text-center">
        <h1 class="page-title">{{ pageData?.title || 'Laboratories & Researches' }}</h1>
        <p class="page-subtitle">{{ pageData?.description || 'Explore our state-of-the-art facilities and scientific equipment.' }}</p>
      </div>
    </div>

    <!-- Intro -->
    <div class="container intro-section text-center prose">
      <p class="intro-text">
        The Vietnamese-German University boasts some of the most advanced materials science laboratories in Southeast Asia. Our students have direct access to equipment that is typically restricted to PhD researchers or industry professionals.
      </p>
    </div>

    <!-- Category Filters -->
    <div class="container filter-container">
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

    <!-- Split Page Layout -->
    <div class="container labs-layout-wrapper">
      <div class="labs-layout" :class="{ 'labs-layout--split': selectedMachine !== null }">
        
        <!-- Left: Equipment Grid -->
        <div class="equipment-section">
          <div class="equipment-grid">
            <div 
              v-for="machine in filteredEquipments" 
              :key="machine.id" 
              class="equipment-card"
              :class="{ 'equipment-card--active': selectedMachine?.id === machine.id }"
              @click="selectMachine(machine)"
            >
              <div class="card-img-wrap">
                <img 
                  v-if="machine.images && machine.images.length > 0" 
                  :src="machine.images[0]" 
                  :alt="machine.name" 
                  class="card-img" 
                />
                <div v-else class="img-placeholder">🔬</div>
                <span class="card-room">{{ machine.room }}</span>
              </div>
              <div class="card-body">
                <h3 class="card-name">{{ machine.name }}</h3>
                <span class="card-cat">{{ machine.category }}</span>
                <p v-if="machine.description" class="card-desc">{{ machine.description.substring(0, 100) }}...</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Desktop Sticky Details Panel (renders only when machine selected) -->
        <div v-if="selectedMachine" class="details-section desktop-only">
          <div class="details-panel-card fade-in">
            <div class="panel-header">
              <span class="detail-room">📍 {{ selectedMachine.room }}</span>
              <button class="panel-close" @click="selectedMachine = null">✕ Close Details</button>
            </div>
            
            <h3 class="detail-title">{{ selectedMachine.name }}</h3>
            <span class="detail-cat mb-4 block inline-block bg-primary-50 text-primary px-2.5 py-1 rounded text-xs font-bold">{{ selectedMachine.category }}</span>

            <!-- Google Image / Masonry View Gallery -->
            <div v-if="selectedMachine.images && selectedMachine.images.length > 0" class="machine-image-gallery mb-6">
              <div 
                class="gallery-grid" 
                :class="'gallery-grid--' + selectedMachine.images.length"
              >
                <div 
                  v-for="(img, idx) in selectedMachine.images" 
                  :key="idx" 
                  class="gallery-image-wrapper"
                  :class="{ 'gallery-image-wrapper--featured': idx === 0 && selectedMachine.images.length > 1 }"
                  @click="openLightbox(selectedMachine.images, idx)"
                >
                  <img :src="img" class="gallery-image" alt="Equipment image" />
                  <div class="gallery-image-overlay">
                    <span class="zoom-icon">🔍 View Large</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Content details -->
            <div class="detail-body-text prose">
              <p>{{ selectedMachine.description }}</p>
              <ContentRenderer :value="selectedMachine" />
            </div>

            <!-- Dynamic Related Activities -->
            <div v-if="getRelatedActivities(selectedMachine).length > 0" class="related-activities-box mt-6">
              <h4 class="related-title text-sm font-bold text-gray-900 mb-2">Involved Academic Activities</h4>
              <ul class="related-list space-y-1.5 text-xs text-primary font-semibold">
                <li v-for="act in getRelatedActivities(selectedMachine)" :key="act.path">
                  <NuxtLink :to="act.path.replace('/_activities', '/academic-activities')" class="hover:underline">
                    🔗 {{ act.title }} ({{ act.meta?.date || act.date }})
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Mobile Drawer Overlay Details View using Nuxt UI USlideover -->
    <USlideover v-model="isDrawerOpen" side="bottom" class="mobile-only-slideover">
      <div class="drawer-scroll-body p-6 overflow-y-auto max-h-[80vh]">
        <div class="flex justify-between items-start mb-4">
          <h3 class="drawer-title text-xl font-bold">{{ selectedMachine?.name }}</h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1.5" @click="isDrawerOpen = false" />
        </div>
        <span class="detail-room mb-2 block text-sm font-semibold text-gray-500">📍 {{ selectedMachine?.room }}</span>
        <span class="detail-cat mb-4 inline-block bg-primary-50 text-primary px-2.5 py-1 rounded text-xs font-bold">{{ selectedMachine?.category }}</span>
        
        <!-- Gallery inside Mobile slideover using UCarousel -->
        <div v-if="selectedMachine?.images && selectedMachine.images.length > 0" class="mobile-gallery-carousel mb-4">
          <UCarousel
            v-slot="{ item }"
            :items="selectedMachine.images"
            :ui="{ item: 'basis-full' }"
            class="rounded-lg overflow-hidden shadow"
            arrows
            indicators
          >
            <img :src="item" class="w-full h-48 object-cover cursor-pointer" drag-value="false" @click="openLightbox(selectedMachine.images, selectedMachine.images.indexOf(item))" />
          </UCarousel>
        </div>

        <div class="prose max-w-none text-sm text-gray-600 leading-relaxed">
          <p>{{ selectedMachine?.description }}</p>
          <ContentRenderer v-if="selectedMachine" :value="selectedMachine" />
        </div>

        <!-- Dynamic Related Activities in Mobile -->
        <div v-if="selectedMachine && getRelatedActivities(selectedMachine).length > 0" class="related-activities-box mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 class="related-title text-sm font-bold text-gray-900 mb-2">Involved Academic Activities</h4>
          <ul class="related-list space-y-1.5 text-xs text-primary font-semibold">
            <li v-for="act in getRelatedActivities(selectedMachine)" :key="act.path">
              <NuxtLink :to="act.path.replace('/_activities', '/academic-activities')" class="hover:underline">
                🔗 {{ act.title }} ({{ act.meta?.date || act.date }})
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </USlideover>

    <!-- OVGU CHAIRS RESEARCH SLIDES SECTION -->
    <div class="container section-lg researches-section">
      <div class="section-header text-center">
        <span class="badge badge-primary">OVGU Collaboration</span>
        <h2 class="section-title mt-2">Research Areas at Partner Chairs (OVGU)</h2>
        <p class="section-subtitle max-w-2xl mx-auto">
          Explore the focus areas of the 6 partner Chairs at Otto von Guericke University Magdeburg. These represent pathways for thesis topics, projects, and German semester collaborations.
        </p>
      </div>

      <!-- Slides Carousel Visual Guide -->
      <div class="slides-carousel-wrapper">
        <div class="slides-container">
          <div 
            class="slide-card" 
            :style="{ background: ovguChairs[activeSlideIndex].bgGradient }"
          >
            <div class="slide-badge">{{ activeSlideIndex + 1 }} / {{ ovguChairs.length }}</div>
            <div class="slide-icon">{{ ovguChairs[activeSlideIndex].icon }}</div>
            <h3 class="slide-chair-title">{{ ovguChairs[activeSlideIndex].title }}</h3>
            <span class="slide-chair-head">Head: {{ ovguChairs[activeSlideIndex].head }}</span>
            
            <div class="slide-topics-box">
              <h4>Core Research Focus Areas:</h4>
              <ul>
                <li v-for="(topic, idx) in ovguChairs[activeSlideIndex].topics" :key="idx">
                  ✓ {{ topic }}
                </li>
              </ul>
            </div>
            
            <div class="slide-footer-meta">
              <span><strong>Sample Projects:</strong> {{ ovguChairs[activeSlideIndex].projects }}</span>
            </div>
          </div>
        </div>

        <!-- Controls -->
        <div class="carousel-controls">
          <button class="control-btn" @click="prevSlide" aria-label="Previous slide">←</button>
          <div class="carousel-dots">
            <span 
              v-for="(chair, idx) in ovguChairs" 
              :key="chair.id"
              class="carousel-dot"
              :class="{ 'carousel-dot--active': idx === activeSlideIndex }"
              @click="activeSlideIndex = idx"
            />
          </div>
          <button class="control-btn" @click="nextSlide" aria-label="Next slide">→</button>
        </div>
      </div>
    </div>

    <!-- Lightbox Modal for Large Image View -->
    <UModal v-model="lightboxOpen" class="lightbox-modal">
      <div class="relative p-2 bg-black rounded-lg overflow-hidden flex flex-col items-center">
        <button class="absolute top-4 right-4 text-white text-2xl font-bold z-50 bg-black/50 w-10 h-10 rounded-full flex items-center justify-center hover:bg-black" @click="lightboxOpen = false">✕</button>
        <img v-if="lightboxImages.length > 0" :src="lightboxImages[lightboxActiveIndex]" class="max-w-full max-h-[80vh] object-contain rounded" />
        <div class="flex justify-between w-full mt-4 px-4 text-white font-semibold text-sm">
          <span>Image {{ lightboxActiveIndex + 1 }} of {{ lightboxImages.length }}</span>
          <div class="flex gap-4">
            <button v-if="lightboxImages.length > 1" @click="prevLightboxImage" class="hover:text-accent">&larr; Prev</button>
            <button v-if="lightboxImages.length > 1" @click="nextLightboxImage" class="hover:text-accent">Next &rarr;</button>
          </div>
        </div>
      </div>
    </UModal>

  </div>
</template>

<style scoped>
.page-labs { min-height: 80vh; background: var(--color-gray-50); padding-bottom: 5rem; }

.intro-section { max-width: 800px; margin: 0 auto 3rem auto; }
.intro-text { font-size: 1.15rem; color: var(--color-gray-700); line-height: 1.8; }

.filter-container { display: flex; justify-content: center; margin-bottom: 3rem; }
.category-filters { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; }
.cat-btn { padding: 0.6rem 1.25rem; background: #fff; border: 1px solid var(--color-gray-200); border-radius: var(--radius-full); font-size: 0.9rem; font-weight: 600; color: var(--color-gray-600); cursor: pointer; transition: all 200ms; }
.cat-btn:hover { border-color: var(--color-primary); color: var(--color-primary); }
.cat-btn--active { background: var(--color-primary); color: #fff; border-color: var(--color-primary); }

/* Layout grid configuration */
.labs-layout-wrapper { max-width: var(--container); margin: 0 auto; }
.labs-layout { display: grid; grid-template-columns: 1fr; gap: 2rem; transition: grid-template-columns 300ms cubic-bezier(0.16, 1, 0.3, 1); }

@media (min-width: 900px) {
  .labs-layout--split { grid-template-columns: 1.4fr 1.2fr; align-items: start; }
}

.equipment-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
@media (min-width: 640px) { .equipment-grid { grid-template-columns: repeat(2, 1fr); } }

.equipment-card { background: #fff; border: 1px solid var(--color-gray-200); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-sm); transition: all 250ms; cursor: pointer; display: flex; flex-direction: column; }
.equipment-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: var(--color-primary-100); }
.equipment-card--active { border-color: var(--color-accent); box-shadow: 0 0 0 2px var(--color-accent-50); }

.card-img-wrap { position: relative; height: 180px; overflow: hidden; background: var(--color-gray-100); display: flex; align-items: center; justify-content: center; }
.card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 300ms; }
.equipment-card:hover .card-img { transform: scale(1.04); }
.img-placeholder { font-size: 3rem; opacity: 0.6; }
.card-room { position: absolute; bottom: 0.75rem; left: 0.75rem; background: rgba(15, 34, 64, 0.85); color: #fff; font-size: 0.75rem; font-weight: 600; padding: 0.2rem 0.6rem; border-radius: var(--radius-sm); backdrop-filter: blur(4px); }

.card-body { padding: 1.25rem; display: flex; flex-direction: column; flex: 1; }
.card-name { font-size: 1.1rem; font-weight: 700; color: var(--color-primary-dark); margin-bottom: 0.3rem; line-height: 1.3; }
.card-cat { font-size: 0.7rem; text-transform: uppercase; font-weight: 700; color: var(--color-accent); letter-spacing: 0.05em; margin-bottom: 0.5rem; }
.card-desc { font-size: 0.85rem; color: var(--color-gray-600); line-height: 1.5; }

/* Right Details Panel */
.details-section { position: sticky; top: 100px; z-index: 10; max-height: calc(100vh - 120px); overflow-y: auto; padding-right: 0.5rem; }
.details-panel-card { background: #fff; border: 1px solid var(--color-gray-200); border-radius: var(--radius-xl); padding: 2rem; box-shadow: var(--shadow-md); }
.panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
.panel-close { background: none; border: none; color: var(--color-gray-500); font-weight: 600; font-size: 0.85rem; cursor: pointer; transition: color 150ms; }
.panel-close:hover { color: var(--color-accent); }

.detail-room { font-size: 0.75rem; font-weight: 700; color: var(--color-accent); text-transform: uppercase; letter-spacing: 0.05em; }
.detail-title { font-size: 1.6rem; font-weight: 800; color: var(--color-primary-dark); line-height: 1.25; margin-bottom: 0.25rem; }
.detail-cat { font-size: 0.8rem; color: var(--color-gray-500); font-weight: 600; margin-bottom: 1.25rem; }

.detail-body-text { font-size: 0.95rem; color: var(--color-gray-700); line-height: 1.6; }

.related-activities-box { border-top: 1px solid var(--color-gray-200); padding-top: 1.25rem; }
.related-title { font-size: 0.85rem; font-weight: 700; color: var(--color-primary); margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.03em; }
.related-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.5rem; }

/* Responsive overlays / drawers */
.mobile-only { display: block; }
.desktop-only { display: none; }
@media (min-width: 900px) {
  .mobile-only { display: none; }
  .desktop-only { display: block; }
  /* Hide mobile bottom-sheet on desktop */
  .mobile-only-slideover { display: none !important; }
}

.drawer-scroll-body { overflow-y: auto; padding: 1.5rem; flex: 1; }
.drawer-title { font-size: 1.5rem; font-weight: 800; color: var(--color-primary-dark); margin-bottom: 0.25rem; line-height: 1.3; }

/* OVGU Research Slides Styles */
.researches-section { border-top: 1px solid var(--color-gray-200); margin-top: 5rem; }
.slides-carousel-wrapper { max-width: 800px; margin: 3rem auto 0 auto; display: flex; flex-direction: column; gap: 1.5rem; }
.slides-container { perspective: 1000px; }
.slide-card { border-radius: var(--radius-xl); padding: 3rem; color: #fff; box-shadow: var(--shadow-lg); position: relative; min-height: 380px; display: flex; flex-direction: column; transition: all 400ms var(--ease-out); }
.slide-badge { position: absolute; top: 1.5rem; right: 2rem; font-size: 0.8rem; font-weight: 700; background: rgba(255,255,255,0.2); padding: 0.25rem 0.75rem; border-radius: var(--radius-full); backdrop-filter: blur(4px); }
.slide-icon { font-size: 3rem; margin-bottom: 1rem; }
.slide-chair-title { font-size: 1.8rem; font-weight: 800; line-height: 1.2; margin-bottom: 0.5rem; }
.slide-chair-head { font-size: 0.95rem; opacity: 0.9; margin-bottom: 2rem; display: block; font-weight: 600; }
.slide-topics-box { margin-bottom: 2rem; }
.slide-topics-box h4 { font-size: 0.9rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.8); margin-bottom: 0.75rem; }
.slide-topics-box ul { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.5rem; }
.slide-topics-box li { font-size: 1rem; line-height: 1.5; color: rgba(255,255,255,0.95); }
.slide-footer-meta { margin-top: auto; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 1.25rem; font-size: 0.9rem; color: rgba(255,255,255,0.85); }

.carousel-controls { display: flex; align-items: center; justify-content: space-between; max-width: 320px; margin: 0 auto; }
.control-btn { background: #fff; border: 1px solid var(--color-gray-200); width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; cursor: pointer; box-shadow: var(--shadow-sm); transition: all 200ms; color: var(--color-primary); }
.control-btn:hover { background: var(--color-primary); color: #fff; border-color: var(--color-primary); }
.carousel-dots { display: flex; gap: 0.5rem; }
.carousel-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--color-gray-300); cursor: pointer; transition: all 200ms; }
.carousel-dot--active { background: var(--color-primary); width: 24px; border-radius: 4px; }

.fade-in { animation: fadeIn 300ms ease forwards; }
@keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }

/* Google Image Style Gallery grid */
.machine-image-gallery {
  width: 100%;
}
.gallery-grid {
  display: grid;
  gap: 0.5rem;
  border-radius: var(--radius-lg);
  overflow: hidden;
}
.gallery-grid--1 {
  grid-template-columns: 1fr;
}
.gallery-grid--2 {
  grid-template-columns: repeat(2, 1fr);
  height: 250px;
}
.gallery-grid--3 {
  grid-template-columns: 2fr 1fr;
  grid-template-rows: repeat(2, 120px);
  height: 248px;
}
.gallery-grid--3 .gallery-image-wrapper--featured {
  grid-row: span 2;
  height: 248px;
}
.gallery-grid--4 {
  grid-template-columns: 2fr 1fr;
  grid-template-rows: repeat(3, 80px);
  height: 248px;
}
.gallery-grid--4 .gallery-image-wrapper--featured {
  grid-row: span 3;
  height: 248px;
}

.gallery-image-wrapper {
  position: relative;
  cursor: pointer;
  overflow: hidden;
  height: 100%;
}
.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 300ms ease;
}
.gallery-image-wrapper:hover .gallery-image {
  transform: scale(1.05);
}
.gallery-image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(30, 58, 95, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 250ms ease;
}
.gallery-image-wrapper:hover .gallery-image-overlay {
  opacity: 1;
}
.zoom-icon {
  color: #fff;
  font-size: 0.85rem;
  font-weight: 700;
  background: var(--color-accent);
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-md);
}
</style>
