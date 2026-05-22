<script setup lang="ts">
const { page } = inject('pageData') as any
</script>

<template>
  <section class="section hybrid-section">
    <div class="container">
      <div class="hybrid-grid">
        <!-- Left: Text info -->
        <div class="hybrid-text">
          <div class="badge badge-accent">{{ page.hybrid?.badge }}</div>
          <h2 class="hybrid-title">{{ page.hybrid?.headline }}</h2>
          <p class="hybrid-sub">{{ page.hybrid?.subtitle }}</p>
          <p class="hybrid-desc">{{ page.hybrid?.description }}</p>
          <div class="hybrid-contact">
            <span>📞 {{ page.hybrid?.contact }}</span>
            <span>🌐 {{ page.hybrid?.website }}</span>
          </div>
        </div>

        <!-- Right: Schedule -->
        <div class="hybrid-schedule">
          <div class="schedule-total">
            <span class="schedule-total-num">20</span>
            <span class="schedule-total-label">Academic Hours / Week</span>
          </div>
          <div class="schedule-rows">
            <div
              v-for="row in page.hybrid?.schedule"
              :key="row.day"
              class="schedule-row"
              :class="row.mode === 'Online' ? 'schedule-row--online' : 'schedule-row--onsite'"
            >
              <div class="schedule-day">{{ row.day }}</div>
              <div class="schedule-info">
                <div class="schedule-time">{{ row.time }}</div>
                <div class="schedule-location">{{ row.location }}</div>
              </div>
              <div class="schedule-meta">
                <span class="schedule-mode-badge" :class="row.mode === 'Online' ? 'mode--online' : 'mode--onsite'">
                  {{ row.mode }}
                </span>
                <span class="schedule-hours">{{ row.hours }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ══ HYBRID LEARNING ══ */
.hybrid-section { background: var(--color-gray-50); }
.hybrid-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
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

.schedule-rows {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 420px;
  overflow-y: auto;
}
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
</style>
