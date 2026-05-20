<script setup lang="ts">
import { inject, ref, computed, unref } from 'vue'

const { page, coreModules, electiveModules } = inject('pageData') as any

const selectedModule = ref<any>(null)
const isDrawerOpen = ref(false)
const activeMobileModule = ref<string | null>(null)

function getSemesterColor(sem: number): string {
  if (sem === 1) return '#E87722'
  if (sem === 2) return '#1E3A5F'
  if (sem === 3) return '#10B981'
  return '#8B5CF6'
}

function getSemesterLabel(sem: number): string {
  if (sem === 1) return 'Semester 1'
  if (sem === 2) return 'Semester 2'
  if (sem === 3) return 'Semester 3'
  return `Semester ${sem}`
}

const allModules = computed(() => {
  const coreArr = unref(coreModules) || []
  const electiveArr = unref(electiveModules) || []
  const core = Array.isArray(coreArr) ? coreArr.map((m: any) => ({ ...m, type: 'core' })) : []
  const electives = Array.isArray(electiveArr) ? electiveArr.map((m: any) => ({ ...m, type: 'elective' })) : []
  return [...core, ...electives]
})

function selectModule(mod: any) {
  selectedModule.value = mod
  isDrawerOpen.value = true
}

function toggleMobileModule(id: string) {
  activeMobileModule.value = activeMobileModule.value === id ? null : id
}

const semesters = [1, 2, 3, 4]
</script>

<template>
  <div class="curriculum-explorer">
    <!-- Semester Legend -->
    <div class="legend-bar">
      <span class="legend-label">Semester Legend:</span>
      <span
        v-for="sem in semesters"
        :key="sem"
        class="legend-chip"
        :style="{ backgroundColor: getSemesterColor(sem) + '1A', borderColor: getSemesterColor(sem), color: getSemesterColor(sem) }"
      >
        <span class="legend-dot" :style="{ backgroundColor: getSemesterColor(sem) }"></span>
        {{ getSemesterLabel(sem) }}
      </span>
      <span class="german-prof-badge">
        <span class="pulse-dot"></span>
        Taught by Visiting German Professors
      </span>
    </div>

    <!-- ── Desktop Layout ── -->
    <div class="desktop-layout">
      <!-- Left: Module Grid -->
      <div class="module-grid-col">
        <div class="module-grid">
          <div
            v-for="mod in allModules"
            :key="mod._path || mod.title"
            class="module-card"
            :class="{ 'is-selected': selectedModule?._path === mod._path || selectedModule?.title === mod.title }"
            :style="{ borderTopColor: getSemesterColor(mod.semester || mod.sem || 1) }"
            @click="selectModule(mod)"
          >
            <div class="module-card-top">
              <span
                class="sem-badge"
                :style="{
                  backgroundColor: getSemesterColor(mod.semester || mod.sem || 1) + '22',
                  color: getSemesterColor(mod.semester || mod.sem || 1),
                  borderColor: getSemesterColor(mod.semester || mod.sem || 1) + '55'
                }"
              >
                Sem {{ mod.semester || mod.sem || 1 }}
              </span>
              <span v-if="mod.german_lecturer" class="german-dot" title="Taught by Visiting German Professor"></span>
            </div>
            <h4 class="module-title">{{ mod.title }}</h4>
            <UBadge v-if="mod.type === 'elective'" color="violet" variant="soft" size="xs" class="mt-1">Elective</UBadge>
          </div>
        </div>
      </div>

      <!-- Right: Detail Panel -->
      <div class="detail-col">
        <div class="detail-sticky">
          <UCard v-if="selectedModule" class="detail-card">
            <template #header>
              <div class="detail-header">
                <h3 class="detail-title">{{ selectedModule.title }}</h3>
                <div class="detail-badges">
                  <span
                    class="sem-badge"
                    :style="{
                      backgroundColor: getSemesterColor(selectedModule.semester || selectedModule.sem || 1) + '22',
                      color: getSemesterColor(selectedModule.semester || selectedModule.sem || 1),
                      borderColor: getSemesterColor(selectedModule.semester || selectedModule.sem || 1) + '55'
                    }"
                  >
                    {{ getSemesterLabel(selectedModule.semester || selectedModule.sem || 1) }}
                  </span>
                  <UBadge v-if="selectedModule.german_lecturer" color="green" variant="soft" size="xs">
                    <span class="pulse-dot-sm"></span> German Lecturer
                  </UBadge>
                  <UBadge v-if="selectedModule.type === 'elective'" color="violet" variant="soft" size="xs">Elective</UBadge>
                  <UBadge v-if="selectedModule.credits" color="gray" variant="soft" size="xs">{{ selectedModule.credits }} Credits</UBadge>
                </div>
              </div>
            </template>

            <div class="detail-body">
              <ContentRenderer v-if="selectedModule.body" :value="selectedModule" class="prose detail-prose" />
              <p v-else-if="selectedModule.description" class="detail-description">{{ selectedModule.description }}</p>
              <p v-else class="detail-empty">Select a module to see details.</p>
            </div>

            <template #footer>
              <div class="detail-footer">
                <UButton
                  v-if="selectedModule.handbook_url || page?.handbook_url"
                  :to="selectedModule.handbook_url || page?.handbook_url"
                  target="_blank"
                  icon="i-heroicons-arrow-down-tray"
                  color="primary"
                  variant="solid"
                  size="sm"
                >
                  Download Handbook
                </UButton>
              </div>
            </template>
          </UCard>

          <div v-else class="detail-empty-state">
            <div class="empty-icon">📚</div>
            <p>Click any module card to view details</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Mobile Layout: Premium Accordion ── -->
    <div class="mobile-layout">
      <div
        v-for="mod in allModules"
        :key="(mod._path || mod.title) + '-mobile'"
        class="accordion-item"
        :style="{ borderLeftColor: getSemesterColor(mod.semester || mod.sem || 1) }"
        :class="{ 'is-active': activeMobileModule === (mod._path || mod.title) }"
      >
        <button
          class="accordion-header"
          @click="toggleMobileModule(mod._path || mod.title)"
        >
          <div class="accordion-header-left">
            <span
              class="sem-badge"
              :style="{
                backgroundColor: getSemesterColor(mod.semester || mod.sem || 1) + '22',
                color: getSemesterColor(mod.semester || mod.sem || 1),
                borderColor: getSemesterColor(mod.semester || mod.sem || 1) + '55'
              }"
            >
              Sem {{ mod.semester || mod.sem || 1 }}
            </span>
            <span v-if="mod.german_lecturer" class="german-dot" title="German Professor"></span>
            <span class="accordion-title">{{ mod.title }}</span>
          </div>
          <span class="accordion-chevron" :class="{ 'rotated': activeMobileModule === (mod._path || mod.title) }">▾</span>
        </button>

        <Transition name="accordion">
          <div v-if="activeMobileModule === (mod._path || mod.title)" class="accordion-body">
            <div class="accordion-badges">
              <UBadge v-if="mod.german_lecturer" color="green" variant="soft" size="xs">German Lecturer</UBadge>
              <UBadge v-if="mod.type === 'elective'" color="violet" variant="soft" size="xs">Elective</UBadge>
              <UBadge v-if="mod.credits" color="gray" variant="soft" size="xs">{{ mod.credits }} Credits</UBadge>
            </div>
            <ContentRenderer v-if="mod.body" :value="mod" class="prose accordion-prose" />
            <p v-else-if="mod.description" class="accordion-description">{{ mod.description }}</p>
            <div v-if="mod.handbook_url || page?.handbook_url" class="accordion-footer">
              <UButton
                :to="mod.handbook_url || page?.handbook_url"
                target="_blank"
                icon="i-heroicons-arrow-down-tray"
                color="primary"
                variant="soft"
                size="sm"
              >
                Download Handbook
              </UButton>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── Explorer container ── */
