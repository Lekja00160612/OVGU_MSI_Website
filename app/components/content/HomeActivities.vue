<script setup lang="ts">
const props = defineProps<{
  headline?: string
  recentActivities?: any[]
}>()

const pageData = inject('pageData', null) as any
const page = computed(() => pageData?.page?.value ?? {})
const injectedActivities = computed(() => pageData?.recentActivities?.value ?? [])
const localePath = pageData?.localePath ?? ((path: string) => path)
const { t, locale } = useI18n()

// Local fallback query if injected recentActivities is not available
const localActivities = ref<any[]>([])
if (!pageData) {
  const { data } = await useAsyncData(`msi-home-activities-${locale.value}`, () =>
    queryCollection('activities').all()
  )
  if (data.value) {
    const highlighted = data.value.filter(a => a.highlighted === true || a.meta?.highlighted === true)
    const sortByDateDesc = (a: any, b: any) => {
      const dateA = a.date || a.meta?.date || ''
      const dateB = b.date || b.meta?.date || ''
      return dateB.localeCompare(dateA)
    }
    const sortedHighlighted = [...highlighted].sort(sortByDateDesc)
    if (sortedHighlighted.length >= 4) {
      localActivities.value = sortedHighlighted.slice(0, 4)
    } else {
      const nonHighlighted = data.value.filter(a => !(a.highlighted === true || a.meta?.highlighted === true))
      const sortedNonHighlighted = [...nonHighlighted].sort(sortByDateDesc)
      localActivities.value = [...sortedHighlighted, ...sortedNonHighlighted].slice(0, 4)
    }
  }
}

const displayHeadline = computed(() => props.headline ?? page.value.activities?.headline ?? t('nav.academic_activities'))
const displayActivities = computed(() => props.recentActivities ?? (pageData ? injectedActivities.value : localActivities.value))
</script>

<template>
  <section class="section activities-section">
    <div class="container">
      <div class="section-header">
        <h2 v-if="displayHeadline" class="section-title">{{ displayHeadline }}</h2>
      </div>

      <div v-if="displayActivities?.length" class="bento-grid">
        <!-- Main large card -->
        <NuxtLink
          v-if="displayActivities[0]"
          :to="localePath(displayActivities[0].path.replace('/_activities', '/academic-activities'))"
          class="bento-main"
        >
          <div class="bento-card bento-card--large">
            <NuxtImg :src="displayActivities[0].meta?.image || displayActivities[0].image" class="bento-img" loading="lazy" />
            <div class="bento-overlay" />
            <div class="bento-content">
              <span class="bento-tag">{{ displayActivities[0].meta?.category || displayActivities[0].category }}</span>
              <h3 class="bento-title">{{ displayActivities[0].title }}</h3>
              <p class="bento-desc">{{ displayActivities[0].meta?.description || displayActivities[0].description }}</p>
            </div>
          </div>
        </NuxtLink>

        <!-- Side column -->
        <div class="bento-side">
          <NuxtLink
            v-if="displayActivities[1]"
            :to="localePath(displayActivities[1].path.replace('/_activities', '/academic-activities'))"
            class="bento-card bento-card--wide"
          >
            <NuxtImg :src="displayActivities[1].meta?.image || displayActivities[1].image" class="bento-img" loading="lazy" />
            <div class="bento-overlay bento-overlay--light" />
            <div class="bento-content">
              <span class="bento-tag">{{ displayActivities[1].meta?.category || displayActivities[1].category }}</span>
              <h3 class="bento-title">{{ displayActivities[1].title }}</h3>
            </div>
          </NuxtLink>

          <!-- Bottom row: cards 3 & 4 -->
          <div class="bento-bottom-row">
            <NuxtLink
              v-if="displayActivities[2]"
              :to="localePath(displayActivities[2].path.replace('/_activities', '/academic-activities'))"
              class="bento-card"
            >
              <NuxtImg :src="displayActivities[2].meta?.image || displayActivities[2].image" class="bento-img" loading="lazy" />
              <div class="bento-overlay bento-overlay--light" />
              <div class="bento-content bento-content--bottom">
                <h3 class="bento-title bento-title--small">{{ displayActivities[2].title }}</h3>
              </div>
            </NuxtLink>

            <NuxtLink
              v-if="displayActivities[3]"
              :to="localePath(displayActivities[3].path.replace('/_activities', '/academic-activities'))"
              class="bento-card"
            >
              <NuxtImg :src="displayActivities[3].meta?.image || displayActivities[3].image" class="bento-img" loading="lazy" />
              <div class="bento-overlay bento-overlay--light" />
              <div class="bento-content bento-content--bottom">
                <h3 class="bento-title bento-title--small">{{ displayActivities[3].title }}</h3>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="activities-actions">
        <NuxtLink :to="localePath('/academic-activities')" class="btn btn-primary" style="padding-left: 1rem; padding-right: 1rem;">
          {{ t('home.explore_all') }} &rarr;
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ══ ACADEMIC ACTIVITIES ══ */
.activities-section { background: #fff; }
.bento-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  min-height: 500px;
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
.bento-card--wide  { min-height: 180px; }

@media (min-width: 900px) {
  .bento-card { min-height: 220px; }
  .bento-card--large { min-height: 400px; }
  .bento-card--wide  { min-height: 240px; }
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

.activities-actions {
  display: flex;
  justify-content: center;
  margin-top: 2.5rem;
}
</style>
