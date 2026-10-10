<!--
  Component: SemesterTimetable
  Description: Interactive block-modular semester schedule and timetable explorer with cohort filters, monthly calendar grid, and detailed course schedule table.
  Data Sources: Local cohort definitions, timetable JSON/computed module data.
  Nuxt UI Primitives: UButton, UBadge.
-->
<script setup lang="ts">
import { ref, computed } from 'vue'

const { locale } = useI18n()
const isVi = computed(() => locale.value === 'vi')

// ── Cohort Intakes ───────────────────────────────────────────────────────────
interface Intake {
  id: string
  name: string
  intake_year: number
  semester_number: number
}

const intakes: Intake[] = [
  { id: 'intake-2026', name: 'Intake 2026', intake_year: 2026, semester_number: 1 },
  { id: 'intake-2025', name: 'Intake 2025', intake_year: 2025, semester_number: 3 },
]

const selectedIntakeId = ref<string>('intake-2026')
const activeModuleId = ref<string | null>(null)

// ── Course Module Schedule Data ──────────────────────────────────────────────
interface ScheduleModule {
  id: string
  intake_id: string
  slug: string
  title_en: string
  title_vi: string
  start_date: string // YYYY-MM-DD
  end_date: string   // YYYY-MM-DD
  display_date: string
  is_semester_long?: boolean
  lecturers: string[]
  notes?: string
}

const allScheduleModules: ScheduleModule[] = [
  // Intake 2026 (Winter Semester 2026/2027 — Semester 1)
  {
    id: 'i26-continuum-mech',
    intake_id: 'intake-2026',
    slug: 'continuum-mechanics',
    title_en: 'Continuum Mechanics',
    title_vi: 'Cơ Học Môi Trường Liên Tục',
    start_date: '2026-09-07',
    end_date: '2026-09-19',
    display_date: '07.09.2026 – 19.09.2026',
    lecturers: ['Prof. Dr.-Ing. Manja Krüger', 'Dr. Nguyen Van A'],
    notes: 'Shared lecture block with Intake 2025'
  },
  {
    id: 'i26-mat-model-sim',
    intake_id: 'intake-2026',
    slug: 'material-modelling-and-simulation',
    title_en: 'Material Modelling and Simulation',
    title_vi: 'Mô Hình Hóa & Mô Phỏng Vật Liệu',
    start_date: '2026-09-28',
    end_date: '2026-10-10',
    display_date: '28.09.2026 – 10.10.2026',
    lecturers: ['Prof. Dr. Thorsten Halle', 'VGU Lab Team']
  },
  {
    id: 'i26-mat-char',
    intake_id: 'intake-2026',
    slug: 'materials-characterization',
    title_en: 'Materials Characterization',
    title_vi: 'Đặc Tính Hóa Vật Liệu',
    start_date: '2026-10-19',
    end_date: '2026-10-31',
    display_date: '19.10.2026 – 31.10.2026',
    lecturers: ['Prof. Dr. Michael Scheffler', 'Dr. Le Thi B']
  },
  {
    id: 'i26-solid-state-phys',
    intake_id: 'intake-2026',
    slug: 'solid-state-physics',
    title_en: 'Solid State Physics',
    title_vi: 'Vật Lý Chất Rắn',
    start_date: '2026-11-09',
    end_date: '2026-11-21',
    display_date: '09.11.2026 – 21.11.2026',
    lecturers: ['Prof. Dr. Jan Wiersig', 'OVGU Guest Lecturer']
  },
  {
    id: 'i26-team-proj',
    intake_id: 'intake-2026',
    slug: 'team-project',
    title_en: 'Team Project',
    title_vi: 'Dự Án Nhóm Nghiên Cứu',
    start_date: '2026-10-01',
    end_date: '2027-01-30',
    display_date: 'October 2026 – January 2027 (Parallel)',
    is_semester_long: true,
    lecturers: ['MSI Academic Coordinators', 'Faculty Advisors']
  },

  // Intake 2025 (Winter Semester 2026/2027 — Semester 3)
  {
    id: 'i25-adv-simulation-fem',
    intake_id: 'intake-2025',
    slug: 'advanced-simulation-fem-application-and-numerical-simulation',
    title_en: 'Advanced Simulation: FEM & Numerical Simulation',
    title_vi: 'Mô Phỏng Nâng Cao: Ứng Dụng FEM & Mô Phỏng Số',
    start_date: '2026-09-07',
    end_date: '2026-09-19',
    display_date: '07.09.2026 – 19.09.2026',
    lecturers: ['Prof. Dr. Daniel Juhre', 'Dr. Tran Van C'],
    notes: 'Shared lecture block with Intake 2026'
  },
  {
    id: 'i25-additive-mfg',
    intake_id: 'intake-2025',
    slug: 'additive-manufacturing',
    title_en: 'Additive Manufacturing',
    title_vi: 'Sản Xuất Đắp Dần (In 3D Kim Loại)',
    start_date: '2026-10-05',
    end_date: '2026-10-17',
    display_date: '05.10.2026 – 17.10.2026',
    lecturers: ['Prof. Dr. Thorsten Halle', 'Additive Lab Faculty']
  },
  {
    id: 'i25-mech-materials-fracture',
    intake_id: 'intake-2025',
    slug: 'mechanics-of-materials-and-fracture-mechanics',
    title_en: 'Mechanics of Materials & Fracture Mechanics',
    title_vi: 'Cơ Học Vật Liệu & Cơ Học Phá Hủy',
    start_date: '2026-10-26',
    end_date: '2026-11-07',
    display_date: '26.10.2026 – 07.11.2026',
    lecturers: ['Prof. Dr.-Ing. Manja Krüger', 'Dr. Pham Van D']
  },
  {
    id: 'i25-inorganic-binders',
    intake_id: 'intake-2025',
    slug: 'inorganic-non-metallic-binders',
    title_en: 'Inorganic Non-Metallic Binders',
    title_vi: 'Chất Kết Dính Vô Cơ Phi Kim',
    start_date: '2026-11-16',
    end_date: '2026-11-28',
    display_date: '16.11.2026 – 28.11.2026',
    lecturers: ['Prof. Dr. Michael Scheffler', 'Industry Specialists']
  },
  {
    id: 'i25-research-lab-testing',
    intake_id: 'intake-2025',
    slug: 'research-lab-properties-testing-and-analytics',
    title_en: 'Research Lab: Properties Testing & Analytics',
    title_vi: 'Phòng Thí Nghiệm Nghiên Cứu: Đo Kiểm & Phân Tích',
    start_date: '2026-10-01',
    end_date: '2027-01-30',
    display_date: 'October 2026 – January 2027 (Parallel)',
    is_semester_long: true,
    lecturers: ['Central Labs Team', 'Prof. Dr. Thorsten Halle']
  }
]

