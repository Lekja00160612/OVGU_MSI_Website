<script setup lang="ts">
const props = defineProps<{
  headline?: string
  description?: string
  badge?: string
  backgroundImage?: string
  primaryCta?: string
  primaryLink?: string
  secondaryCta?: string
  secondaryLink?: string
}>()

const pageData = inject('pageData', null) as any
const page = computed(() => pageData?.page?.value ?? {})
const localePath = pageData?.localePath ?? ((path: string) => path)

const displayHeadline = computed(() => props.headline ?? page.value.cta?.headline)
const displayDescription = computed(() => props.description ?? page.value.cta?.description)
const displayBadge = computed(() => props.badge ?? page.value.cta?.badge)
const displayBackgroundImage = computed(() => props.backgroundImage ?? page.value.cta?.backgroundImage)
const displayPrimaryCta = computed(() => props.primaryCta ?? page.value.cta?.primaryCta)
const displayPrimaryLink = computed(() => props.primaryLink ?? page.value.cta?.primaryLink ?? '/')
const displaySecondaryCta = computed(() => props.secondaryCta ?? page.value.cta?.secondaryCta)
const displaySecondaryLink = computed(() => props.secondaryLink ?? page.value.cta?.secondaryLink ?? '/')
</script>

<template>
  <section
    class="relative bg-cover bg-center bg-no-repeat overflow-hidden"
    :style="{ backgroundImage: `url(${displayBackgroundImage})` }"
  >
    <div class="absolute inset-0 bg-gradient-to-br from-msi-dark/95 via-msi-dark/90 to-msi-navy/90" />
    <div class="relative z-10 text-center py-20 px-4 sm:px-6 max-w-4xl mx-auto flex flex-col items-center gap-6">
      <UBadge
        v-if="displayBadge"
        color="neutral"
        variant="subtle"
        size="lg"
        class="bg-white/15 text-white border border-white/30 backdrop-blur-md font-bold px-4 py-1.5 rounded-full uppercase tracking-wider text-xs"
      >
        {{ displayBadge }}
      </UBadge>
      
      <h2 v-if="displayHeadline" class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-2xl text-balance">
        {{ displayHeadline }}
      </h2>
      
      <p v-if="displayDescription" class="text-sm sm:text-base text-slate-200/85 max-w-xl leading-relaxed">
        {{ displayDescription }}
      </p>
      
      <div class="flex flex-wrap gap-4 justify-center mt-2">
        <UButton
          :to="localePath(displayPrimaryLink)"
          size="xl"
          color="primary"
          variant="solid"
          trailing-icon="i-lucide-arrow-right"
          class="font-bold shadow-xl hover:-translate-y-0.5 transition-all text-white px-8 py-3.5 rounded-full cursor-pointer"
        >
          {{ displayPrimaryCta }}
        </UButton>
        <UButton
          :to="localePath(displaySecondaryLink)"
          size="xl"
          color="neutral"
          variant="outline"
          class="font-bold bg-white/10 hover:bg-white text-white hover:text-msi-dark border-2 border-white/40 hover:border-white backdrop-blur-md shadow-md hover:-translate-y-0.5 transition-all px-8 py-3.5 rounded-full cursor-pointer"
        >
          {{ displaySecondaryCta }}
        </UButton>
      </div>
    </div>
  </section>
</template>
