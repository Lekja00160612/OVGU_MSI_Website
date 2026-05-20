<script setup lang="ts">
import { inject, ref, computed, watch } from 'vue'

const { page } = inject('pageData') as any

type Pathway = 'direct' | 'bridging'

const activeTab = ref<Pathway>('direct')
const selectedStepIndex = ref(0)

// Reset step when pathway changes
watch(activeTab, () => {
  selectedStepIndex.value = 0
})

const steps = computed(() => {
  if (activeTab.value === 'direct') {
    return page?.eligible_steps || []
  }
  return page?.non_eligible_steps || []
})

const totalSteps = computed(() => steps.value.length)

const currentStep = computed(() => steps.value[selectedStepIndex.value] || null)

function prevStep() {
  if (selectedStepIndex.value > 0) selectedStepIndex.value--
}

function nextStep() {
  if (selectedStepIndex.value < totalSteps.value - 1) selectedStepIndex.value++
}

// Direct Entry: 3-step flowchart nodes
const directFlowNodes = [
  { label: 'Apply Online',     icon: '📝', desc: 'Submit your application via the admissions portal.' },
  { label: 'Document Review',  icon: '📋', desc: 'Your credentials are evaluated by the admissions office.' },
  { label: 'Enroll',           icon: '🎓', desc: 'Receive your acceptance letter and complete enrollment.' },
]

// Bridging: 4-step flowchart nodes
const bridgingFlowNodes = [
  { label: 'Pre-Assessment',   icon: '🔍', desc: 'Check your eligibility for bridging courses.' },
  { label: 'Bridging Courses', icon: '📚', desc: 'Complete required foundation modules.' },
  { label: 'Document Review',  icon: '📋', desc: 'Your bridged credentials are reviewed.' },
  { label: 'Enroll',           icon: '🎓', desc: 'Complete enrollment after bridging approval.' },
]

const flowNodes = computed(() =>
  activeTab.value === 'direct' ? directFlowNodes : bridgingFlowNodes
)

function getStatusColor(status: string): 'green' | 'orange' | 'blue' | 'gray' {
  const s = (status || '').toLowerCase()
  if (s.includes('required') || s.includes('mandatory')) return 'orange'
  if (s.includes('complete') || s.includes('done') || s.includes('pass')) return 'green'
  if (s.includes('optional')) return 'blue'
  return 'gray'
}
</script>