// Distinct color assignments for modules
const moduleColorMap: Record<string, string> = {
  'continuum-mechanics': '#1E3A5F',
  'material-modelling-and-simulation': '#E87722',
  'materials-characterization': '#009FDF',
  'solid-state-physics': '#2563EB',
  'team-project': '#059669',
  'advanced-simulation-fem-application-and-numerical-simulation': '#7C3AED',
  'additive-manufacturing': '#DC2626',
  'mechanics-of-materials-and-fracture-mechanics': '#D97706',
  'inorganic-non-metallic-binders': '#475569',
  'research-lab-properties-testing-and-analytics': '#0891B2'
}

function getModColor(slug: string): string {
  return moduleColorMap[slug] || '#1E3A5F'
}

// ── Computed Filtered Modules ────────────────────────────────────────────────
const activeModules = computed(() => {
  if (selectedIntakeId.value === 'all') {
    return allScheduleModules
  }
  return allScheduleModules.filter(m => m.intake_id === selectedIntakeId.value)
})

function getModuleTitle(mod: ScheduleModule): string {
  const baseTitle = isVi.value ? (mod.title_vi || mod.title_en) : mod.title_en
  if (selectedIntakeId.value === 'all') {
    const intakeTag = mod.intake_id === 'intake-2026' ? '_26' : '_25'
    return `${baseTitle} (${intakeTag})`
  }
  return baseTitle
}

function toggleModule(id: string) {
  activeModuleId.value = activeModuleId.value === id ? null : id
}

// ── Calendar Month View State ────────────────────────────────────────────────
const currentYear = ref(2026)
const currentMonth = ref(8) // 8 = September (0-indexed)

const semesterMonths = [
  { year: 2026, month: 8, label: '09/2026' },
  { year: 2026, month: 9, label: '10/2026' },
  { year: 2026, month: 10, label: '11/2026' },
  { year: 2026, month: 11, label: '12/2026' },
  { year: 2027, month: 0, label: '01/2027' }
]

