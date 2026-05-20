<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const { locale } = useI18n()

// Fetch localized Student Life page content
const pagePath = '/student-life'
const { data: pageData } = await useAsyncData(`student-life-page-${locale.value}`, () =>
  queryCollection('content').path(pagePath).first()
)

// Active relocation stage selection tab
const stageTabs = [
  { key: 'stageA', label: 'Stage 1: Prep & Funding', icon: 'i-heroicons-banknotes-20-solid' },
  { key: 'stageB', label: 'Stage 2: Travel & Bureaucracy', icon: 'i-heroicons-globe-europe-africa-20-solid' },
  { key: 'stageC', label: 'Stage 3: Physical Enrollment', icon: 'i-heroicons-document-check-20-solid' }
]
const activeStageKey = ref('stageA')
const activeStageIndex = computed(() => stageTabs.findIndex(t => t.key === activeStageKey.value))
const selectedStepIndex = ref(0)

// Reset step selection when switching stages
watch(activeStageKey, () => {
  selectedStepIndex.value = 0
})

// Combined relocation checklist
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
const completedCount = computed(() => {
  return Object.values(userChecklist.value).filter(Boolean).length
})
const overallProgress = computed(() => {
  return (completedCount.value / totalTasks) * 100
})

// Relocation stage steps content
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
    desc: 'Schedule appointment at German Embassy Hanoi/HCMC. Bring Letters of Admission, Blocked Account confirmation, APS, and biometrics. Processing takes 4-6 weeks.',
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
    title: 'Final secretariat document filing',
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

const activeStep = computed(() => {
  return currentSteps.value[selectedStepIndex.value] || currentSteps.value[0]
})

// Accordion items mapping for mobile progressive checklist
const mobileAccordionItems = computed(() => {
  return currentSteps.value.map((step, idx) => ({
    label: `${idx + 1}. ${step.title}`,
    content: step.desc,
    id: step.id,
    todoText: step.todoText,
    link: step.link
  }))
})
</script>

