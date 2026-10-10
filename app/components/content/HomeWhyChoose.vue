<script setup lang="ts">
interface FeatureItem {
  id: number
  icon: string
  title: string
  description: string
  link?: string
  featured?: boolean
}

const props = defineProps<{
  headline?: string
  subtitle?: string
  features?: FeatureItem[]
}>()

const pageData = inject('pageData', null) as any
const page = computed(() => pageData?.page?.value ?? {})
const localePath = pageData?.localePath ?? ((path: string) => path)
const { t } = useI18n()

const displayHeadline = computed(() => props.headline ?? page.value.whyChoose?.headline)
const displaySubtitle = computed(() => props.subtitle ?? page.value.whyChoose?.subtitle)
const displayFeatures = computed(() => props.features ?? page.value.whyChoose?.features ?? [])

const iconMap: Record<string, string> = {
  diploma:    'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
  lab:        'M9 3v10.5a3 3 0 003 3h0a3 3 0 003-3V3 M6.5 3h11 M8 12H5a2 2 0 00-2 2v1a4 4 0 004 4h10a4 4 0 004-4v-1a2 2 0 00-2-2h-3',
  faculty:    'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  hybrid:     'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  industry:   'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  scholarship:'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
}
</script>

<template>
  <section class="py-20 bg-slate-50 border-t border-slate-200">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto mb-12">
        <h2 v-if="displayHeadline" class="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
          {{ displayHeadline }}
        </h2>
        <p v-if="displaySubtitle" class="text-sm sm:text-base text-slate-600 leading-relaxed">
          {{ displaySubtitle }}
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <UCard
          v-for="f in displayFeatures"
          :key="f.id"
          variant="outline"
          class="hover:-translate-y-1 hover:shadow-xl transition-all duration-200 border-slate-200/80 rounded-2xl flex flex-col bg-white"
          :class="{ 'border-t-4 !border-t-primary-500 bg-gradient-to-b from-white to-primary-50/20': f.featured }"
          :ui="{ body: 'p-6 sm:p-7 flex flex-col justify-between h-full' }"
        >
          <div>
            <div class="size-12 rounded-xl bg-orange-50 flex items-center justify-center mb-4 text-orange-600">
              <svg class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path :d="iconMap[f.icon] ?? iconMap.diploma" />
              </svg>
            </div>
            <h3 class="text-base font-bold text-slate-900 mb-2">{{ f.title }}</h3>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">{{ f.description }}</p>
          </div>
          <NuxtLink v-if="f.link" :to="localePath(f.link)" class="text-xs font-bold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 mt-auto">
            {{ t('home.view_feature', { title: f.title }) }} &rarr;
          </NuxtLink>
        </UCard>
      </div>
    </div>
  </section>
</template>
