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
