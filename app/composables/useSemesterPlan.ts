import { ref, computed } from 'vue'
import defaultPlanData from '~/data/semesterPlan.json'

export interface ScheduleItem {
  module_slug: string
  start_date: string
  end_date: string
  display_date?: string
  is_semester_long?: boolean
  notes?: string
}

export interface IntakeSchedule {
  id: string
  name: string
  semester_number: number
  schedule: ScheduleItem[]
}

export interface SemesterPlanSchema {
  academic_year: string
  term: string
  intakes: IntakeSchedule[]
}

export function useSemesterPlan(initialIntake = 'intake-3-2026') {
  const planData = ref<SemesterPlanSchema>(defaultPlanData as SemesterPlanSchema)
  const selectedIntakeId = ref<string>(initialIntake)

  const academicYear = computed(() => planData.value.academic_year)
  const term = computed(() => planData.value.term)
  const intakes = computed(() => planData.value.intakes)

  const selectedIntake = computed<IntakeSchedule | undefined>(() => {
    if (selectedIntakeId.value === 'all') return undefined
    return intakes.value.find(i => i.id === selectedIntakeId.value) || intakes.value[0]
  })

  function selectIntake(id: string) {
    selectedIntakeId.value = id
  }

  return {
    academicYear,
    term,
    intakes,
    selectedIntakeId,
    selectedIntake,
    selectIntake
  }
}
