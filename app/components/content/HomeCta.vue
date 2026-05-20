<script setup lang="ts">
const { page, localePath } = inject('pageData') as any
</script>

<template>
  <section
    class="cta-section"
    :style="{ backgroundImage: `url(${page.cta?.backgroundImage})` }"
  >
    <div class="cta-overlay" />
    <div class="container cta-inner">
      <div class="badge badge-white">{{ page.cta?.badge }}</div>
      <h2 class="cta-title">{{ page.cta?.headline }}</h2>
      <p class="cta-desc">{{ page.cta?.description }}</p>
      <div class="cta-actions">
        <NuxtLink :to="localePath(page.cta?.primaryLink ?? '/')" class="btn btn-primary">
          {{ page.cta?.primaryCta }} →
        </NuxtLink>
        <NuxtLink :to="localePath(page.cta?.secondaryLink ?? '/')" class="btn btn-outline-white">
          {{ page.cta?.secondaryCta }}
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