<template>
  <div class="page-student-life">
    <!-- Header -->
    <div class="header-banner">
      <div class="container text-center">
        <h1 class="page-title">{{ pageData?.title || 'Relocation Journey' }}</h1>
        <p class="page-subtitle">{{ pageData?.description || 'Your structured path from preparation to physical enrollment in Germany.' }}</p>
      </div>
    </div>

    <!-- Global Progress Bar Tracker -->
    <div class="container max-w-3xl mb-12">
      <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-center">
        <h3 class="text-lg font-bold text-gray-900 mb-2">Overall Relocation & Enrollment Readiness</h3>
        <UProgress :value="overallProgress" color="primary" indicator class="my-4" />
        <p class="text-sm font-semibold text-gray-600">
          You have completed <span class="text-primary font-bold">{{ completedCount }}</span> of <span class="font-bold">{{ totalTasks }}</span> critical preparation tasks.
        </p>
      </div>
    </div>

    <!-- Relocation Stage Switcher -->
    <div class="container max-w-xl mb-10">
      <UTabs 
        v-model="activeStageKey" 
        :items="stageTabs" 
        class="w-full"
      />
    </div>

    <!-- MAIN INTERACTIVE SECTION -->
    <div class="container max-w-6xl mb-16">
      <div class="interactive-grid">
        
        <!-- Desktop Excalidraw Roadmaps (Left Column) -->
        <div class="desktop-only roadmap-visualizer bg-white border border-gray-200 rounded-3xl p-6 shadow-md">
          <h3 class="text-center font-bold text-lg text-primary mb-4">Click steps to inspect details & checklists</h3>
          
          <!-- Stage 1 SVG Diagram -->
          <div v-if="activeStageKey === 'stageA'" class="svg-container">
            <svg viewBox="0 0 500 550" class="excalidraw-svg">
              <defs>
                <marker id="arrow-a" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--color-primary)" />
                </marker>
                <filter id="handdrawn-a" x="-10%" y="-10%" width="120%" height="120%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
                </filter>
              </defs>

              <!-- Connection curves -->
              <path d="M 160 160 C 220 200, 320 200, 340 220" fill="none" stroke="var(--color-primary)" stroke-width="3" stroke-dasharray="6,4" marker-end="url(#arrow-a)" filter="url(#handdrawn-a)" />
              <path d="M 340 340 C 280 380, 180 380, 160 400" fill="none" stroke="var(--color-primary)" stroke-width="3" stroke-dasharray="6,4" marker-end="url(#arrow-a)" filter="url(#handdrawn-a)" />

              <!-- Step 1 Node -->
              <g @click="selectedStepIndex = 0" style="cursor: pointer;">
                <rect x="30" y="40" width="260" height="110" rx="12" fill="#ffffff" :stroke="selectedStepIndex === 0 ? 'var(--color-accent)' : 'var(--color-primary)'" stroke-width="3" filter="url(#handdrawn-a)" />
                <circle cx="65" cy="95" r="20" :fill="selectedStepIndex === 0 ? 'var(--color-accent)' : 'var(--color-primary)'" filter="url(#handdrawn-a)" />
                <text x="65" y="100" fill="#ffffff" font-size="14" font-weight="bold" text-anchor="middle">1</text>
                <text x="100" y="90" :fill="selectedStepIndex === 0 ? 'var(--color-accent)' : 'var(--color-primary-dark)'" font-size="14" font-weight="bold">Explore Funding</text>
                <text x="100" y="110" fill="var(--color-gray-500)" font-size="11">DAAD Scholarship Database</text>
              </g>

              <!-- Step 2 Node -->
              <g @click="selectedStepIndex = 1" style="cursor: pointer;">
                <rect x="210" y="220" width="260" height="110" rx="12" fill="#ffffff" :stroke="selectedStepIndex === 1 ? 'var(--color-accent)' : 'var(--color-primary)'" stroke-width="3" filter="url(#handdrawn-a)" />
                <circle cx="245" cy="275" r="20" :fill="selectedStepIndex === 1 ? 'var(--color-accent)' : 'var(--color-primary)'" filter="url(#handdrawn-a)" />
                <text x="245" y="280" fill="#ffffff" font-size="14" font-weight="bold" text-anchor="middle">2</text>
                <text x="280" y="270" :fill="selectedStepIndex === 1 ? 'var(--color-accent)' : 'var(--color-primary-dark)'" font-size="14" font-weight="bold">Portfolio &amp; Letters</text>
                <text x="280" y="290" fill="var(--color-gray-500)" font-size="11">References &amp; Proposal</text>
              </g>

              <!-- Step 3 Node -->
              <g @click="selectedStepIndex = 2" style="cursor: pointer;">
                <rect x="30" y="400" width="260" height="110" rx="12" fill="#ffffff" :stroke="selectedStepIndex === 2 ? 'var(--color-accent)' : 'var(--color-primary)'" stroke-width="3" filter="url(#handdrawn-a)" />
                <circle cx="65" cy="455" r="20" :fill="selectedStepIndex === 2 ? 'var(--color-accent)' : 'var(--color-primary)'" filter="url(#handdrawn-a)" />
                <text x="65" y="460" fill="#ffffff" font-size="14" font-weight="bold" text-anchor="middle">3</text>
                <text x="100" y="450" :fill="selectedStepIndex === 2 ? 'var(--color-accent)' : 'var(--color-primary-dark)'" font-size="14" font-weight="bold">Portal Upload</text>
                <text x="100" y="470" fill="var(--color-gray-500)" font-size="11">November Deadline</text>
              </g>
            </svg>
          </div>

          <!-- Stage 2 SVG Diagram -->
          <div v-if="activeStageKey === 'stageB'" class="svg-container">
            <svg viewBox="0 0 500 550" class="excalidraw-svg">
              <defs>
                <marker id="arrow-b" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--color-primary)" />
                </marker>
                <filter id="handdrawn-b" x="-10%" y="-10%" width="120%" height="120%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
                </filter>
              </defs>

              <path d="M 340 160 C 280 200, 180 200, 160 220" fill="none" stroke="var(--color-primary)" stroke-width="3" stroke-dasharray="6,4" marker-end="url(#arrow-b)" filter="url(#handdrawn-b)" />
              <path d="M 160 340 C 220 380, 320 380, 340 400" fill="none" stroke="var(--color-primary)" stroke-width="3" stroke-dasharray="6,4" marker-end="url(#arrow-b)" filter="url(#handdrawn-b)" />

              <!-- Step 4 Node -->
              <g @click="selectedStepIndex = 0" style="cursor: pointer;">
                <rect x="210" y="40" width="260" height="110" rx="12" fill="#ffffff" :stroke="selectedStepIndex === 0 ? 'var(--color-accent)' : 'var(--color-primary)'" stroke-width="3" filter="url(#handdrawn-b)" />
                <circle cx="245" cy="95" r="20" :fill="selectedStepIndex === 0 ? 'var(--color-accent)' : 'var(--color-primary)'" filter="url(#handdrawn-b)" />
                <text x="245" y="100" fill="#ffffff" font-size="14" font-weight="bold" text-anchor="middle">4</text>
                <text x="280" y="90" :fill="selectedStepIndex === 0 ? 'var(--color-accent)' : 'var(--color-primary-dark)'" font-size="14" font-weight="bold">Admission &amp; APS</text>
                <text x="280" y="110" fill="var(--color-gray-500)" font-size="11">Coordinated Selection letter</text>
              </g>

              <!-- Step 5 Node -->
              <g @click="selectedStepIndex = 1" style="cursor: pointer;">
                <rect x="30" y="220" width="260" height="110" rx="12" fill="#ffffff" :stroke="selectedStepIndex === 1 ? 'var(--color-accent)' : 'var(--color-primary)'" stroke-width="3" filter="url(#handdrawn-b)" />
                <circle cx="65" cy="275" r="20" :fill="selectedStepIndex === 1 ? 'var(--color-accent)' : 'var(--color-primary)'" filter="url(#handdrawn-b)" />
                <text x="65" y="280" fill="#ffffff" font-size="14" font-weight="bold" text-anchor="middle">5</text>
                <text x="100" y="270" :fill="selectedStepIndex === 1 ? 'var(--color-accent)' : 'var(--color-primary-dark)'" font-size="14" font-weight="bold">Blocked Account</text>
                <text x="100" y="290" fill="var(--color-gray-500)" font-size="11">Sperrkonto Activation</text>
              </g>

              <!-- Step 6 Node -->
              <g @click="selectedStepIndex = 2" style="cursor: pointer;">
                <rect x="210" y="400" width="260" height="110" rx="12" fill="#ffffff" :stroke="selectedStepIndex === 2 ? 'var(--color-accent)' : 'var(--color-primary)'" stroke-width="3" filter="url(#handdrawn-b)" />
                <circle cx="245" cy="455" r="20" :fill="selectedStepIndex === 2 ? 'var(--color-accent)' : 'var(--color-primary)'" filter="url(#handdrawn-b)" />
                <text x="245" y="460" fill="#ffffff" font-size="14" font-weight="bold" text-anchor="middle">6</text>
                <text x="280" y="450" :fill="selectedStepIndex === 2 ? 'var(--color-accent)' : 'var(--color-primary-dark)'" font-size="14" font-weight="bold">Student Visa</text>
                <text x="280" y="470" fill="var(--color-gray-500)" font-size="11">Hanoi Embassy Interview</text>
              </g>
            </svg>
          </div>

          <!-- Stage 3 SVG Diagram -->
          <div v-if="activeStageKey === 'stageC'" class="svg-container">
            <svg viewBox="0 0 500 550" class="excalidraw-svg">
              <defs>
                <marker id="arrow-c" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--color-primary)" />
                </marker>
                <filter id="handdrawn-c" x="-10%" y="-10%" width="120%" height="120%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
                </filter>
              </defs>

              <path d="M 160 120 C 220 160, 320 160, 340 180" fill="none" stroke="var(--color-primary)" stroke-width="3" stroke-dasharray="6,4" marker-end="url(#arrow-c)" filter="url(#handdrawn-c)" />
              <path d="M 340 260 C 280 300, 180 300, 160 320" fill="none" stroke="var(--color-primary)" stroke-width="3" stroke-dasharray="6,4" marker-end="url(#arrow-c)" filter="url(#handdrawn-c)" />
              <path d="M 160 400 C 220 440, 320 440, 340 460" fill="none" stroke="var(--color-primary)" stroke-width="3" stroke-dasharray="6,4" marker-end="url(#arrow-c)" filter="url(#handdrawn-c)" />

              <!-- Step 7 Node -->
              <g @click="selectedStepIndex = 0" style="cursor: pointer;">
                <rect x="30" y="20" width="260" height="90" rx="12" fill="#ffffff" :stroke="selectedStepIndex === 0 ? 'var(--color-accent)' : 'var(--color-primary)'" stroke-width="3" filter="url(#handdrawn-c)" />
                <circle cx="65" cy="65" r="18" :fill="selectedStepIndex === 0 ? 'var(--color-accent)' : 'var(--color-primary)'" filter="url(#handdrawn-c)" />
                <text x="65" y="70" fill="#ffffff" font-size="13" font-weight="bold" text-anchor="middle">7</text>
                <text x="95" y="60" :fill="selectedStepIndex === 0 ? 'var(--color-accent)' : 'var(--color-primary-dark)'" font-size="13" font-weight="bold">Health Insurance</text>
                <text x="95" y="78" fill="var(--color-gray-500)" font-size="10.5">TK / AOK Registration</text>
              </g>

              <!-- Step 8 Node -->
              <g @click="selectedStepIndex = 1" style="cursor: pointer;">
                <rect x="210" y="160" width="260" height="90" rx="12" fill="#ffffff" :stroke="selectedStepIndex === 1 ? 'var(--color-accent)' : 'var(--color-primary)'" stroke-width="3" filter="url(#handdrawn-c)" />
                <circle cx="245" cy="205" r="18" :fill="selectedStepIndex === 1 ? 'var(--color-accent)' : 'var(--color-primary)'" filter="url(#handdrawn-c)" />
                <text x="245" y="210" fill="#ffffff" font-size="13" font-weight="bold" text-anchor="middle">8</text>
                <text x="275" y="200" :fill="selectedStepIndex === 1 ? 'var(--color-accent)' : 'var(--color-primary-dark)'" font-size="13" font-weight="bold">Semester Contribution</text>
                <text x="275" y="218" fill="var(--color-gray-500)" font-size="10.5">~150 EUR Social Fee</text>
              </g>

              <!-- Step 9 Node -->
              <g @click="selectedStepIndex = 2" style="cursor: pointer;">
                <rect x="30" y="300" width="260" height="90" rx="12" fill="#ffffff" :stroke="selectedStepIndex === 2 ? 'var(--color-accent)' : 'var(--color-primary)'" stroke-width="3" filter="url(#handdrawn-c)" />
                <circle cx="65" cy="345" r="18" :fill="selectedStepIndex === 2 ? 'var(--color-accent)' : 'var(--color-primary)'" filter="url(#handdrawn-c)" />
                <text x="65" y="350" fill="#ffffff" font-size="13" font-weight="bold" text-anchor="middle">9</text>
                <text x="95" y="340" :fill="selectedStepIndex === 2 ? 'var(--color-accent)' : 'var(--color-primary-dark)'" font-size="13" font-weight="bold">City Registration</text>
                <text x="95" y="358" fill="var(--color-gray-500)" font-size="10.5">Magdeburg Bürgerbüro</text>
              </g>

              <!-- Step 10 Node -->
              <g @click="selectedStepIndex = 3" style="cursor: pointer;">
                <rect x="210" y="440" width="260" height="90" rx="12" fill="#ffffff" :stroke="selectedStepIndex === 3 ? 'var(--color-accent)' : 'var(--color-primary)'" stroke-width="3" filter="url(#handdrawn-c)" />
                <circle cx="245" cy="485" r="18" :fill="selectedStepIndex === 3 ? 'var(--color-accent)' : 'var(--color-primary)'" filter="url(#handdrawn-c)" />
                <text x="245" y="490" fill="#ffffff" font-size="13" font-weight="bold" text-anchor="middle">10</text>
                <text x="275" y="480" :fill="selectedStepIndex === 3 ? 'var(--color-accent)' : 'var(--color-primary-dark)'" font-size="13" font-weight="bold">Secretariat Filing</text>
                <text x="275" y="498" fill="var(--color-gray-500)" font-size="10.5">Physical Student Card Issued</text>
              </g>
            </svg>
          </div>
        </div>

        <!-- Desktop Details Panel (Right Column) -->
        <div class="desktop-only details-column bg-white border border-gray-200 rounded-3xl p-8 shadow-md">
          <div v-if="activeStep" class="fade-in">
            <span class="text-xs uppercase font-bold text-accent tracking-widest block mb-1">Detailed Instructions</span>
            <h3 class="text-2xl font-extrabold text-primary-dark mb-4">{{ activeStep.title }}</h3>
            
            <div class="prose text-gray-600 mb-6 text-sm leading-relaxed">
              <p>{{ activeStep.desc }}</p>
            </div>

            <!-- Action Checklist for active step -->
            <div class="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
              <h4 class="text-xs font-bold uppercase text-primary tracking-wider mb-3">Required Action Check:</h4>
              <label class="flex items-center gap-3 cursor-pointer select-none text-sm font-bold text-gray-800">
                <UCheckbox v-model="userChecklist[activeStep.id]" />
                <span>{{ activeStep.todoText }}</span>
              </label>
            </div>

            <!-- Helpful Links -->
            <div v-if="activeStep.link && activeStep.link !== '#'">
              <a :href="activeStep.link" target="_blank" class="w-full text-center font-bold text-sm bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-lg block shadow transition">
                Visit Official Portal / Resource &rarr;
              </a>
            </div>
          </div>
        </div>

        <!-- Mobile Accordion progressive sequence (Mobile Viewport Fallback) -->
        <div class="mobile-only w-full">
          <div class="bg-white border border-gray-200 rounded-2xl p-4 shadow-md">
            <h3 class="text-center font-bold text-base text-primary mb-4">Relocation Roadmap Timeline</h3>
            <div class="flex flex-col gap-2">
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
                  <p class="text-sm text-gray-600 mb-4 leading-relaxed">{{ step.desc }}</p>
                  <div class="bg-gray-50 border border-gray-200 rounded-lg p-3.5 mb-4">
                    <label class="flex items-center gap-2.5 font-bold text-xs text-gray-700 cursor-pointer select-none">
                      <input type="checkbox" v-model="userChecklist[step.id]" class="accent-primary" />
                      <span>Ready: {{ step.todoText }}</span>
                    </label>
                  </div>
                  <a v-if="step.link && step.link !== '#'" :href="step.link" target="_blank" class="w-full text-center font-bold text-xs bg-primary text-white py-2 rounded block">
                    Visit Resource
                  </a>
                </div>
              </details>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Localized markdown content renderer -->
    <div v-if="pageData" class="container main-content prose mt-12">
      <ContentRenderer :value="pageData" />
    </div>

  </div>
