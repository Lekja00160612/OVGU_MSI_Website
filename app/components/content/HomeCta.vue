<script setup lang="ts">
const props = defineProps<{
  headline?: string
  description?: string
  badge?: string
  backgroundImage?: string
  primaryCta?: string
  primaryLink?: string
  secondaryCta?: string
  secondaryLink?: string
}>()

const pageData = inject('pageData', null) as any
const page = computed(() => pageData?.page?.value ?? {})
const localePath = pageData?.localePath ?? ((path: string) => path)

const displayHeadline = computed(() => props.headline ?? page.value.cta?.headline)
const displayDescription = computed(() => props.description ?? page.value.cta?.description)
const displayBadge = computed(() => props.badge ?? page.value.cta?.badge)
const displayBackgroundImage = computed(() => props.backgroundImage ?? page.value.cta?.backgroundImage)
const displayPrimaryCta = computed(() => props.primaryCta ?? page.value.cta?.primaryCta)
const displayPrimaryLink = computed(() => props.primaryLink ?? page.value.cta?.primaryLink ?? '/')
const displaySecondaryCta = computed(() => props.secondaryCta ?? page.value.cta?.secondaryCta)
const displaySecondaryLink = computed(() => props.secondaryLink ?? page.value.cta?.secondaryLink ?? '/')
</script>

<template>
  <section
    class="cta-section"
    :style="{ backgroundImage: `url(${displayBackgroundImage})` }"
  >
    <div class="cta-overlay" />
    <div class="container cta-inner">
      <div v-if="displayBadge" class="badge badge-white">{{ displayBadge }}</div>
      <h2 v-if="displayHeadline" class="cta-title">{{ displayHeadline }}</h2>
      <p v-if="displayDescription" class="cta-desc">{{ displayDescription }}</p>
      <div class="cta-actions">
        <NuxtLink :to="localePath(displayPrimaryLink)" class="btn btn-primary">
          {{ displayPrimaryCta }} →
        </NuxtLink>
        <NuxtLink :to="localePath(displaySecondaryLink)" class="btn btn-outline-white">
          {{ displaySecondaryCta }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
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
</style>
