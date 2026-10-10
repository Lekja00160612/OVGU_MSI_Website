<!--
  Page: AdminPosterPreview
  Description: Admin-only preview and export engine for event posters across portrait A4, landscape Facebook, Paged.js polyfill, and Typst vector formats.
  Data Sources: Nuxt Content '_activities' collection.
  Nuxt UI Primitives: UButton, UBadge, UIcon.
-->
<script setup lang="ts">
import { defineAsyncComponent, h, computed, ref } from 'vue'

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

// Load activity data from _activities collection using slug
const contentPath = computed(() => `/_activities/${slug.value}`)
const { data: activity, status } = await useAsyncData(
  `admin-poster-${slug.value}`,
  () => queryCollection('activities').path(contentPath.value).first()
)

const FallbackComponent = {
  render() {
    return h('div', { class: 'p-12 text-center text-slate-400 no-print' }, [
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
    <div class="w-full bg-white min-h-screen">
      <component 
        v-if="resolvedPoster" 
        :is="resolvedPoster" 
        :activity="activity" 
      />
    </div>
  </template>

  <!-- Admin dashboard view with toolbar -->
  <div v-else class="min-h-screen bg-[#060b13] text-slate-100 font-sans">

    <!-- === SECTION: Top Admin Toolbar === -->
    <div class="bg-[#091322]/95 backdrop-blur-md border-b-2 border-orange-500/40 px-4 sm:px-6 py-2.5 sticky top-0 z-50 no-print">
      <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">

        <div class="flex items-center gap-2">
          <UButton to="/admin" color="neutral" variant="ghost" size="xs" icon="i-lucide-arrow-left">
            Admin
          </UButton>
          <span class="text-slate-600 select-none">|</span>
          <span class="text-xs font-semibold text-slate-400">Poster Preview</span>
          <UBadge color="primary" variant="subtle" size="xs">{{ slug }}</UBadge>
        </div>

        <!-- Format Switcher Buttons -->
        <div class="flex items-center gap-1.5 flex-wrap">
          <UButton
            :to="`/admin/${slug}`"
            :variant="format === 'portrait' ? 'solid' : 'ghost'"
            color="primary"
            size="xs"
            icon="i-lucide-image"
            class="rounded-lg font-semibold"
          >
            Portrait (A4)
          </UButton>
          <UButton
            :to="`/admin/${slug}?format=facebook`"
            :variant="format === 'facebook' ? 'solid' : 'ghost'"
            color="primary"
            size="xs"
            icon="i-lucide-share-2"
            class="rounded-lg font-semibold"
          >
            Facebook Post
          </UButton>
          <UButton
            :to="`/admin/${slug}?format=pagedjs`"
            :variant="format === 'pagedjs' ? 'solid' : 'ghost'"
            color="primary"
            size="xs"
            icon="i-lucide-file-text"
            class="rounded-lg font-semibold"
          >
            Paged.js Preview
          </UButton>
          <UButton
            v-if="slug === 'msi-seminar-workshop-2026'"
            :to="`/admin/${slug}?format=typst`"
            :variant="format === 'typst' ? 'solid' : 'ghost'"
            color="primary"
            size="xs"
            icon="i-lucide-file-code"
            class="rounded-lg font-semibold"
          >
            Typst Vector PDF
          </UButton>
        </div>

      </div>
    </div>

    <!-- === SECTION: Loading State === -->
    <div v-if="status === 'pending'" class="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-slate-400 no-print">
      <UIcon name="i-lucide-loader-2" class="size-8 animate-spin text-orange-500" />
      <p class="text-sm font-medium">Loading activity data…</p>
    </div>

    <!-- === SECTION: Not Found State === -->
    <div v-else-if="!activity" class="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center text-slate-300 no-print">
      <div class="text-5xl mb-4">📭</div>
      <h2 class="text-xl font-bold text-white mb-2">Activity not found</h2>
      <p class="text-slate-400 text-sm mb-6">
        No activity with slug <code class="bg-slate-800 px-2 py-0.5 rounded text-orange-400">{{ slug }}</code> was found in the <code class="bg-slate-800 px-2 py-0.5 rounded text-orange-400">_activities</code> collection.
      </p>
      <UButton to="/admin" color="primary" variant="solid" size="md" icon="i-lucide-arrow-left" class="font-bold rounded-xl">
        Back to Admin
      </UButton>
    </div>

    <!-- === SECTION: Poster Render Workspace === -->
    <template v-else>

      <!-- Facebook Format -->
      <template v-if="format === 'facebook'">
        <component 
          v-if="resolvedFacebookPoster" 
          :is="resolvedFacebookPoster" 
          :activity="activity" 
        />
      </template>

      <!-- Paged.js Format -->
      <template v-else-if="format === 'pagedjs'">
        <div class="max-w-6xl mx-auto p-4 sm:p-6 no-print">
          <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 class="text-base font-bold text-white mb-1">Paged.js A4 Print Preview</h3>
              <p class="text-xs text-slate-400 max-w-xl">
                Polished layout rendering standard HTML/CSS exactly as it will print on physical paper. Paged.js handles all margins and dimensions natively.
              </p>
            </div>
            <UButton
              color="primary"
              variant="solid"
              size="sm"
              icon="i-lucide-printer"
              class="font-bold rounded-xl cursor-pointer shrink-0"
              @click="printIframe"
            >
              Print Poster (Paged.js)
            </UButton>
          </div>
          <div class="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-white">
            <iframe 
              ref="iframeRef"
              :src="`/admin/${slug}?clean=true`" 
              class="w-full h-[85vh] border-none" 
            />
          </div>
        </div>
      </template>

      <!-- Typst Format -->
      <template v-else-if="format === 'typst'">
        <div class="max-w-6xl mx-auto p-4 sm:p-6 no-print">
          <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 class="text-base font-bold text-white mb-1">Typst Compiled Vector PDF</h3>
              <p class="text-xs text-slate-400 max-w-xl">
                Generated dynamically using Typst's modern typesetting CLI. Zero print engine/browser inconsistencies.
              </p>
            </div>
            <div class="flex items-center gap-2 flex-wrap">
              <UButton
                as="a"
                href="/posters/msi-seminar-workshop-2026.pdf"
                download
                color="primary"
                variant="solid"
                size="sm"
                icon="i-lucide-download"
                class="font-bold rounded-xl"
              >
                Download PDF (Vector)
              </UButton>
              <UButton
                as="a"
                href="/posters/msi-seminar-workshop-2026.png"
                download
                color="neutral"
                variant="outline"
                size="sm"
                icon="i-lucide-download"
                class="font-bold rounded-xl"
              >
                Download PNG (300 DPI)
              </UButton>
            </div>
          </div>
          <div class="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-white">
            <iframe src="/posters/msi-seminar-workshop-2026.pdf" class="w-full h-[85vh] border-none" />
          </div>
        </div>
      </template>

      <!-- Portrait Format (Default) -->
      <template v-else-if="format === 'portrait' || !format">
        <component 
          v-if="resolvedPoster" 
          :is="resolvedPoster" 
          :activity="activity" 
        />
        <div v-else class="p-12 text-center text-slate-400 no-print">
          <p>No portrait poster component mapped for <code>{{ activity.posterComponent }}</code>.</p>
        </div>
      </template>

    </template>

  </div>
</template>
