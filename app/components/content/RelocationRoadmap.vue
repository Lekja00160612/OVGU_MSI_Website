<script setup lang="ts">
import { inject, ref, computed, watch } from 'vue'

// pageData injected (not used directly — all steps data is local & self-contained)
const { page } = inject('pageData') as any

// ── Stage tabs ──────────────────────────────────────────────────────────────
const stageTabs = [
  { key: 'stageA', label: 'Stage 1: Prep & Funding', icon: 'i-heroicons-banknotes-20-solid' },
  { key: 'stageB', label: 'Stage 2: Travel & Bureaucracy', icon: 'i-heroicons-globe-europe-africa-20-solid' },
  { key: 'stageC', label: 'Stage 3: Physical Enrollment', icon: 'i-heroicons-document-check-20-solid' }
]

// UTabs expects items with 'label' property
const tabItems = stageTabs.map(t => ({ label: t.label, key: t.key }))

const activeStageKey = ref('stageA')
const selectedStepIndex = ref(0)

watch(activeStageKey, () => { selectedStepIndex.value = 0 })

// ── Steps data (self-contained) ─────────────────────────────────────────────
const stageASteps = [
  {
    id: 'daadDb',
    title: 'Explore DAAD Funding',
    desc: 'Browse the DAAD scholarship database. Look for "Study Scholarships for Graduates of All Disciplines". It covers monthly stipends, health insurance, and travel allowance.',
    todoText: 'Identify matching scholarships and note application deadlines.',
    link: 'https://www.daad.de/en/'
  },
  {
    id: 'letters',
    title: 'Recommendation & Research Proposals',
    desc: 'Request academic recommendation letters from VGU professors. Draft a comprehensive research proposal aligning with your target OVGU research chair interests.',
    todoText: 'Obtain 2 signed reference letters and compile research plan.',
    link: '#'
  },
  {
    id: 'portal',
    title: 'DAAD Portal Upload',
    desc: 'Upload complete application packet to the DAAD portal. Take note that the application window typically closes in October/November of the preceding year.',
    todoText: 'Submit dossier and defend proposal in selection interview.',
    link: 'https://portal.daad.de/'
  }
]

const stageBSteps = [
  {
    id: 'admission',
    title: 'Admissions & APS Vietnam',
    desc: 'VGU coordinates with OVGU Magdeburg to issue your official Letter of Admission (Zulassungsbescheid). Vietnam applicants must obtain academic verification (APS) from Hanoi Embassy.',
    todoText: 'Receive admission offer and get physical APS certificate.',
    link: '#'
  },
  {
    id: 'blockedAccount',
    title: 'Sperrkonto Blocked Account',
    desc: 'Open a blocked account (Sperrkonto) online. Transfer the required statutory living cost guarantee amount (currently €11,904) to obtain a confirmation certificate.',
    todoText: 'Wire funds and download blocked proof statement.',
    link: 'https://www.expatrio.com/'
  },
  {
    id: 'visa',
    title: 'Embassy Student Visa',
    desc: 'Schedule appointment at German Embassy Hanoi/HCMC. Bring Letters of Admission, Blocked Account confirmation, APS, and biometrics. Processing takes 4–6 weeks.',
    todoText: 'Book appointment and attend student visa interview.',
    link: '#'
  }
]

const stageCSteps = [
  {
    id: 'insurance',
    title: 'Health Insurance Activation',
    desc: 'Register with a German public health insurance provider (TK/AOK). They will send a digital clearance notice direct to OVGU for enrollment.',
    todoText: 'Register online to trigger digital transmission.',
    link: 'https://www.krankenkassen.de/'
  },
  {
    id: 'semesterFee',
    title: 'Social Contribution Semester Fee',
    desc: 'Transfer the social contribution fee (~150 EUR) directly to the OVGU bank account coordinates. This funds student services, cafeteria, and local committees.',
    todoText: 'Complete wire transfer and save confirmation receipt.',
    link: '#'
  },
  {
    id: 'melde',
    title: 'City Registration (Bürgerbüro)',
    desc: 'Within 14 days of moving into your Magdeburg dormitory or flat, register at the Bürgerbüro city registry. You will need your landlord certificate.',
    todoText: 'Receive Wohnungsgeberbestätigung and obtain city registration proof.',
    link: 'https://www.magdeburg.de/'
  },
  {
    id: 'ovguSubmit',
    title: 'Final Secretariat Document Filing',
    desc: 'Visit OVGU student secretariat in person. Submit physical copies of bachelor certificates, German translations, health insurance clearance, and fee receipt.',
    todoText: 'Fulfill conditions to receive physical student card (Semesterticket).',
    link: '#'
  }
]