.curriculum-explorer {
  font-family: var(--font-sans);
}

/* ── Legend bar ── */
.legend-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding: 0.75rem 1rem;
  background: var(--color-gray-50);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-gray-200);
}

.legend-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-gray-600);
  margin-right: 0.25rem;
}

.legend-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-full);
  border: 1.5px solid;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}

/* German professor badge with glowing green border */
.german-prof-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  border: 2px solid #10B981;
  color: #059669;
  background: #ecfdf5;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.4), 0 0 20px rgba(16, 185, 129, 0.15);
  animation: green-glow 2.5s ease-in-out infinite;
}

@keyframes green-glow {
  0%, 100% { box-shadow: 0 0 8px rgba(16, 185, 129, 0.4), 0 0 16px rgba(16, 185, 129, 0.15); }
  50%       { box-shadow: 0 0 14px rgba(16, 185, 129, 0.7), 0 0 28px rgba(16, 185, 129, 0.3); }
}

/* Pulsing green dot */
.pulse-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #10B981;
  display: inline-block;
  position: relative;
  flex-shrink: 0;
}
.pulse-dot::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.3);
  animation: pulse-ring 1.8s ease-out infinite;
}

.pulse-dot-sm {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10B981;
  display: inline-block;
  flex-shrink: 0;
}

@keyframes pulse-ring {
  0%   { transform: scale(0.8); opacity: 0.8; }
  100% { transform: scale(2);   opacity: 0; }
}

