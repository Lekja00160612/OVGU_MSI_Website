<script setup lang="ts">
const props = defineProps<{
  headline?: string
  recentActivities?: any[]
}>()

const pageData = inject('pageData', null) as any
const page = computed(() => pageData?.page?.value ?? {})
const injectedActivities = computed(() => pageData?.recentActivities?.value ?? [])
const localePath = pageData?.localePath ?? ((path: string) => path)
const { t, locale } = useI18n()

// Local fallback query if injected recentActivities is not available
const localActivities = ref<any[]>([])
if (!pageData) {
  const { data } = await useAsyncData(`msi-home-activities-${locale.value}`, () =>
    queryCollection('activities').all()
  )
  if (data.value) {
    const highlighted = data.value.filter(a => a.highlighted === true || a.meta?.highlighted === true)
    const sortByDateDesc = (a: any, b: any) => {
      const dateA = a.date || a.meta?.date || ''
      const dateB = b.date || b.meta?.date || ''
      return dateB.localeCompare(dateA)
    }
    const sortedHighlighted = [...highlighted].sort(sortByDateDesc)
    if (sortedHighlighted.length >= 4) {
      localActivities.value = sortedHighlighted.slice(0, 4)
    } else {
      const nonHighlighted = data.value.filter(a => !(a.highlighted === true || a.meta?.highlighted === true))
      const sortedNonHighlighted = [...nonHighlighted].sort(sortByDateDesc)
      localActivities.value = [...sortedHighlighted, ...sortedNonHighlighted].slice(0, 4)
    }
  }
}

const displayHeadline = computed(() => props.headline ?? page.value.activities?.headline ?? t('nav.academic_activities'))
const displayActivities = computed(() => props.recentActivities ?? (pageData ? injectedActivities.value : localActivities.value))
</script>

<template>
  <section class="py-20 bg-slate-50 border-t border-slate-200">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto mb-12">
        <h2 v-if="displayHeadline" class="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {{ displayHeadline }}
        </h2>
      </div>

      <div v-if="displayActivities?.length" class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
        <!-- Main large card (7 cols) -->
        <NuxtLink
          v-if="displayActivities[0]"
          :to="localePath(displayActivities[0].path.replace('/_activities', '/academic-activities'))"
          class="lg:col-span-7 group relative rounded-3xl overflow-hidden min-h-[360px] lg:min-h-[460px] flex flex-col justify-end p-6 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <NuxtImg :src="displayActivities[0].meta?.image || displayActivities[0].image" class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
          <div class="relative z-10 flex flex-col gap-2">
            <UBadge
              color="primary"
              variant="solid"
              size="xs"
              class="font-bold uppercase tracking-wider rounded-full shadow-xs w-fit"
            >
              {{ displayActivities[0].meta?.category || displayActivities[0].category }}
            </UBadge>
            <h3 class="text-xl sm:text-2xl font-bold text-white group-hover:text-primary-300 transition-colors leading-snug">
              {{ displayActivities[0].title }}
            </h3>
            <p class="text-xs sm:text-sm text-slate-200/90 line-clamp-2 leading-relaxed">
              {{ displayActivities[0].meta?.description || displayActivities[0].description }}
            </p>
          </div>
        </NuxtLink>

        <!-- Side column (5 cols) -->
        <div class="lg:col-span-5 flex flex-col gap-6">
          <NuxtLink
            v-if="displayActivities[1]"
            :to="localePath(displayActivities[1].path.replace('/_activities', '/academic-activities'))"
            class="group relative rounded-3xl overflow-hidden min-h-[200px] flex-1 flex flex-col justify-end p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <NuxtImg :src="displayActivities[1].meta?.image || displayActivities[1].image" class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div class="relative z-10 flex flex-col gap-1.5">
              <UBadge
                color="primary"
                variant="solid"
                size="xs"
                class="font-bold uppercase tracking-wider rounded-full shadow-xs w-fit"
              >
                {{ displayActivities[1].meta?.category || displayActivities[1].category }}
              </UBadge>
              <h3 class="text-base sm:text-lg font-bold text-white group-hover:text-primary-300 transition-colors leading-snug">
                {{ displayActivities[1].title }}
              </h3>
            </div>
          </NuxtLink>

          <!-- Bottom row: cards 3 & 4 -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <NuxtLink
              v-if="displayActivities[2]"
              :to="localePath(displayActivities[2].path.replace('/_activities', '/academic-activities'))"
              class="group relative rounded-3xl overflow-hidden min-h-[160px] flex flex-col justify-end p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <NuxtImg :src="displayActivities[2].meta?.image || displayActivities[2].image" class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div class="relative z-10">
                <h3 class="text-xs sm:text-sm font-bold text-white group-hover:text-primary-300 transition-colors line-clamp-2 leading-snug">
                  {{ displayActivities[2].title }}
                </h3>
              </div>
            </NuxtLink>

            <NuxtLink
              v-if="displayActivities[3]"
              :to="localePath(displayActivities[3].path.replace('/_activities', '/academic-activities'))"
              class="group relative rounded-3xl overflow-hidden min-h-[160px] flex flex-col justify-end p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <NuxtImg :src="displayActivities[3].meta?.image || displayActivities[3].image" class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div class="relative z-10">
                <h3 class="text-xs sm:text-sm font-bold text-white group-hover:text-primary-300 transition-colors line-clamp-2 leading-snug">
                  {{ displayActivities[3].title }}
                </h3>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="text-center">
        <UButton
          :to="localePath('/academic-activities')"
          size="lg"
          color="primary"
          variant="solid"
          trailing-icon="i-lucide-arrow-right"
          class="font-bold shadow-md rounded-full px-8 py-3 text-white cursor-pointer"
        >
          {{ t('home.explore_all') }}
        </UButton>
      </div>
    </div>
  </section>
</template>
