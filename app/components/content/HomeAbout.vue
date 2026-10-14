<script setup lang="ts">
const props = defineProps<{
  headline?: string
  subtitle?: string
  paragraph1?: string
  paragraph2?: string
  degree1Label?: string
  degree1Value?: string
  degree2Label?: string
  degree2Value?: string
}>()

const pageData = inject('pageData', null) as any
const page = computed(() => pageData?.page?.value ?? {})
const { t } = useI18n()

const displayHeadline = computed(() => props.headline ?? page.value.about?.headline)
const displaySubtitle = computed(() => props.subtitle ?? page.value.about?.subtitle)
const displayParagraph1 = computed(() => props.paragraph1 ?? page.value.about?.paragraph1)
const displayParagraph2 = computed(() => props.paragraph2 ?? page.value.about?.paragraph2)
const displayDegree1Label = computed(() => props.degree1Label ?? t('home.degree1'))
const displayDegree1Value = computed(() => props.degree1Value ?? t('home.degree1_value'))
const displayDegree2Label = computed(() => props.degree2Label ?? t('home.degree2'))
const displayDegree2Value = computed(() => props.degree2Value ?? t('home.degree2_value'))
</script>

<template>
  <section class="py-20 bg-white">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      <!-- Left: Text -->
      <div class="flex flex-col">
        <h2 v-if="displayHeadline" class="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
          {{ displayHeadline }}
        </h2>
        <div v-if="displaySubtitle" class="inline-block text-xs font-bold tracking-widest uppercase text-primary-600 mb-6">
          {{ displaySubtitle }}
        </div>
        <p v-if="displayParagraph1" class="text-sm sm:text-base text-slate-600 leading-relaxed mb-4">
          {{ displayParagraph1 }}
        </p>
        <p v-if="displayParagraph2" class="text-sm sm:text-base text-slate-600 leading-relaxed">
          {{ displayParagraph2 }}
        </p>
      </div>

      <!-- Right: Degree Card -->
      <div class="flex justify-center">
        <UCard
          variant="outline"
          class="shadow-xl overflow-hidden border border-slate-200/80 rounded-3xl w-full max-w-md"
          :ui="{
            header: 'bg-msi-navy p-8 flex items-center justify-center',
            body: 'p-6 sm:p-8 flex flex-col gap-5'
          }"
        >
          <template #header>
            <NuxtImg src="/Logo/LOGO_MSI_Full_color.png" alt="MSI" class="h-20 sm:h-24 w-auto object-contain brightness-0 invert" />
          </template>

          <div class="flex items-start gap-4">
            <div class="size-3.5 rounded-full bg-sky-500 mt-1 shrink-0 ring-4 ring-sky-100" />
            <div>
              <div class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">{{ displayDegree1Label }}</div>
              <div class="text-base font-semibold text-msi-navy leading-snug">{{ displayDegree1Value }}</div>
            </div>
          </div>

          <div class="h-px bg-slate-100" />

          <div class="flex items-start gap-4">
            <div class="size-3.5 rounded-full bg-primary-500 mt-1 shrink-0 ring-4 ring-orange-100" />
            <div>
              <div class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">{{ displayDegree2Label }}</div>
              <div class="text-base font-semibold text-msi-navy leading-snug">{{ displayDegree2Value }}</div>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </section>
</template>