const currentSteps = computed(() => {
  if (activeStageKey.value === 'stageA') return stageASteps
  if (activeStageKey.value === 'stageB') return stageBSteps
  return stageCSteps
})

const activeStep = computed(() =>
  currentSteps.value[selectedStepIndex.value] ?? currentSteps.value[0]
)

// ── Checklist state ─────────────────────────────────────────────────────────
const userChecklist = ref<Record<string, boolean>>({
  daadDb: false,
  letters: false,
  portal: false,
  admission: false,
  blockedAccount: false,
  visa: false,
  insurance: false,
  semesterFee: false,
  melde: false,
  ovguSubmit: false
})

const totalTasks = 10
const completedCount = computed(() =>
  Object.values(userChecklist.value).filter(Boolean).length
)
const overallProgress = computed(() =>
  Math.round((completedCount.value / totalTasks) * 100)
)

// ── SVG node data for each stage ────────────────────────────────────────────
// (Positions pre-computed to avoid duplicating SVG markup in template)
type SvgNode = {
  stepNum: number
  stepIndex: number
  x: number; y: number; w: number; h: number
  cx: number; cy: number; r: number
  label: string; sub: string
}

const svgNodesA: SvgNode[] = [
  { stepNum: 1, stepIndex: 0, x: 30,  y: 40,  w: 260, h: 110, cx: 65,  cy: 95,  r: 20, label: 'Explore Funding',    sub: 'DAAD Scholarship Database' },
  { stepNum: 2, stepIndex: 1, x: 210, y: 220, w: 260, h: 110, cx: 245, cy: 275, r: 20, label: 'Portfolio & Letters', sub: 'References & Proposal' },
  { stepNum: 3, stepIndex: 2, x: 30,  y: 400, w: 260, h: 110, cx: 65,  cy: 455, r: 20, label: 'Portal Upload',       sub: 'November Deadline' }
]

const svgNodesB: SvgNode[] = [
  { stepNum: 4, stepIndex: 0, x: 210, y: 40,  w: 260, h: 110, cx: 245, cy: 95,  r: 20, label: 'Admission & APS',    sub: 'Coordinated Selection letter' },
  { stepNum: 5, stepIndex: 1, x: 30,  y: 220, w: 260, h: 110, cx: 65,  cy: 275, r: 20, label: 'Blocked Account',     sub: 'Sperrkonto Activation' },
  { stepNum: 6, stepIndex: 2, x: 210, y: 400, w: 260, h: 110, cx: 245, cy: 455, r: 20, label: 'Student Visa',        sub: 'Hanoi Embassy Interview' }
]

const svgNodesC: SvgNode[] = [
  { stepNum: 7,  stepIndex: 0, x: 30,  y: 20,  w: 260, h: 90, cx: 65,  cy: 65,  r: 18, label: 'Health Insurance',       sub: 'TK / AOK Registration' },
  { stepNum: 8,  stepIndex: 1, x: 210, y: 160, w: 260, h: 90, cx: 245, cy: 205, r: 18, label: 'Semester Contribution',   sub: '~150 EUR Social Fee' },
  { stepNum: 9,  stepIndex: 2, x: 30,  y: 300, w: 260, h: 90, cx: 65,  cy: 345, r: 18, label: 'City Registration',       sub: 'Magdeburg Bürgerbüro' },
  { stepNum: 10, stepIndex: 3, x: 210, y: 440, w: 260, h: 90, cx: 245, cy: 485, r: 18, label: 'Secretariat Filing',      sub: 'Physical Student Card Issued' }
]

type SvgArrow = { d: string; markerId: string }

