<script setup lang="ts">
import { inject, ref, computed, watch } from 'vue'

// pageData injected (not used directly — all steps data is local & self-contained)
const pageData = inject('pageData', null) as any
const page = pageData?.page

// ── Stage tabs ──────────────────────────────────────────────────────────────
const stageTabs = [
  { key: 'stageA', label: 'Stage 1: Prep & Funding', icon: 'i-lucide-coins' },
  { key: 'stageB', label: 'Stage 2: Travel & Bureaucracy', icon: 'i-lucide-globe' },
  { key: 'stageC', label: 'Stage 3: Physical Enrollment', icon: 'i-lucide-file-check' }
]

// UTabs expects items with 'label' property
const tabItems = stageTabs.map(t => ({ label: t.label, key: t.key, icon: t.icon }))

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
  <div class="w-full flex flex-col gap-8 my-6 font-sans">

    <!-- Progress bar card -->
    <div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs text-center max-w-2xl mx-auto w-full">
      <h3 class="text-base sm:text-lg font-bold text-slate-900 mb-3">Overall Relocation &amp; Enrollment Readiness</h3>
      <UProgress :value="overallProgress" color="primary" indicator class="my-3" />
      <p class="text-xs sm:text-sm text-slate-600 font-medium mt-3">
        Completed
        <strong class="text-primary-600 font-bold">{{ completedCount }}</strong>
        of
        <strong>{{ totalTasks }}</strong>
        critical preparation tasks.
      </p>
    </div>

    <!-- Stage Tabs -->
    <div class="max-w-2xl mx-auto w-full">
      <UTabs
        v-model="activeStageKey"
        :items="tabItems"
        class="w-full"
      />
    </div>

    <!-- Main interactive grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

      <!-- Desktop: SVG Diagram (left) -->
      <div class="hidden lg:block lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 text-center">Click steps to inspect details &amp; checklists</h4>

        <div class="w-full overflow-hidden flex justify-center">
          <svg viewBox="0 0 500 550" class="w-full max-w-[460px] h-auto" role="img" aria-label="Roadmap diagram">
            <defs>
              <marker
                :id="arrowMarkerId"
                viewBox="0 0 10 10"
                refX="5" refY="5"
                markerWidth="6" markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#1E3A5F" />
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
              stroke="#1E3A5F"
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
                :stroke="selectedStepIndex === node.stepIndex ? '#E87722' : '#1E3A5F'"
                stroke-width="3"
                :filter="'url(#hd-' + activeStageKey + ')'"
              />
              <circle
                :cx="node.cx" :cy="node.cy" :r="node.r"
                :fill="selectedStepIndex === node.stepIndex ? '#E87722' : '#1E3A5F'"
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
                :fill="selectedStepIndex === node.stepIndex ? '#E87722' : '#0F2240'"
                font-size="13"
                font-weight="bold"
              >{{ node.label }}</text>
              <text
                :x="node.cx + node.r + 10" :y="node.cy + 12"
                fill="#64748B"
                font-size="10.5"
              >{{ node.sub }}</text>
            </g>
          </svg>
        </div>
      </div>

      <!-- Desktop: Detail panel (right) -->
      <div class="hidden lg:block lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs sticky top-24 min-h-[420px]">
        <div v-if="activeStep" class="flex flex-col gap-4" :key="activeStep.id">
          <span class="text-xs font-bold uppercase tracking-wider text-primary-600">Detailed Instructions</span>
          <h3 class="text-lg font-extrabold text-slate-900 leading-tight">{{ activeStep.title }}</h3>

          <div class="flex flex-col gap-4">
            <p class="text-sm text-slate-600 leading-relaxed">{{ activeStep.desc }}</p>

            <!-- Checklist checkbox -->
            <div class="p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
              <h4 class="text-xs font-bold uppercase tracking-wider text-orange-700 mb-2">Required Action Check</h4>
              <label class="flex items-start gap-2.5 cursor-pointer">
                <UCheckbox v-model="userChecklist[activeStep.id]" class="mt-0.5" />
                <span class="text-xs font-semibold text-slate-700 leading-snug">{{ activeStep.todoText }}</span>
              </label>
            </div>

            <!-- External link -->
            <div v-if="activeStep.link && activeStep.link !== '#'">
              <UButton
                :to="activeStep.link"
                target="_blank"
                external
                color="primary"
                variant="solid"
                size="md"
                block
                trailing-icon="i-lucide-external-link"
                class="font-bold rounded-xl"
              >
                Visit Official Portal / Resource
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile: Accordion list -->
      <div class="lg:hidden w-full">
        <div class="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
          <h3 class="text-base font-extrabold text-slate-900 mb-4">Relocation Roadmap Timeline</h3>
          <div class="flex flex-col gap-3">
            <details
              v-for="(step, idx) in currentSteps"
              :key="step.id"
              class="group rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/50 p-4 open:bg-white open:shadow-xs transition-all"
            >
              <summary class="flex items-center gap-3 font-bold text-slate-900 cursor-pointer text-sm list-none select-none">
                <span class="size-6 rounded-full bg-orange-100 text-orange-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                  {{ idx + 1 }}
                </span>
                <span class="flex-1">{{ step.title }}</span>
                <span v-if="userChecklist[step.id]" class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">✓ Ready</span>
              </summary>
              <div class="pt-4 border-t border-slate-100 mt-3 flex flex-col gap-3 text-xs text-slate-600">
                <p class="leading-relaxed">{{ step.desc }}</p>
                <label class="flex items-start gap-2 p-3 bg-orange-50/60 rounded-xl border border-orange-100 cursor-pointer">
                  <UCheckbox v-model="userChecklist[step.id]" class="mt-0.5" />
                  <span class="font-semibold text-slate-700">Ready: {{ step.todoText }}</span>
                </label>
                <UButton
                  v-if="step.link && step.link !== '#'"
                  :href="step.link"
                  target="_blank"
                  external
                  rel="noopener"
                  trailing-icon="i-lucide-arrow-right"
                  color="primary"
                  variant="subtle"
                  size="xs"
                  class="font-bold self-start rounded-lg"
                >
                  Visit Resource
                </UButton>
              </div>
            </details>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
