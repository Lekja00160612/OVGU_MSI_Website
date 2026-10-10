<script setup lang="ts">
interface ScheduleRow {
  day: string
  time: string
  mode: string
  location: string
  hours: string
}

const props = defineProps<{
  headline?: string
  badge?: string
  subtitle?: string
  description?: string
  contact?: string
  website?: string
  schedule?: ScheduleRow[]
  totalHours?: string | number
}>()

const pageData = inject('pageData', null) as any
const page = computed(() => pageData?.page?.value ?? {})
const { t } = useI18n()

const displayHeadline = computed(() => props.headline ?? page.value.hybrid?.headline)
const displayBadge = computed(() => props.badge ?? page.value.hybrid?.badge)
const displaySubtitle = computed(() => props.subtitle ?? page.value.hybrid?.subtitle)
const displayDescription = computed(() => props.description ?? page.value.hybrid?.description)
const displayContact = computed(() => props.contact ?? page.value.hybrid?.contact)
const displayWebsite = computed(() => props.website ?? page.value.hybrid?.website)
const displaySchedule = computed(() => props.schedule ?? page.value.hybrid?.schedule ?? [])
const displayTotalHours = computed(() => props.totalHours ?? page.value.hybrid?.totalHours ?? '20')
</script>

<template>
  <section class="py-20 bg-slate-50 border-t border-slate-200" id="hybrid">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        <!-- Left: Text info -->
        <div class="flex flex-col">
          <UBadge
            v-if="displayBadge"
            color="primary"
            variant="subtle"
            size="md"
            class="font-bold tracking-wider uppercase mb-3 w-fit"
          >
            {{ displayBadge }}
          </UBadge>
          <h2 v-if="displayHeadline" class="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
            {{ displayHeadline }}
          </h2>
          <p v-if="displaySubtitle" class="text-xs sm:text-sm font-bold uppercase tracking-wider text-primary-600 mb-4">
            {{ displaySubtitle }}
          </p>
          <p v-if="displayDescription" class="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
            {{ displayDescription }}
          </p>
          <div class="flex flex-wrap gap-4 text-xs sm:text-sm font-semibold text-slate-700">
            <span v-if="displayContact" class="flex items-center gap-1.5"><UIcon name="i-lucide-phone" class="size-4 text-slate-400" /><span>{{ displayContact }}</span></span>
            <span v-if="displayWebsite" class="flex items-center gap-1.5"><UIcon name="i-lucide-globe" class="size-4 text-slate-400" /><span>{{ displayWebsite }}</span></span>
          </div>
        </div>

        <!-- Right: Schedule Card -->
        <UCard
          variant="outline"
          class="border-slate-200/80 shadow-lg rounded-3xl bg-white"
          :ui="{ body: 'p-6 sm:p-7 flex flex-col gap-4' }"
        >
          <div class="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span class="text-3xl font-extrabold text-primary-600">{{ displayTotalHours }}</span>
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500 ml-2">{{ t('home.academic_hours') }}</span>
            </div>
            <UBadge color="secondary" variant="subtle" size="sm" class="font-bold">
              WS 2026/2027
            </UBadge>
          </div>
          <div class="flex flex-col gap-3">
            <div
              v-for="row in displaySchedule"
              :key="row.day"
              class="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border transition-all"
              :class="row.mode === 'Online' || row.mode === 'Trực tuyến'
                ? 'bg-sky-50/50 border-sky-100'
                : 'bg-orange-50/50 border-orange-100'"
            >
              <div class="flex items-center gap-3">
                <div class="font-bold text-sm text-slate-900 min-w-20">{{ row.day }}</div>
                <div>
                  <div class="text-xs font-semibold text-slate-700">{{ row.time }}</div>
                  <div class="text-xs text-slate-500">{{ row.location }}</div>
                </div>
              </div>
              <div class="flex items-center gap-2 mt-2 sm:mt-0 justify-end">
                <UBadge
                  :color="row.mode === 'Online' || row.mode === 'Trực tuyến' ? 'secondary' : 'primary'"
                  variant="subtle"
                  size="xs"
                  class="font-bold"
                >
                  {{ row.mode }}
                </UBadge>
                <span class="text-xs font-semibold text-slate-500">{{ row.hours }}</span>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </section>
</template>