const svgArrowsA: SvgArrow[] = [
  { d: 'M 160 160 C 220 200, 320 200, 340 220', markerId: 'arrow-a' },
  { d: 'M 340 340 C 280 380, 180 380, 160 400', markerId: 'arrow-a' }
]
const svgArrowsB: SvgArrow[] = [
  { d: 'M 340 160 C 280 200, 180 200, 160 220', markerId: 'arrow-b' },
  { d: 'M 160 340 C 220 380, 320 380, 340 400', markerId: 'arrow-b' }
]
const svgArrowsC: SvgArrow[] = [
  { d: 'M 160 120 C 220 160, 320 160, 340 180', markerId: 'arrow-c' },
  { d: 'M 340 260 C 280 300, 180 300, 160 320', markerId: 'arrow-c' },
  { d: 'M 160 400 C 220 440, 320 440, 340 460', markerId: 'arrow-c' }
]

const currentNodes = computed(() => {
  if (activeStageKey.value === 'stageA') return svgNodesA
  if (activeStageKey.value === 'stageB') return svgNodesB
  return svgNodesC
})

const currentArrows = computed(() => {
  if (activeStageKey.value === 'stageA') return svgArrowsA
  if (activeStageKey.value === 'stageB') return svgArrowsB
  return svgArrowsC
})

const arrowMarkerId = computed(() => {
  if (activeStageKey.value === 'stageA') return 'arrow-a'
  if (activeStageKey.value === 'stageB') return 'arrow-b'
  return 'arrow-c'
})
</script>

