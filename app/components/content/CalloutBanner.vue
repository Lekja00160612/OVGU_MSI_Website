<!--
  Component: CalloutBanner
  Description: Universal callout and gateway banner component across academic & student life pages.
  Variants: 'navy' (elevated institutional gradient) | 'white' (floating clean card)
  Nuxt UI Primitives: UButton, UBadge, UIcon.
  Design System: Tailwind CSS v4, zero custom scoped CSS, 100% mobile responsive down to 360px.
-->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  badge?: string
  title: string
  description?: string
  to?: string
  href?: string
  buttonText: string
  buttonIcon?: string
  variant?: 'navy' | 'white'
  icon?: string
  borderAccent?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'navy',
  buttonIcon: 'i-lucide-arrow-right',
  borderAccent: true
})

const isExternal = computed(() => {
  if (props.href) return true
  if (props.to && props.to.startsWith('http')) return true
  return false
})

const targetLink = computed(() => props.to || props.href || '#')
</script>

<template>
  <!-- === VARIANT: Institutional Navy Gradient === -->
  <div
    v-if="variant === 'navy'"
    class="relative overflow-hidden rounded-3xl text-white p-6 sm:p-8 md:p-10 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 group"
    :class="[
      'bg-gradient-to-br from-msi-navy via-msi-navy-light/90 to-msi-navy',
      borderAccent ? 'border-l-8 border-l-primary-500' : 'border border-white/10'
    ]"
  >
    <!-- Ambient Backdrop Glows for Floating Depth -->
    <div class="absolute -right-16 -top-16 w-72 h-72 bg-primary-500/15 rounded-full blur-3xl pointer-events-none" />
    <div class="absolute -left-16 -bottom-16 w-72 h-72 bg-secondary-500/10 rounded-full blur-3xl pointer-events-none" />

    <!-- Left: Content & Highlighted Words -->
    <div class="relative z-10 flex flex-col gap-2 max-w-2xl">
      <div v-if="badge" class="flex items-center gap-2">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/20 text-orange-400 text-xs font-black uppercase tracking-wider">
          <UIcon v-if="icon" :name="icon" class="size-3.5" />
          <span>{{ badge }}</span>
        </span>
      </div>

      <h3 class="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
        {{ title }}
      </h3>

      <p v-if="description" class="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl">
        {{ description }}
      </p>

      <slot />
    </div>

    <!-- Right: High-Contrast Primary CTA Button -->
    <div class="relative z-10 shrink-0 self-start md:self-center">
      <UButton
        :to="!isExternal ? targetLink : undefined"
        :href="isExternal ? targetLink : undefined"
        :external="isExternal"
        :target="isExternal && !targetLink.startsWith('mailto:') ? '_blank' : undefined"
        color="primary"
        variant="solid"
        size="lg"
        :trailing-icon="buttonIcon"
        class="font-extrabold shadow-lg hover:shadow-orange-500/25 transition-all text-white px-6 py-3 rounded-full cursor-pointer whitespace-nowrap active:scale-[0.98]"
      >
        {{ buttonText }}
      </UButton>
    </div>
  </div>

  <!-- === VARIANT: Floating Clean White Card === -->
  <div
    v-else
    class="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 md:p-10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group"
  >
    <!-- Left: Highlighted Leading Icon & Text -->
    <div class="flex items-start gap-4 sm:gap-5">
      <div
        v-if="icon"
        class="size-12 sm:size-14 rounded-2xl bg-orange-50 text-primary-600 flex items-center justify-center shrink-0 ring-1 ring-orange-200/60 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300 mt-1 sm:mt-0 shadow-xs"
      >
        <UIcon :name="icon" class="size-6 sm:size-7" />
      </div>

      <div class="flex flex-col gap-1.5">
        <span v-if="badge" class="text-xs font-black uppercase tracking-wider text-primary-600">
          {{ badge }}
        </span>

        <h3 class="text-lg sm:text-xl md:text-2xl font-black text-slate-900 group-hover:text-primary-600 transition-colors tracking-tight leading-snug">
          {{ title }}
        </h3>

        <p v-if="description" class="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
          {{ description }}
        </p>

        <slot />
      </div>
    </div>

    <!-- Right: High-Contrast CTA Button -->
    <div class="shrink-0 self-start sm:self-center">
      <UButton
        :to="!isExternal ? targetLink : undefined"
        :href="isExternal ? targetLink : undefined"
        :external="isExternal"
        :target="isExternal && !targetLink.startsWith('mailto:') ? '_blank' : undefined"
        color="primary"
        variant="solid"
        size="md"
        :trailing-icon="buttonIcon"
        class="font-extrabold shadow-sm hover:shadow-md transition-all text-white px-5 py-2.5 rounded-full cursor-pointer whitespace-nowrap active:scale-[0.98]"
      >
        {{ buttonText }}
      </UButton>
    </div>
  </div>
</template>
