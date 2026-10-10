<!--
  Component: ProseImg
  Description: Custom image renderer for Nuxt Content prose markdown with optional bleed, subtle hover zoom, and caption support.
-->
<script setup lang="ts">
import { computed, useAttrs } from 'vue'

const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  },
  width: {
    type: [String, Number],
    default: undefined
  },
  height: {
    type: [String, Number],
    default: undefined
  },
  align: {
    type: String,
    default: 'center' // 'center' | 'left' | 'right'
  },
  fit: {
    type: String,
    default: 'cover' // 'cover' | 'contain' | 'fill' | 'none'
  },
  overlay: {
    type: [Boolean, String],
    default: true
  },
  bleed: {
    type: [Boolean, String],
    default: false
  },
  caption: {
    type: [Boolean, String],
    default: true
  }
})

const attrs = useAttrs()

// Determine if overlay should show
const showOverlay = computed(() => {
  if (props.overlay === false || props.overlay === 'false') return false
  if (attrs['no-overlay'] !== undefined && attrs['no-overlay'] !== 'false' && attrs['no-overlay'] !== false) return false
  if (typeof attrs.class === 'string' && attrs.class.includes('no-overlay')) return false
  return true
})

// Determine if caption should show
const showCaption = computed(() => {
  if (props.caption === false || props.caption === 'false') return false
  if (attrs['no-caption'] !== undefined && attrs['no-caption'] !== 'false' && attrs['no-caption'] !== false) return false
  if (typeof attrs.class === 'string' && attrs.class.includes('no-caption')) return false
  return true
})

// Handle custom dimensions and alignment styles dynamically
const containerStyles = computed(() => {
  const styles: Record<string, string> = {}
  
  if (props.width) {
    styles.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  } else {
    styles.width = '100%'
  }
  
  if (props.height) {
    styles.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }
  
  return styles
})

// Determine if image should bleed out to card margins
const isBleed = computed(() => {
  if (props.bleed === true || props.bleed === 'true') return true
  if (attrs.bleed === true || attrs.bleed === 'true' || attrs.bleed === '') return true
  if (typeof attrs.class === 'string' && attrs.class.includes('bleed')) return true
  return false
})
</script>

<template>
  <figure 
    :class="[
      'block max-w-full my-8 transition-all',
      isBleed ? '-mx-6 sm:-mx-10 w-[calc(100%+3rem)] sm:w-[calc(100%+5rem)] max-w-none' : '',
      props.align === 'left' ? 'mr-auto ml-0' : props.align === 'right' ? 'ml-auto mr-0' : 'mx-auto'
    ]"
    :style="containerStyles"
  >
    <div class="group relative block w-full rounded-2xl overflow-hidden shadow-xs border border-slate-200 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
      <NuxtImg 
        :src="src" 
        :alt="alt" 
        :width="width" 
        :height="height" 
        :style="{ objectFit: fit, height: height ? '100%' : 'auto' }"
        class="w-full max-w-full h-auto block transition-transform duration-400 group-hover:scale-[1.015]"
        loading="lazy"
        v-bind="attrs"
      />
      <div 
        v-if="showOverlay" 
        class="absolute inset-0 bg-gradient-to-b from-transparent to-[#1e3a5f]/10 pointer-events-none mix-blend-multiply opacity-0 group-hover:opacity-50 transition-opacity duration-300" 
        aria-hidden="true" 
      />
    </div>
    <figcaption v-if="alt && showCaption" class="mt-3 text-xs sm:text-sm text-slate-500 text-center italic leading-relaxed px-4">
      {{ alt }}
    </figcaption>
  </figure>
</template>