<template>
  <div class="pathway-selector">
    <!-- ── Pathway Toggle Cards ── -->
    <div class="pathway-cards">
      <button
        class="pathway-btn"
        :class="{ active: activeTab === 'direct' }"
        @click="activeTab = 'direct'"
      >
        <span class="pathway-icon">🎯</span>
        <div class="pathway-btn-text">
          <strong>Direct Entry</strong>
          <span>Meet all requirements</span>
        </div>
        <span class="pathway-check" v-if="activeTab === 'direct'">✓</span>
      </button>

      <button
        class="pathway-btn pathway-btn-bridging"
        :class="{ active: activeTab === 'bridging' }"
        @click="activeTab = 'bridging'"
      >
        <span class="pathway-icon">🌉</span>
        <div class="pathway-btn-text">
          <strong>Bridging Pathway</strong>
          <span>Need additional preparation</span>
        </div>
        <span class="pathway-check" v-if="activeTab === 'bridging'">✓</span>
      </button>
    </div>

    <!-- ── Desktop: SVG Flowchart ── -->
    <div class="flowchart-wrapper">
      <div class="flowchart" :class="{ 'flowchart-four': activeTab === 'bridging' }">
        <template v-for="(node, idx) in flowNodes" :key="idx">
          <!-- Node -->
          <div
            class="flow-node"
            :class="{ 'flow-node-active': selectedStepIndex === idx }"
            @click="selectedStepIndex = idx"
          >
            <div class="flow-node-icon">{{ node.icon }}</div>
            <div class="flow-node-label">{{ node.label }}</div>
            <div class="flow-node-num">{{ idx + 1 }}</div>
          </div>
          <!-- Arrow (not after last) -->
          <div v-if="idx < flowNodes.length - 1" class="flow-arrow">→</div>
        </template>
      </div>
    </div>

    <!-- ── Mobile: Horizontal Pill Nav ── -->
    <div class="mobile-pill-nav">
      <button
        v-for="(step, idx) in steps"
        :key="idx"
        class="pill"
        :class="{ 'pill-active': selectedStepIndex === idx }"
        @click="selectedStepIndex = idx"
      >
        <span class="pill-num">{{ idx + 1 }}</span>
        <span class="pill-label">{{ step.title || step.name || ('Step ' + (idx + 1)) }}</span>
      </button>
    </div>

    <!-- ── Step Detail Card ── -->
    <div class="step-detail-wrapper">
      <div v-if="currentStep" class="step-detail-card">
        <!-- Step header -->
        <div class="step-detail-header">
          <div class="step-counter-badge">
            <span class="step-counter-num">{{ selectedStepIndex + 1 }}</span>
            <span class="step-counter-total">/ {{ totalSteps }}</span>
          </div>
          <h3 class="step-title">{{ currentStep.title || currentStep.name }}</h3>
          <UBadge
            v-if="currentStep.status"
            :color="getStatusColor(currentStep.status)"
            variant="soft"
            size="sm"
            class="step-status"
          >
            {{ currentStep.status }}
          </UBadge>
        </div>

        <!-- Description box -->
        <div v-if="currentStep.description" class="step-description-box">
          <p>{{ currentStep.description }}</p>
        </div>

        <!-- Requirements checklist grid -->
        <div v-if="currentStep.requirements && currentStep.requirements.length" class="requirements-section">
          <h4 class="requirements-title">Requirements</h4>
          <div class="requirements-grid">
            <div
              v-for="(req, rIdx) in currentStep.requirements"
              :key="rIdx"
              class="requirement-item"
            >
              <UCheckbox
                v-if="typeof req === 'object' && req.checked !== undefined"
                :model-value="req.checked"
                :label="req.label || req.text || String(req)"
                disabled
              />
              <div v-else class="req-text-item">
                <span class="req-dot">▸</span>
                <span>{{ req.label || req.text || req }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Body content -->
        <div v-if="currentStep.body" class="step-body-scroll">
          <ContentRenderer :value="currentStep" class="prose step-prose" />
        </div>

        <!-- Prev / Next navigation -->
        <div class="step-nav">
          <UButton
            icon="i-heroicons-arrow-left"
            color="gray"
            variant="ghost"
            size="sm"
            :disabled="selectedStepIndex === 0"
            @click="prevStep"
          >
            Prev
          </UButton>

          <!-- Nav dots -->
          <div class="step-nav-dots">
            <button
              v-for="i in totalSteps"
              :key="i"
              class="step-dot"
              :class="{ active: selectedStepIndex === i - 1 }"
              @click="selectedStepIndex = i - 1"
            />
          </div>

          <UButton
            trailing-icon="i-heroicons-arrow-right"
            color="primary"
            variant="solid"
            size="sm"
            :disabled="selectedStepIndex === totalSteps - 1"
            @click="nextStep"
          >
            Next
          </UButton>
        </div>
      </div>

      <!-- Empty state when no steps defined -->
      <div v-else class="step-empty">
        <p>No steps defined for this pathway yet.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pathway-selector {
  font-family: var(--font-sans);
}

/* ── Pathway toggle cards ── */
.pathway-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.75rem;
}

@media (max-width: 540px) {
  .pathway-cards {
    grid-template-columns: 1fr;
  }
}

.pathway-btn {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1.125rem 1.25rem;
  border-radius: var(--radius-lg);
  border: 2px solid var(--color-gray-200);
  background: #fff;
  cursor: pointer;
  text-align: left;
  transition: all var(--duration-base) var(--ease-out);
  box-shadow: var(--shadow-xs);
  position: relative;
}

.pathway-btn:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.pathway-btn.active {
  border-color: var(--color-primary);
  background: var(--color-primary-50);
  box-shadow: var(--shadow-brand);
}

.pathway-btn-bridging.active {
  border-color: var(--color-accent);
  background: var(--color-accent-50);
  box-shadow: var(--shadow-accent);
}

.pathway-icon {
  font-size: 1.75rem;
  flex-shrink: 0;
}

.pathway-btn-text {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  flex: 1;
}

.pathway-btn-text strong {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1.2;
}

.pathway-btn-text span {
  font-size: 0.78rem;
  color: var(--color-gray-500);
}

.pathway-check {
  position: absolute;
  top: 0.6rem;
  right: 0.75rem;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-primary);
  background: var(--color-primary-100);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
}

/* ── Desktop Flowchart ── */
.flowchart-wrapper {
  display: none;
  margin-bottom: 1.75rem;
}

@media (min-width: 900px) {
  .flowchart-wrapper {
    display: block;
  }
}

.flowchart {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, var(--color-primary-50), var(--color-gray-50));
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-primary-100);
}

.flow-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 0.875rem 1.125rem;
  border-radius: var(--radius-md);
  background: #fff;
  border: 2px solid var(--color-gray-200);
  cursor: pointer;
  transition: all var(--duration-base) var(--ease-out);
  min-width: 110px;
  text-align: center;
  position: relative;
  box-shadow: var(--shadow-xs);
}

