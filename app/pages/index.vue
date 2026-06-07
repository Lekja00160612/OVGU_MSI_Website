<script setup lang="ts">
const { locale, t } = useI18n()
const localePath = useLocalePath()

const pathPrefix = computed(() => locale.value === 'en' ? '/' : `/${locale.value}`)

const { data: raw, refresh: refreshRaw } = await useAsyncData(`msi-home-page-${locale.value}`, () =>
  queryCollection('content').path(pathPrefix.value).first()
)
const { data: allActivities } = await useAsyncData(`msi-all-activities-${locale.value}`, () =>
  queryCollection('activities').all()
)
const { data: allModules } = await useAsyncData(`msi-all-modules-${locale.value}`, () =>
  queryCollection('modules').all()
)

// Re-fetch on client-side navigation back to this page (fixes blank page on logo click)
const route = useRoute()
watch(() => route.path, async (newPath) => {
  if (newPath === '/' || newPath === `/${locale.value}`) {
    await refreshRaw()
  }
})
// @nuxt/content v3: pass the full raw document so injected child components
// (HomeCurriculum, HomeActivities, etc.) can access both .meta and top-level fields.
// Using only raw.value?.meta (old approach) broke after content/index.md moved
// curriculum/hero data into MDC props instead of frontmatter.
const page = computed(() => raw.value ?? {})

// SEO Metadata for the homepage targeting prospective Master's students
useSeoMeta({
  title: () => raw.value?.title ? `${raw.value.title} | VGU & OVGU` : 'Master of Science in Materials Science and Innovation (MSI) | VGU & OVGU Magdeburg',
  ogTitle: () => raw.value?.title ? `${raw.value.title} | VGU & OVGU` : 'Master of Science in Materials Science and Innovation (MSI) | VGU & OVGU Magdeburg',
  description: () => raw.value?.meta?.description || 'Study Materials Science & Innovation at VGU. Earn a German-standard joint degree from Otto von Guericke University Magdeburg & VGU with computational mechanics and wide-bandgap semiconductor specialties.',
  ogDescription: () => raw.value?.meta?.description || 'Study Materials Science & Innovation at VGU. Earn a German-standard joint degree from Otto von Guericke University Magdeburg & VGU with computational mechanics and wide-bandgap semiconductor specialties.',
})

const recentActivities = computed(() => {
  if (!allActivities.value) return []

  // Get highlighted activities and sort by date descending
  const highlighted = allActivities.value.filter(a => a.highlighted === true || a.meta?.highlighted === true)
  
  const sortByDateDesc = (a: any, b: any) => {
    const dateA = a.date || a.meta?.date || ''
    const dateB = b.date || b.meta?.date || ''
    return dateB.localeCompare(dateA)
  }

  const sortedHighlighted = [...highlighted].sort(sortByDateDesc)

  if (sortedHighlighted.length >= 4) {
    return sortedHighlighted.slice(0, 4)
  }

  // Fallback / fill the rest with recent non-highlighted activities
  const nonHighlighted = allActivities.value.filter(a => !(a.highlighted === true || a.meta?.highlighted === true))
  const sortedNonHighlighted = [...nonHighlighted].sort(sortByDateDesc)

  return [...sortedHighlighted, ...sortedNonHighlighted].slice(0, 4)
})





const iconMap: Record<string, string> = {
  diploma:    'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
  lab:        'M9 3v10.5a3 3 0 003 3h0a3 3 0 003-3V3 M6.5 3h11 M8 12H5a2 2 0 00-2 2v1a4 4 0 004 4h10a4 4 0 004-4v-1a2 2 0 00-2-2h-3',
  faculty:    'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  hybrid:     'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  industry:   'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  scholarship:'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
}

const activeTab = ref(0)
const selectedModule = ref<string | null>(null)

watch(activeTab, () => {
  selectedModule.value = null
})
const getModulesForSemester = (semNumber: number) => {
  return allModules.value?.filter(m => 
    (m.meta?.semester || m.semester) === semNumber &&
    !(m.is_elective || m.meta?.is_elective)
  ) || []
}

const semesters = computed(() => page.value.curriculum?.semesters || [])
const currentSemester = computed(() => semesters.value[activeTab.value] || null)

provide('pageData', { page, allModules, recentActivities, localePath })
</script>

