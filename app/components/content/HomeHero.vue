<script setup lang="ts">
const { page, localePath } = inject('pageData') as any
</script>

<template>
  <section class="hero" :style="{ backgroundImage: `url(${page.hero?.backgroundImage})` }">
    <div class="hero-overlay" />
    <div class="container hero-content">
      <div class="badge badge-white animate-fade-in">{{ page.hero?.badge }}</div>
      <h1 class="hero-title animate-fade-in-up delay-100">{{ page.hero?.headline }}</h1>
      <div class="hero-logos animate-fade-in-up delay-200">
        <img src="/Logo/VGU_Logo.png" alt="VGU" class="hero-uni-logo" />
        <span class="hero-logo-x">×</span>
        <img src="/Logo/OVGU_Logo_Transparent.svg" alt="OVGU" class="hero-uni-logo" />
      </div>
      <div class="hero-actions animate-fade-in-up delay-300">
        <NuxtLink :to="localePath('/future-students')" class="btn btn-primary">Explore the Program →</NuxtLink>
        <NuxtLink :to="localePath('/tuition-scholarships')" class="btn btn-outline-white">View Scholarships</NuxtLink>
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