</template>

<style scoped>
.page-student-life { min-height: 80vh; background: var(--color-gray-50); padding-bottom: 5rem; }

.interactive-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 900px) {
  .interactive-grid {
    grid-template-columns: 1.3fr 1fr;
  }
}

.svg-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.excalidraw-svg {
  max-width: 480px;
  width: 100%;
  height: auto;
}

.node-rect {
  transition: all 200ms;
}

.node-rect:hover {
  stroke-width: 4.5px;
}

.desktop-only { display: none; }
.mobile-only { display: block; }

@media (min-width: 900px) {
  .desktop-only { display: block; }
  .mobile-only { display: none; }
}

.main-content { max-width: 800px; margin: 0 auto; padding: 0 1.5rem; }
.fade-in { animation: fadeIn 300ms ease forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

/* Native accordion for mobile */
.accordion-item { border: 1px solid var(--color-gray-200); border-radius: var(--radius-md); overflow: hidden; background: #fff; }
.accordion-summary {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem 1rem;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-primary-dark);
  cursor: pointer;
  list-style: none;
  user-select: none;
}
.accordion-summary::-webkit-details-marker { display: none; }
.accordion-num { width: 24px; height: 24px; border-radius: 50%; background: var(--color-primary); color: #fff; font-size: 0.75rem; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
.accordion-done { margin-left: auto; font-size: 0.85rem; color: #22c55e; font-weight: 800; }
.accordion-body { padding: 0 1rem 1rem; border-top: 1px solid var(--color-gray-100); background: #fff; }
</style>
