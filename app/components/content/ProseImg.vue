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

// Determine if we should show the overlay.
// Defaults to true, can be disabled by overlay="false" or having 'no-overlay' attribute/class
const showOverlay = computed(() => {
  if (props.overlay === false || props.overlay === 'false') return false
  if (attrs['no-overlay'] !== undefined && attrs['no-overlay'] !== 'false' && attrs['no-overlay'] !== false) return false
  if (typeof attrs.class === 'string' && attrs.class.includes('no-overlay')) return false
  return true
})

// Determine if we should show the caption.
const showCaption = computed(() => {
  if (props.caption === false || props.caption === 'false') return false
  if (attrs['no-caption'] !== undefined && attrs['no-caption'] !== 'false' && attrs['no-caption'] !== false) return false
  if (typeof attrs.class === 'string' && attrs.class.includes('no-caption')) return false
  return true
})

// Handle custom dimensions and alignment styles dynamically
const containerStyles = computed(() => {
  const styles: Record<string, string> = {}
  
  // Width handling
  if (props.width) {
    styles.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  } else {
    styles.width = '100%'
  }
  
  // Height handling
  if (props.height) {
    styles.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }
  
  // Alignment handling
  if (props.align === 'left') {
    styles.marginLeft = '0'
    styles.marginRight = 'auto'
  } else if (props.align === 'right') {
    styles.marginLeft = 'auto'
    styles.marginRight = '0'
  } else {
    styles.marginLeft = 'auto'
    styles.marginRight = 'auto'
  }
  
  return styles
})

// Determine if we should bleed the image out to the card margins.
// Disabled by default, can be enabled by bleed="true" or class="bleed".
const isBleed = computed(() => {
  if (props.bleed === true || props.bleed === 'true') return true
  if (attrs.bleed === true || attrs.bleed === 'true' || attrs.bleed === '') return true
  if (typeof attrs.class === 'string' && attrs.class.includes('bleed')) return true
  return false
})

// Bind class names
const containerClasses = computed(() => {
  return {
    'prose-img-figure': true,
    'bleed': isBleed.value,
    'align-left': props.align === 'left',
    'align-right': props.align === 'right',
    'align-center': props.align !== 'left' && props.align !== 'right'
  }
})
</script>

<template>
  <figure 
    :class="containerClasses"
    :style="containerStyles"
  >
    <div class="prose-img-wrapper" :class="{ 'has-overlay': showOverlay }">
      <NuxtImg 
        :src="src" 
        :alt="alt" 
        :width="width"
        :height="height"
        :style="{ objectFit: fit, height: height ? '100%' : 'auto' }"
        class="prose-img"
        loading="lazy"
        v-bind="attrs"
      />
      <div v-if="showOverlay" class="prose-img-overlay" aria-hidden="true" />
    </div>
    <figcaption v-if="alt && showCaption" class="prose-img-caption">
      {{ alt }}
    </figcaption>
  </figure>
</template>

<style scoped>
.prose-img-figure {
  display: block;
  max-width: 100%;
  margin: 2rem auto;
}

.prose-img-figure.bleed {
  margin-left: calc(-1 * var(--card-padding-x, 0px)) !important;
  margin-right: calc(-1 * var(--card-padding-x, 0px)) !important;
  width: calc(100% + 2 * var(--card-padding-x, 0px)) !important;
  max-width: none !important;
}

.prose-img-wrapper {
  position: relative;
  display: block;
  width: 100%;
  border-radius: var(--radius-lg, 12px);
  overflow: hidden;
  box-shadow: var(--shadow-sm, 0 2px 8px rgba(0, 0, 0, 0.06));
  border: 1px solid var(--color-gray-200, #e9ecef);
  transition: transform 300ms var(--ease-out), box-shadow 300ms var(--ease-out);
}

.prose-img-wrapper:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md, 0 6px 20px rgba(0, 0, 0, 0.1));
}

.prose-img {
  width: 100%;
  max-width: 100%;
  height: auto;
  display: block;
  transition: transform 400ms var(--ease-out);
}

.prose-img-wrapper:hover .prose-img {
  transform: scale(1.015);
}

/* Subtle overlay to unify styling: very light gradient with deep navy theme tint */
.prose-img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg, 
    rgba(30, 58, 95, 0) 0%, 
    rgba(30, 58, 95, 0.08) 100%
  );
  pointer-events: none;
  mix-blend-mode: multiply;
  transition: opacity 300ms var(--ease-out);
}

.prose-img-wrapper:hover .prose-img-overlay {
  opacity: 0.5;
}

.prose-img-caption {
  margin-top: 0.75rem;
  font-size: 0.85rem;
  color: var(--color-gray-600, #6c757d);
  text-align: center;
  font-style: italic;
  line-height: 1.4;
  padding: 0 1rem;
}
</style>
