<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { thesisTopics } from '~/data/thesisTopics'
import { getFacultyAnchor, getModuleSlug } from '~/utils/faculty'

const route = useRoute()
const { locale, t } = useI18n()
const localePath = useLocalePath()

// Fetch all modules from Nuxt Content
const { data: allModules } = await useAsyncData('handbook-all-modules', () =>
  queryCollection('modules').all()
)

// Active filter states: default to 15 Core Modules per user requirement
const activeType = ref<'all' | 'core' | 'elective'>('core')
const activeSemester = ref<number | 'all'>('all')
const onlyGermanLecturer = ref(false)
const searchQuery = ref('')

// Modal & selected module state
const selectedModule = ref<any | null>(null)
const isDetailModalOpen = ref(false)
const activeMobilePath = ref<string | null>(null)

function openModal(mod: any) {
  selectedModule.value = mod
  isDetailModalOpen.value = true
}

function selectModule(mod: any) {
  selectedModule.value = mod
  if (activeMobilePath.value === mod.path) {
    activeMobilePath.value = null
  } else {
    activeMobilePath.value = mod.path
  }
  const slug = getModuleSlug(mod)
  if (typeof window !== 'undefined' && window.history && slug) {
    window.history.replaceState(window.history.state, '', `${window.location.pathname}#${slug}`)
  }
}

function selectModuleAndSyncHash(mod: any) {
  selectedModule.value = mod
  const slug = getModuleSlug(mod)
  if (typeof window !== 'undefined' && window.history && slug) {
    window.history.replaceState(window.history.state, '', `${window.location.pathname}#${slug}`)
  }
}

const isElective = (mod: any) => {
  return !!(mod.is_elective || mod.meta?.is_elective)
}

const hasGermanLecturer = (mod: any) => {
  const val = mod.german_lecturer ?? mod.meta?.german_lecturer
  return val === true || val === 'true'
}

const getSemester = (mod: any): number => {
  return Number(mod.semester ?? mod.meta?.semester ?? 1)
}

const getSemesterColor = (sem: number): string => {
  if (sem === 1) return '#1E3A5F' // Navy
  if (sem === 2) return '#009FDF' // Cyan
  if (sem === 3) return '#E87722' // Orange
  return '#2E5280' // Deep Navy
}

const getPdfs = (mod: any) => mod?.pdfs || mod?.meta?.pdfs || []
const getLinks = (mod: any) => mod?.links || mod?.meta?.links || []
const getImages = (mod: any) => mod?.images || mod?.meta?.images || []
const getLecturers = (mod: any): string[] => mod?.lecturers || mod?.meta?.lecturers || []

// Media safe extraction helpers
const getPdfUrl = (item: any): string => {
  if (!item) return ''
  if (typeof item === 'string') return item
  return item.url || ''
}

const getPdfTitle = (item: any): string => {
  if (!item) return 'Document (PDF)'
  if (typeof item === 'string') {
    const filename = item.split('/').pop() || item
    try {
      return decodeURIComponent(filename)
    } catch {
      return filename
    }
  }
  return item.title || item.url?.split('/').pop() || 'Document (PDF)'
}

const getLinkUrl = (item: any): string => {
  if (!item) return ''
  if (typeof item === 'string') return item
  return item.url || ''
}

const getLinkTitle = (item: any): string => {
  if (!item) return 'External Link'
  if (typeof item === 'string') return item
  return item.title || item.url || 'External Link'
}

const getImageUrl = (item: any): string => {
  if (!item) return ''
  if (typeof item === 'string') return item
  return item.url || item.src || ''
}

const getImageCaption = (item: any): string => {
  if (!item || typeof item === 'string') return ''
  return item.title || item.caption || item.alt || ''
}

// Check if module has rich media to display the Details button
const hasDetailedMedia = (mod: any): boolean => {
  if (!mod) return false
  return getPdfs(mod).length > 0 || getImages(mod).length > 0 || getLinks(mod).length > 0
}

// Thesis connection helper: strictly check if thesis topics exist
const getRelatedThesisCount = (moduleTitle?: string): number => {
  if (!moduleTitle) return 0
  const norm = moduleTitle.toLowerCase().trim()
  return thesisTopics.filter(t => t.module.toLowerCase().trim() === norm).length
}