<template>
  <div class="relocation-roadmap">

    <!-- Progress bar -->
    <div class="progress-card">
      <h3 class="progress-title">Overall Relocation &amp; Enrollment Readiness</h3>
      <UProgress :value="overallProgress" color="primary" indicator class="progress-bar" />
      <p class="progress-text">
        Completed
        <strong class="progress-done">{{ completedCount }}</strong>
        of
        <strong>{{ totalTasks }}</strong>
        critical preparation tasks.
      </p>
    </div>

    <!-- Stage Tabs -->
    <div class="tabs-wrapper">
      <UTabs
        v-model="activeStageKey"
        :items="tabItems"
        class="w-full"
      />
    </div>

    <!-- Main interactive grid -->
    <div class="roadmap-grid">

      <!-- ── Desktop: SVG Diagram (left) ── -->
      <div class="diagram-panel desktop-only">
        <h4 class="diagram-hint">Click steps to inspect details &amp; checklists</h4>

        <div class="svg-container">
          <svg viewBox="0 0 500 550" class="roadmap-svg" role="img" aria-label="Roadmap diagram">
            <defs>
              <marker
                :id="arrowMarkerId"
                viewBox="0 0 10 10"
                refX="5" refY="5"
                markerWidth="6" markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--color-primary)" />
              </marker>
              <filter :id="'hd-' + activeStageKey" x="-10%" y="-10%" width="120%" height="120%">
                <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>

            <!-- Arrows -->
            <path
              v-for="(arrow, ai) in currentArrows"
              :key="'arrow-' + ai"
              :d="arrow.d"
              fill="none"
              stroke="var(--color-primary)"
              stroke-width="3"
              stroke-dasharray="6,4"
              :marker-end="'url(#' + arrowMarkerId + ')'"
              :filter="'url(#hd-' + activeStageKey + ')'"
            />

            <!-- Step Nodes -->
            <g
              v-for="node in currentNodes"
              :key="'node-' + node.stepNum"
              style="cursor: pointer;"
              @click="selectedStepIndex = node.stepIndex"
            >
              <rect
                :x="node.x" :y="node.y" :width="node.w" :height="node.h"
                rx="12"
                fill="#ffffff"
                :stroke="selectedStepIndex === node.stepIndex ? 'var(--color-accent)' : 'var(--color-primary)'"
                stroke-width="3"
                :filter="'url(#hd-' + activeStageKey + ')'"
              />
              <circle
                :cx="node.cx" :cy="node.cy" :r="node.r"
                :fill="selectedStepIndex === node.stepIndex ? 'var(--color-accent)' : 'var(--color-primary)'"
                :filter="'url(#hd-' + activeStageKey + ')'"
              />
              <text
                :x="node.cx" :y="node.cy + 5"
                fill="#ffffff"
                font-size="13"
                font-weight="bold"
                text-anchor="middle"
              >{{ node.stepNum }}</text>
              <text
                :x="node.cx + node.r + 10" :y="node.cy - 6"
                :fill="selectedStepIndex === node.stepIndex ? 'var(--color-accent)' : 'var(--color-primary-dark)'"
                font-size="13"
                font-weight="bold"
              >{{ node.label }}</text>
              <text
                :x="node.cx + node.r + 10" :y="node.cy + 12"
                fill="var(--color-gray-500)"
                font-size="10.5"
              >{{ node.sub }}</text>
            </g>
          </svg>
        </div>
      </div>

      <!-- ── Desktop: Detail panel (right) ── -->
      <div class="detail-panel desktop-only">
        <div v-if="activeStep" class="detail-inner fade-in" :key="activeStep.id">
          <span class="detail-label">Detailed Instructions</span>
          <h3 class="detail-title">{{ activeStep.title }}</h3>

          <div class="detail-scroll-body">
            <p class="detail-desc">{{ activeStep.desc }}</p>

            <!-- Checklist checkbox -->
            <div class="checklist-box">
              <h4 class="checklist-heading">Required Action Check</h4>
              <label class="checklist-label">
                <UCheckbox v-model="userChecklist[activeStep.id]" />
                <span class="checklist-text">{{ activeStep.todoText }}</span>
              </label>
            </div>

            <!-- External link -->
            <div v-if="activeStep.link && activeStep.link !== '#'" class="link-btn-wrap">
              <UButton
                :to="activeStep.link"
                target="_blank"
                external
                color="primary"
                variant="solid"
                size="md"
                block
                icon="i-heroicons-arrow-top-right-on-square-20-solid"
                trailing
              >
                Visit Official Portal / Resource
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Mobile: Accordion list ── -->
      <div class="mobile-only mobile-accordion-wrap">
        <div class="mobile-accordion-card">
          <h3 class="mobile-accordion-title">Relocation Roadmap Timeline</h3>
          <div class="accordion-list">
            <details
              v-for="(step, idx) in currentSteps"
              :key="step.id"
              class="accordion-item"
            >
              <summary class="accordion-summary">
                <span class="accordion-num">{{ idx + 1 }}</span>
                {{ step.title }}
                <span v-if="userChecklist[step.id]" class="accordion-done">✓</span>
              </summary>
              <div class="accordion-body">
                <p class="accordion-desc">{{ step.desc }}</p>
                <div class="accordion-checklist">
                  <label class="accordion-check-label">
                    <input type="checkbox" v-model="userChecklist[step.id]" class="accent-primary" />
                    <span>Ready: {{ step.todoText }}</span>
                  </label>
                </div>
                <a
                  v-if="step.link && step.link !== '#'"
                  :href="step.link"
                  target="_blank"
                  class="accordion-link-btn"
                >
                  Visit Resource →
                </a>
              </div>
            </details>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.relocation-roadmap {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* ── Progress card ──────────────────────── */
.progress-card {
  background: #fff;
  border: 1px solid var(--color-gray-200, #e5e7eb);
  border-radius: var(--radius-xl, 16px);
  padding: 1.75rem 2rem;
  box-shadow: var(--shadow-sm);
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
  width: 100%;
}
.progress-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-gray-900, #111827);
  margin-bottom: 0.75rem;
}
.progress-bar { margin: 0.75rem 0; }
.progress-text {
  font-size: 0.9rem;
  color: var(--color-gray-600, #4b5563);
  font-weight: 500;
}
.progress-done { color: var(--color-primary, #1e3a5f); font-weight: 800; }

/* ── Tabs ───────────────────────────────── */
.tabs-wrapper {
  max-width: 700px;
  margin: 0 auto;
  width: 100%;
}

/* ── Main grid ──────────────────────────── */
.roadmap-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.75rem;
}

@media (min-width: 900px) {
  .roadmap-grid {
    grid-template-columns: 1.25fr 1fr;
    align-items: start;
  }
  .mobile-only { display: none !important; }
  .desktop-only { display: block; }
}

.desktop-only { display: none; }
.mobile-only { display: block; }

/* ── Diagram panel ──────────────────────── */
.diagram-panel {
  background: #fff;
  border: 1px solid var(--color-gray-200, #e5e7eb);
  border-radius: var(--radius-2xl, 20px);
  padding: 1.75rem;
  box-shadow: var(--shadow-md);
}
.diagram-hint {
  text-align: center;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-primary, #1e3a5f);
  margin-bottom: 1.25rem;
}
.svg-container {
  display: flex;
  justify-content: center;
}
.roadmap-svg {
  max-width: 460px;
  width: 100%;
  height: auto;
}

/* ── Detail panel ───────────────────────── */
.detail-panel {
  background: #fff;
  border: 1px solid var(--color-gray-200, #e5e7eb);
  border-radius: var(--radius-2xl, 20px);
  padding: 2rem 2.25rem;
  box-shadow: var(--shadow-md);
  position: sticky;
  top: 90px;
}
.detail-inner { display: flex; flex-direction: column; gap: 1rem; }
.detail-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-accent, #e87722);
  display: block;
}
.detail-title {
  font-size: 1.45rem;
  font-weight: 800;
  color: var(--color-primary-dark, #0f2240);
  line-height: 1.25;
}
.detail-scroll-body {
  max-height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-right: 0.25rem;
}
.detail-desc {
  font-size: 0.92rem;
  color: var(--color-gray-700, #374151);
  line-height: 1.7;
}
.checklist-box {
  background: var(--color-gray-50, #f9fafb);
  border: 1px solid var(--color-gray-200, #e5e7eb);
  border-radius: var(--radius-lg, 12px);
  padding: 1.1rem 1.25rem;
}
.checklist-heading {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-primary, #1e3a5f);
  margin-bottom: 0.65rem;
}
.checklist-label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
}
.checklist-text {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-gray-800, #1f2937);
  line-height: 1.45;
}
.link-btn-wrap {}

/* ── Mobile accordion ───────────────────── */
.mobile-accordion-wrap {}
.mobile-accordion-card {
  background: #fff;
  border: 1px solid var(--color-gray-200, #e5e7eb);
  border-radius: var(--radius-xl, 16px);
  padding: 1.25rem;
  box-shadow: var(--shadow-md);
}
.mobile-accordion-title {
  text-align: center;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-primary, #1e3a5f);
  margin-bottom: 1rem;
}
.accordion-list { display: flex; flex-direction: column; gap: 0.5rem; }
.accordion-item {
  border: 1px solid var(--color-gray-200, #e5e7eb);
  border-radius: var(--radius-md, 8px);
  overflow: hidden;
  background: #fff;
}
.accordion-summary {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem 1rem;
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--color-primary-dark, #0f2240);
  cursor: pointer;
  list-style: none;
  user-select: none;
}
.accordion-summary::-webkit-details-marker { display: none; }
.accordion-num {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-primary, #1e3a5f);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.accordion-done { margin-left: auto; color: var(--color-success-main); font-weight: 800; font-size: 0.85rem; }
.accordion-body {
  padding: 0 1rem 1rem;
  border-top: 1px solid var(--color-gray-100, #f3f4f6);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.accordion-desc { font-size: 0.85rem; color: var(--color-gray-600, #4b5563); line-height: 1.6; }
.accordion-checklist {
  background: var(--color-gray-50, #f9fafb);
  border: 1px solid var(--color-gray-200, #e5e7eb);
  border-radius: var(--radius-md, 8px);
  padding: 0.75rem;
}
.accordion-check-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-gray-700, #374151);
  cursor: pointer;
  user-select: none;
}
.accordion-link-btn {
  display: block;
  width: 100%;
  text-align: center;
  background: var(--color-primary, #1e3a5f);
  color: #fff;
  font-size: 0.82rem;
  font-weight: 700;
  padding: 0.6rem 1rem;
  border-radius: var(--radius-md, 8px);
  text-decoration: none;
  transition: background 150ms;
}
.accordion-link-btn:hover { background: var(--color-primary-dark, #0f2240); }

/* Fade animation */
.fade-in { animation: fadeIn 280ms ease forwards; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