<template>
  <div v-if="raw">
    <ContentRenderer :key="route?.path" :value="raw" />
  </div>
  <div v-else class="container section" style="min-height:60vh;display:flex;align-items:center;justify-content:center">
    <p style="color:var(--color-gray-500)">{{ t('home.loading') }}</p>
  </div>
</template>

<style scoped>
/* ══ HERO ══ */
.hero {
  position: relative;
  min-height: 60vh;
  display: flex;
  align-items: center;
  background-size: cover;
  background-position: center 30%;
  background-repeat: no-repeat;
}
@media (min-width: 900px) {
  .hero {
    min-height: 88vh;
  }
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(10,22,45,0.72) 0%,
    rgba(10,22,45,0.55) 50%,
    rgba(10,22,45,0.80) 100%
  );
}
.hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.25rem;
  padding: 3.5rem 1rem;
}
  @media (min-width: 900px) {
    .hero-content {
      gap: 1rem; /* tighter hero content */
      padding-top: 6rem;
      padding-bottom: 6rem;
    }
  }
.hero-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5.5vw, 4.5rem);
  font-weight: 800;
  color: #fff;
  line-height: 1.1;
  letter-spacing: -0.025em;
  max-width: 860px;
  text-shadow: 0 2px 24px rgba(0,0,0,.3);
}
.hero-logos {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255,255,255,.12);
  border: 1px solid rgba(255,255,255,.25);
  border-radius: var(--radius-full);
  padding: 0.5rem 1.5rem;
  backdrop-filter: blur(8px);
}
.hero-uni-logo {
  height: 36px;
  object-fit: contain;
  opacity: 0.95;
}
.hero-logo-x { color: rgba(255,255,255,.6); font-size: 1.25rem; font-weight: 300; margin: 0 0.25rem; }
.hero-actions { display:flex; flex-wrap:wrap; gap:1rem; justify-content:center; }

/* ══ ABOUT ══ */
.about-section { background: #fff; }
.about-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem; /* reduced from 4rem */
  align-items: center;
}
@media (min-width: 900px) { .about-grid { grid-template-columns: 1fr 1fr; } }

.about-title {
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  color: var(--color-primary);
  margin: 0.75rem 0 0.5rem;
}
.about-tag {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: 1.25rem;
}
.about-body { color: var(--color-gray-600); line-height: 1.75; margin-bottom: 1rem; font-size: 0.975rem; }
.about-tags-row { display:flex; flex-wrap:wrap; gap:0.5rem; margin-top:1.5rem; }
.about-tag-chip {
  font-size: 0.8rem;
  font-weight: 600;
  background: var(--color-gray-100);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-full);
  padding: 0.3rem 0.875rem;
  color: var(--color-gray-700);
}

/* Degree Card */
.degree-card {
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-gray-200);
}
.degree-card-header {
  background: var(--color-primary);
  padding: 3rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.degree-msi-logo { height: 90px; width: auto; object-fit: contain; filter: brightness(0) invert(1); }
.degree-card-body { padding: 1.75rem; display:flex; flex-direction:column; gap:1.25rem; }
.degree-item { display:flex; align-items:flex-start; gap:1rem; }
.degree-dot { width:12px; height:12px; border-radius:50%; flex-shrink:0; margin-top:4px; }
.degree-dot--blue   { background: var(--color-ovgu-blue); }
.degree-dot--orange { background: var(--color-accent); }
.degree-label { font-size:0.72rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--color-gray-400); margin-bottom:2px; }
.degree-value { font-size:0.9rem; font-weight:600; color:var(--color-primary); line-height:1.4; }
.degree-divider { height:1px; background:var(--color-gray-200); }
.degree-footer { display:flex; flex-wrap:wrap; gap:0.5rem; padding-top:0.5rem; border-top:1px solid var(--color-gray-100); }
.degree-badge { font-size:0.78rem; font-weight:600; background:var(--color-primary-50); color:var(--color-primary); border:1px solid var(--color-primary-100); border-radius:var(--radius-full); padding:0.25rem 0.75rem; }

/* ══ FEATURES ══ */
.features-section { background: var(--color-gray-50); }
.features-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem; /* tighter feature grid */
}
@media (min-width: 640px) { .features-grid { grid-template-columns: repeat(2,1fr); } }
@media (min-width: 1024px) { .features-grid { grid-template-columns: repeat(3,1fr); } }

