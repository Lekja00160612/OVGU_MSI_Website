<script setup lang="ts">
const route = useRoute()
const localePath = useLocalePath()
const { locale } = useI18n()

// Fetch localized page content
const pagePath = locale.value === 'vi' ? '/vi/program-structure' : '/program-structure'
const { data: pageData } = await useAsyncData(`ps-page-${locale.value}`, () =>
  queryCollection('content').path(pagePath).first()
)
const page = computed(() => pageData.value?.meta ?? {})

// Fetch all modules
const { data: allModules } = await useAsyncData('all-modules', () =>
  queryCollection('modules').all()
)

const coreModules = computed(() => {
  return allModules.value?.filter(m => !(m.is_elective || m.meta?.is_elective)) || []
})

const electiveModules = computed(() => {
  return allModules.value?.filter(m => m.is_elective || m.meta?.is_elective) || []
})

const selectedModule = ref<any | null>(null)
</script>

<template>
  <div class="page-structure">
    <div class="header-banner">
      <div class="container text-center">
        <h1 class="page-title">{{ page.headline || 'Program Structure' }}</h1>
        <p class="page-subtitle">{{ page.subtitle }}</p>
      </div>
    </div>
    
    <div class="container intro-section text-center">
      <p class="intro-text">
        {{ page.intro_text }}
      </p>
      <div class="cta-wrapper">
        <a href="/Documents/MODULE CATALOGUE MSI.pdf" target="_blank" class="btn btn-primary cta-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
          {{ page.cta_handbook || 'Explore Full Module Handbook' }}
        </a>
      </div>
    </div>

    <!-- CORE MODULES -->
    <div class="container modules-container">
      <h2 class="section-title text-center mb-10">{{ page.core_title || 'Core Modules' }}</h2>
      
      <div class="modules-layout">
        <div class="modules-grid">
          <button 
            v-for="mod in coreModules" 
            :key="mod.path" 
            class="module-card"
            :class="{ 'module-card--active': selectedModule?.path === mod.path }"
            @click="selectedModule = mod"
          >
            <span class="mod-name">{{ mod.title }}</span>
            <span v-if="mod.meta?.german_lecturer" class="german-badge" title="Taught by German Lecturer">🇩🇪 German Lecturer</span>
          </button>
        </div>
        
        <div class="module-details">
          <div v-if="selectedModule" class="module-details-inner fade-in">
            <div class="mod-details-header">
              <h3 class="mod-details-title">{{ selectedModule.title }}</h3>
              <span v-if="selectedModule.meta?.german_lecturer" class="badge-german">🇩🇪 German Lecturer</span>
            </div>
            <div class="mod-details-content prose max-w-none">
              <ContentRenderer :value="selectedModule" />
            </div>
            <a href="/Documents/MODULE CATALOGUE MSI.pdf" target="_blank" class="btn btn-outline mt-6">{{ page.view_handbook || 'View in Handbook &rarr;' }}</a>
          </div>
          <div v-else class="module-details-empty fade-in">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="empty-icon"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.671zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-5.407l-1.59-1.59" /></svg>
            <span>Select a module to view details</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ELECTIVE COURSES -->
    <div v-if="electiveModules.length > 0" class="container electives-container">
      <h2 class="section-title text-center mb-8">{{ page.electives_title || 'Elective Courses' }}</h2>
      <p class="text-center mb-8 text-gray-600">{{ page.electives_intro }}</p>
      
      <div class="electives-list">
        <a 
          v-for="mod in electiveModules" 
          :key="mod.path" 
          href="#" 
          class="elective-item"
        >
          <div class="elective-content">
            <h3 class="elective-title">{{ mod.title }}</h3>
            <p class="elective-desc">{{ mod.meta?.description || 'External module.' }}</p>
          </div>
          <div class="elective-arrow">&rarr;</div>
        </a>
      </div>
    </div>

  </div>
</template>

