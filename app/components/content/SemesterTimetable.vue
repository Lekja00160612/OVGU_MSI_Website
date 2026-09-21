<script setup lang="ts">
import { ref, computed } from 'vue'
import defaultPlanData from '~/data/semesterPlan.json'

const props = withDefaults(defineProps<{
  initialIntake?: string
}>(), {
  initialIntake: 'intake-3-2026'
})

const { locale } = useI18n()
const isVi = computed(() => locale.value === 'vi')

// Query all official modules dynamically from Nuxt Content collection 'modules'
const { data: contentModules } = await useAsyncData('timetable-content-modules', () =>
  queryCollection('modules').all()
)

function findContentModule(slug: string) {
  if (!contentModules.value) return null
  return contentModules.value.find((m: any) => {
    const stem = m.stem || m.path || ''
    return stem.endsWith(`/${slug}`) || stem.endsWith(slug) || stem === slug
  })
}

function formatDisplayDate(start: string, end: string): string {
  if (!start || !end) return ''
  const [sy, sm, sd] = start.split('-')
  const [ey, em, ed] = end.split('-')
  return `${sd}/${sm}/${sy} – ${ed}/${em}/${ey}`
}

function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

// Intake Cohort Filter
const selectedIntakeId = ref(props.initialIntake)

// Enriched Intakes drawing module titles and faculty directly from content/_modules
const intakes = computed(() => {
  return defaultPlanData.intakes.map(intake => {
    const modules = intake.schedule.map((item, idx) => {
      const contentMod = findContentModule(item.module_slug)
      return {
        id: `${intake.id}-${idx + 1}`,
        intake_id: intake.id,
        intake_name: intake.name,
        semester_number: intake.semester_number,
        slug: item.module_slug,
        title: contentMod?.title || slugToTitle(item.module_slug),
        lecturers: (contentMod?.lecturers as string[]) || [],
        german_lecturer: contentMod?.german_lecturer ?? true,
        start_date: item.start_date,
        end_date: item.end_date,
        display_date: item.display_date || formatDisplayDate(item.start_date, item.end_date),
        is_semester_long: !!item.is_semester_long,
        notes: item.notes || ''
      }
    })
    return {
      ...intake,
      modules
    }
  })
})

const activeModules = computed(() => {
  if (selectedIntakeId.value === 'all') {
    return intakes.value.flatMap(i => i.modules)
  }
  const found = intakes.value.find(i => i.id === selectedIntakeId.value)
  return found ? found.modules : (intakes.value[0]?.modules || [])
})

// Highlighted module
const activeModuleId = ref<string | null>(null)

function toggleModule(id: string) {
  activeModuleId.value = activeModuleId.value === id ? null : id
}

// In All Cohorts view, append intake suffix (e.g. _26 for Intake 2026, _25 for Intake 2025)
function getModuleTitle(mod: any): string {
  if (selectedIntakeId.value === 'all') {
    const suffix = mod.intake_name?.includes('2026') ? '_26' : mod.intake_name?.includes('2025') ? '_25' : ''
    return `${mod.title}${suffix}`
  }
  return mod.title
}

// Calendar Month State (Defaults to September 2026)
const currentYear = ref(2026)
const currentMonth = ref(8) // 8 = September (0-indexed)

const monthNamesEn = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]
const monthNamesVi = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
]

const currentMonthLabel = computed(() => {
  const mName = isVi.value ? monthNamesVi[currentMonth.value] : monthNamesEn[currentMonth.value]
  return `${mName} ${currentYear.value}`
})

const semesterMonths = [
  { year: 2026, month: 8, label: 'Sep 2026' },
  { year: 2026, month: 9, label: 'Oct 2026' },
  { year: 2026, month: 10, label: 'Nov 2026' },
  { year: 2026, month: 11, label: 'Dec 2026' },
  { year: 2027, month: 0, label: 'Jan 2027' },
  { year: 2027, month: 1, label: 'Feb 2027' },
  { year: 2027, month: 2, label: 'Mar 2027' }
]

function jumpToMonth(y: number, m: number) {
  currentYear.value = y
  currentMonth.value = m
}

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