.feature-card { padding: 1.75rem; }
@media (max-width: 640px) {
  .feature-card { 
    padding: 1.25rem; 
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}

.feature-icon-wrap {
  width: 48px; height: 48px;
  border-radius: var(--radius-md);
  background: var(--color-primary-50);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 1.125rem;
  color: var(--color-primary);
  transition: background 250ms;
}
@media (max-width: 640px) {
  .feature-icon-wrap { 
    width: 40px; height: 40px; 
    margin-bottom: 0.75rem; 
  }
  .feature-icon-svg { width: 20px; height: 20px; }
}

.feature-card:hover .feature-icon-wrap { background: var(--color-primary); color: #fff; }
.feature-icon-svg { width: 24px; height: 24px; }
.feature-title { font-size: 1rem; font-weight: 700; color: var(--color-primary); margin-bottom: 0.625rem; }
@media (max-width: 640px) {
  .feature-title { font-size: 0.95rem; margin-bottom: 0.5rem; }
}
.feature-desc { font-size: 0.875rem; color: var(--color-gray-600); line-height: 1.65; margin-bottom: 1rem; }
@media (max-width: 640px) {
  .feature-desc { font-size: 0.825rem; margin-bottom: 0.75rem; line-height: 1.5; }
}
.feature-link { font-size: 0.85rem; font-weight: 700; color: var(--color-primary); text-decoration: none; transition: all 200ms; }
.feature-link:hover { text-decoration: underline; color: var(--color-ovgu-blue); }
.feature-link--featured {
  display: inline-block;
  background: var(--color-primary);
  color: #fff !important;
  padding: 0.5rem 1.25rem;
  border-radius: var(--radius-sm);
  margin-top: 0.5rem;
}
.feature-link--featured:hover {
  background: var(--color-accent);
  text-decoration: none;
  transform: translateX(4px);
}

/* ══ CURRICULUM ══ */
.curriculum-section { background: #fff; }
.sem-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2.5rem;
  justify-content: center;
  width: max-content;
  min-width: 100%;
}
.sem-tabs-container {
  overflow-x: auto;
  padding-bottom: 0rem;
  margin-bottom: 0rem;
  mask-image: linear-gradient(to right, black 85%, transparent 100%);
}
@media (min-width: 900px) {
  .sem-tabs-container {
    mask-image: none;
    overflow: visible;
  }
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

/* ══ ACADEMIC ACTIVITIES ══ */
.activities-section { background: #fff; }
.bento-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem; /* tighter bento grid */
  min-height: 450px;
}
.bento-grid a {
  text-decoration: none !important;
}
@media (min-width: 900px) { .bento-grid { grid-template-columns: 1.15fr 1fr; } }
.bento-main { display: flex; flex-direction: column; text-decoration: none !important; }
.bento-side { display: flex; flex-direction: column; gap: 1.25rem; }
.bento-bottom-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; flex: 1; }

.bento-card {
  position: relative;
  border-radius: var(--radius-xl);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 160px;
  flex: 1;
  background: var(--color-gray-100);
}
.bento-card--large { min-height: 260px; }
.bento-card--wide { min-height: 180px; }

@media (min-width: 900px) {
  .bento-card { min-height: 220px; }
  .bento-card--large { min-height: 400px; }
  .bento-card--wide { min-height: 240px; }
}
.bento-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 500ms ease;
}
.bento-card:hover .bento-img { transform: scale(1.05); }

.bento-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.4) 55%, transparent 100%);
  z-index: 1;
}
.bento-overlay--light { background: linear-gradient(to top, rgba(15,23,42,0.85) 0%, transparent 100%); }

