<script setup lang="ts">
const { page } = inject('pageData') as any
</script>

<template>
  <section class="section about-section">
    <div class="container about-grid">
      <!-- Left: Text -->
      <div class="about-text">
        <h2 class="about-title">{{ page.about?.headline }}</h2>
        <div class="about-tag">{{ page.about?.subtitle }}</div>
        <p class="about-body">{{ page.about?.paragraph1 }}</p>
        <p class="about-body">{{ page.about?.paragraph2 }}</p>
      </div>

      <!-- Right: Degree Card -->
      <div class="about-visual">
        <div class="degree-card">
          <div class="degree-card-header">
            <NuxtImg src="/Logo/LOGO_MSI_Full_color.png" alt="MSI" class="degree-msi-logo" />
          </div>
          <div class="degree-card-body">
            <div class="degree-item">
              <div class="degree-dot degree-dot--blue" />
              <div>
                <div class="degree-label">Degree 1</div>
                <div class="degree-value">M.Sc. — Otto von Guericke University Magdeburg</div>
              </div>
            </div>
            <div class="degree-divider" />
            <div class="degree-item">
              <div class="degree-dot degree-dot--orange" />
              <div>
                <div class="degree-label">Degree 2</div>
                <div class="degree-value">M.Sc. — Vietnamese-German University</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ══ ABOUT ══ */
.about-section { background: #fff; }
.about-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rem;
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

/* Degree Card */
.degree-card {
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-gray-200);
  max-height: 420px;
  overflow-y: auto;
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
</style>
