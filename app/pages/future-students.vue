<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const { locale } = useI18n()

// Fetch localized content page
const pagePath = '/future-students'
const { data: pageData } = await useAsyncData(`fs-page-${locale.value}`, () =>
  queryCollection('content').path(pagePath).first()
)

// UTabs configuration for admission pathways
const items = [
  {
    key: 'eligible',
    label: 'Direct Entry Route',
    icon: 'i-heroicons-academic-cap'
  },
  {
    key: 'non-eligible',
    label: 'Bridging Pathway Route',
    icon: 'i-heroicons-wrench-screwdriver'
  }
]
const activeTab = ref('eligible')
const selectedStepIndex = ref(0)

// @nuxt/content v3: rich frontmatter attributes (intro_text, eligible_steps, non_eligible_steps) are inside .meta
const page = computed(() => pageData.value?.meta ?? {})

const currentSteps = computed(() => {
  return activeTab.value === 'eligible'
    ? (page.value.eligible_steps || [])
    : (page.value.non_eligible_steps || [])
})

watch(activeTab, () => {
  selectedStepIndex.value = 0
})
</script>

<template>
  <div class="page-candidates">
    <!-- Header Banner -->
    <div class="header-banner">
      <div class="container text-center">
        <h1 class="page-title">{{ pageData?.title || 'Future Students Guide' }}</h1>
        <p class="page-subtitle">{{ pageData?.description || 'Find your pathway to the Materials Science and Innovation Master program.' }}</p>
      </div>
    </div>

    <!-- Intro Text -->
    <div class="container intro-section text-center prose">
      <p class="intro-text">
        {{ page.intro_text }}
      </p>
    </div>

    <!-- Eligibility Decision Tree / Branching Interactive Block -->
    <div class="container flow-section">
      <div class="decision-box text-center mb-10">
        <h2 class="section-title text-primary-dark">Interactive Admission Pathway Guide</h2>
        <p class="section-subtitle mb-8">Select your academic background to reveal your custom qualification and application timeline.</p>
        
        <!-- Two-Card Pathway Selector Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10">
          <button 
            type="button"
            class="pathway-card-btn" 
            :class="{ 'pathway-card-btn--active': activeTab === 'eligible' }"
            @click="activeTab = 'eligible'"
          >
            <div class="pathway-card-icon-wrap">
              <span class="text-2xl">🎓</span>
            </div>
            <div class="pathway-card-text text-left">
              <span class="pathway-card-title">Direct Entry Route</span>
              <span class="pathway-card-subtitle">For Bachelor of Materials Science, Physics, Chemistry, or engineering graduates.</span>
            </div>
            <div class="pathway-card-badge">DIRECT PATH</div>
          </button>

          <button 
            type="button"
            class="pathway-card-btn" 
            :class="{ 'pathway-card-btn--active': activeTab === 'non-eligible' }"
            @click="activeTab = 'non-eligible'"
          >
            <div class="pathway-card-icon-wrap">
              <span class="text-2xl">🔧</span>
            </div>
            <div class="pathway-card-text text-left">
              <span class="pathway-card-title">Bridging Pathway Route</span>
              <span class="pathway-card-subtitle">For candidates requiring supplementary qualification courses before admission.</span>
            </div>
            <div class="pathway-card-badge">BRIDGING PATH</div>
          </button>
        </div>

        <!-- Interactive Excalidraw Flowcharts (Desktop Only) -->
        <div class="desktop-only-excalidraw bg-white border border-gray-200 rounded-3xl p-6 shadow-md mb-10 max-w-4xl mx-auto">
          <h3 class="text-center font-bold text-lg text-primary mb-6">Click steps to inspect details & checklists</h3>
          
          <!-- Direct Route SVG (3 Steps) -->
          <div v-if="activeTab === 'eligible'" class="svg-wrapper flex justify-center">
            <svg viewBox="0 0 820 200" class="excalidraw-svg max-w-full">
              <defs>
                <marker id="arrow-fs" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--color-primary)" />
                </marker>
                <filter id="handdrawn-fs" x="-10%" y="-10%" width="120%" height="120%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
                </filter>
              </defs>
 
              <path d="M 250 95 L 278 95" fill="none" stroke="var(--color-primary)" stroke-width="3" stroke-dasharray="6,4" marker-end="url(#arrow-fs)" filter="url(#handdrawn-fs)" />
              <path d="M 510 95 L 538 95" fill="none" stroke="var(--color-primary)" stroke-width="3" stroke-dasharray="6,4" marker-end="url(#arrow-fs)" filter="url(#handdrawn-fs)" />
 
              <!-- Step 1 Node -->
              <g @click="selectedStepIndex = 0" style="cursor: pointer;">
                <rect x="20" y="40" width="230" height="110" rx="12" fill="#ffffff" :stroke="selectedStepIndex === 0 ? 'var(--color-accent)' : 'var(--color-primary)'" stroke-width="3" filter="url(#handdrawn-fs)" />
                <circle cx="55" cy="95" r="20" :fill="selectedStepIndex === 0 ? 'var(--color-accent)' : 'var(--color-primary)'" filter="url(#handdrawn-fs)" />
                <text x="55" y="100" fill="#ffffff" font-size="14" font-weight="bold" text-anchor="middle">1</text>
                <text x="90" y="90" :fill="selectedStepIndex === 0 ? 'var(--color-accent)' : 'var(--color-primary-dark)'" font-size="13" font-weight="bold">Submit Dossier</text>
                <text x="90" y="110" fill="var(--color-gray-500)" font-size="11">Degree &amp; IELTS 6.0</text>
              </g>
 
              <!-- Step 2 Node -->
              <g @click="selectedStepIndex = 1" style="cursor: pointer;">
                <rect x="280" y="40" width="230" height="110" rx="12" fill="#ffffff" :stroke="selectedStepIndex === 1 ? 'var(--color-accent)' : 'var(--color-primary)'" stroke-width="3" filter="url(#handdrawn-fs)" />
                <circle cx="315" cy="95" r="20" :fill="selectedStepIndex === 1 ? 'var(--color-accent)' : 'var(--color-primary)'" filter="url(#handdrawn-fs)" />
                <text x="315" y="100" fill="#ffffff" font-size="14" font-weight="bold" text-anchor="middle">2</text>
                <text x="350" y="90" :fill="selectedStepIndex === 1 ? 'var(--color-accent)' : 'var(--color-primary-dark)'" font-size="13" font-weight="bold">Academic Review</text>
                <text x="350" y="110" fill="var(--color-gray-500)" font-size="11">Technical Interview</text>
              </g>
 
              <!-- Step 3 Node -->
              <g @click="selectedStepIndex = 2" style="cursor: pointer;">
                <rect x="540" y="40" width="230" height="110" rx="12" fill="#ffffff" :stroke="selectedStepIndex === 2 ? 'var(--color-accent)' : 'var(--color-primary)'" stroke-width="3" filter="url(#handdrawn-fs)" />
                <circle cx="575" cy="95" r="20" :fill="selectedStepIndex === 2 ? 'var(--color-accent)' : 'var(--color-primary)'" filter="url(#handdrawn-fs)" />
                <text x="575" y="100" fill="#ffffff" font-size="14" font-weight="bold" text-anchor="middle">3</text>
                <text x="610" y="90" :fill="selectedStepIndex === 2 ? 'var(--color-accent)' : 'var(--color-primary-dark)'" font-size="13" font-weight="bold">Admission Offer</text>
                <text x="610" y="110" fill="var(--color-gray-500)" font-size="11">VGU/OVGU Enrollment</text>
              </g>
            </svg>
          </div>
 
          <!-- Bridging Route SVG (4 Steps) -->
          <div v-if="activeTab === 'non-eligible'" class="svg-wrapper flex justify-center">
            <svg viewBox="0 0 940 200" class="excalidraw-svg max-w-full">
              <defs>
                <marker id="arrow-fs2" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--color-primary)" />
                </marker>
                <filter id="handdrawn-fs2" x="-10%" y="-10%" width="120%" height="120%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
                </filter>
              </defs>
 
              <path d="M 205 95 L 238 95" fill="none" stroke="var(--color-primary)" stroke-width="3" stroke-dasharray="6,4" marker-end="url(#arrow-fs2)" filter="url(#handdrawn-fs2)" />
              <path d="M 435 95 L 468 95" fill="none" stroke="var(--color-primary)" stroke-width="3" stroke-dasharray="6,4" marker-end="url(#arrow-fs2)" filter="url(#handdrawn-fs2)" />
              <path d="M 665 95 L 698 95" fill="none" stroke="var(--color-primary)" stroke-width="3" stroke-dasharray="6,4" marker-end="url(#arrow-fs2)" filter="url(#handdrawn-fs2)" />
 
              <!-- Step 1 Node -->
              <g @click="selectedStepIndex = 0" style="cursor: pointer;">
                <rect x="10" y="40" width="195" height="110" rx="12" fill="#ffffff" :stroke="selectedStepIndex === 0 ? 'var(--color-accent)' : 'var(--color-primary)'" stroke-width="3" filter="url(#handdrawn-fs2)" />
                <circle cx="40" cy="95" r="18" :fill="selectedStepIndex === 0 ? 'var(--color-accent)' : 'var(--color-primary)'" filter="url(#handdrawn-fs2)" />
                <text x="40" y="100" fill="#ffffff" font-size="13" font-weight="bold" text-anchor="middle">1</text>
                <text x="70" y="90" :fill="selectedStepIndex === 0 ? 'var(--color-accent)' : 'var(--color-primary-dark)'" font-size="12" font-weight="bold">Dossier Evaluation</text>
                <text x="70" y="110" fill="var(--color-gray-500)" font-size="10">Credit Review</text>
              </g>
 
              <!-- Step 2 Node -->
              <g @click="selectedStepIndex = 1" style="cursor: pointer;">
                <rect x="240" y="40" width="195" height="110" rx="12" fill="#ffffff" :stroke="selectedStepIndex === 1 ? 'var(--color-accent)' : 'var(--color-primary)'" stroke-width="3" filter="url(#handdrawn-fs2)" />
                <circle cx="270" cy="95" r="18" :fill="selectedStepIndex === 1 ? 'var(--color-accent)' : 'var(--color-primary)'" filter="url(#handdrawn-fs2)" />
                <text x="270" y="100" fill="#ffffff" font-size="13" font-weight="bold" text-anchor="middle">2</text>
                <text x="300" y="90" :fill="selectedStepIndex === 1 ? 'var(--color-accent)' : 'var(--color-primary-dark)'" font-size="12" font-weight="bold">Consultation</text>
                <text x="300" y="110" fill="var(--color-gray-500)" font-size="10">Assigned Courses</text>
              </g>
 
              <!-- Step 3 Node -->
              <g @click="selectedStepIndex = 2" style="cursor: pointer;">
                <rect x="470" y="40" width="195" height="110" rx="12" fill="#ffffff" :stroke="selectedStepIndex === 2 ? 'var(--color-accent)' : 'var(--color-primary)'" stroke-width="3" filter="url(#handdrawn-fs2)" />
                <circle cx="500" cy="95" r="18" :fill="selectedStepIndex === 2 ? 'var(--color-accent)' : 'var(--color-primary)'" filter="url(#handdrawn-fs2)" />
                <text x="500" y="100" fill="#ffffff" font-size="13" font-weight="bold" text-anchor="middle">3</text>
                <text x="530" y="90" :fill="selectedStepIndex === 2 ? 'var(--color-accent)' : 'var(--color-primary-dark)'" font-size="12" font-weight="bold">Technical Test</text>
                <text x="530" y="110" fill="var(--color-gray-500)" font-size="10">Subject Evaluation</text>
              </g>
 
              <!-- Step 4 Node -->
              <g @click="selectedStepIndex = 3" style="cursor: pointer;">
                <rect x="700" y="40" width="195" height="110" rx="12" fill="#ffffff" :stroke="selectedStepIndex === 3 ? 'var(--color-accent)' : 'var(--color-primary)'" stroke-width="3" filter="url(#handdrawn-fs2)" />
                <circle cx="730" cy="95" r="18" :fill="selectedStepIndex === 3 ? 'var(--color-accent)' : 'var(--color-primary)'" filter="url(#handdrawn-fs2)" />
                <text x="730" y="100" fill="#ffffff" font-size="13" font-weight="bold" text-anchor="middle">4</text>
                <text x="760" y="90" :fill="selectedStepIndex === 3 ? 'var(--color-accent)' : 'var(--color-primary-dark)'" font-size="12" font-weight="bold">Conditional Offer</text>
                <text x="760" y="110" fill="var(--color-gray-500)" font-size="10">Bridging Track</text>
              </g>
            </svg>
          </div>
        </div>
      </div>
 
      <!-- Mobile Step Navigation (Horizontal Scrollable Pill Bar) -->
      <div class="mobile-only-step-bar flex md:hidden justify-start md:justify-center gap-2 mb-6 overflow-x-auto py-2 px-1">
        <button
          v-for="(item, idx) in currentSteps"
          :key="idx"
          type="button"
          class="mobile-step-pill"
          :class="{ 'mobile-step-pill--active': selectedStepIndex === idx }"
          @click="selectedStepIndex = idx"
        >
          Step {{ idx + 1 }}
        </button>
      </div>

      <!-- Pathway Details Display Refinement (Stunning Active Step Card) -->
      <div class="pathway-details-section">
        <div class="pathway-details-card fade-in" v-if="currentSteps[selectedStepIndex]">
          <div class="pathway-details-header">
            <div class="details-step-num">
              Step {{ selectedStepIndex + 1 }} of {{ currentSteps.length }} &bull; {{ activeTab === 'eligible' ? 'Direct Application' : 'Bridging Pathway' }}
            </div>
            <div class="details-title-row">
              <h3 class="details-step-title">{{ currentSteps[selectedStepIndex].title }}</h3>
              <span class="details-status-badge">{{ currentSteps[selectedStepIndex].status }}</span>
            </div>
          </div>

          <div class="details-body mt-6">
            <div class="details-desc-box">
              <p class="details-desc-text">{{ currentSteps[selectedStepIndex].desc }}</p>
            </div>

            <div class="details-requirements-box mt-6" v-if="currentSteps[selectedStepIndex].requirements?.length">
              <h4 class="requirements-heading">📋 Required Actions & Documents</h4>
              <ul class="requirements-checklist">
                <li v-for="req in currentSteps[selectedStepIndex].requirements" :key="req" class="checklist-item">
                  <div class="check-icon">✓</div>
                  <span class="check-text">{{ req }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Walkthrough Navigation inside details card -->
          <div class="pathway-navigation mt-8">
            <button 
              type="button"
              class="btn btn-outline-primary"
              :disabled="selectedStepIndex === 0"
              @click="selectedStepIndex > 0 ? selectedStepIndex-- : null"
              :style="{ opacity: selectedStepIndex === 0 ? 0.35 : 1, cursor: selectedStepIndex === 0 ? 'not-allowed' : 'pointer' }"
            >
              &larr; Previous Step
            </button>
            
            <div class="navigation-dots hidden sm:flex">
              <span 
                v-for="(dot, idx) in currentSteps" 
                :key="idx" 
                class="nav-dot"
                :class="{ 'nav-dot--active': selectedStepIndex === idx }"
                @click="selectedStepIndex = idx"
              />
            </div>
            
            <button 
              type="button"
              class="btn btn-primary"
              :disabled="selectedStepIndex === currentSteps.length - 1"
              @click="selectedStepIndex < currentSteps.length - 1 ? selectedStepIndex++ : null"
              :style="{ opacity: selectedStepIndex === currentSteps.length - 1 ? 0.35 : 1, cursor: selectedStepIndex === currentSteps.length - 1 ? 'not-allowed' : 'pointer' }"
            >
              Next Step &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Original markdown content renderer -->
    <div v-if="pageData" class="container main-content prose mt-12">
      <ContentRenderer :value="pageData" />
    </div>

  </div>
</template>

<style scoped>
.page-candidates { min-height: 80vh; background: var(--color-gray-50); padding-bottom: 5rem; }

.intro-section { max-width: 800px; margin: 0 auto 3rem auto; }
.intro-text { font-size: 1.15rem; color: var(--color-gray-700); line-height: 1.8; }

.flow-section { max-width: 1000px; margin: 0 auto; }
.section-title { font-size: 2.25rem; font-weight: 800; color: var(--color-primary-dark); }
.section-subtitle { font-size: 1.05rem; color: var(--color-gray-600); margin-top: 0.35rem; }

/* Pathway Selectors */
.pathway-card-btn {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.75rem;
  background: #ffffff;
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-2xl);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: var(--shadow-sm);
  width: 100%;
}
.pathway-card-btn:hover {
  transform: translateY(-3px);
  border-color: var(--color-primary-light);
  box-shadow: var(--shadow-md);
}
.pathway-card-btn--active {
  border-color: var(--color-accent) !important;
  background: rgba(232, 119, 34, 0.01) !important;
  box-shadow: 0 12px 30px rgba(232, 119, 34, 0.12) !important;
}
.pathway-card-icon-wrap {
  width: 54px;
  height: 54px;
  background: var(--color-gray-100);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}