.flow-node:hover {
  border-color: var(--color-primary);
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.flow-node-active {
  border-color: var(--color-accent) !important;
  background: var(--color-accent-50) !important;
  box-shadow: var(--shadow-accent) !important;
  transform: translateY(-3px) !important;
}

.flow-node-icon {
  font-size: 1.5rem;
}

.flow-node-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1.2;
}

.flow-node-num {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flow-node-active .flow-node-num {
  background: var(--color-accent);
}

.flow-arrow {
  font-size: 1.25rem;
  color: var(--color-gray-400);
  flex-shrink: 0;
  font-weight: 700;
}

/* ── Mobile pill nav ── */
.mobile-pill-nav {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.75rem;
  margin-bottom: 1rem;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.mobile-pill-nav::-webkit-scrollbar {
  display: none;
}

@media (min-width: 900px) {
  .mobile-pill-nav {
    display: none;
  }
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.875rem;
  border-radius: var(--radius-full);
  border: 2px solid var(--color-gray-200);
  background: #fff;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all var(--duration-fast) var(--ease-out);
  font-family: var(--font-sans);
}

.pill:hover {
  border-color: var(--color-primary);
}

.pill-active {
  border-color: var(--color-primary) !important;
  background: var(--color-primary) !important;
  box-shadow: var(--shadow-brand);
}

.pill-num {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-gray-100);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 800;
  color: var(--color-primary);
  flex-shrink: 0;
}

.pill-active .pill-num {
  background: rgba(255,255,255,0.25);
  color: #fff;
}

.pill-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-primary);
}

.pill-active .pill-label {
  color: #fff;
}

/* ── Step Detail Card ── */
.step-detail-wrapper {
  max-height: 520px;
  overflow-y: auto;
}

@media (min-width: 900px) {
  .step-detail-wrapper {
    max-height: none;
    overflow-y: visible;
  }
}

.step-detail-card {
  background: #fff;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-gray-200);
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.step-detail-header {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.step-counter-badge {
  display: flex;
  align-items: baseline;
  gap: 0.2rem;
  background: var(--color-primary);
  color: #fff;
  padding: 0.35rem 0.7rem;
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.step-counter-num {
  font-size: 1.25rem;
  font-weight: 800;
  line-height: 1;
}

.step-counter-total {
  font-size: 0.75rem;
  opacity: 0.75;
}

.step-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1.3;
  margin: 0;
  flex: 1;
}

.step-status {
  flex-shrink: 0;
}

/* Description box */
.step-description-box {
  background: var(--color-primary-50);
  border-left: 3px solid var(--color-accent);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  padding: 0.875rem 1rem;
}

.step-description-box p {
  font-size: 0.9rem;
  color: var(--color-gray-700);
  line-height: 1.65;
  margin: 0;
}

/* Requirements checklist grid */
.requirements-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.requirements-title {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-gray-500);
  margin: 0;
}

.requirements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.4rem 1rem;
}

.req-text-item {
  display: flex;
  align-items: flex-start;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: var(--color-gray-700);
}

.req-dot {
  color: var(--color-accent);
  flex-shrink: 0;
  font-size: 0.8em;
  margin-top: 0.1em;
}

/* Body content */
.step-body-scroll {
  overflow: hidden;
}

.step-prose :deep(p) {
  font-size: 0.875rem;
  color: var(--color-gray-700);
  line-height: 1.65;
  margin-bottom: 0.75rem;
}

.step-prose :deep(h2),
.step-prose :deep(h3) {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-primary);
  margin: 1rem 0 0.4rem;
}

.step-prose :deep(ul) {
  padding-left: 1.25rem;
  margin-bottom: 0.75rem;
}

.step-prose :deep(li) {
  font-size: 0.85rem;
  color: var(--color-gray-700);
  margin-bottom: 0.2rem;
}

/* Step navigation */
.step-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-gray-100);
  gap: 0.75rem;
}

.step-nav-dots {
  display: flex;
  gap: 0.4rem;
  justify-content: center;
  flex: 1;
}

.step-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-gray-300);
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all var(--duration-fast) var(--ease-out);
}

.step-dot.active {
  background: var(--color-primary);
  width: 20px;
  border-radius: var(--radius-full);
}

/* Empty state */
.step-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: var(--color-gray-50);
  border: 2px dashed var(--color-gray-300);
  border-radius: var(--radius-lg);
  color: var(--color-gray-400);
  font-size: 0.9rem;
  text-align: center;
}
</style>
