<script setup lang="ts">
import { inject, ref, computed } from 'vue'

const { chairs } = inject('pageData') as any

// Fallback data if chairs is not injected
const defaultChairs = [
  {
    id: 'comp-mech',
    title: 'Chair of Computational Mechanics',
    head: 'Prof. Dr.-Ing. Daniel Juhre',
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

const chairsList = computed(() => {
  if (chairs?.value && Array.isArray(chairs.value) && chairs.value.length > 0) return chairs.value
  return defaultChairs
})

const activeSlideIndex = ref(0)
const activeChair = computed(() => chairsList.value[activeSlideIndex.value] || chairsList.value[0])

const nextSlide = () => {
  activeSlideIndex.value = (activeSlideIndex.value + 1) % chairsList.value.length
}
const prevSlide = () => {
  const len = chairsList.value.length
  activeSlideIndex.value = (activeSlideIndex.value - 1 + len) % len
}
const goToSlide = (idx: number) => {
  activeSlideIndex.value = idx
}
</script>

<template>
  <div class="research-chairs">
    <!-- Slide Card -->
    <div class="slide-wrapper">
      <div
        class="slide-card"
        :style="{ background: activeChair.bgGradient }"
        :key="activeChair.id"
      >
        <!-- Badge counter -->
        <div class="slide-badge">
          {{ activeSlideIndex + 1 }} / {{ chairsList.length }}
        </div>

        <!-- Icon -->
        <div class="slide-icon" aria-hidden="true">{{ activeChair.icon }}</div>

        <!-- Title & Head -->
        <h3 class="slide-title">{{ activeChair.title }}</h3>
        <span class="slide-head">Head: {{ activeChair.head }}</span>

        <!-- Topics list — scrollable -->
        <div class="slide-topics-box">
          <h4 class="topics-heading">Core Research Focus Areas</h4>
          <ul class="topics-list">
            <li v-for="(topic, idx) in activeChair.topics" :key="idx" class="topic-item">
              <span class="topic-check" aria-hidden="true">✓</span>
              {{ topic }}
            </li>
          </ul>
        </div>

        <!-- Projects -->
        <div class="slide-footer">
          <strong class="footer-label">Sample Projects: </strong>
          <span class="footer-text">{{ activeChair.projects }}</span>
        </div>
      </div>
    </div>

    <!-- Controls: Prev | Dots | Next -->
    <div class="carousel-controls">
      <UButton
        icon="i-heroicons-chevron-left-20-solid"
        variant="outline"
        color="gray"
        size="sm"
        class="control-btn"
        aria-label="Previous chair"
        @click="prevSlide"
      />

      <div class="dot-track" role="tablist" aria-label="Chair slides">
        <button
          v-for="(chair, idx) in chairsList"
          :key="chair.id"
          class="dot"
          :class="{ 'dot--active': idx === activeSlideIndex }"
          :aria-label="`Go to ${chair.title}`"
          :aria-selected="idx === activeSlideIndex"
          role="tab"
          @click="goToSlide(idx)"
        />
      </div>

      <UButton
        icon="i-heroicons-chevron-right-20-solid"
        variant="outline"
        color="gray"
        size="sm"
        class="control-btn"
        aria-label="Next chair"
        @click="nextSlide"
      />
    </div>
  </div>
</template>

<style scoped>
.research-chairs {
  width: 100%;
  max-width: 820px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ── Slide card ──────────────────────────── */
.slide-wrapper {
  perspective: 1000px;
}

.slide-card {
  border-radius: var(--radius-xl, 16px);
  padding: 2.5rem 2.75rem;
  color: #fff;
  box-shadow: var(--shadow-lg, 0 10px 40px rgba(0,0,0,.18));
  position: relative;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  animation: slideIn 350ms var(--ease-out, cubic-bezier(0.16,1,0.3,1)) forwards;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(12px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0)   scale(1);    }
}

.slide-badge {
  position: absolute;
  top: 1.5rem;
  right: 2rem;
  font-size: 0.78rem;
  font-weight: 700;
  background: rgba(255,255,255,0.18);
  padding: 0.2rem 0.7rem;
  border-radius: var(--radius-full, 9999px);
  backdrop-filter: blur(4px);
  letter-spacing: 0.04em;
}

.slide-icon {
  font-size: 2.8rem;
  line-height: 1;
  margin-bottom: 0.85rem;
}

.slide-title {
  font-size: 1.65rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 0.4rem;
}

.slide-head {
  font-size: 0.95rem;
  font-weight: 600;
  opacity: 0.9;
  margin-bottom: 1.75rem;
  display: block;
}

/* Topics box — scrollable */
.slide-topics-box {
  flex: 1;
  margin-bottom: 1.5rem;
}
.topics-heading {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255,255,255,0.75);
  margin-bottom: 0.65rem;
}
.topics-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  /* Custom scrollbar for dark bg */
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.3) transparent;
}
.topics-list::-webkit-scrollbar { width: 4px; }
.topics-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 4px; }
.topic-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.95rem;
  line-height: 1.5;
  color: rgba(255,255,255,0.95);
}
.topic-check {
  flex-shrink: 0;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.7);
  margin-top: 0.15rem;
}

/* Footer */
.slide-footer {
  border-top: 1px solid rgba(255,255,255,0.2);
  padding-top: 1.1rem;
  font-size: 0.9rem;
  color: rgba(255,255,255,0.85);
  line-height: 1.6;
}
.footer-label { color: rgba(255,255,255,0.95); }
.footer-text { font-style: italic; }

/* ── Controls ────────────────────────────── */
.carousel-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
}
.control-btn {
  border-radius: 50% !important;
  width: 42px;
  height: 42px;
  flex-shrink: 0;
}

.dot-track {
  display: flex;
  gap: 0.45rem;
  align-items: center;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-gray-300, #d1d5db);
  border: none;
  cursor: pointer;
  transition: background 200ms, width 200ms, border-radius 200ms;
  padding: 0;
}
.dot--active {
  background: var(--color-primary, #1e3a5f);
  width: 24px;
  border-radius: 4px;
}

@media (max-width: 640px) {
  .slide-card {
    padding: 1.75rem 1.5rem;
    min-height: 350px;
  }
  .slide-title { font-size: 1.35rem; }
}
</style>