.pathway-card-btn--active .pathway-card-icon-wrap {
  background: var(--color-accent-50);
  transform: scale(1.05);
}
.pathway-card-text {
  display: flex;
  flex-direction: column;
}
.pathway-card-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--color-primary-dark);
}
.pathway-card-subtitle {
  font-size: 0.85rem;
  color: var(--color-gray-500);
  line-height: 1.5;
  margin-top: 4px;
}
.pathway-card-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 0.625rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  background: var(--color-gray-100);
  color: var(--color-gray-500);
}
.pathway-card-btn--active .pathway-card-badge {
  background: var(--color-accent-50);
  color: var(--color-accent-dark);
}

/* Pathway Details Card */
.pathway-details-section {
  max-width: 900px;
  margin: 2.5rem auto 0 auto;
}
.pathway-details-card {
  background: #ffffff;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-3xl);
  padding: 2.5rem;
  box-shadow: var(--shadow-lg);
  border-top: 5px solid var(--color-accent);
  text-align: left;
  position: relative;
  transition: all var(--duration-base) var(--ease-out);
}
.pathway-details-header {
  border-bottom: 1px solid var(--color-gray-100);
  padding-bottom: 1.25rem;
}
.details-step-num {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: 0.5rem;
}
.details-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}
.details-step-title {
  font-size: 1.58rem;
  font-weight: 800;
  color: var(--color-primary-dark);
  line-height: 1.2;
}
.details-status-badge {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-accent);
  text-transform: uppercase;
  background: var(--color-accent-50);
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  border: 1px solid rgba(232, 119, 34, 0.15);
}