// Distinct, website brand-aligned colors keyed by official module slug
const moduleColorMap: Record<string, string> = {
  'solid-state-physics': '#1E3A5F', // MSI Navy
  'polymers': '#E87722', // VGU Orange
  'continuum-mechanics': '#009FDF', // OVGU Blue
  'micro-nano-fabrication-technology': '#0F766E', // Deep Teal
  'mechanics-of-materials-and-fracture-mechanics': '#991B1B', // Dark Red
  'engineering-ceramics': '#5B21B6', // Deep Purple
  'glass': '#0D9488', // Teal
  'team-project': '#475569'  // Slate
}

function getModColor(slug: string): string {
  return moduleColorMap[slug] || 'var(--color-primary, #1E3A5F)'
}

// Calendar Days Matrix
interface DayCell {
  dateStr: string
  dayNumber: number
  isCurrentMonth: boolean
  isToday: boolean
  modules: any[]
}

const calendarDays = computed<DayCell[]>(() => {
  const year = currentYear.value
  const month = currentMonth.value

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  let startDayOfWeek = firstDay.getDay() - 1
  if (startDayOfWeek === -1) startDayOfWeek = 6

  const days: DayCell[] = []

  // Prev month padding
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthLastDay - i)
    days.push(makeDay(d, false))
  }

  // Current month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(year, month, d)
    days.push(makeDay(date, true))
  }

  // Next month padding to complete row
  const remaining = 7 - (days.length % 7)
  if (remaining < 7) {
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
  <section class="semester-schedule-root" id="semester-schedule">
    <!-- SECTION TITLE & SUBTITLE -->
    <div class="schedule-header">
      <h2 class="schedule-title">
        {{ isVi ? 'Kế Hoạch & Lịch Học Dự Kiến' : 'Prospective Semester Schedule' }}
      </h2>
      <p class="schedule-subtitle">
        {{ isVi
          ? 'Kế hoạch học tập theo khối môn học cho học kỳ Mùa Đông 2026/2027.'
          : 'Block-modular curriculum schedule for Winter Semester 2026/2027.'
        }}
      </p>
    </div>

    <!-- OPEN LECTURES NOTICE (MSI BRANDED CALLOUT) -->
    <div class="open-lectures-callout">
      <div class="callout-header">
        <strong class="callout-title">
          {{ isVi ? 'Thông báo về dự thính bài giảng mở:' : 'Open Lectures Policy:' }}
        </strong>
      </div>
      <p class="callout-body">
        {{ isVi
          ? 'Tất cả các bài giảng chuyên đề Thạc sĩ MSI đều mở cửa cho sinh viên ngoài ngành tham dự (Kỹ thuật Cơ khí, Kỹ thuật Điện, CNTT, Vật lý...). Sinh viên có nhu cầu dự thính vui lòng gửi email về '
          : 'All MSI master lectures are open by default to guest students and auditors from other disciplines (e.g. Mechanical Engineering, Electrical Engineering, Computer Science, Physics). For guest attendance or syllabus materials, please contact '
        }}
        <a href="mailto:msi.info@vgu.edu.vn" class="callout-email">msi.info@vgu.edu.vn</a>.
      </p>
    </div>

    <!-- CONTROLS BAR: COHORT SELECTOR & QUICK MONTH TABS -->
    <div class="schedule-controls-card">
      <!-- Cohort Selector -->
      <div class="cohort-selector-group">
        <span class="cohort-label">{{ isVi ? 'Khóa Học:' : 'Cohort:' }}</span>
        
        <div class="cohort-buttons">
          <button
            v-for="intake in intakes"
            :key="intake.id"
            type="button"
            class="cohort-btn"
            :class="{ 'cohort-btn--active': selectedIntakeId === intake.id }"
            @click="selectedIntakeId = intake.id; activeModuleId = null"
          >
            <span>{{ intake.name }}</span>
            <span class="cohort-btn-pill">
              {{ intake.semester_number === 1 ? (isVi ? 'Kỳ 1' : 'Sem 1') : (isVi ? 'Kỳ 3' : 'Sem 3') }}
            </span>
          </button>

          <button
            type="button"
            class="cohort-btn"
            :class="{ 'cohort-btn--active': selectedIntakeId === 'all' }"
            @click="selectedIntakeId = 'all'; activeModuleId = null"
          >
            <span>{{ isVi ? 'Tất Cả Khóa' : 'All Cohorts' }}</span>
          </button>
        </div>
      </div>

      <!-- Month Quick Navigation -->
      <div class="month-selector-group">
        <button
          v-for="sm in semesterMonths"
          :key="sm.label"
          type="button"
          class="month-btn"
          :class="{ 'month-btn--active': currentYear === sm.year && currentMonth === sm.month }"
          @click="jumpToMonth(sm.year, sm.month)"
        >
          {{ sm.label }}
        </button>
      </div>
    </div>

    <!-- CALENDAR PANEL (FIXED HEIGHT, BREATHABLE, UNIFIED) -->
    <div class="calendar-card">
      <!-- Calendar Nav Header -->
      <div class="calendar-header-bar">
        <h3 class="current-month-heading">
          {{ currentMonthLabel }}
        </h3>
        <div class="calendar-nav-controls">
          <button type="button" class="cal-nav-btn" @click="prevMonth" :title="isVi ? 'Tháng trước' : 'Previous Month'">
            &larr; {{ isVi ? 'Trước' : 'Prev' }}
          </button>
          <button type="button" class="cal-nav-btn cal-nav-btn--primary" @click="jumpToMonth(2026, 8)">
            {{ isVi ? 'Hôm Nay' : 'Today' }}
          </button>
          <button type="button" class="cal-nav-btn" @click="nextMonth" :title="isVi ? 'Tháng sau' : 'Next Month'">
            {{ isVi ? 'Sau' : 'Next' }} &rarr;
          </button>
        </div>
      </div>

      <!-- Weekday Headers -->
      <div class="calendar-weekday-bar">
        <div v-for="d in weekDayLabels" :key="d.key" class="weekday-cell">
          <span class="weekday-text-full">{{ isVi ? d.vi : d.en }}</span>
          <span class="weekday-text-short">{{ isVi ? d.vi : d.en.substring(0, 3) }}</span>
        </div>
      </div>

      <!-- Calendar Month Grid (Fixed Height, Breathable Cells) -->
      <div class="calendar-grid">
        <div
          v-for="(day, idx) in calendarDays"
          :key="idx"
          class="calendar-day-cell"
          :class="{
            'calendar-day-cell--outside': !day.isCurrentMonth,
            'calendar-day-cell--today': day.isToday
          }"
        >
          <div class="day-number-row">
            <span class="day-number" :class="{ 'day-number--today': day.isToday }">
              {{ day.dayNumber }}
            </span>
          </div>

          <!-- Module Event Bars -->
          <div class="day-events-container">
            <div
              v-for="mod in day.modules"
              :key="mod.id"
              class="calendar-event-pill"
              :style="{ backgroundColor: getModColor(mod.slug) }"
              :class="{ 'calendar-event-pill--active': activeModuleId === mod.id }"
              @click="toggleModule(mod.id)"
              :title="`${getModuleTitle(mod)} (${mod.display_date})`"
            >
              <span class="event-pill-text">{{ getModuleTitle(mod) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PROSPECTIVE COURSE MODULES TABLE (NO LEARNING HOURS, NO ECTS, NO SYNTHETIC CODES) -->
    <div class="modules-table-card">
      <div class="table-card-header">
        <div class="table-card-title">
          {{ isVi ? 'Danh Sách Các Khối Môn Học & Thời Gian Dự Kiến' : 'Prospective Course Modules & Scheduled Dates' }}
        </div>
        <div class="table-card-badge">
          {{ activeModules.length }} {{ isVi ? 'khối môn' : 'modules' }}
        </div>
      </div>

      <div class="table-card-body">
        <table class="unified-schedule-table">
          <thead>
            <tr>
              <th class="col-th col-th-module">{{ isVi ? 'Tên Môn Học' : 'Module' }}</th>
              <th class="col-th col-th-dates">{{ isVi ? 'Thời Gian Dự Kiến' : 'Scheduled Dates' }}</th>
              <th class="col-th col-th-lecturers">{{ isVi ? 'Giảng Viên Phụ Trách' : 'Lecturer(s)' }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="mod in activeModules"
              :key="mod.id"
              class="table-row-item"
              :class="{ 'table-row-item--highlighted': activeModuleId === mod.id }"
              @click="toggleModule(mod.id)"
            >
              <!-- Module Title -->
              <td class="col-td col-module-info">
                <div class="module-title-line">
                  <span class="module-accent-dot" :style="{ backgroundColor: getModColor(mod.slug) }"></span>
                  <span class="module-title-text">{{ getModuleTitle(mod) }}</span>
                </div>
              </td>

              <!-- Scheduled Dates -->
              <td class="col-td col-dates-info">
                <span class="dates-highlight">{{ mod.display_date }}</span>
                <div v-if="mod.notes" class="dates-note">{{ mod.notes }}</div>
              </td>

              <!-- Lecturers -->
              <td class="col-td col-lecturers-info">
                <div class="lecturers-text">
                  {{ mod.lecturers && mod.lecturers.length ? mod.lecturers.join(', ') : 'Faculty' }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- FOOTER / DOWNLOAD GUIDE -->
    <div class="schedule-footer-bar">
      <div class="footer-note-text">
        {{ isVi ? 'Kế hoạch học tập có thể có điều chỉnh nhỏ theo thông báo của Ban Điều phối Đào tạo.' : 'Schedule is subject to minor adjustments by academic coordinators.' }}
      </div>
      <a
        href="/Documents/Semester Plan/Semester_Plan_Template_Guide.xlsx"
        download
        class="guide-download-link"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="download-icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        <span>Download Semester Schedule Guide (XLSX)</span>
      </a>
    </div>
  </section>
</template>

<style scoped>
/* ==========================================================================
   SEMESTER TIMETABLE — UNIFIED WITH MSI DESIGN SYSTEM
   - Fixed height, breathable cells
   - MSI Navy (#1E3A5F), VGU Orange (#E87722), OVGU Blue (#009FDF)
   - Clean typography matching Be Vietnam Pro
   - No learning hours, no ECTS, no synthetic codes
   ========================================================================== */

.semester-schedule-root {
  font-family: var(--font-sans, 'Be Vietnam Pro', system-ui, -apple-system, sans-serif);
  margin-top: 3.5rem;
  margin-bottom: 3.5rem;
  padding-top: 1rem;
  scroll-margin-top: 6rem;
}

/* Header */
.schedule-header {
  text-align: center;
  max-width: 760px;
  margin: 0 auto 1.75rem auto;
}

.schedule-title {
  font-family: var(--font-display, 'Be Vietnam Pro', sans-serif);
  font-size: clamp(1.6rem, 3vw, 2.25rem);
  font-weight: 800;
  color: var(--color-primary, #1E3A5F);
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
}

.schedule-subtitle {
  font-size: 1rem;
  color: var(--color-gray-600, #6c757d);
  line-height: 1.6;
}

/* Open Lectures Notice Callout */
.open-lectures-callout {
  background-color: var(--color-primary-50, #EEF3FB);
  border: 1px solid var(--color-primary-100, #CDDAEE);
  border-left: 5px solid var(--color-accent, #E87722);
  border-radius: var(--radius-md, 10px);
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-xs, 0 1px 2px rgba(0, 0, 0, 0.05));
}

.callout-header {
  margin-bottom: 0.25rem;
}

.callout-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-primary, #1E3A5F);
}

.callout-body {
  font-size: 0.875rem;
  color: var(--color-gray-700, #495057);
  line-height: 1.65;
  margin: 0;
}

.callout-email {
  color: var(--color-accent, #E87722);
  font-weight: 700;
  text-decoration: underline;
  transition: color 0.15s ease;
}

.callout-email:hover {
  color: var(--color-accent-dark, #C95E0A);
}

/* Controls Card */
.schedule-controls-card {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background-color: #ffffff;
  border: 1px solid var(--color-gray-200, #dee2e6);
  border-radius: var(--radius-lg, 16px);
  padding: 0.875rem 1.25rem;
  margin-bottom: 1.75rem;
  box-shadow: var(--shadow-sm, 0 1px 4px rgba(0, 0, 0, 0.06));
}

.cohort-selector-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.cohort-label {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--color-primary, #1E3A5F);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.cohort-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.cohort-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: var(--radius-full, 9999px);
  border: 1.5px solid var(--color-primary-100, #CDDAEE);
  background-color: #ffffff;
  color: var(--color-primary, #1E3A5F);
  cursor: pointer;
  transition: all 0.2s ease;
}

.cohort-btn:hover {
  background-color: var(--color-primary-50, #EEF3FB);
  border-color: var(--color-primary, #1E3A5F);
}

.cohort-btn--active {
  background-color: var(--color-primary, #1E3A5F);
  border-color: var(--color-primary, #1E3A5F);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(30, 58, 95, 0.25);
}

.cohort-btn-pill {
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.1rem 0.45rem;
  border-radius: var(--radius-full, 9999px);
  background-color: var(--color-primary-50, #EEF3FB);
  color: var(--color-primary, #1E3A5F);
}

.cohort-btn--active .cohort-btn-pill {
  background-color: rgba(255, 255, 255, 0.25);
  color: #ffffff;
}

/* Quick Month Tabs */
.month-selector-group {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  overflow-x: auto;
  max-width: 100%;
}

.month-btn {
  padding: 0.4rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: var(--radius-full, 9999px);
  border: 1px solid transparent;
  background: transparent;
  color: var(--color-gray-600, #6c757d);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.month-btn:hover {
  background-color: var(--color-gray-100, #f1f3f5);
  color: var(--color-primary, #1E3A5F);
}

.month-btn--active {
  background-color: var(--color-accent-50, #FFF4EB);
  color: var(--color-accent-dark, #C95E0A);
  font-weight: 700;
  border-color: rgba(232, 119, 34, 0.25);
}

/* ==========================================================================
   CALENDAR CARD (FIXED HEIGHT, BREATHABLE, UNIFIED)
   ========================================================================== */

.calendar-card {
  background-color: #ffffff;
  border: 1px solid var(--color-gray-200, #dee2e6);
  border-radius: var(--radius-lg, 16px);
  overflow: hidden;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-sm, 0 1px 4px rgba(0, 0, 0, 0.06));
}

/* Calendar Header Bar */
.calendar-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.25rem;
  background-color: var(--color-primary-50, #EEF3FB);
  border-bottom: 1px solid var(--color-primary-100, #CDDAEE);
}

.current-month-heading {
  font-family: var(--font-display, 'Be Vietnam Pro', sans-serif);
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--color-primary, #1E3A5F);
  margin: 0;
}

.calendar-nav-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cal-nav-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 0.85rem;
  font-size: 0.8125rem;
  font-weight: 600;
  background-color: #ffffff;
  border: 1px solid var(--color-primary-100, #CDDAEE);
  border-radius: var(--radius-sm, 6px);
  color: var(--color-primary, #1E3A5F);
  cursor: pointer;
  transition: all 0.15s ease;
}

.cal-nav-btn:hover {
  background-color: var(--color-primary, #1E3A5F);
  border-color: var(--color-primary, #1E3A5F);
  color: #ffffff;
}

.cal-nav-btn--primary {
  font-weight: 700;
}

/* Weekday Bar */
.calendar-weekday-bar {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  background-color: #ffffff;
  border-bottom: 1px solid var(--color-gray-200, #dee2e6);
  text-align: center;
}

.weekday-cell {
  padding: 0.65rem 0.25rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-gray-600, #6c757d);
  border-right: 1px solid var(--color-gray-100, #f1f3f5);
}

.weekday-cell:last-child {
  border-right: none;
}

.weekday-text-full {
  display: inline;
}
.weekday-text-short {
  display: none;
}

@media (max-width: 640px) {
  .weekday-text-full {
    display: none;
  }
  .weekday-text-short {
    display: inline;
  }
}

/* Calendar Days Grid: Fixed Height, Breathable */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  background-color: var(--color-gray-200, #dee2e6);
  gap: 1px;
}

.calendar-day-cell {
  background-color: #ffffff;
  height: 96px; /* FIXED HEIGHT */
  min-height: 96px;
  padding: 0.35rem 0.45rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
  transition: background-color 0.15s ease;
}

.calendar-day-cell--outside {
  background-color: var(--color-gray-50, #f8f9fa);
  opacity: 0.45;
}

.calendar-day-cell--today {
  background-color: var(--color-primary-50, #EEF3FB);
}

.day-number-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.day-number {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-gray-800, #343a40);
  line-height: 1;
}

.day-number--today {
  color: var(--color-accent, #E87722);
}

.day-events-container {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  overflow-y: auto;
  flex: 1;
}

/* Scrollbar for overflow in a single cell */
.day-events-container::-webkit-scrollbar {
  width: 3px;
}
.day-events-container::-webkit-scrollbar-thumb {
  background-color: var(--color-gray-300, #dee2e6);
  border-radius: 3px;
}

.calendar-event-pill {
  padding: 0.25rem 0.45rem;
  border-radius: 4px;
  font-size: 0.71875rem;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.25;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.calendar-event-pill:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.18);
}

.calendar-event-pill--active {
  outline: 2px solid var(--color-accent, #E87722);
  box-shadow: 0 0 0 3px rgba(232, 119, 34, 0.35);
}

.event-pill-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

/* ==========================================================================
   MODULES TABLE CARD (NO LEARNING HOURS, NO ECTS, NO SYNTHETIC CODES)
   ========================================================================== */

.modules-table-card {
  background-color: #ffffff;
  border: 1px solid var(--color-gray-200, #dee2e6);
  border-radius: var(--radius-lg, 16px);
  overflow: hidden;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-sm, 0 1px 4px rgba(0, 0, 0, 0.06));
}

.table-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.25rem;
  background-color: var(--color-primary-50, #EEF3FB);
  border-bottom: 1px solid var(--color-primary-100, #CDDAEE);
}

.table-card-title {
  font-size: 0.875rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-primary, #1E3A5F);
}

.table-card-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-full, 9999px);
  background-color: #ffffff;
  color: var(--color-primary, #1E3A5F);
  border: 1px solid var(--color-primary-100, #CDDAEE);
}

.table-card-body {
  overflow-x: auto;
  width: 100%;
}

.unified-schedule-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.875rem;
}

.col-th {
  background-color: var(--color-gray-50, #f8f9fa);
  color: var(--color-gray-700, #495057);
  font-weight: 700;
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid var(--color-gray-200, #dee2e6);
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.04em;
}

.col-th-module {
  width: 38%;
}

.col-th-dates {
  width: 28%;
}

.col-th-lecturers {
  width: 34%;
}

.table-row-item {
  cursor: pointer;
  transition: background-color 0.15s ease;
  border-bottom: 1px solid var(--color-gray-100, #f1f3f5);
}

.table-row-item:hover {
  background-color: var(--color-primary-50, #EEF3FB);
}

.table-row-item:last-child {
  border-bottom: none;
}

.table-row-item--highlighted {
  background-color: rgba(30, 58, 95, 0.06) !important;
  box-shadow: inset 4px 0 0 var(--color-accent, #E87722);
}

.col-td {
  padding: 1rem 1.25rem;
  vertical-align: middle;
  color: var(--color-gray-800, #343a40);
  line-height: 1.5;
}

.module-title-line {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.module-accent-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.module-title-text {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-primary, #1E3A5F);
}

.dates-highlight {
  font-weight: 700;
  color: var(--color-primary, #1E3A5F);
}

.dates-note {
  font-size: 0.75rem;
  color: var(--color-gray-600, #6c757d);
  margin-top: 0.25rem;
}

.lecturers-text {
  font-size: 0.875rem;
  color: var(--color-gray-700, #495057);
}

/* ==========================================================================
   FOOTER & GUIDE DOWNLOAD
   ========================================================================== */

.schedule-footer-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.5rem 0.25rem;
  font-size: 0.8125rem;
  color: var(--color-gray-600, #6c757d);
}

.footer-note-text {
  font-style: italic;
}

.guide-download-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 700;
  color: var(--color-primary, #1E3A5F);
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.15s ease;
}

.guide-download-link:hover {
  color: var(--color-accent, #E87722);
}

.download-icon {
  width: 16px;
  height: 16px;
  stroke-width: 2.2;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .schedule-controls-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .month-selector-group {
    width: 100%;
    padding-bottom: 0.25rem;
  }

  .calendar-day-cell {
    height: 80px;
    min-height: 80px;
    padding: 0.25rem;
  }

  .calendar-event-pill {
    font-size: 0.65rem;
    padding: 0.15rem 0.3rem;
  }

  .col-td {
    padding: 0.75rem 0.875rem;
  }
}
</style>
