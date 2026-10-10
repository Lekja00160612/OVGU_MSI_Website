<!--
  Component: HomeCurriculum
  Description: Interactive homepage curriculum explorer with semester tabs and module breakdown cards.
  Data Sources: Nuxt Content 'modules' collection or injected pageData.
  Nuxt UI Primitives: UButton, UBadge, UIcon.
-->
<script setup lang="ts">
interface Semester {
  number: number
  label: string
  theme: string
  color: string
}

const props = defineProps<{
  headline?: string
  subtitle?: string
  semesters?: Semester[]
}>()

const pageData = inject('pageData', null) as any
const page = computed(() => pageData?.page?.value ?? {})
const injectedModules = computed(() => pageData?.allModules?.value ?? [])
const localePath = pageData?.localePath ?? ((path: string) => path)
const { t, locale } = useI18n()

// If allModules was not injected, query it locally
const localModules = ref<any[]>([])
if (!pageData) {
  const { data } = await useAsyncData(`msi-curriculum-modules-${locale.value}`, () =>
    queryCollection('modules').all()
  )
  if (data.value) {
    localModules.value = data.value
  }
}

const allModules = computed(() => pageData ? injectedModules.value : localModules.value)

const displayHeadline = computed(() => props.headline ?? page.value.curriculum?.headline)
const displaySubtitle = computed(() => props.subtitle ?? page.value.curriculum?.subtitle)
const displaySemesters = computed(() => props.semesters ?? page.value.curriculum?.semesters ?? [])

const activeTab = ref(0)
const currentSemester = computed(() => displaySemesters.value[activeTab.value] ?? null)

const currentModules = computed(() => {
  if (!allModules.value || !currentSemester.value) return []
  return allModules.value.filter(m => 
    ((m.semester || m.meta?.semester) === currentSemester.value!.number) && 
    !(m.is_elective || m.meta?.is_elective)
  )
})
</script>

<template>
  <section class="py-20 bg-white">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto mb-10">
        <h2 v-if="displayHeadline" class="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
          {{ displayHeadline }}
        </h2>
        <p v-if="displaySubtitle" class="text-sm sm:text-base text-slate-600 leading-relaxed">
          {{ displaySubtitle }}
        </p>
      </div>

      <!-- Semester Tabs -->
      <div class="flex gap-3 overflow-x-auto justify-center pb-4 mb-8">
        <UButton
          v-for="(s, i) in displaySemesters"
          :key="s.number"
          :variant="activeTab === i ? 'solid' : 'outline'"
          color="primary"
          class="rounded-2xl px-5 py-3.5 flex flex-col items-center gap-1 font-semibold transition-all shadow-xs shrink-0 cursor-pointer"
          @click="activeTab = i"
        >
          <span class="text-sm font-bold">{{ s.label }}</span>
          <span class="text-xs opacity-80">{{ s.theme }}</span>
        </UButton>
      </div>

      <!-- Semester Panel -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-1.5"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1.5"
        mode="out-in"
      >
        <div
          v-if="currentSemester"
          :key="activeTab"
          class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden max-w-4xl mx-auto"
        >
          <div
            class="p-6 sm:p-8 text-white flex items-center gap-6"
            :style="{ background: `linear-gradient(135deg, ${currentSemester.color} 0%, ${currentSemester.color}DD 100%)` }"
          >
            <div class="text-4xl sm:text-5xl font-extrabold opacity-95">S{{ currentSemester.number }}</div>
            <div>
              <div class="text-xs font-bold uppercase tracking-wider opacity-85">{{ currentSemester.label }}</div>
              <div class="text-xl sm:text-2xl font-bold">{{ currentSemester.theme }}</div>
            </div>
          </div>
          
          <div class="p-6 sm:p-8 flex flex-col gap-6">
            <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <li v-for="mod in currentModules" :key="mod.path" class="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center gap-3 text-sm font-semibold text-slate-800">
                <span class="size-2.5 rounded-full shrink-0" :style="{ background: currentSemester.color }" />
                <span>{{ mod.title }}</span>
              </li>
            </ul>
            
            <div class="pt-4 border-t border-slate-100 text-center">
              <UButton
                :to="localePath('/program-structure')"
                size="lg"
                color="primary"
                variant="solid"
                trailing-icon="i-lucide-arrow-right"
                class="font-bold shadow-md rounded-full px-8 py-3 text-white cursor-pointer"
              >
                {{ t('home.explore_full_program') }}
              </UButton>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </section>
</template>
