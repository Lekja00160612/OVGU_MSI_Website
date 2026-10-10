<!--
  Component: DefaultLayout
  Description: Global application layout featuring sticky 2-line desktop navigation, mobile slideover drawer, language switcher, invitation toast notifications, and dark navy footer.
  Data Sources: Nuxt Content 'activities' collection for dynamic event toasts.
  Nuxt UI Primitives: USlideover, UButton, UIcon, useToast.
-->
<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch, computed, ref } from 'vue'
import { useAsyncData, useToast, useRuntimeConfig, queryCollection, useHead } from '#imports'

// Global Schema.org JSON-LD Structured Data for search engines & AI agents
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': 'https://msi.vgu.edu.vn/#website',
            'url': 'https://msi.vgu.edu.vn',
            'name': 'Master of Science in Materials Science and Innovation (MSI)',
            'description': 'Official double degree Master of Science program co-delivered by Vietnamese-German University (VGU) and Otto von Guericke University Magdeburg (OVGU).',
            'inLanguage': ['en', 'vi']
          },
          {
            '@type': 'CollegeOrUniversity',
            '@id': 'https://msi.vgu.edu.vn/#vgu',
            'name': 'Vietnamese-German University',
            'alternateName': 'VGU',
            'url': 'https://vgu.edu.vn',
            'logo': 'https://msi.vgu.edu.vn/Logo/VGU_Logo.png',
            'address': {
              '@type': 'PostalAddress',
              'streetAddress': 'Ring road 4, Quarter 4, Thoi Hoa Ward',
              'addressLocality': 'Ben Cat City',
              'addressRegion': 'Binh Duong Province',
              'addressCountry': 'VN'
            }
          },
          {
            '@type': 'CollegeOrUniversity',
            '@id': 'https://msi.vgu.edu.vn/#ovgu',
            'name': 'Otto von Guericke University Magdeburg',
            'alternateName': 'OVGU',
            'url': 'https://www.ovgu.de',
            'logo': 'https://msi.vgu.edu.vn/Logo/OVGU_Logo.png',
            'address': {
              '@type': 'PostalAddress',
              'streetAddress': 'Universitätsplatz 2',
              'addressLocality': 'Magdeburg',
              'postalCode': '39106',
              'addressCountry': 'DE'
            }
          },
          {
            '@type': 'EducationalOccupationalProgram',
            '@id': 'https://msi.vgu.edu.vn/#program',
            'name': 'Master of Science in Materials Science and Innovation',
            'alternateName': 'MSI Double Master Degree',
            'description': 'A prestigious German-accredited double Master degree program co-delivered by VGU and OVGU Magdeburg, featuring block-modular hybrid schedules, DAAD scholarships, and hands-on laboratory research training.',
            'url': 'https://msi.vgu.edu.vn',
            'provider': [
              { '@id': 'https://msi.vgu.edu.vn/#vgu' },
              { '@id': 'https://msi.vgu.edu.vn/#ovgu' }
            ],
            'educationalCredentialAwarded': 'Double Master of Science (M.Sc.) Degrees from VGU and OVGU Magdeburg',
            'timeToComplete': 'P2Y',
            'numberOfCredits': 120,
            'educationalProgramMode': 'hybrid',
            'programPrerequisites': 'Bachelor degree in Engineering, Materials Science, Physics, Chemistry, or related STEM fields.',
            'offers': [
              {
                '@type': 'Offer',
                'category': 'DAAD Sur-Place Scholarship',
                'description': 'Full tuition fee waiver plus monthly living allowance during studies at VGU campus.'
              },
              {
                '@type': 'Offer',
                'category': 'DAAD Mobility Scholarship',
                'description': 'Funding for Semester 4 master thesis research stay at OVGU Magdeburg, Germany.'
              }
            ]
          }
        ]
      }))
    }
  ]
})