<style scoped>
.page-structure { min-height: 80vh; background: var(--color-gray-50); padding-bottom: 5rem; }
.header-banner { background: var(--color-primary-dark); padding: 5rem 1.5rem; color: #fff; margin-bottom: 3rem; }
.page-title { font-size: 3rem; font-family: var(--font-display); font-weight: 800; margin-bottom: 1rem;  background-color: var(--color-accent); padding: 0rem 0.5rem; display: inline-block;}
.page-subtitle { font-size: 1.1rem; color: rgba(255,255,255,0.8); }

.intro-section { max-width: 800px; margin: 0 auto 5rem auto; }
.intro-text { font-size: 1.1rem; color: var(--color-gray-700); line-height: 1.8; margin-bottom: 2.5rem; }
.cta-wrapper { display: flex; justify-content: center; width: 100%; margin: 3rem 0; }
.cta-btn { padding: 1rem 2rem; font-size: 1.1rem; }
.btn-icon { width: 22px; height: 22px; margin-right: 10px; display: inline-block; vertical-align: middle; }

.modules-container { margin-bottom: 5rem; }
.modules-layout {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: flex-start;
}
@media (min-width: 900px) { .modules-layout { flex-direction: row; } }

.modules-grid {
  flex: 1.2;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  width: 100%;
}

.module-card {
  background: var(--color-accent);
  color: #fff;
  padding: 1.25rem 1rem;
  border-radius: var(--radius-md);
  border: 2px solid transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: all 200ms;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  min-height: 110px;
  position: relative;
}
.module-card:hover { transform: translateY(-4px); box-shadow: 0 8px 15px rgba(0,0,0,0.15); border-color: #fff; }
.module-card--active { background: var(--color-primary); box-shadow: 0 0 0 2px var(--color-gray-50), 0 0 0 4px var(--color-primary); }

.mod-name { font-size: 0.95rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; line-height: 1.3; }
.german-badge { position: absolute; top: -8px; right: -8px; background: #fff; color: var(--color-primary-dark); font-size: 0.65rem; padding: 2px 6px; border-radius: 10px; font-weight: 800; box-shadow: 0 2px 4px rgba(0,0,0,0.2); border: 1px solid var(--color-gray-200); }

.module-details {
  flex: 1;
  width: 100%;
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background: #fff;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  height: 550px;
  position: sticky;
  top: 100px;
  overflow-y: auto;
}
.module-details-inner { display: flex; flex-direction: column; gap: 1rem; align-items: flex-start; }
.mod-details-header { display: flex; flex-direction: column; gap: 0.75rem; align-items: flex-start; margin-bottom: 0.5rem; border-bottom: 1px solid var(--color-gray-100); padding-bottom: 1rem; width: 100%; }
.mod-details-title { font-size: 1.75rem; font-weight: 800; color: var(--color-primary); line-height: 1.2; }
.badge-german { background: var(--color-gray-100); color: var(--color-gray-800); font-size: 0.75rem; padding: 4px 8px; border-radius: 4px; font-weight: 600; border: 1px solid var(--color-gray-300); }
.mod-details-content { font-size: 1rem; color: var(--color-gray-600); line-height: 1.7; width: 100%; }

.module-details-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: var(--color-gray-400); gap: 1rem; padding: 2rem; }
.empty-icon { width: 64px; height: 64px; opacity: 0.3; }
.fade-in { animation: fadeIn 300ms ease forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* ELECTIVES */
.electives-container { max-width: 800px; margin: 0 auto; }
.electives-list { display: flex; flex-direction: column; gap: 1rem; }
.elective-item { display: flex; align-items: center; justify-content: space-between; background: #fff; padding: 1.5rem 2rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); border: 1px solid var(--color-gray-200); text-decoration: none; transition: all 250ms; }
.elective-item:hover { transform: translateX(5px); box-shadow: var(--shadow-md); border-color: var(--color-primary); }
.elective-title { font-size: 1.1rem; font-weight: 700; color: var(--color-primary); margin-bottom: 0.25rem; }
.elective-desc { font-size: 0.9rem; color: var(--color-gray-500); }
.elective-arrow { font-size: 1.5rem; color: var(--color-accent); font-weight: bold; transition: transform 250ms; }
.elective-item:hover .elective-arrow { transform: translateX(5px); }
</style>
