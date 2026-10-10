<!--
  =============================================================================
  Component: ProseA.vue (Nuxt Content Prose Link Override)
  =============================================================================
  WHAT THIS COMPONENT IS:
    This is an automatic Nuxt Content prose override for all standard markdown
    hyperlinks written in the format `[link text](url)`.
  
  WHY IT EXISTS (CRITICAL ARCHITECTURAL PURPOSE):
    By default, @nuxt/content renders markdown links as internal <NuxtLink>.
    However, when an author links to static files like `/Documents/MODULE CATALOGUE MSI.pdf`,
    Vue Router attempts to resolve it as a client-side JavaScript route. This
    causes route resolution failures or breaks native file downloads!
    
    ProseA intercepts all markdown links:
      1. Detects static documents (.pdf, .pptx, .xlsx, .docx, /Documents/, etc.)
      2. Detects external URLs (http://, https://, mailto:, tel:)
      3. Automatically attaches `:external="true"`, `target="_blank"`, and
         `rel="noopener noreferrer"`.
         
    This guarantees that clicking any document in markdown initiates a clean,
    native browser file download in a new tab without breaking single-page routing.
  =============================================================================
-->
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  href: {
    type: String,
    default: ''
  },
  target: {
    type: String,
    default: undefined
  },
  rel: {
    type: String,
    default: undefined
  }
})

const isStaticAsset = computed(() => {
  if (!props.href) return false
  const lower = props.href.toLowerCase()
  return (
    lower.startsWith('/documents/') ||
    lower.startsWith('/images/') ||
    lower.startsWith('/thumbnail/') ||
    lower.startsWith('/logo/') ||
    lower.endsWith('.pdf') ||
    lower.endsWith('.pptx') ||
    lower.endsWith('.ppt') ||
    lower.endsWith('.docx') ||
    lower.endsWith('.doc') ||
    lower.endsWith('.xlsx') ||
    lower.endsWith('.xls') ||
    lower.endsWith('.zip')
  )
})

const isExternal = computed(() => {
  if (!props.href) return false
  return (
    isStaticAsset.value ||
    props.href.startsWith('http://') ||
    props.href.startsWith('https://') ||
    props.href.startsWith('mailto:') ||
    props.href.startsWith('tel:')
  )
})

const resolvedTarget = computed(() => {
  if (props.target) return props.target
  if (isExternal.value) return '_blank'
  return undefined
})

const resolvedRel = computed(() => {
  if (props.rel) return props.rel
  if (resolvedTarget.value === '_blank') return 'noopener noreferrer'
  return undefined
})
</script>

<template>
  <NuxtLink
    :to="href"
    :target="resolvedTarget"
    :rel="resolvedRel"
    :external="isExternal"
  >
    <slot />
  </NuxtLink>
</template>