const { t, locale, setLocale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const mobileMenuOpen = ref(false)

// Query all invitation activities that are not expired yet
const { data: allActivities } = await useAsyncData('active-invitations-raw', () =>
  queryCollection('activities').all()
)

const activeInvitations = computed(() => {
  if (!allActivities.value) return []
  const today = new Date().toISOString().split('T')[0] // 'YYYY-MM-DD'
  return allActivities.value.filter((act: any) => {
    const isInvitation = !!act.invitation || !!act.meta?.invitation
    if (!isInvitation) return false
    const expiry = act.expiryDate || act.eventDate || act.date || ''
    return expiry >= today
  })
})

const toast = useToast()
const config = useRuntimeConfig()

const showAcademicActivitiesToast = () => {
  const path = route.path.replace(/\/$/, '')
  const isAcademicActivities = path.endsWith('/academic-activities') || path.includes('/academic-activities/')

  if (isAcademicActivities) {
    const events = activeInvitations.value
    if (!events || events.length === 0) return
    
    events.slice(0, 2).forEach((event: any) => {
      const eventTargetRoute = localePath(event.path.replace('/_activities', '/academic-activities'))
      
      // Skip showing toast if already on the detail page of this specific event
      if (route.path.replace(/\/$/, '') === eventTargetRoute.replace(/\/$/, '')) {
        return
      }
      
      const title = locale.value === 'vi' ? (event.title_vi || event.title) : event.title
      const desc = locale.value === 'vi'
        ? `Sự kiện: ${event.eventDate_vi || event.eventDate || event.date}`
        : `Upcoming: ${event.eventDate || event.date}`

      toast.add({
        id: `event-toast-${event.path.replace(/\//g, '-')}-${Date.now()}`,
        title: title,
        description: desc,
        icon: 'i-heroicons-ticket',
        color: 'primary',
        duration: config.public.eventToastDurationMs || 6000,
        close: true,
        ui: {
          root: 'relative group overflow-hidden bg-[#0f2240] shadow-[0_12px_40px_rgba(0,0,0,.55),0_2px_10px_rgba(232,119,34,.12)] rounded-xl ring-1 ring-[rgba(232,119,34,.3)] p-5 pb-7 flex gap-3.5 focus:outline-none border-l-[4px] border-l-[#e87722] items-start',
          wrapper: 'w-0 flex-1 flex flex-col',
          title: 'text-sm font-bold text-white tracking-tight pr-8',
          description: 'text-xs text-slate-300 leading-relaxed mt-1.5',
          icon: 'shrink-0 size-5 text-[#e87722] mt-0.5',
          close: 'p-0.5 text-slate-400 hover:text-[#e87722] transition-colors duration-150 absolute top-4 right-4',
          actions: 'flex gap-1.5 shrink-0 items-start mt-4'
        },
        actions: [
          {
            label: locale.value === 'vi' ? 'Xem vé →' : 'View Ticket →',
            to: eventTargetRoute,
            color: 'primary',
            variant: 'solid',
            size: 'sm',
          }
        ]
      })
    })
  }
}

onMounted(() => {
  watch(
    [() => route.path, activeInvitations],
    () => {
      showAcademicActivitiesToast()
    },
    { immediate: true }
  )
})

// Sub-routes for dropdown navigation
const futureSubLinks = computed(() => [
  { label: locale.value === 'vi' ? 'Tổng Quan Tuyển Sinh & Điều Kiện' : 'Admission & Eligibility Overview', to: localePath('/future-students'), icon: 'i-lucide-user-check' },
  { label: locale.value === 'vi' ? 'Lộ Trình Tuyển Sinh (Sơ Đồ)' : 'Application Pathways Explorer', to: localePath('/future-students/pathways'), icon: 'i-lucide-git-branch' },
  { label: locale.value === 'vi' ? 'Chia Sẻ Học Viên & Sự Nghiệp' : 'Student Experience & Career Pathways', to: localePath('/future-students/alumni'), icon: 'i-lucide-users' },
  { label: locale.value === 'vi' ? 'Học Phí & Học Bổng Toàn Phần' : 'Tuition & DAAD Scholarships', to: localePath('/tuition-scholarships'), icon: 'i-lucide-award' },
])

const programSubLinks = computed(() => [
  { label: locale.value === 'vi' ? 'Tổng Quan Khung Đào Tạo (120 ECTS)' : 'Degree Blueprint & Overview', to: localePath('/program-structure'), icon: 'i-lucide-layout-dashboard' },
  { label: locale.value === 'vi' ? 'Sổ Tay Môn Học & Đề Cương' : 'Course Handbook & Syllabi', to: localePath('/program-structure/modules'), icon: 'i-lucide-book-open' },
  { label: locale.value === 'vi' ? 'Thời Khóa Biểu Học Kỳ' : 'Semester Timetable', to: localePath('/program-structure/timetable'), icon: 'i-lucide-calendar' },
  { label: locale.value === 'vi' ? 'Đề Tài Luận Văn Tốt Nghiệp' : 'Master Thesis Topics', to: localePath('/program-structure/thesis'), icon: 'i-lucide-graduation-cap' },
])

const labsSubLinks = computed(() => [
  { label: locale.value === 'vi' ? 'Tổng Quan Phòng Thí Nghiệm & Nghiên Cứu' : 'Laboratories & Research Overview', to: localePath('/laboratories-research'), icon: 'i-lucide-flask-conical' },
  { label: locale.value === 'vi' ? '22+ Thiết Bị Phân Tích (SEM, XRD)' : 'Characterization Equipment (22+)', to: localePath('/laboratories-research/equipment'), icon: 'i-lucide-microscope' },
  { label: locale.value === 'vi' ? '6 Bộ Môn Nghiên Cứu OVGU' : 'OVGU Partner Research Chairs', to: localePath('/laboratories-research/chairs'), icon: 'i-lucide-atom' },
])

const partnersSubLinks = computed(() => [
  { label: locale.value === 'vi' ? 'Đối Tác Học Thuật (Giảng Viên & Bộ Môn)' : 'Academic Partners (Faculty & Chairs)', to: localePath('/academic-partners'), icon: 'i-lucide-graduation-cap' },
  { label: locale.value === 'vi' ? 'Đối Tác Doanh Nghiệp (Kiến Tập Thực Địa)' : 'Industrial Partners (Plant Visits & Connections)', to: localePath('/industrial-partners'), icon: 'i-lucide-building-2' },
])

const studentLifeSubLinks = computed(() => [
  { label: locale.value === 'vi' ? 'Đời Sống Sinh Viên Tại VGU' : 'Campus Life at VGU Binh Duong', to: localePath('/student-life'), icon: 'i-lucide-building-2' },
  { label: locale.value === 'vi' ? 'Hành Trình Sang Đức (OVGU)' : 'Path to Germany Relocation Guide', to: localePath('/student-life/germany-relocation'), icon: 'i-lucide-plane-takeoff' },
])

// Navigation links divided into balanced 2 rows for desktop
const navLinks = computed(() => [
  { label: t('nav.potential_candidates'), to: localePath('/future-students'), menuKey: 'future', subLinks: futureSubLinks.value },
  { label: t('nav.program_structure'), to: localePath('/program-structure'), menuKey: 'program', subLinks: programSubLinks.value },
  { label: t('nav.academic_activities'), to: localePath('/academic-activities') },
  { label: t('nav.partners_lecturers'), to: localePath('/academic-partners'), menuKey: 'partners', subLinks: partnersSubLinks.value },
  { label: t('nav.tuition_scholarships'), to: localePath('/tuition-scholarships') },
  { label: t('nav.laboratories_research'), to: localePath('/laboratories-research'), menuKey: 'labs', subLinks: labsSubLinks.value },
  { label: t('nav.student_life'), to: localePath('/student-life'), menuKey: 'life', subLinks: studentLifeSubLinks.value },
])

const navRowTop = computed(() => navLinks.value.slice(0, 4))
const navRowBottom = computed(() => navLinks.value.slice(4))

const isActive = (to: string) => route.path === to
const isLinkActive = (link: any) => {
  if (link.subLinks) {
    return route.path === link.to || route.path.startsWith(link.to + '/') || link.subLinks.some((sub: any) => route.path === sub.to || route.path.startsWith(sub.to + '/'))
  }
  return route.path === link.to
}

// Robust dropdown management: Hover preview + Click-to-pin + Click-outside
const activeDropdown = ref<string | null>(null)
const isPinnedDropdown = ref<boolean>(false)
let dropdownCloseTimer: any = null

function openDropdown(key: string) {
  if (dropdownCloseTimer) {
    clearTimeout(dropdownCloseTimer)
    dropdownCloseTimer = null
  }
  activeDropdown.value = key
}

function scheduleCloseDropdown() {
  if (isPinnedDropdown.value) return // User intentionally clicked; remain pinned open!
  if (dropdownCloseTimer) clearTimeout(dropdownCloseTimer)
  dropdownCloseTimer = setTimeout(() => {
    activeDropdown.value = null
  }, 350) // Generous 350ms window allows natural cursor movement
}

function toggleDropdown(key: string, event?: Event) {
  if (event) {
    event.stopPropagation()
  }
  if (dropdownCloseTimer) {
    clearTimeout(dropdownCloseTimer)
    dropdownCloseTimer = null
  }
  if (activeDropdown.value === key) {
    activeDropdown.value = null
    isPinnedDropdown.value = false
  } else {
    activeDropdown.value = key
    isPinnedDropdown.value = true // Pin open until clicking outside or choosing an item
  }
}

function closeDropdown() {
  if (dropdownCloseTimer) clearTimeout(dropdownCloseTimer)
  activeDropdown.value = null
  isPinnedDropdown.value = false
}

const handleGlobalClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement | null
  if (!target || !target.closest('[data-dropdown-container]')) {
    closeDropdown()
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    closeDropdown()
  }
}

