<script setup lang="ts">
const props = defineProps<{
  badge?: string
  headline?: string
  backgroundImage?: string
  applyUrl?: string
  scholarshipsUrl?: string
}>()

const pageData = inject('pageData', null) as any
const page = computed(() => pageData?.page?.value ?? {})
const localePath = pageData?.localePath ?? ((path: string) => path)
const { t } = useI18n()

const displayBadge = computed(() => props.badge ?? page.value.hero?.badge)
const displayHeadline = computed(() => props.headline ?? page.value.hero?.headline)
const displayBackgroundImage = computed(() => props.backgroundImage ?? page.value.hero?.backgroundImage)
const displayApplyUrl = computed(() => props.applyUrl ?? 'https://apply.vgu.edu.vn/en')
const displayScholarshipsUrl = computed(() => props.scholarshipsUrl ?? '/tuition-scholarships')
</script>

<template>
  <section class="hero" :style="{ backgroundImage: `url(${displayBackgroundImage})` }">
    <div class="hero-overlay" />
    <div class="container hero-content">
      <div v-if="displayBadge" class="badge badge-white animate-fade-in">{{ displayBadge }}</div>
      <h1 v-if="displayHeadline" class="hero-title animate-fade-in-up delay-100">{{ displayHeadline }}</h1>
      <div class="hero-logos animate-fade-in-up delay-200">
        <img src="/Logo/VGU_Logo.png" alt="VGU" class="hero-uni-logo" />
        <span class="hero-logo-x">×</span>
        <img src="/Logo/OVGU_Logo.png" alt="OVGU" class="hero-uni-logo" />
      </div>
      <div class="hero-actions animate-fade-in-up delay-300">
        <NuxtLink :to="displayApplyUrl.startsWith('http') ? displayApplyUrl : localePath(displayApplyUrl)" class="btn btn-primary">{{ t('home.apply_now') }} →</NuxtLink>
        <NuxtLink :to="localePath(displayScholarshipsUrl)" class="btn btn-outline-white">{{ t('home.view_scholarships') }}</NuxtLink>
      </div>
    </div>
  </section>
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
    gap: 1.5rem;
    padding-top: 5rem;
    padding-bottom: 5rem;
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
/* Glassmorphic logo strip */
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
</style>
