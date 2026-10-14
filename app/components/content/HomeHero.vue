<script setup lang="ts">
const props = defineProps<{
  badge?: string
  headline?: string
  backgroundImage?: string
  applyUrl?: string
  scholarshipsUrl?: string
}>()

const pageData = inject('pageData', null) as any
const page = computed(() => pageData?.page?.value ?? {})
const localePath = pageData?.localePath ?? ((path: string) => path)
const { t } = useI18n()

const displayBadge = computed(() => props.badge ?? page.value.hero?.badge)
const displayHeadline = computed(() => props.headline ?? page.value.hero?.headline)
const displayBackgroundImage = computed(() => props.backgroundImage ?? page.value.hero?.backgroundImage)
const displayApplyUrl = computed(() => props.applyUrl ?? 'https://apply.vgu.edu.vn/en')
const displayScholarshipsUrl = computed(() => props.scholarshipsUrl ?? '/tuition-scholarships')
</script>

<template>
  <section class="relative min-h-[60vh] md:min-h-[85vh] flex items-center justify-center bg-cover bg-no-repeat bg-[center_30%]" :style="{ backgroundImage: `url(${displayBackgroundImage})` }">
    <div class="absolute inset-0 bg-gradient-to-b from-msi-dark/90 via-msi-dark/70 to-msi-dark/95" />
    <div class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-20 flex flex-col items-center text-center">
      <UBadge
        v-if="displayBadge"
        color="neutral"
        variant="subtle"
        size="lg"
        class="bg-white/15 text-white border border-white/30 backdrop-blur-md font-bold px-4 py-1.5 rounded-full uppercase tracking-wider text-xs"
      >
        {{ displayBadge }}
      </UBadge>
      
      <h1 v-if="displayHeadline" class="font-extrabold text-white text-3xl sm:text-5xl md:text-6xl tracking-tight leading-tight my-6 max-w-4xl text-balance drop-shadow-md">
        {{ displayHeadline }}
      </h1>
      
      <div class="flex items-center gap-4 sm:gap-6 my-6 bg-white/95 backdrop-blur-md px-6 py-2.5 rounded-2xl shadow-lg border border-white/40">
        <NuxtImg src="/Logo/VGU_Logo.png" alt="VGU" class="h-7 sm:h-9 w-auto object-contain" />
        <span class="text-slate-400 font-bold text-lg select-none">×</span>
        <NuxtImg src="/Logo/OVGU_Logo.png" alt="OVGU" class="h-7 sm:h-9 w-auto object-contain" />
      </div>

      <div class="flex flex-col sm:flex-row items-center gap-4 mt-6">
        <UButton
          :to="displayApplyUrl.startsWith('http') ? displayApplyUrl : localePath(displayApplyUrl)"
          :external="displayApplyUrl.startsWith('http')"
          :target="displayApplyUrl.startsWith('http') ? '_blank' : undefined"
          size="xl"
          color="primary"
          variant="solid"
          trailing-icon="i-lucide-arrow-right"
          class="font-bold shadow-xl hover:-translate-y-0.5 transition-all text-white px-8 py-3.5 rounded-full cursor-pointer"
        >
          {{ t('home.apply_now') }}
        </UButton>
        <UButton
          :to="localePath(displayScholarshipsUrl)"
          size="xl"
          color="neutral"
          variant="outline"
          class="font-bold bg-white/10 hover:bg-white text-white hover:text-msi-dark border-2 border-white/40 hover:border-white backdrop-blur-md shadow-md hover:-translate-y-0.5 transition-all px-8 py-3.5 rounded-full cursor-pointer"
        >
          {{ t('home.view_scholarships') }}
        </UButton>
      </div>
    </div>
  </section>
</template>