const currentMonthLabel = computed(() => {
  const date = new Date(currentYear.value, currentMonth.value, 1)
  const monthName = isVi.value
    ? `Tháng ${currentMonth.value + 1}, ${currentYear.value}`
    : date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  return monthName
})

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function jumpToMonth(year: number, month: number) {
  currentYear.value = year
  currentMonth.value = month
}

// ── Calendar Grid Generation ─────────────────────────────────────────────────
interface DayCell {
  dateStr: string
  dayNumber: number
  isCurrentMonth: boolean
  isToday: boolean
  modules: ScheduleModule[]
}

const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()

  // Monday = 0, Sunday = 6
  let startDayOfWeek = firstDayOfMonth.getDay() - 1
  if (startDayOfWeek === -1) startDayOfWeek = 6

  const days: DayCell[] = []

  // Trailing days from previous month
  const prevMonthLastDate = new Date(year, month, 0).getDate()
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthLastDate - i)
    days.push(makeDay(d, false))
  }

  // Days of current month
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i)
    days.push(makeDay(d, true))
  }

  // Leading days of next month to complete the row
  const remaining = (7 - (days.length % 7)) % 7
  if (remaining > 0) {
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i)
      days.push(makeDay(d, false))
    }
  }

  return days
})

function formatIso(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function makeDay(date: Date, isCurrentMonth: boolean): DayCell {
  const dateStr = formatIso(date)
  const todayStr = formatIso(new Date())

  const mods = activeModules.value.filter(m => {
    if (m.is_semester_long) return false
    return dateStr >= m.start_date && dateStr <= m.end_date
  })

  return {
    dateStr,
    dayNumber: date.getDate(),
    isCurrentMonth,
    isToday: dateStr === todayStr,
    modules: mods
  }
}

const weekDayLabels = [
  { key: 'mon', en: 'Monday', vi: 'Thứ Hai' },
  { key: 'tue', en: 'Tuesday', vi: 'Thứ Ba' },
  { key: 'wed', en: 'Wednesday', vi: 'Thứ Tư' },
  { key: 'thu', en: 'Thursday', vi: 'Thứ Năm' },
  { key: 'fri', en: 'Friday', vi: 'Thứ Sáu' },
  { key: 'sat', en: 'Saturday', vi: 'Thứ Bảy' },
  { key: 'sun', en: 'Sunday', vi: 'Chủ Nhật' }
]
</script>

<template>
  <section id="semester-schedule" class="my-14 pt-4 scroll-mt-24 font-sans max-w-6xl mx-auto px-4 sm:px-6">

    <!-- === SECTION 1: Title & Overview === -->
    <div class="text-center max-w-2xl mx-auto mb-7">
      <h2 class="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f] tracking-tight mb-2">
        {{ isVi ? 'Kế Hoạch & Lịch Học Dự Kiến' : 'Prospective Semester Schedule' }}
      </h2>
      <p class="text-sm sm:text-base text-slate-600 leading-relaxed">
        {{ isVi
          ? 'Kế hoạch học tập theo khối môn học cho học kỳ Mùa Đông 2026/2027.'
          : 'Block-modular curriculum schedule for Winter Semester 2026/2027.'
        }}
      </p>
    </div>

    <!-- === SECTION 2: Open Lectures Policy Notice === -->
    <div class="bg-[#eef3fb] border border-[#cddaee] border-l-4 border-l-orange-500 rounded-xl p-4 sm:p-5 mb-6 shadow-xs">
      <div class="mb-1">
        <strong class="text-sm font-bold text-[#1e3a5f]">
          {{ isVi ? 'Thông báo về dự thính bài giảng mở:' : 'Open Lectures Policy:' }}
        </strong>
      </div>
      <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">
        {{ isVi
          ? 'Tất cả các bài giảng chuyên đề Thạc sĩ MSI đều mở cửa cho sinh viên ngoài ngành tham dự (Kỹ thuật Cơ khí, Kỹ thuật Điện, CNTT, Vật lý...). Sinh viên có nhu cầu dự thính vui lòng gửi email về '
          : 'All MSI master lectures are open by default to guest students and auditors from other disciplines (e.g. Mechanical Engineering, Electrical Engineering, Computer Science, Physics). For guest attendance or syllabus materials, please contact '
        }}
        <a href="mailto:msi.info@vgu.edu.vn" class="text-orange-600 font-bold hover:underline">msi.info@vgu.edu.vn</a>.
      </p>
    </div>

    <!-- === SECTION 3: Controls Bar (Cohort & Month Selectors) === -->
    <div class="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 mb-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <!-- Cohort Selector -->
      <div class="flex items-center gap-3 flex-wrap">
        <span class="text-xs font-bold uppercase tracking-wider text-slate-500">
          {{ isVi ? 'Khóa Học:' : 'Cohort:' }}
        </span>
        
        <div class="flex items-center gap-2 flex-wrap">
          <UButton
            v-for="intake in intakes"
            :key="intake.id"
            :color="selectedIntakeId === intake.id ? 'primary' : 'neutral'"
            :variant="selectedIntakeId === intake.id ? 'solid' : 'outline'"
            size="sm"
            class="rounded-xl font-bold cursor-pointer"
            @click="selectedIntakeId = intake.id; activeModuleId = null"
          >
            <span>{{ intake.name }}</span>
            <UBadge
              :color="selectedIntakeId === intake.id ? 'neutral' : 'primary'"
              variant="subtle"
              size="xs"
              class="font-extrabold"
            >
              {{ intake.semester_number === 1 ? (isVi ? 'Kỳ 1' : 'Sem 1') : (isVi ? 'Kỳ 3' : 'Sem 3') }}
            </UBadge>
          </UButton>

          <UButton
            :color="selectedIntakeId === 'all' ? 'primary' : 'neutral'"
            :variant="selectedIntakeId === 'all' ? 'solid' : 'outline'"
            size="sm"
            class="rounded-xl font-bold cursor-pointer"
            @click="selectedIntakeId = 'all'; activeModuleId = null"
          >
            {{ isVi ? 'Tất Cả Khóa' : 'All Cohorts' }}
          </UButton>
        </div>
      </div>

      <!-- Quick Month Navigation -->
      <div class="flex items-center gap-1.5 flex-wrap">
        <UButton
          v-for="sm in semesterMonths"
          :key="sm.label"
          :color="currentYear === sm.year && currentMonth === sm.month ? 'primary' : 'neutral'"
          :variant="currentYear === sm.year && currentMonth === sm.month ? 'solid' : 'ghost'"
          size="xs"
          class="rounded-lg font-bold cursor-pointer"
          @click="jumpToMonth(sm.year, sm.month)"
        >
          {{ sm.label }}
        </UButton>
      </div>
    </div>

    <!-- === SECTION 4: Interactive Monthly Calendar Matrix === -->
    <div class="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden mb-8">
      <!-- Calendar Nav Header -->
      <div class="bg-slate-50/80 px-4 sm:px-6 py-3.5 border-b border-slate-200 flex items-center justify-between gap-4">
        <h3 class="text-base sm:text-lg font-bold text-[#1e3a5f] tracking-tight">
          {{ currentMonthLabel }}
        </h3>
        <div class="flex items-center gap-1.5">
          <UButton
            size="xs"
            color="neutral"
            variant="outline"
            icon="i-lucide-chevron-left"
            :title="isVi ? 'Tháng trước' : 'Previous Month'"
            @click="prevMonth"
          >
            {{ isVi ? 'Trước' : 'Prev' }}
          </UButton>
          <UButton
            size="xs"
            color="primary"
            variant="subtle"
            @click="jumpToMonth(2026, 8)"
          >
            {{ isVi ? 'Hôm Nay' : 'Today' }}
          </UButton>
          <UButton
            size="xs"
            color="neutral"
            variant="outline"
            trailing-icon="i-lucide-chevron-right"
            :title="isVi ? 'Tháng sau' : 'Next Month'"
            @click="nextMonth"
          >
            {{ isVi ? 'Sau' : 'Next' }}
          </UButton>
        </div>
      </div>

      <!-- Weekday Headers (7 columns) -->
      <div class="grid grid-cols-7 border-b border-slate-200 bg-slate-50/50 text-center text-xs font-bold text-slate-600">
        <div v-for="d in weekDayLabels" :key="d.key" class="py-2.5 px-1 border-r border-slate-200 last:border-r-0">
          <span class="hidden sm:inline">{{ isVi ? d.vi : d.en }}</span>
          <span class="sm:hidden">{{ isVi ? d.vi : d.en.substring(0, 3) }}</span>
        </div>
      </div>

      <!-- Calendar Month Grid (7 columns, auto-rows) -->
      <div class="grid grid-cols-7 auto-rows-fr">
        <div
          v-for="(day, idx) in calendarDays"
          :key="idx"
          class="min-h-[105px] sm:min-h-[120px] p-1.5 sm:p-2 border-b border-r border-slate-200 last:border-r-0 flex flex-col gap-1 transition-colors"
          :class="[
            !day.isCurrentMonth ? 'bg-slate-50/40 text-slate-400' : 'bg-white text-slate-800',
            day.isToday ? 'bg-orange-50/20' : ''
          ]"
        >
          <!-- Day Number -->
          <div class="flex justify-end">
            <span
              class="text-xs font-semibold px-1.5 py-0.5 rounded-full"
              :class="day.isToday ? 'bg-orange-500 text-white font-bold' : ''"
            >
              {{ day.dayNumber }}
            </span>
          </div>

          <!-- Module Event Pills -->
          <div class="flex-1 flex flex-col gap-1 overflow-y-auto max-h-[85px] sm:max-h-[100px]">
            <button
              v-for="mod in day.modules"
              :key="mod.id"
              class="text-[11px] leading-tight font-medium text-white px-1.5 py-1 rounded truncate text-left w-full transition-transform active:scale-95 shadow-2xs cursor-pointer"
              :style="{ backgroundColor: getModColor(mod.slug) }"
              :class="activeModuleId === mod.id ? 'ring-2 ring-offset-1 ring-slate-900 font-bold' : 'opacity-95 hover:opacity-100'"
              @click="toggleModule(mod.id)"
              :title="`${getModuleTitle(mod)} (${mod.display_date})`"
            >
              {{ getModuleTitle(mod) }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- === SECTION 5: Course Modules & Scheduled Dates Table === -->
    <div class="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden mb-8">
      <div class="px-5 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between gap-4">
        <h3 class="text-base sm:text-lg font-bold text-[#1e3a5f]">
          {{ isVi ? 'Danh Sách Các Khối Môn Học & Thời Gian Dự Kiến' : 'Prospective Course Modules & Scheduled Dates' }}
        </h3>
        <UBadge color="primary" variant="subtle" size="sm" class="font-bold">
          {{ activeModules.length }} {{ isVi ? 'khối môn' : 'modules' }}
        </UBadge>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs sm:text-sm">
          <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px] tracking-wider">
            <tr>
              <th class="py-3 px-4">{{ isVi ? 'Tên Môn Học' : 'Module' }}</th>
              <th class="py-3 px-4">{{ isVi ? 'Thời Gian Dự Kiến' : 'Scheduled Dates' }}</th>
              <th class="py-3 px-4">{{ isVi ? 'Giảng Viên Phụ Trách' : 'Lecturer(s)' }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="mod in activeModules"
              :key="mod.id"
              class="hover:bg-slate-50/80 cursor-pointer transition-colors"
              :class="activeModuleId === mod.id ? 'bg-orange-50/40 font-semibold' : ''"
              @click="toggleModule(mod.id)"
            >
              <!-- Module Title & Color Dot -->
              <td class="py-3.5 px-4 flex items-center gap-2.5">
                <span class="size-2.5 rounded-full shrink-0" :style="{ backgroundColor: getModColor(mod.slug) }" />
                <span class="text-slate-900">{{ getModuleTitle(mod) }}</span>
              </td>

              <!-- Scheduled Dates -->
              <td class="py-3.5 px-4 text-slate-700">
                <span class="font-semibold text-orange-600">{{ mod.display_date }}</span>
                <div v-if="mod.notes" class="text-xs text-slate-500 mt-0.5">{{ mod.notes }}</div>
              </td>

              <!-- Lecturers -->
              <td class="py-3.5 px-4 text-slate-600">
                {{ mod.lecturers && mod.lecturers.length ? mod.lecturers.join(', ') : 'Faculty' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- === SECTION 6: Footer Disclaimer & Download Guide === -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
      <p class="text-xs sm:text-sm text-slate-600">
        {{ isVi ? 'Kế hoạch học tập có thể có điều chỉnh nhỏ theo thông báo của Ban Điều phối Đào tạo.' : 'Schedule is subject to minor adjustments by academic coordinators.' }}
      </p>
      <UButton
        href="/Documents/Semester Plan/Semester_Plan_Template_Guide.xlsx"
        download
        target="_blank"
        external
        icon="i-lucide-download"
        color="primary"
        variant="solid"
        size="md"
        class="font-bold rounded-xl shadow-xs shrink-0 cursor-pointer"
      >
        Download Semester Schedule Guide (XLSX)
      </UButton>
    </div>
  </section>
</template>