// Faculty connection helper: canonical anchor link
const getLecturerPartnerLink = (lecturer: string): string => {
  const anchor = getFacultyAnchor(lecturer)
  return `${localePath('/academic-partners')}#${anchor}`
}

// Helper: Split sentences by dot/period into clean, structured lines
const formatDotLines = (text?: string): string[] => {
  if (!text) return []
  return text
    .split(/(?<=[.!?])\s+|\s*[;•·]\s*|\n+/)
    .map(line => line.trim())
    .filter(line => line.length > 2)
}

// Filtered modules
const filteredModules = computed(() => {
  if (!allModules.value) return []
  return allModules.value.filter((mod: any) => {
    // Type filter
    if (activeType.value === 'core' && isElective(mod)) return false
    if (activeType.value === 'elective' && !isElective(mod)) return false

    // Semester filter
    if (activeSemester.value !== 'all' && getSemester(mod) !== activeSemester.value) return false

    // German lecturer filter
    if (onlyGermanLecturer.value && !hasGermanLecturer(mod)) return false

    // Search query
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      const titleMatch = (mod.title || '').toLowerCase().includes(q)
      const descMatch = (mod.description || mod.meta?.description || '').toLowerCase().includes(q)
      const lectMatch = getLecturers(mod).some(l => l.toLowerCase().includes(q))
      if (!titleMatch && !descMatch && !lectMatch) return false
    }

    return true
  }).sort((a: any, b: any) => {
    const semA = getSemester(a)
    const semB = getSemester(b)
    if (semA !== semB) return semA - semB
    return (a.title || '').localeCompare(b.title || '')
  })
})

const coreCount = computed(() => allModules.value?.filter(m => !isElective(m)).length || 0)
const electiveCount = computed(() => allModules.value?.filter(m => isElective(m)).length || 0)

function resetFilters() {
  activeType.value = 'core'
  activeSemester.value = 'all'
  onlyGermanLecturer.value = false
  searchQuery.value = ''
}

