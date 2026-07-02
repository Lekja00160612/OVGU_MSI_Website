<script setup lang="ts">
import { defineAsyncComponent, h, computed, ref } from 'vue'

/**
 * Admin poster preview page — /admin/{event}
 *
 * Renders admin-only printable assets for a given activity event slug.
 * Currently supports:
 *   - "portrait" poster  (default, the original A4 component)
 *   - "facebook" post    (landscape 1200×630, Facebook-friendly)
 *   - "pagedjs" preview  (A4 print formatting polyfill using Paged.js)
 *   - "typst" PDF        (Typeset PDF document link/iframe)
 */

const route = useRoute()
const slug  = computed(() => route.params.slug as string)
const format = computed(() => (route.query.format as string) || 'portrait')
const isClean = computed(() => route.query.clean === 'true')

// noindex / nofollow — admin only, never crawled
useSeoMeta({
  title: isClean.value ? `Print Clean | ${slug.value}` : 'Admin Poster Preview | MSI',
  robots: 'noindex, nofollow'
})

// Inject Paged.js legacy script if we are in clean print preview mode
useHead(() => {
  if (isClean.value) {
    return {
      script: [
        {
          src: 'https://unpkg.com/pagedjs/dist/paged.legacy.js',
          defer: true
        }
      ],
      style: [
        {
          children: `
            /* Fix page margin and display for Paged.js inside iframe */
            html, body {
              background: #ffffff !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            .pagedjs_pages {
              background: #f8fafc !important;
              padding: 30px 0 !important;
              min-height: 100vh;
              box-sizing: border-box;
            }
            .pagedjs_page {
              background: white !important;
              box-shadow: 0 10px 25px rgba(15, 23, 42, 0.12), 0 1px 3px rgba(15, 23, 42, 0.05) !important;
              margin: 0 auto 30px auto !important;
              border: 1px solid rgba(15, 23, 42, 0.06) !important;
            }
            /* Hide default Paged.js page headers/footers */
            .pagedjs_margin {
              display: none !important;
            }
          `
        }
      ]
    }
  }
  return {}
})

// Load the activity data from the _activities collection using the slug.
const contentPath = computed(() => `/_activities/${slug.value}`)
const { data: activity, status } = await useAsyncData(
  `admin-poster-${slug.value}`,
  () => queryCollection('activities').path(contentPath.value).first()
)

const FallbackComponent = {
  render() {
    return h('div', { class: 'admin-not-found no-print' }, [
      h('p', 'No Facebook layout available for this poster.')
    ])
  }
}

const resolvedPoster = computed(() => {
  const componentName = activity.value?.posterComponent || 'VguMasterInfoDay2026'
  return defineAsyncComponent(() => import(`../../components/content/posters/${componentName}.vue`))
})

const resolvedFacebookPoster = computed(() => {
  const componentName = activity.value?.posterComponent || 'VguMasterInfoDay2026'
  return defineAsyncComponent(() => 
    import(`../../components/content/posters/${componentName}Facebook.vue`)
      .catch(() => FallbackComponent)
  )
})

// Print function for the Paged.js iframe preview
const iframeRef = ref<HTMLIFrameElement | null>(null)
const printIframe = () => {
  if (iframeRef.value && iframeRef.value.contentWindow) {
    iframeRef.value.contentWindow.focus()
    iframeRef.value.contentWindow.print()
  }
}
</script>