onMounted(() => {
  window.addEventListener('click', handleGlobalClick)
  window.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleGlobalClick)
  window.removeEventListener('keydown', handleKeyDown)
})

watch(() => route.fullPath, () => {
  closeDropdown()
})

const mobileExpandedMap = ref<Record<string, boolean>>({
  future: false,
  program: false,
  partners: false,
  labs: false,
  life: false
})

const scrollToFooter = () => {
  const footer = document.getElementById('site-footer')
  if (footer) {
    footer.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="flex flex-col min-h-screen bg-white text-slate-900 font-sans">

    <!-- === SECTION: Sticky Header & Navigation === -->
    <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4 py-2 min-h-[72px]">

        <!-- MSI Brand Logo -->
        <NuxtLink :to="localePath('/')" class="shrink-0 flex items-center" aria-label="MSI Home">
          <div class="bg-white px-2 py-1 border-2 border-slate-100 rounded-xl shadow-xs hover:border-orange-500 hover:shadow-md transition-all -my-4 z-10">
            <NuxtImg
              src="/Logo/LOGO_MSI_Full_color.png"
              alt="MSI – Materials Science Program"
              class="h-14 sm:h-16 lg:h-18 w-auto object-contain block"
              width="210"
              height="78"
            />
          </div>
        </NuxtLink>

        <!-- Desktop Navigation: Strictly 2 equal lines, matching logo height -->
        <nav class="hidden lg:flex flex-col items-center justify-center gap-1.5 flex-1 py-1" aria-label="Main navigation">
          <!-- Row 1: 4 links -->
          <div class="flex items-center justify-center gap-1.5 flex-nowrap">
            <template v-for="link in navRowTop" :key="link.to">
              <!-- Dropdown for links with sub-routes -->
              <div
                v-if="link.subLinks"
                data-dropdown-container
                class="relative"
                @mouseenter="openDropdown(link.menuKey!)"
                @mouseleave="scheduleCloseDropdown"
              >
                <div
                  class="text-xs xl:text-sm font-semibold rounded-full transition-all duration-150 whitespace-nowrap inline-flex items-center select-none"
                  :class="isLinkActive(link)
                    ? 'bg-orange-50 text-orange-600 font-bold shadow-xs'
                    : 'text-slate-700 hover:text-orange-600 hover:bg-slate-100'"
                >
                  <NuxtLink
                    :to="link.to"
                    class="pl-2.5 pr-1 py-1 cursor-pointer"
                    @click="closeDropdown"
                  >
                    {{ link.label }}
                  </NuxtLink>
                  <button
                    type="button"
                    class="pr-2 pl-0.5 py-1 text-slate-400 hover:text-orange-600 cursor-pointer inline-flex items-center"
                    :aria-expanded="activeDropdown === link.menuKey"
                    :aria-label="`Toggle ${link.label} menu`"
                    @click.stop="toggleDropdown(link.menuKey!, $event)"
                  >
                    <UIcon
                      name="i-lucide-chevron-down"
                      class="size-3 transition-transform duration-200"
                      :class="{ 'rotate-180 text-orange-600': activeDropdown === link.menuKey }"
                    />
                  </button>
                </div>

                <!-- Floating Dropdown Sub-menu with seamless padding bridge & hit area -->
                <Transition name="fade">
                  <div
                    v-if="activeDropdown === link.menuKey"
                    class="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-72 z-50"
                    @mouseenter="openDropdown(link.menuKey!)"
                    @mouseleave="scheduleCloseDropdown"
                  >
                    <!-- Invisible top hit extension bridge (guarantees zero mouseleave gap) -->
                    <div class="absolute -top-2 inset-x-0 h-4 bg-transparent" />
                    <div class="bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 flex flex-col gap-1 relative z-10">
                      <NuxtLink
                        v-for="sub in link.subLinks"
                        :key="sub.to"
                        :to="sub.to"
                        class="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl mx-1.5 transition-colors"
                        :class="isActive(sub.to)
                          ? 'bg-orange-50 text-orange-600 font-bold'
                          : 'text-slate-700 hover:text-orange-600 hover:bg-slate-50'"
                        @click="closeDropdown"
                      >
                        <UIcon :name="sub.icon" class="size-4 shrink-0 text-orange-500" />
                        <span class="truncate">{{ sub.label }}</span>
                      </NuxtLink>
                    </div>
                  </div>
                </Transition>
              </div>

              <!-- Standard Row 1 Link without sub-menu -->
              <NuxtLink
                v-else
                :to="link.to"
                :prefetch="true"
                class="text-xs xl:text-sm font-semibold px-2.5 py-1 rounded-full transition-all duration-150 whitespace-nowrap"
                :class="isActive(link.to)
                  ? 'bg-orange-50 text-orange-600 font-bold shadow-xs'
                  : 'text-slate-700 hover:text-orange-600 hover:bg-slate-100'"
              >
                {{ link.label }}
              </NuxtLink>
            </template>
          </div>

          <!-- Row 2: 3 links (with sub-menus for Labs and Student Life) -->
          <div class="flex items-center justify-center gap-1.5 flex-nowrap">
            <template v-for="link in navRowBottom" :key="link.to">
              <!-- Dropdown for links with sub-routes in Row 2 -->
              <div
                v-if="link.subLinks"
                data-dropdown-container
                class="relative"
                @mouseenter="openDropdown(link.menuKey!)"
                @mouseleave="scheduleCloseDropdown"
              >
                <div
                  class="text-xs xl:text-sm font-semibold rounded-full transition-all duration-150 whitespace-nowrap inline-flex items-center select-none"
                  :class="isLinkActive(link)
                    ? 'bg-orange-50 text-orange-600 font-bold shadow-xs'
                    : 'text-slate-700 hover:text-orange-600 hover:bg-slate-100'"
                >
                  <NuxtLink
                    :to="link.to"
                    class="pl-2.5 pr-1 py-1 cursor-pointer"
                    @click="closeDropdown"
                  >
                    {{ link.label }}
                  </NuxtLink>
                  <button
                    type="button"
                    class="pr-2 pl-0.5 py-1 text-slate-400 hover:text-orange-600 cursor-pointer inline-flex items-center"
                    :aria-expanded="activeDropdown === link.menuKey"
                    :aria-label="`Toggle ${link.label} menu`"
                    @click.stop="toggleDropdown(link.menuKey!, $event)"
                  >
                    <UIcon
                      name="i-lucide-chevron-down"
                      class="size-3 transition-transform duration-200"
                      :class="{ 'rotate-180 text-orange-600': activeDropdown === link.menuKey }"
                    />
                  </button>
                </div>

                <!-- Floating Dropdown Sub-menu with seamless padding bridge & hit area -->
                <Transition name="fade">
                  <div
                    v-if="activeDropdown === link.menuKey"
                    class="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-72 z-50"
                    @mouseenter="openDropdown(link.menuKey!)"
                    @mouseleave="scheduleCloseDropdown"
                  >
                    <!-- Invisible top hit extension bridge (guarantees zero mouseleave gap) -->
                    <div class="absolute -top-2 inset-x-0 h-4 bg-transparent" />
                    <div class="bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 flex flex-col gap-1 relative z-10">
                      <NuxtLink
                        v-for="sub in link.subLinks"
                        :key="sub.to"
                        :to="sub.to"
                        class="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl mx-1.5 transition-colors"
                        :class="isActive(sub.to)
                          ? 'bg-orange-50 text-orange-600 font-bold'
                          : 'text-slate-700 hover:text-orange-600 hover:bg-slate-50'"
                        @click="closeDropdown"
                      >
                        <UIcon :name="sub.icon" class="size-4 shrink-0 text-orange-500" />
                        <span class="truncate">{{ sub.label }}</span>
                      </NuxtLink>
                    </div>
                  </div>
                </Transition>
              </div>

              <!-- Standard Row 2 Link without sub-menu (Tuition & Scholarships) -->
              <NuxtLink
                v-else
                :to="link.to"
                :prefetch="true"
                class="text-xs xl:text-sm font-semibold px-2.5 py-1 rounded-full transition-all duration-150 whitespace-nowrap"
                :class="isActive(link.to)
                  ? 'bg-orange-50 text-orange-600 font-bold shadow-xs'
                  : 'text-slate-700 hover:text-orange-600 hover:bg-slate-100'"
              >
                {{ link.label }}
              </NuxtLink>
            </template>
          </div>
        </nav>

        <!-- Header Controls: Language Switcher, Contact CTA, Mobile Drawer Button -->
        <div class="flex items-center gap-2.5 shrink-0 ml-auto lg:ml-0">
          <!-- Contact Us CTA -->
          <UButton
            color="primary"
            variant="outline"
            size="xs"
            class="hidden lg:inline-flex font-bold rounded-full text-xs px-3.5 py-1.5 hover:bg-orange-50"
            @click="scrollToFooter"
          >
            {{ t('nav.contact_us') }}
          </UButton>

          <!-- Language Switcher Pill (EN / VI) -->
          <div class="inline-flex items-center gap-0.5 bg-slate-100 border border-slate-200 rounded-full p-0.5">
            <button
              class="px-2 py-0.5 text-xs font-bold rounded-full transition-all duration-150 cursor-pointer"
              :class="locale === 'en' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:text-orange-600'"
              @click="setLocale('en')"
            >
              EN
            </button>
            <span class="text-slate-300 text-xs select-none">|</span>
            <button
              class="px-2 py-0.5 text-xs font-bold rounded-full transition-all duration-150 cursor-pointer"
              :class="locale === 'vi' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:text-orange-600'"
              @click="setLocale('vi')"
            >
              VI
            </button>
          </div>

          <!-- Mobile Menu Trigger -->
          <UButton
            icon="i-lucide-menu"
            color="neutral"
            variant="ghost"
            size="sm"
            class="lg:hidden"
            aria-label="Toggle navigation menu"
            @click="mobileMenuOpen = true"
          />
        </div>
      </div>

      <!-- Mobile Navigation Drawer -->
      <USlideover
        v-model:open="mobileMenuOpen"
        side="right"
        :title="locale === 'vi' ? 'Điều hướng MSI' : 'MSI Navigation'"
        :ui="{
          content: 'w-[85vw] max-w-sm bg-white shadow-2xl flex flex-col',
          header: 'border-b border-slate-100 p-4 font-bold text-slate-800 flex items-center justify-between',
          body: 'p-4 flex flex-col justify-between flex-1 overflow-y-auto'
        }"
      >
        <template #body>
          <div class="flex flex-col gap-1.5 py-1">
            <template v-for="link in navLinks" :key="link.to">
              <!-- Collapsible for links with sub-routes in Mobile Drawer -->
              <div v-if="link.subLinks" class="flex flex-col">
                <button
                  type="button"
                  class="flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all duration-150 cursor-pointer text-left"
                  :class="isLinkActive(link)
                    ? 'bg-orange-50 text-orange-600 font-bold'
                    : 'text-slate-700 hover:text-orange-600 hover:bg-slate-50'"
                  @click="mobileExpandedMap[link.menuKey!] = !mobileExpandedMap[link.menuKey!]"
                >
                  <span>{{ link.label }}</span>
                  <UIcon
                    name="i-lucide-chevron-down"
                    class="size-4 transition-transform duration-200"
                    :class="mobileExpandedMap[link.menuKey!] ? 'rotate-180 text-orange-600' : 'text-slate-400'"
                  />
                </button>

                <div v-show="mobileExpandedMap[link.menuKey!]" class="pl-3 py-1 flex flex-col gap-1 border-l-2 border-orange-300 ml-4 my-1">
                  <NuxtLink
                    v-for="sub in link.subLinks"
                    :key="sub.to"
                    :to="sub.to"
                    class="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
                    :class="isActive(sub.to)
                      ? 'bg-orange-100 text-orange-700 font-bold'
                      : 'text-slate-600 hover:text-orange-600 hover:bg-slate-100'"
                    @click="mobileMenuOpen = false"
                  >
                    <UIcon :name="sub.icon" class="size-3.5 text-orange-500 shrink-0" />
                    <span>{{ sub.label }}</span>
                  </NuxtLink>
                </div>
              </div>

              <!-- Standard Nav Links -->
              <NuxtLink
                v-else
                :to="link.to"
                class="flex items-center px-4 py-3 rounded-xl font-medium text-sm transition-all duration-150"
                :class="isActive(link.to)
                  ? 'bg-orange-50 text-orange-600 font-bold shadow-xs'
                  : 'text-slate-700 hover:text-orange-600 hover:bg-slate-50'"
                @click="mobileMenuOpen = false"
              >
                {{ link.label }}
              </NuxtLink>
            </template>

            <div class="my-3 border-t border-slate-100" />

            <UButton
              color="primary"
              variant="solid"
              size="md"
              block
              icon="i-lucide-mail"
              class="font-bold shadow-sm rounded-full"
              @click="scrollToFooter(); mobileMenuOpen = false"
            >
              {{ t('nav.contact_us') }}
            </UButton>
          </div>

          <!-- Mobile Language Switcher -->
          <div class="pt-4 border-t border-slate-100 mt-4">
            <div class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Language / Ngôn ngữ</div>
            <div class="grid grid-cols-2 gap-2">
              <UButton
                :color="locale === 'en' ? 'primary' : 'neutral'"
                :variant="locale === 'en' ? 'solid' : 'outline'"
                size="sm"
                block
                class="font-semibold rounded-lg"
                @click="setLocale('en'); mobileMenuOpen = false"
              >
                English
              </UButton>
              <UButton
                :color="locale === 'vi' ? 'primary' : 'neutral'"
                :variant="locale === 'vi' ? 'solid' : 'outline'"
                size="sm"
                block
                class="font-semibold rounded-lg"
                @click="setLocale('vi'); mobileMenuOpen = false"
              >
                Tiếng Việt
              </UButton>
            </div>
          </div>
        </template>
      </USlideover>
    </header>

    <!-- === SECTION: Main Page Content === -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- === SECTION: Global Footer === -->
    <footer id="site-footer" class="bg-[#0f2240] text-slate-300 relative overflow-hidden border-t-4 border-t-orange-500 pt-16 pb-12 sm:pt-20 sm:pb-16 font-sans">
      <!-- Decorative Backdrop Glow -->
      <div class="absolute -right-20 -bottom-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div class="absolute -left-20 -top-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <!-- MSI Wordmark Watermark: larger, positioned towards the bottom of the footer -->
      <div class="absolute inset-0 flex items-end justify-center pointer-events-none overflow-hidden select-none pb-0">
        <NuxtImg
          src="/Logo/MSI_Word_Only.png"
          alt=""
          aria-hidden="true"
          class="w-[500px] sm:w-[680px] md:w-[840px] lg:w-[980px] xl:w-[1100px] h-auto object-contain opacity-[0.08] sm:opacity-[0.10] pointer-events-none select-none filter drop-shadow-[0_0_30px_rgba(232,119,34,0.12)] transform translate-y-6 sm:translate-y-8"
        />
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <!-- 4-Column Footer Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-slate-700/60">

          <!-- Column 1: Brand & Joint Universities -->
          <div class="flex flex-col">
            <p class="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
              {{ t('footer.subtitle') }}
            </p>
            <div class="inline-flex items-center gap-4 bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-slate-100 mb-6 w-fit">
              <a href="https://vgu.edu.vn" target="_blank" rel="noopener noreferrer" aria-label="VGU Website" class="inline-flex items-center hover:opacity-85 transition-opacity">
                <NuxtImg src="/Logo/VGU_Logo.png" alt="Vietnamese-German University (VGU)" class="h-8 sm:h-9 w-auto object-contain" />
              </a>
              <div class="h-6 w-px bg-slate-200" aria-hidden="true" />
              <a href="https://www.ovgu.de" target="_blank" rel="noopener noreferrer" aria-label="OVGU Website" class="inline-flex items-center hover:opacity-85 transition-opacity">
                <NuxtImg src="/Logo/OVGU_Logo.png" alt="Otto von Guericke University Magdeburg (OVGU)" class="h-8 sm:h-9 w-auto object-contain" />
              </a>
            </div>
            <div class="flex flex-col gap-1.5 text-xs text-slate-400">
              <a href="https://vgu.edu.vn" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors">
                Vietnamese-German University (VGU)
              </a>
              <a href="https://www.ovgu.de" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors">
                Otto von Guericke University Magdeburg (OVGU)
              </a>
            </div>
          </div>

          <!-- Column 2: Quick Links -->
          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-orange-400 mb-4">
              {{ t('footer.quick_links') }}
            </h4>
            <ul class="space-y-2 text-xs sm:text-sm">
              <li v-for="link in navLinks" :key="link.to">
                <NuxtLink :to="link.to" class="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5">
                  <UIcon name="i-lucide-chevron-right" class="size-3.5 text-orange-400 shrink-0" />
                  <span>{{ link.label }}</span>
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Column 3: Quick Resources (Official PDF Downloads) -->
          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-orange-400 mb-4">
              {{ locale === 'vi' ? 'TÀI NGUYÊN NHANH' : 'QUICK RESOURCES' }}
            </h4>
            <ul class="space-y-3 text-xs sm:text-sm">
              <li>
                <a
                  href="/Documents/Booklet MSI (updated 06.2026).pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-slate-300 hover:text-white transition-colors flex items-center gap-2 font-medium"
                >
                  <UIcon name="i-lucide-file-text" class="size-4 text-orange-400 shrink-0" />
                  <span>{{ locale === 'vi' ? 'Cẩm nang MSI (PDF)' : 'MSI Booklet (PDF)' }}</span>
                </a>
                <span class="text-slate-500 text-[11px] block pl-6">
                  {{ locale === 'vi' ? '↳ Không có thông tin học bổng' : '↳ No scholarship info' }}
                </span>
              </li>
              <li>
                <a
                  href="/Documents/MSI leaflet 2026.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-slate-300 hover:text-white transition-colors flex items-center gap-2 font-medium"
                >
                  <UIcon name="i-lucide-file-text" class="size-4 text-orange-400 shrink-0" />
                  <span>{{ locale === 'vi' ? 'Tờ rơi MSI (PDF)' : 'MSI Leaflet (PDF)' }}</span>
                </a>
              </li>
              <li>
                <a
                  href="/Documents/MSI_Scholarships_Brochure.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-2 font-semibold"
                >
                  <UIcon name="i-lucide-download" class="size-4 text-orange-400 shrink-0" />
                  <span>{{ locale === 'vi' ? 'Học bổng MSI (PDF)' : 'MSI Scholarships (PDF)' }}</span>
                </a>
              </li>
            </ul>
          </div>

          <!-- Column 4: Contact & Social Info -->
          <div class="flex flex-col">
            <h4 class="text-xs font-bold uppercase tracking-wider text-orange-400 mb-4">
              {{ t('footer.contact') }}
            </h4>
            <p class="text-xs text-slate-400 leading-relaxed mb-3">
              {{ t('footer.welcome_message') }}
            </p>
            <address class="not-italic text-xs text-slate-400 leading-relaxed mb-4">
              Vietnamese-German University<br>
              Ring road 4, Quarter 4<br>
              Thoi Hoa Ward, Ben Cat Town<br>
              Ho Chi Minh City, Vietnam
            </address>
            <div class="flex flex-col gap-2.5 text-xs">
              <a href="mailto:msi.info@vgu.edu.vn" class="inline-flex items-center gap-2 text-slate-300 hover:text-orange-400 transition-colors">
                <UIcon name="i-lucide-mail" class="size-4 text-orange-400 shrink-0" />
                <span>msi.info@vgu.edu.vn</span>
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61577622987645"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 text-slate-300 hover:text-orange-400 transition-colors"
              >
                <UIcon name="i-lucide-facebook" class="size-4 text-orange-400 shrink-0" />
                <span>{{ t('footer.facebook_fanpage') }}</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Bottom Copyright Row -->
        <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <span>&copy; {{ new Date().getFullYear() }} Vietnamese-German University &amp; OVGU Magdeburg. All rights reserved.</span>
          <div class="flex items-center gap-4">
            <a href="#" class="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" class="hover:text-white transition-colors">Imprint</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