// Clean canonical URL synchronization: handle #slug or legacy ?module=
function syncModuleFromRoute() {
  if (!allModules.value || allModules.value.length === 0) return

  let targetSlug = ''

  if (route.hash) {
    targetSlug = route.hash.replace(/^#/, '').trim().toLowerCase()
  }

  if (!targetSlug && (route.query.module || route.query.search)) {
    const raw = ((route.query.module as string) || (route.query.search as string)).trim()
    targetSlug = getModuleSlug(raw)
  }

  if (targetSlug) {
    const target = allModules.value.find(
      (m: any) => getModuleSlug(m) === targetSlug ||
                  m.title?.toLowerCase() === targetSlug ||
                  m.path?.toLowerCase().endsWith(`/${targetSlug}`)
    )
    if (target) {
      activeType.value = 'all'
      selectedModule.value = target
      activeMobilePath.value = target.path

      nextTick(() => {
        const el = document.getElementById(targetSlug)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      })
      return
    }
  }

  if (!selectedModule.value && filteredModules.value.length > 0) {
    selectedModule.value = filteredModules.value[0]
  }
}

onMounted(() => {
  syncModuleFromRoute()
})

watch(() => [route.hash, route.query], () => {
  syncModuleFromRoute()
})
</script>

<template>
  <div class="flex flex-col gap-8 font-sans">

    <!-- === SECTION 1: Search & Filter Toolbar === -->
    <div class="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm flex flex-col gap-4">
      <!-- Row 1: Course Type Tabs & Official PDF Button -->
      <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <!-- Type Tabs (All / Core / Elective) -->
        <div class="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl shrink-0 overflow-x-auto no-scrollbar">
          <button
            type="button"
            class="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer select-none whitespace-nowrap"
            :class="activeType === 'core'
              ? 'bg-orange-500 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'"
            @click="activeType = 'core'"
          >
            {{ locale === 'vi' ? '15 Môn Cốt Lõi' : '15 Core Modules' }} ({{ coreCount }})
          </button>
          <button
            type="button"
            class="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer select-none whitespace-nowrap"
            :class="activeType === 'elective'
              ? 'bg-orange-500 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'"
            @click="activeType = 'elective'"
          >
            {{ locale === 'vi' ? 'Môn Tự Chọn' : 'Electives Pool' }} ({{ electiveCount }})
          </button>
          <button
            type="button"
            class="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer select-none whitespace-nowrap"
            :class="activeType === 'all'
              ? 'bg-orange-500 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'"
            @click="activeType = 'all'"
          >
            {{ locale === 'vi' ? 'Tất cả môn' : 'All Courses' }} ({{ allModules?.length || 0 }})
          </button>
        </div>

        <!-- Official Handbook PDF CTA Button -->
        <div class="flex items-center gap-2.5">
          <a
            href="/Documents/MODULE CATALOGUE MSI.pdf"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-xs hover:shadow-md shrink-0 cursor-pointer"
          >
            <UIcon name="i-lucide-file-text" class="size-4 shrink-0 text-orange-400" />
            <span>{{ locale === 'vi' ? 'Tải Cẩm Nang Môn Học (PDF)' : 'Official Handbook (PDF)' }}</span>
          </a>
        </div>
      </div>

      <!-- Row 2: Search Input & Quick Filters -->
      <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <!-- Search Input -->
        <div class="w-full md:w-80">
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            size="sm"
            :placeholder="locale === 'vi' ? 'Tìm tên môn, giảng viên...' : 'Search course title, lecturer...'"
            class="w-full"
          />
        </div>

        <!-- Semester & German Lecturer Chips -->
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-bold text-slate-500 mr-1 uppercase tracking-wider">
            {{ locale === 'vi' ? 'Học kỳ:' : 'Semester:' }}
          </span>
          <button
            v-for="sem in ['all', 1, 2, 3]"
            :key="sem"
            type="button"
            class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer select-none"
            :class="activeSemester === sem
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            @click="activeSemester = sem as any"
          >
            {{ sem === 'all' ? (locale === 'vi' ? 'Tất cả' : 'All') : `Sem ${sem}` }}
          </button>

          <!-- Visiting German Professor Toggle -->
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border select-none ml-1"
            :class="onlyGermanLecturer
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-1 ring-emerald-400/40'
              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'"
            @click="onlyGermanLecturer = !onlyGermanLecturer"
          >
            <span class="size-2 rounded-full" :class="onlyGermanLecturer ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'" />
            <span>{{ locale === 'vi' ? 'Giáo sư OVGU' : 'Visiting German Professors' }}</span>
          </button>

          <UButton
            v-if="activeType !== 'core' || activeSemester !== 'all' || onlyGermanLecturer || searchQuery"
            color="neutral"
            variant="ghost"
            size="xs"
            icon="i-lucide-x"
            @click="resetFilters"
          >
            {{ locale === 'vi' ? 'Xóa lọc' : 'Reset' }}
          </UButton>
        </div>
      </div>
    </div>

    <!-- === SECTION 2: Desktop 2-Column Split Layout === -->
    <div class="hidden lg:flex gap-8 items-start">

      <!-- Left Column: Redesigned Module Cards Grid -->
      <div class="flex-[1.25] grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          v-for="mod in filteredModules"
          :id="getModuleSlug(mod)"
          :key="mod.path"
          type="button"
          class="relative p-5 sm:p-6 rounded-3xl text-left transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[185px] border group scroll-mt-28"
          :class="[
            mod.title === 'Master Thesis'
              ? (selectedModule?.path === mod.path
                  ? 'bg-gradient-to-br from-[#1E3A5F] via-[#244670] to-[#1E3A5F] text-white ring-2 ring-orange-500 shadow-xl -translate-y-1 scale-[1.01]'
                  : 'bg-gradient-to-br from-[#1E3A5F] to-[#2E5280] text-white shadow-sm hover:shadow-lg hover:-translate-y-1 border-slate-800')
              : (selectedModule?.path === mod.path
                  ? 'bg-white text-slate-900 border-orange-300 ring-2 ring-orange-500 shadow-xl -translate-y-1 scale-[1.01]'
                  : 'bg-white text-slate-900 border-slate-200/90 shadow-sm hover:shadow-lg hover:border-slate-300 hover:-translate-y-1')
          ]"
          :style="{
            borderLeftWidth: selectedModule?.path === mod.path ? '8px' : '6px',
            borderLeftColor: mod.title === 'Master Thesis' ? '#E87722' : getSemesterColor(getSemester(mod))
          }"
          @click="selectModuleAndSyncHash(mod)"
        >
          <!-- Top Badges Row -->
          <div class="flex items-center justify-between gap-1.5 w-full mb-3 flex-wrap">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span
                class="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-lg tracking-wider"
                :class="isElective(mod) ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-700'"
              >
                {{ isElective(mod) ? 'Elective Pool' : `Semester ${getSemester(mod)}` }}
              </span>
              <span
                v-if="hasGermanLecturer(mod)"
                class="text-[10px] font-black uppercase px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 tracking-wider flex items-center gap-1"
                title="Taught by Visiting German Professor from OVGU Magdeburg"
              >
                <span>🇩🇪</span>
                <span>OVGU</span>
              </span>
            </div>

            <!-- Thesis Badge if open topics exist -->
            <span
              v-if="getRelatedThesisCount(mod.title) > 0"
              class="text-[10px] font-extrabold px-2 py-0.5 rounded-lg bg-orange-50 text-orange-700 border border-orange-200 tracking-tight flex items-center gap-1"
            >
              <UIcon name="i-lucide-graduation-cap" class="size-3 text-orange-500" />
              <span>{{ getRelatedThesisCount(mod.title) }} Topics</span>
            </span>
            <span
              v-else-if="mod.title === 'Master Thesis'"
              class="text-[10px] font-black uppercase px-2 py-0.5 rounded-lg bg-orange-500 text-white tracking-wider"
            >
              30 CP · Capstone
            </span>
          </div>

          <!-- Course Name -->
          <h4
            class="text-sm sm:text-base font-extrabold uppercase tracking-wide leading-snug line-clamp-2"
            :class="mod.title === 'Master Thesis' ? 'text-white' : 'text-slate-900 group-hover:text-orange-600 transition-colors'"
          >
            {{ mod.title }}
          </h4>

          <!-- Multi-line Content: Key structured outcomes -->
          <div
            v-if="formatDotLines(mod.description || mod.meta?.description).length > 0"
            class="mt-3 pt-3 border-t flex flex-col gap-1.5 text-xs"
            :class="mod.title === 'Master Thesis' ? 'border-white/20 text-slate-200' : 'border-slate-100 text-slate-600'"
          >
            <div
              v-for="(point, pIdx) in formatDotLines(mod.description || mod.meta?.description).slice(0, 3)"
              :key="pIdx"
              class="flex items-start gap-1.5 leading-relaxed"
            >
              <span class="text-orange-500 font-bold shrink-0 mt-0.5">▸</span>
              <span class="line-clamp-2">{{ point.replace(/\.$/, '') }}</span>
            </div>
          </div>

          <!-- Bottom Credits Tag & Instructor -->
          <div
            class="mt-3 pt-2.5 flex items-center justify-between text-[11px] font-bold"
            :class="mod.title === 'Master Thesis' ? 'text-slate-200' : 'text-slate-500'"
          >
            <span>{{ mod.title === 'Master Thesis' ? '30 ECTS Capstone' : '5 ECTS Credits' }}</span>
            <span v-if="getLecturers(mod).length > 0" class="truncate max-w-[150px] flex items-center gap-1 text-slate-700">
              <UIcon name="i-lucide-user" class="size-3 text-orange-500 shrink-0" />
              <span>{{ getLecturers(mod)[0] }}</span>
            </span>
          </div>
        </button>
      </div>

      <!-- Right Column: Redesigned Sticky Detail Panel -->
      <div class="flex-1 sticky top-28 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl min-h-[500px] max-h-[82vh] overflow-y-auto flex flex-col justify-between">
        <div v-if="selectedModule" class="flex flex-col gap-5">
          <!-- Header -->
          <div class="border-b border-slate-100 pb-4">
            <div class="flex items-center gap-2 mb-2 flex-wrap">
              <UBadge
                :color="isElective(selectedModule) ? 'primary' : 'neutral'"
                variant="subtle"
                size="xs"
                class="font-black uppercase"
              >
                {{ isElective(selectedModule) ? 'Elective Module' : `Core Module · Semester ${getSemester(selectedModule)}` }}
              </UBadge>
              <UBadge color="neutral" variant="outline" size="xs" class="font-bold">
                {{ selectedModule.title === 'Master Thesis' ? '30 ECTS Credits' : '5 ECTS Credits' }}
              </UBadge>
              <UBadge
                v-if="hasGermanLecturer(selectedModule)"
                color="success"
                variant="subtle"
                size="xs"
                class="font-bold"
              >
                <UIcon name='i-lucide-plane' class='size-3.5 text-emerald-600 inline mr-1' />
                {{ locale === 'vi' ? 'Giảng viên từ Đức (OVGU)' : 'Taught by Visiting German Professor' }}
              </UBadge>
            </div>

            <h3 class="text-xl sm:text-2xl font-black text-[#1E3A5F] leading-tight">
              {{ selectedModule.title }}
            </h3>
          </div>

          <!-- Description & Learning Outcomes broken into structured lines -->
          <div class="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-none">
            <div v-if="formatDotLines(selectedModule.description || selectedModule.meta?.description).length > 0" class="space-y-2">
              <div
                v-for="(line, lIdx) in formatDotLines(selectedModule.description || selectedModule.meta?.description)"
                :key="lIdx"
                class="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors"
              >
                <span class="text-orange-500 font-extrabold text-sm shrink-0 mt-0.5">▸</span>
                <span class="text-slate-700 leading-relaxed font-medium">{{ line.replace(/\.$/, '') }}</span>
              </div>
            </div>
            <p v-else class="italic text-slate-400">
              Detailed module descriptors covering foundational scientific principles, laboratory experiments, and German-standard engineering qualifications.
            </p>

            <!-- Lecturers List with Normalized Clickable Chips -->
            <div v-if="getLecturers(selectedModule).length > 0" class="mt-5 pt-4 border-t border-slate-100">
              <span class="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-2.5">
                {{ locale === 'vi' ? 'Giảng viên phụ trách:' : 'Teaching Faculty:' }}
              </span>
              <div class="flex flex-wrap gap-2">
                <NuxtLink
                  v-for="lecturer in getLecturers(selectedModule)"
                  :key="lecturer"
                  :to="getLecturerPartnerLink(lecturer)"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-orange-50 border border-slate-200/80 hover:border-orange-300 text-slate-800 hover:text-orange-600 font-bold text-xs transition-all duration-200 group/lec shadow-2xs hover:shadow-xs"
                  :title="`Meet ${lecturer} on Academic Faculty page`"
                >
                  <UIcon name="i-lucide-user" class="size-3.5 text-orange-500" />
                  <span>{{ lecturer }}</span>
                  <UIcon name="i-lucide-arrow-up-right" class="size-3 text-slate-400 group-hover/lec:text-orange-500 group-hover/lec:translate-x-0.5 group-hover/lec:-translate-y-0.5 transition-transform" />
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Normalized Action Buttons Container (Only display buttons with real content!) -->
          <div class="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2.5 flex-wrap">
            <!-- Button 1: Official Handbook (PDF) -->
            <a
              href="/Documents/MODULE CATALOGUE MSI.pdf"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-xs hover:shadow-md cursor-pointer select-none"
            >
              <UIcon name="i-lucide-book-open" class="size-4 text-orange-400" />
              <span>{{ locale === 'vi' ? 'Xem trong Cẩm nang' : 'View in Handbook' }}</span>
            </a>

            <!-- Button 2: More Detail & Media (ONLY IF CONTENT EXISTS) -->
            <button
              v-if="hasDetailedMedia(selectedModule)"
              type="button"
              class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 transition-all shadow-xs hover:shadow-md cursor-pointer select-none"
              @click="openModal(selectedModule)"
            >
              <UIcon name="i-lucide-layers" class="size-4" />
              <span>{{ locale === 'vi' ? 'Tài liệu chi tiết' : 'More Detail & Media' }}</span>
            </button>

            <!-- Button 3: Master Thesis Topics (ONLY IF TOPICS ACTUALLY EXIST FOR THIS MODULE) -->
            <NuxtLink
              v-if="getRelatedThesisCount(selectedModule.title) > 0"
              :to="`${localePath('/program-structure/thesis')}#${getModuleSlug(selectedModule)}`"
              class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#1E3A5F] hover:bg-[#152a45] transition-all shadow-xs hover:shadow-md cursor-pointer select-none"
              :title="`Explore ${getRelatedThesisCount(selectedModule.title)} open thesis projects in ${selectedModule.title}`"
            >
              <UIcon name="i-lucide-graduation-cap" class="size-4 text-orange-400" />
              <span>{{ locale === 'vi' ? 'Đề Tài Luận Văn' : 'Thesis Topics' }}</span>
              <UBadge
                color="secondary"
                variant="solid"
                size="xs"
                class="ml-0.5 px-1.5 py-0.2 rounded-full font-extrabold text-[10px]"
              >
                {{ getRelatedThesisCount(selectedModule.title) }}
              </UBadge>
            </NuxtLink>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="flex flex-col items-center justify-center text-center text-slate-400 py-16 gap-3">
          <UIcon name="i-lucide-mouse-pointer-click" class="size-12 text-slate-300" />
          <p class="text-xs sm:text-sm font-medium">
            {{ locale === 'vi' ? 'Nhấp chọn một môn học để xem đề cương chi tiết' : 'Click a course module to view its syllabus and German-standard learning outcomes' }}
          </p>
        </div>
      </div>

    </div>

    <!-- === SECTION 3: Mobile & Tablet Accordion Layout === -->
    <div class="lg:hidden flex flex-col gap-3">
      <div
        v-for="mod in filteredModules"
        :id="'mobile-' + getModuleSlug(mod)"
        :key="'mobile-' + mod.path"
        class="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden"
        :style="{
          borderLeftWidth: '6px',
          borderLeftColor: mod.title === 'Master Thesis' ? '#E87722' : getSemesterColor(getSemester(mod))
        }"
      >
        <!-- Mobile Header (Tap to expand/collapse) -->
        <button
          type="button"
          class="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left cursor-pointer"
          @click="selectModule(mod)"
        >
          <div class="flex flex-col min-w-0">
            <div class="flex items-center gap-1.5 mb-1.5 flex-wrap">
              <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {{ isElective(mod) ? 'Elective Pool' : `Semester ${getSemester(mod)}` }}
              </span>
              <span
                v-if="mod.title === 'Master Thesis'"
                class="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-orange-500 text-white"
              >
                30 CP
              </span>
              <span
                v-else-if="hasGermanLecturer(mod)"
                class="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-0.5"
              >
                <span>🇩🇪</span>
                <span>OVGU</span>
              </span>
              <span
                v-if="getRelatedThesisCount(mod.title) > 0"
                class="text-[9px] font-extrabold px-2 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-200"
              >
                {{ getRelatedThesisCount(mod.title) }} Topics
              </span>
            </div>
            <span class="text-sm font-extrabold text-slate-900 leading-snug line-clamp-2">
              {{ mod.title }}
            </span>
          </div>

          <UIcon
            name="i-lucide-chevron-down"
            class="size-5 text-slate-400 shrink-0 transition-transform duration-200"
            :class="{ 'rotate-180 text-orange-600': activeMobilePath === mod.path }"
          />
        </button>

        <!-- Mobile Inline Expanded Body -->
        <div
          v-if="activeMobilePath === mod.path"
          class="p-4 pt-2 border-t border-slate-100 bg-white flex flex-col gap-3 text-xs text-slate-600"
        >
          <div v-if="formatDotLines(mod.description || mod.meta?.description).length > 0" class="space-y-1.5 my-1">
            <div
              v-for="(point, pIdx) in formatDotLines(mod.description || mod.meta?.description)"
              :key="pIdx"
              class="flex items-start gap-1.5 leading-relaxed"
            >
              <span class="text-orange-500 font-bold shrink-0 mt-0.5">▸</span>
              <span>{{ point.replace(/\.$/, '') }}</span>
            </div>
          </div>

          <!-- Mobile Teaching Faculty with links -->
          <div v-if="getLecturers(mod).length > 0" class="pt-2 border-t border-slate-100">
            <span class="text-[10px] font-bold uppercase text-slate-400 block mb-1">
              {{ locale === 'vi' ? 'Giảng viên phụ trách:' : 'Teaching Faculty:' }}
            </span>
            <div class="font-semibold text-slate-700 flex flex-wrap gap-2">
              <NuxtLink
                v-for="lecturer in getLecturers(mod)"
                :key="lecturer"
                :to="getLecturerPartnerLink(lecturer)"
                class="hover:text-orange-600 hover:underline inline-flex items-center gap-1 text-orange-700 font-bold bg-orange-50/60 px-2.5 py-1 rounded-lg border border-orange-200/60"
              >
                <span>{{ lecturer }}</span>
                <UIcon name="i-lucide-arrow-up-right" class="size-3 text-orange-400" />
              </NuxtLink>
            </div>
          </div>

          <!-- Mobile Normalized Action Buttons -->
          <div class="pt-2 flex items-center gap-2 flex-wrap">
            <a
              href="/Documents/MODULE CATALOGUE MSI.pdf"
              target="_blank"
              class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800"
            >
              <span>Handbook (PDF)</span>
            </a>
            <button
              v-if="hasDetailedMedia(mod)"
              type="button"
              class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 cursor-pointer"
              @click="openModal(mod)"
            >
              <span>Details &amp; Files</span>
            </button>
            <NuxtLink
              v-if="getRelatedThesisCount(mod.title) > 0"
              :to="`${localePath('/program-structure/thesis')}#${getModuleSlug(mod)}`"
              class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#1E3A5F] hover:bg-[#152a45]"
            >
              <UIcon name="i-lucide-graduation-cap" class="size-3.5 text-orange-400" />
              <span>Thesis ({{ getRelatedThesisCount(mod.title) }})</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- === SECTION 4: Media & Syllabus Detail Modal === -->
    <Teleport to="body">
      <div
        v-if="isDetailModalOpen && selectedModule"
        class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
        @click.self="isDetailModalOpen = false"
      >
        <div class="bg-white w-full max-w-2xl max-h-[85vh] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
          <!-- Modal Header -->
          <div class="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50">
            <div>
              <div class="flex items-center gap-2 mb-1.5 flex-wrap">
                <UBadge color="primary" variant="subtle" size="xs" class="font-bold">
                  {{ isElective(selectedModule) ? 'Elective' : `Sem ${getSemester(selectedModule)}` }}
                </UBadge>
                <UBadge color="neutral" variant="outline" size="xs" class="font-bold">
                  {{ selectedModule.title === 'Master Thesis' ? '30 ECTS' : '5 ECTS' }}
                </UBadge>
                <UBadge v-if="hasGermanLecturer(selectedModule)" color="success" variant="subtle" size="xs" class="font-bold">
                  🇩🇪 Visiting German Professor
                </UBadge>
              </div>
              <h3 class="text-lg sm:text-xl font-black text-slate-900">
                {{ selectedModule.title }}
              </h3>
            </div>
            <button
              type="button"
              class="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              @click="isDetailModalOpen = false"
              aria-label="Close modal"
            >
              <UIcon name="i-lucide-x" class="size-5 block" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <!-- Overview -->
            <div>
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Module Overview</h4>
              <div v-if="formatDotLines(selectedModule.description || selectedModule.meta?.description).length > 0" class="space-y-2">
                <div
                  v-for="(point, pIdx) in formatDotLines(selectedModule.description || selectedModule.meta?.description)"
                  :key="pIdx"
                  class="flex items-start gap-2"
                >
                  <span class="text-orange-500 font-bold shrink-0 mt-0.5">▸</span>
                  <span>{{ point.replace(/\.$/, '') }}</span>
                </div>
              </div>
              <p v-else>{{ selectedModule.description || selectedModule.meta?.description || 'Course description not provided.' }}</p>
            </div>

            <!-- Documents & Syllabi -->
            <div v-if="getPdfs(selectedModule).length > 0">
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                {{ locale === 'vi' ? 'Tài liệu & Đề cương' : 'Documents & Syllabi' }}
              </h4>
              <div class="flex flex-col gap-2">
                <a
                  v-for="(pdf, idx) in getPdfs(selectedModule)"
                  :key="idx"
                  :href="getPdfUrl(pdf)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-orange-50/80 border border-orange-200 text-orange-800 font-bold hover:bg-orange-100 transition-colors group"
                >
                  <div class="flex items-center gap-2 min-w-0">
                    <UIcon name="i-lucide-file-down" class="size-4 shrink-0 text-orange-600" />
                    <span class="truncate">{{ getPdfTitle(pdf) }}</span>
                  </div>
                  <UIcon name="i-lucide-download" class="size-3.5 shrink-0 text-orange-400 group-hover:text-orange-700" />
                </a>
              </div>
            </div>

            <!-- Academic Resources & Links -->
            <div v-if="getLinks(selectedModule).length > 0">
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                {{ locale === 'vi' ? 'Tài nguyên & Hoạt động Học thuật' : 'Academic Resources & Activities' }}
              </h4>
              <div class="flex flex-col gap-2">
                <a
                  v-for="(link, idx) in getLinks(selectedModule)"
                  :key="idx"
                  :href="getLinkUrl(link)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium hover:text-orange-600 hover:border-orange-200 transition-colors group"
                >
                  <div class="flex items-center gap-2 min-w-0">
                    <UIcon name="i-lucide-external-link" class="size-4 shrink-0 text-orange-500" />
                    <span class="truncate font-semibold">{{ getLinkTitle(link) }}</span>
                  </div>
                  <span v-if="link.description" class="text-xs text-slate-400 shrink-0 hidden sm:inline">{{ link.description }}</span>
                </a>
              </div>
            </div>

            <!-- Image Gallery -->
            <div v-if="getImages(selectedModule).length > 0">
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                {{ locale === 'vi' ? 'Hình ảnh Phòng thí nghiệm' : 'Laboratory & Equipment Gallery' }}
              </h4>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div
                  v-for="(img, idx) in getImages(selectedModule)"
                  :key="idx"
                  class="flex flex-col gap-1"
                >
                  <NuxtImg
                    :src="getImageUrl(img)"
                    :alt="getImageCaption(img) || selectedModule.title"
                    class="rounded-xl border border-slate-200 object-cover h-28 w-full"
                    loading="lazy"
                  />
                  <span v-if="getImageCaption(img)" class="text-[10px] text-slate-500 truncate">
                    {{ getImageCaption(img) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Teaching Faculty in Modal with Links -->
            <div v-if="getLecturers(selectedModule).length > 0" class="pt-3 border-t border-slate-100">
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                {{ locale === 'vi' ? 'Giảng viên phụ trách' : 'Teaching Faculty' }}
              </h4>
              <div class="flex flex-wrap gap-2">
                <NuxtLink
                  v-for="lecturer in getLecturers(selectedModule)"
                  :key="lecturer"
                  :to="getLecturerPartnerLink(lecturer)"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-orange-50 text-slate-800 hover:text-orange-600 font-bold text-xs border border-slate-200 hover:border-orange-200 transition-colors group"
                  @click="isDetailModalOpen = false"
                >
                  <UIcon name="i-lucide-user" class="size-3.5 text-orange-500" />
                  <span>{{ lecturer }}</span>
                  <UIcon name="i-lucide-arrow-up-right" class="size-3 text-slate-400 group-hover:text-orange-500" />
                </NuxtLink>
              </div>
            </div>

            <!-- Master Thesis Topics in Modal: ONLY IF MODULE HAS THESIS TOPICS -->
            <div
              v-if="getRelatedThesisCount(selectedModule.title) > 0"
              class="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/80 flex items-center justify-between gap-3 flex-wrap"
            >
              <div class="flex items-center gap-2.5">
                <UIcon name="i-lucide-graduation-cap" class="size-5 text-orange-500 shrink-0" />
                <div>
                  <div class="text-xs font-bold text-slate-900">
                    {{ locale === 'vi' ? 'Đề Tài Luận Văn Thạc Sĩ Liên Quan' : 'Related Master Thesis Research Topics' }}
                  </div>
                  <div class="text-[11px] text-slate-600">
                    {{ locale === 'vi'
                      ? `Có ${getRelatedThesisCount(selectedModule.title)} đề tài nghiên cứu mở cho môn học này.`
                      : `${getRelatedThesisCount(selectedModule.title)} research project offers available for this module.`
                    }}
                  </div>
                </div>
              </div>
              <NuxtLink
                :to="`${localePath('/program-structure/thesis')}#${getModuleSlug(selectedModule)}`"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1E3A5F] hover:bg-[#152a45] text-white font-bold text-xs transition-colors shadow-2xs"
                @click="isDetailModalOpen = false"
              >
                <span>{{ locale === 'vi' ? 'Xem Đề Tài' : 'View Thesis Topics' }}</span>
                <UIcon name="i-lucide-arrow-right" class="size-3.5" />
              </NuxtLink>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
            <UButton
              color="neutral"
              variant="solid"
              size="sm"
              class="font-bold rounded-xl"
              @click="isDetailModalOpen = false"
            >
              Close
            </UButton>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>