.bento-content {
  position: relative;
  z-index: 2;
  padding: 2rem;
  color: #fff;
}
.bento-content--bottom { padding: 1.25rem; }
.bento-tag {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: .08em;
  background: var(--color-accent);
  color: #fff;
  padding: 0.35rem 0.85rem;
  border-radius: var(--radius-sm);
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
.bento-title {
  font-size: 1.6rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 0.5rem;
  color: #ffffff;
  text-shadow: 0 2px 10px rgba(0,0,0,0.6);
  transition: text-decoration 200ms;
}
.bento-main:hover .bento-title,
.bento-card:hover .bento-title {
  text-decoration: underline;
  text-decoration-color: var(--color-accent);
  text-underline-offset: 6px;
}
.bento-title--small { font-size: 1.2rem; }
.bento-desc {
  font-size: 1rem;
  color: #f1f5f9;
  line-height: 1.6;
  max-width: 95%;
  text-shadow: 0 1px 8px rgba(0,0,0,0.5);
}

.bento-explore {
  background: var(--color-primary-50);
  border: 1px solid var(--color-primary-100);
  padding: 2rem 1.5rem;
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  text-decoration: none;
  color: var(--color-primary);
  transition: all 250ms;
}
.bento-explore:hover { background: var(--color-primary-100); border-color: var(--color-primary-100); }
.bento-explore-icon {
  width: 48px; height: 48px;
  color: var(--color-ovgu-blue);
  margin-bottom: 1rem;
}
.bento-explore h3 { font-size: 1.2rem; font-weight: 700; margin-bottom: 0.5rem; }
.bento-explore p { font-size: 0.85rem; color: var(--color-gray-600); line-height: 1.5; }

/* ══ HYBRID ══ */
.hybrid-section { background: var(--color-gray-50); }
.hybrid-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem; /* reduced from 3rem */
  align-items: start;
}
@media (min-width: 900px) { .hybrid-grid { grid-template-columns: 1fr 1fr; } }

.hybrid-title { font-size: clamp(1.4rem, 3vw, 2rem); color: var(--color-primary); margin: 0.75rem 0 0.5rem; }
.hybrid-sub { font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--color-accent); margin-bottom: 1rem; }
.hybrid-desc { font-size: 0.95rem; color: var(--color-gray-600); line-height: 1.75; margin-bottom: 1.25rem; }
.hybrid-contact { display:flex; flex-direction:column; gap:0.375rem; font-size:0.875rem; color:var(--color-gray-600); }

.hybrid-schedule { display: flex; flex-direction: column; gap: 1rem; }
.schedule-total {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  background: var(--color-primary);
  color: #fff;
  border-radius: var(--radius-lg);
  padding: 1.25rem 1.5rem;
}
.schedule-total-num { font-size: 3rem; font-weight: 800; font-family: var(--font-display); line-height: 1; }
.schedule-total-label { font-size: 0.875rem; font-weight: 600; opacity: 0.8; }

.schedule-rows { display: flex; flex-direction: column; gap: 0.5rem; }
.schedule-row {
  display: grid;
  grid-template-columns: 100px 1fr auto;
  align-items: center;
  gap: 1rem;
  background: #fff;
  border-radius: var(--radius-md);
  padding: 0.875rem 1.25rem;
  border: 1px solid var(--color-gray-200);
  border-left: 4px solid;
  transition: box-shadow 200ms;
}
@media (max-width: 639px) {
  .schedule-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  .schedule-meta {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid var(--color-gray-100);
    padding-top: 0.5rem;
    margin-top: 0.25rem;
  }
}
.schedule-row:hover { box-shadow: var(--shadow-sm); }
.schedule-row--online  { border-left-color: var(--color-ovgu-blue); }
.schedule-row--onsite  { border-left-color: var(--color-accent); }
.schedule-day { font-weight: 700; color: var(--color-primary); font-size: 0.9rem; }
.schedule-time { font-size: 0.82rem; color: var(--color-gray-700); font-weight: 600; }
.schedule-location { font-size: 0.75rem; color: var(--color-gray-500); }
.schedule-meta { display:flex; flex-direction:column; align-items:flex-end; gap:0.25rem; }
.schedule-mode-badge {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  border-radius: var(--radius-full);
  padding: 0.15rem 0.6rem;
}
.mode--online { background: var(--color-ovgu-blue-50); color: var(--color-ovgu-blue-dark); }
.mode--onsite { background: var(--color-accent-50); color: var(--color-accent-dark); }
.schedule-hours { font-size: 0.75rem; color: var(--color-gray-500); font-weight: 600; }

/* ══ CTA ══ */
.cta-section {
  position: relative;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.cta-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(10,22,45,0.88) 0%, rgba(30,58,95,0.80) 100%);
}
.cta-inner {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 6rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}
.cta-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  color: #fff;
  max-width: 640px;
  line-height: 1.1;
}
.cta-desc { font-size: 1.05rem; color: rgba(255,255,255,.72); max-width: 520px; line-height: 1.7; }
.cta-actions { display:flex; flex-wrap:wrap; gap:1rem; justify-content:center; }

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
</style>
