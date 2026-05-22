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
  }
})

const attrs = useAttrs()

// Determine if we should show the overlay.
// By default, overlay is true. It is disabled if overlay="false" or no-overlay is present.
const showOverlay = computed(() => {
  if (attrs.overlay === 'false' || attrs.overlay === false) return false
  if (attrs['no-overlay'] !== undefined && attrs['no-overlay'] !== 'false' && attrs['no-overlay'] !== false) return false
  return true
})

// Handle custom dimensions and alignment
const containerStyles = computed(() => {
  const styles: Record<string, string> = {}
  if (props.width) {
    styles.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  if (props.height) {
    styles.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }
  return styles
})
</script>

<template>
  <div 
    class="prose-img-wrapper" 
    :class="{ 'has-overlay': showOverlay }"
    :style="containerStyles"
  >
    <NuxtImg 
      :src="src" 
      :alt="alt" 
      :width="width"
      :height="height"
      class="prose-img"
      loading="lazy"
      v-bind="attrs"
    />
    <div v-if="showOverlay" class="prose-img-overlay" aria-hidden="true" />
  </div>
</template>

<style scoped>
.prose-img-wrapper {
  position: relative;
  display: block;
  width: 100%;
  max-width: 100%;
  margin: 2rem auto;
  border-radius: var(--radius-lg, 16px);
  overflow: hidden;
  box-shadow: var(--shadow-md, 0 4px 16px rgba(0, 0, 0, 0.08));
  transition: transform 300ms var(--ease-out), box-shadow 300ms var(--ease-out);
}

.prose-img-wrapper:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg, 0 12px 32px rgba(0, 0, 0, 0.12));
}

.prose-img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  border-radius: inherit;
}

/* Subtle overlay to unify styling: very light gradient with deep navy theme tint */
.prose-img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg, 
    rgba(15, 34, 64, 0.02) 0%, 
    rgba(15, 34, 64, 0.12) 100%
  );
  pointer-events: none;
  mix-blend-mode: multiply;
  transition: opacity 300ms var(--ease-out);
}

.prose-img-wrapper:hover .prose-img-overlay {
  opacity: 0.6;
}
</style>
