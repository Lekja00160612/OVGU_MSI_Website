<script setup lang="ts">
interface Semester {
  number: number
  label: string
  theme: string
  color: string
}

const props = defineProps<{
  headline?: string
  subtitle?: string
  semesters?: Semester[]
}>()

const pageData = inject('pageData', null) as any
const page = computed(() => pageData?.page?.value ?? {})
const injectedModules = computed(() => pageData?.allModules?.value ?? [])
const localePath = pageData?.localePath ?? ((path: string) => path)
const { t, locale } = useI18n()

// If allModules was not injected, query it locally
const localModules = ref<any[]>([])
if (!pageData) {
  const { data } = await useAsyncData(`msi-curriculum-modules-${locale.value}`, () =>
    queryCollection('modules').all()
  )
  if (data.value) {
    localModules.value = data.value
  }
}

const allModules = computed(() => pageData ? injectedModules.value : localModules.value)

const displayHeadline = computed(() => props.headline ?? page.value.curriculum?.headline)
const displaySubtitle = computed(() => props.subtitle ?? page.value.curriculum?.subtitle)
const displaySemesters = computed(() => props.semesters ?? page.value.curriculum?.semesters ?? [])

const activeTab = ref(0)
const currentSemester = computed(() => displaySemesters.value[activeTab.value] ?? null)

const currentModules = computed(() => {
  if (!allModules.value || !currentSemester.value) return []
  return allModules.value.filter(m => 
    ((m.semester || m.meta?.semester) === currentSemester.value!.number) && 
    !(m.is_elective || m.meta?.is_elective)
  )
})
</script>

<template>
  <section class="section curriculum-section">
    <div class="container">
      <div class="section-header">
        <h2 v-if="displayHeadline" class="section-title">{{ displayHeadline }}</h2>
        <p v-if="displaySubtitle" class="section-subtitle">{{ displaySubtitle }}</p>
      </div>

      <!-- Semester Tabs -->
      <div class="sem-tabs-container scroll-x">
        <div class="sem-tabs">
          <UButton
            v-for="(s, i) in displaySemesters"
            :key="s.number"
            variant="outline"
            :class="['sem-tab', { 'sem-tab--active': activeTab === i }]"
            :style="activeTab === i ? { borderColor: s.color, color: s.color } : {}"
            @click="activeTab = i"
          >
            <span class="sem-tab-num">{{ s.label }}</span>
            <span class="sem-tab-theme">{{ s.theme }}</span>
          </UButton>
        </div>
      </div>

      <!-- Semester Panel -->
      <Transition name="fade" mode="out-in">
        <div
          v-if="currentSemester"
          :key="activeTab"
          class="sem-panel"
        >
          <div
            class="sem-panel-header"
            :style="{ background: `linear-gradient(135deg, ${currentSemester.color} 0%, ${currentSemester.color}CC 100%)` }"
          >
            <div class="sem-num-big">S{{ currentSemester.number }}</div>
            <div>
              <div class="sem-panel-label">{{ currentSemester.label }}</div>
              <div class="sem-panel-theme">{{ currentSemester.theme }}</div>
            </div>
          </div>
          <div class="sem-modules-layout">
            <ul class="sem-modules">
              <li v-for="mod in currentModules" :key="mod.path" class="sem-module">
                <span class="sem-module-dot" :style="{ background: currentSemester.color }" />
                {{ mod.title }}
              </li>
            </ul>
            <div class="mt-8 mb-6 text-center">
              <NuxtLink
                :to="localePath('/program-structure')"
                class="btn btn-curriculum"
                :style="{ '--semester-color': currentSemester.color }"
              >
                {{ t('home.explore_full_program') }} →
              </NuxtLink>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </section>
</template>

<style scoped>
/* ══ CURRICULUM ══ */
.curriculum-section { background: #fff; }
.sem-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2.5rem;
  justify-content: center;
}
.sem-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  background: #fff;
  cursor: pointer;
  transition: all 250ms var(--ease-out);
  min-width: 140px;
}
.sem-tab:hover { border-color: var(--color-primary); }
.sem-tab--active { background: var(--color-gray-50); box-shadow: var(--shadow-md); }
.sem-tab-num { font-size: 0.95rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
.sem-tab-theme { font-size: 0.72rem; color: var(--color-gray-500); font-weight: 500; }

.sem-panel {
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-gray-200);
  max-width: 700px;
  margin: 0 auto;
}
.sem-panel-header {
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  color: #fff;
}
.sem-num-big {
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 800;
  line-height: 1;
  opacity: 0.5;
}
.sem-panel-label { font-size: 0.75rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; opacity: .7; }
.sem-panel-theme { font-size: 1.2rem; font-weight: 700; }
.sem-modules-layout {
  display: flex;
  flex-direction: column;
  background: #fff;
  min-height: 280px;
}
.sem-modules {
  list-style: none;
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  min-height: 285px;
  max-height: 285px;
  overflow-y: auto;
}
.sem-module {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  font-size: 0.925rem;
  color: var(--color-gray-700);
  font-weight: 500;
  padding-bottom: 0.875rem;
  border-bottom: 1px solid var(--color-gray-100);
}
.sem-module:last-child { border-bottom: none; padding-bottom: 0; }
.sem-module-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

/* Transition */
.fade-enter-active, .fade-leave-active { transition: opacity 200ms; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.btn-curriculum {
  border: 2px solid var(--semester-color) !important;
  color: var(--semester-color) !important;
  background: transparent;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
  padding-left: 1rem;
  padding-right: 1rem;
}
.btn-curriculum:hover {
  background: var(--semester-color) !important;
  color: #fff !important;
  box-shadow: 0 10px 28px var(--semester-color);
  transform: translateY(-3px) scale(1.02);
}

/* Utility */
.mt-8 { margin-top: 2rem; }
.mb-6 { margin-bottom: 1.5rem; }
.text-center { text-align: center; }
</style>
