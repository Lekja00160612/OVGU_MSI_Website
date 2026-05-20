<script setup lang="ts">
const { page, allModules, localePath } = inject('pageData') as any

const activeTab = ref(0)

const semesters = computed(() => page.curriculum?.semesters || [])
const currentSemester = computed(() => semesters.value[activeTab.value] || null)

watch(activeTab, () => {
  // Reset scroll when tab changes (if needed)
})

const getModulesForSemester = (semNumber: number) => {
  return allModules?.filter((m: any) => (m.meta?.semester || m.semester) === semNumber) || []
}
</script>

<template>
  <section class="section curriculum-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">{{ page.curriculum?.headline }}</h2>
        <p class="section-subtitle">{{ page.curriculum?.subtitle }}</p>
      </div>

      <!-- Semester Tabs -->
      <div v-if="semesters.length" class="sem-tabs">
        <button
          v-for="(s, i) in semesters"
          :key="s.number"
          class="sem-tab"
          :class="{ 'sem-tab--active': activeTab === i }"
          :style="activeTab === i ? { borderColor: s.color, color: s.color } : {}"
          @click="activeTab = i"
        >
          <span class="sem-tab-num">{{ s.label }}</span>
          <span class="sem-tab-theme">{{ s.theme }}</span>
        </button>
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
              <li v-for="mod in getModulesForSemester(currentSemester.number)" :key="mod.path" class="sem-module">
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
                Explore Detailed Program Structure
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
  min-height: 330px;
  max-height: 330px;
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