.details-desc-box {
  background: var(--color-gray-50);
  padding: 1.25rem 1.5rem;
  border-radius: var(--radius-xl);
  border-left: 4px solid var(--color-primary-light);
}
.details-desc-text {
  font-size: 1.025rem;
  line-height: 1.7;
  color: var(--color-gray-700);
}

.requirements-heading {
  font-size: 0.925rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--color-primary);
  letter-spacing: 0.04em;
  margin-bottom: 1rem;
}
.requirements-checklist {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.875rem;
}
@media (min-width: 768px) {
  .requirements-checklist {
    grid-template-columns: 1fr 1fr;
  }
}
.checklist-item {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}
.check-icon {
  width: 22px;
  height: 22px;
  background: var(--color-primary-50);
  color: var(--color-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
  flex-shrink: 0;
}
.check-text {
  font-size: 0.925rem;
  color: var(--color-gray-600);
  line-height: 1.4;
  font-weight: 500;
}

/* Walkthrough navigation */
.pathway-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--color-gray-100);
  padding-top: 1.5rem;
}
.navigation-dots {
  display: flex;
  gap: 0.625rem;
}
.nav-dot {
  width: 10px;
  height: 10px;
  background: var(--color-gray-200);
  border-radius: 50%;
  cursor: pointer;
  transition: all var(--duration-base) ease;
}
.nav-dot:hover {
  background: var(--color-gray-300);
}
.nav-dot--active {
  background: var(--color-accent);
  transform: scale(1.25);
  box-shadow: 0 0 8px rgba(232, 119, 34, 0.4);
}

/* Mobile pill step indicator navigation */
.mobile-only-step-bar {
  scrollbar-width: none; /* Firefox */
}
.mobile-only-step-bar::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}
.mobile-step-pill {
  padding: 0.5rem 1.15rem;
  background: #ffffff;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-gray-600);
  transition: all 0.2s ease;
  white-space: nowrap;
}
.mobile-step-pill--active {
  background: var(--color-accent);
  color: #fff;
  border-color: var(--color-accent);
  box-shadow: 0 4px 10px rgba(232, 119, 34, 0.2);
}

.main-content { max-width: 800px; margin: 4rem auto 0 auto; padding: 0 1.5rem; }
.fade-in { animation: fadeIn 300ms ease forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

/* Desktop Only Excalidraw view */
.desktop-only-excalidraw { display: none; }
@media (min-width: 900px) {
  .desktop-only-excalidraw { display: block; }
}
.svg-wrapper { width: 100%; overflow: hidden; }
.excalidraw-svg { width: 100%; height: auto; }
</style>