<template>
  <!-- Clean view: only render raw poster component for Paged.js parsing inside iframe -->
  <template v-if="isClean">
    <div class="clean-print-wrapper">
      <component 
        v-if="resolvedPoster" 
        :is="resolvedPoster" 
        :activity="activity" 
      />
    </div>
  </template>

  <!-- Admin dashboard view with toolbar -->
  <div v-else class="admin-poster-page">

    <!-- ── Top admin toolbar ───────────────────────────────────────────── -->
    <div class="admin-toolbar no-print">
      <div class="toolbar-inner">

        <div class="toolbar-left">
          <NuxtLink to="/admin" class="back-btn">
            ← Admin
          </NuxtLink>
          <span class="toolbar-sep">|</span>
          <span class="toolbar-label">Poster Preview</span>
          <span class="toolbar-slug">{{ slug }}</span>
        </div>

        <div class="toolbar-right">
          <!-- Format switcher tabs -->
          <div class="format-tabs">
            <NuxtLink
              :to="`/admin/${slug}`"
              class="fmt-tab"
              :class="{ active: format === 'portrait' }"
            >
              🖼 Portrait (A4)
            </NuxtLink>
            <NuxtLink
              :to="`/admin/${slug}?format=facebook`"
              class="fmt-tab"
              :class="{ active: format === 'facebook' }"
            >
              📘 Facebook Post
            </NuxtLink>
            <NuxtLink
              :to="`/admin/${slug}?format=pagedjs`"
              class="fmt-tab"
              :class="{ active: format === 'pagedjs' }"
            >
              📄 Paged.js Preview
            </NuxtLink>
            <NuxtLink
              v-if="slug === 'msi-seminar-workshop-2026'"
              :to="`/admin/${slug}?format=typst`"
              class="fmt-tab"
              :class="{ active: format === 'typst' }"
            >
              📄 Typst Vector PDF
            </NuxtLink>
          </div>
        </div>

      </div>
    </div>

    <!-- ── Loading state ──────────────────────────────────────────────── -->
    <div v-if="status === 'pending'" class="admin-loading no-print">
      <div class="spinner" />
      <p>Loading activity data…</p>
    </div>

    <!-- ── Not found ──────────────────────────────────────────────────── -->
    <div v-else-if="!activity" class="admin-not-found no-print">
      <div class="not-found-icon">📭</div>
      <h2>Activity not found</h2>
      <p>No activity with slug <code>{{ slug }}</code> was found in the <code>_activities</code> collection.</p>
      <NuxtLink to="/admin" class="back-btn-lg">← Back to Admin</NuxtLink>
    </div>

    <!-- ── Poster render area ─────────────────────────────────────────── -->
    <template v-else>

      <!-- Facebook format -->
      <template v-if="format === 'facebook'">
        <component 
          v-if="resolvedFacebookPoster" 
          :is="resolvedFacebookPoster" 
          :activity="activity" 
        />
      </template>

      <!-- Paged.js format -->
      <template v-else-if="format === 'pagedjs'">
        <div class="pagedjs-container no-print">
          <div class="pagedjs-header-panel">
            <div class="panel-left">
              <h3>Paged.js A4 Print Preview</h3>
              <p>Polished layout rendering standard HTML/CSS exactly as it will print on physical paper. Paged.js handles all margins and dimensions natively.</p>
            </div>
            <div class="panel-right">
              <button @click="printIframe" class="print-trigger-btn">
                🖨️ Print Poster (Paged.js)
              </button>
            </div>
          </div>
          <div class="pagedjs-viewer-frame">
            <iframe 
              ref="iframeRef"
              :src="`/admin/${slug}?clean=true`" 
              class="pagedjs-iframe" 
            />
          </div>
        </div>
      </template>

      <!-- Typst format -->
      <template v-else-if="format === 'typst'">
        <div class="typst-container no-print">
          <div class="typst-header-panel">
            <div class="panel-left">
              <h3>Typst Compiled Vector PDF</h3>
              <p>Generated dynamically using Typst's modern typesetting CLI. Zero print engine/browser inconsistencies.</p>
            </div>
            <div class="panel-right">
              <a href="/posters/msi-seminar-workshop-2026.pdf" download class="dl-btn pdf-btn">
                📥 Download PDF (Vector)
              </a>
              <a href="/posters/msi-seminar-workshop-2026.png" download class="dl-btn png-btn">
                📥 Download PNG (300 DPI)
              </a>
            </div>
          </div>
          <div class="pdf-viewer-frame">
            <iframe src="/posters/msi-seminar-workshop-2026.pdf" class="pdf-iframe" />
          </div>
        </div>
      </template>

      <!-- Portrait format (fallback to the original portrait poster) -->
      <template v-else-if="format === 'portrait' || !format">
        <component 
          v-if="resolvedPoster" 
          :is="resolvedPoster" 
          :activity="activity" 
        />
        <div v-else class="admin-not-found no-print">
          <p>No portrait poster component mapped for <code>{{ activity.posterComponent }}</code>.</p>
        </div>
      </template>

    </template>

  </div>
</template>

<style scoped>
.admin-poster-page {
  min-height: 100vh;
  background: #060b13;
}