/* German dot on module cards */
.german-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #10B981;
  display: inline-block;
  flex-shrink: 0;
  box-shadow: 0 0 6px rgba(16, 185, 129, 0.6);
}

/* ── Semester badge ── */
.sem-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  padding: 0.18rem 0.55rem;
  border-radius: var(--radius-full);
  border: 1.5px solid;
  flex-shrink: 0;
}

/* ── Desktop layout ── */
.desktop-layout {
  display: none;
}

.detail-col {
  display: none;
}

@media (min-width: 900px) {
  .desktop-layout {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 2rem;
    align-items: start;
  }
  .mobile-layout {
    display: none;
  }
}

/* ── Module grid ── */
.module-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.875rem;
}

.module-card {
  background: #fff;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-gray-200);
  border-top: 3px solid transparent;
  padding: 0.875rem 1rem;
  cursor: pointer;
  transition: all var(--duration-base) var(--ease-out);
  box-shadow: var(--shadow-xs);
}

.module-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-gray-300);
}

.module-card.is-selected {
  box-shadow: var(--shadow-brand);
  border-color: var(--color-primary);
  background: var(--color-primary-50);
}

.module-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.module-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-primary);
  line-height: 1.3;
  margin: 0;
}

/* ── Detail panel ── */
.detail-col {
  display: block;
}

.detail-sticky {
  position: sticky;
  top: calc(var(--nav-height) + 1.5rem);
}

.detail-card {
  max-height: 480px;
  overflow-y: auto;
}

.detail-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0;
  line-height: 1.3;
}

.detail-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  align-items: center;
}

.detail-body {
  overflow: hidden;
}

.detail-prose :deep(h2),
.detail-prose :deep(h3),
.detail-prose :deep(h4) {
  color: var(--color-primary);
  font-weight: 700;
  margin: 1rem 0 0.5rem;
}

.detail-prose :deep(p) {
  color: var(--color-gray-700);
  font-size: 0.9rem;
  line-height: 1.65;
  margin-bottom: 0.75rem;
}

.detail-prose :deep(ul) {
  padding-left: 1.25rem;
  margin-bottom: 0.75rem;
}

.detail-prose :deep(li) {
  font-size: 0.875rem;
  color: var(--color-gray-700);
  margin-bottom: 0.25rem;
}

.detail-description {
  font-size: 0.9rem;
  color: var(--color-gray-700);
  line-height: 1.65;
}

.detail-footer {
  display: flex;
  justify-content: flex-end;
}

/* Empty state */
.detail-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  background: var(--color-gray-50);
  border: 2px dashed var(--color-gray-300);
  border-radius: var(--radius-lg);
  text-align: center;
  color: var(--color-gray-500);
  min-height: 200px;
}

.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
}

/* ── Mobile accordion ── */
.mobile-layout {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.accordion-item {
  border-left: 4px solid var(--color-gray-300);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  background: #fff;
  box-shadow: var(--shadow-xs);
  overflow: hidden;
  transition: border-color var(--duration-base) var(--ease-out),
              box-shadow var(--duration-base) var(--ease-out);
}

.accordion-item.is-active {
  box-shadow: var(--shadow-md);
}

.accordion-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1rem;
  background: transparent;
  border: none;
  cursor: pointer;
  gap: 0.75rem;
  text-align: left;
}

.accordion-header-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
}

.accordion-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-primary);
  line-height: 1.3;
  flex: 1;
  min-width: 0;
}

.accordion-chevron {
  font-size: 1.2rem;
  color: var(--color-gray-500);
  transition: transform var(--duration-base) var(--ease-out);
  flex-shrink: 0;
}

.accordion-chevron.rotated {
  transform: rotate(180deg);
}

.accordion-body {
  padding: 0 1rem 1rem;
  border-top: 1px solid var(--color-gray-100);
}

.accordion-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  padding: 0.75rem 0 0.5rem;
}

.accordion-prose :deep(p),
.accordion-description {
  font-size: 0.875rem;
  color: var(--color-gray-700);
  line-height: 1.65;
  margin-bottom: 0.5rem;
}

.accordion-prose :deep(h2),
.accordion-prose :deep(h3) {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0.75rem 0 0.4rem;
}

.accordion-prose :deep(ul) {
  padding-left: 1.25rem;
}

.accordion-prose :deep(li) {
  font-size: 0.85rem;
  color: var(--color-gray-700);
  margin-bottom: 0.2rem;
}

.accordion-footer {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-gray-100);
}

/* ── Accordion transition ── */
.accordion-enter-active,
.accordion-leave-active {
  transition: max-height var(--duration-base) var(--ease-out),
              opacity var(--duration-base) var(--ease-out);
  max-height: 600px;
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