/* ── Admin Toolbar ───────────────────────────────────────────────────────── */
.admin-toolbar {
  background: rgba(9, 19, 34, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 2px solid rgba(232, 119, 34, 0.4);
  padding: 0.65rem 1.5rem;
  position: sticky;
  top: 0;
  z-index: 200;
}
.toolbar-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  max-width: 1400px;
  margin: 0 auto;
}
.toolbar-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.back-btn {
  color: #e87722;
  font-size: 0.85rem;
  font-weight: 700;
  text-decoration: none;
  font-family: 'Be Vietnam Pro', system-ui, sans-serif;
  transition: opacity 200ms;
}
.back-btn:hover { opacity: 0.75; }
.toolbar-sep {
  color: rgba(255, 255, 255, 0.2);
  font-size: 0.8rem;
}
.toolbar-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.55);
  font-family: 'Be Vietnam Pro', system-ui, sans-serif;
}
.toolbar-slug {
  background: rgba(232, 119, 34, 0.15);
  color: #e87722;
  font-size: 0.72rem;
  font-weight: 700;
  font-family: monospace;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid rgba(232, 119, 34, 0.3);
}

.toolbar-right {
  display: flex;
  align-items: center;
}

/* Format tabs */
.format-tabs {
  display: flex;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 3px;
  gap: 3px;
}
.fmt-tab {
  font-size: 0.78rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.55);
  text-decoration: none;
  padding: 5px 14px;
  border-radius: 6px;
  transition: background 200ms, color 200ms;
  font-family: 'Be Vietnam Pro', system-ui, sans-serif;
}
.fmt-tab:hover {
  color: rgba(255, 255, 255, 0.85);
  background: rgba(255, 255, 255, 0.08);
}
.fmt-tab.active {
  background: #e87722;
  color: #ffffff;
}

/* ── Loading ─────────────────────────────────────────────────────────────── */
.admin-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 6rem 2rem;
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Be Vietnam Pro', system-ui, sans-serif;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(232, 119, 34, 0.2);
  border-top-color: #e87722;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Not found ───────────────────────────────────────────────────────────── */
.admin-not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 6rem 2rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.75);
  font-family: 'Be Vietnam Pro', system-ui, sans-serif;
}
.not-found-icon { font-size: 3rem; }
.admin-not-found h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
}
.admin-not-found p {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.55);
  max-width: 420px;
}
.admin-not-found code {
  background: rgba(232, 119, 34, 0.15);
  color: #e87722;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 0.9em;
}
.back-btn-lg {
  display: inline-block;
  background: #e87722;
  color: #ffffff;
  font-weight: 700;
  padding: 0.7rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.9rem;
  font-family: 'Be Vietnam Pro', system-ui, sans-serif;
  margin-top: 0.5rem;
  transition: background 200ms, transform 200ms;
}
.back-btn-lg:hover {
  background: #d96512;
  transform: translateY(-2px);
}

/* ── Typst Panel ─────────────────────────────────────────────────────────── */
.typst-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1.5rem 3rem 1.5rem;
  font-family: 'Be Vietnam Pro', system-ui, sans-serif;
}
.typst-header-panel {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 2rem;
}
.panel-left h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 0.25rem 0;
}
.panel-left p {
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}
.panel-right {
  display: flex;
  gap: 0.75rem;
}
.dl-btn {
  display: inline-flex;
  align-items: center;
  font-size: 0.85rem;
  font-weight: 700;
  text-decoration: none;
  padding: 0.65rem 1.2rem;
  border-radius: 8px;
  transition: transform 200ms, opacity 200ms;
}
.dl-btn:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}
.pdf-btn {
  background: #e87722;
  color: #ffffff;
}
.png-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.15);
}
.pdf-viewer-frame {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  height: 800px;
  overflow: hidden;
}
.pdf-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* ── Paged.js Panel ──────────────────────────────────────────────────────── */
.pagedjs-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1.5rem 3rem 1.5rem;
  font-family: 'Be Vietnam Pro', system-ui, sans-serif;
}
.pagedjs-header-panel {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 2rem;
}
.print-trigger-btn {
  background: #e87722;
  color: #ffffff;
  border: none;
  font-size: 0.88rem;
  font-weight: 700;
  padding: 0.65rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 200ms, transform 200ms;
}
.print-trigger-btn:hover {
  background-color: #d96512;
  transform: translateY(-2px);
}
.pagedjs-viewer-frame {
  background: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  height: 900px;
  overflow: hidden;
}
.pagedjs-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* ── Clean Print Wrapper ─────────────────────────────────────────────────── */
.clean-print-wrapper {
  background: #ffffff !important;
  min-height: 100vh;
}

/* ── Print: hide toolbar ─────────────────────────────────────────────────── */
@media print {
  .no-print { display: none !important; }
  .admin-poster-page { background: #ffffff !important; }
}
</style>
