<script setup lang="ts">
import { inject, computed, onMounted, nextTick, watch } from 'vue'
import { getFacultyAnchor, getModuleSlug } from '~/utils/faculty'

const { page, allModules, localePath } = inject('pageData') as any
const route = useRoute()
const { locale } = useI18n()

// Resolve the page groups from meta
const groups = computed<any[]>(() => {
  if (!page?.value) return []
  return page.value?.meta?.groups ?? page.value?.groups ?? []
})

// ── Helper: initials from full name ─────────────────────────────────────────
const getInitials = (name: string): string => {
  if (!name) return 'L'
  const cleaned = name
    .replace(/^(Dr\.|Prof\.|apl\.|Ing\.|rer\.|nat\.|habil\.|h\. c\.|mult\.|Mr\.)\s*/gi, '')
    .trim()
  const parts = cleaned.split(' ').filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return (parts[0]?.[0] ?? 'L').toUpperCase()
}

// ── Helper: modules taught by a given lecturer with normalized title matching ─
const getLecturerModules = (lecturerName: string): any[] => {
  if (!allModules?.value || !lecturerName) return []
  const normLecturer = getFacultyAnchor(lecturerName)
  return allModules.value.filter((mod: any) => {
    const list: string[] = mod.lecturers ?? mod.meta?.lecturers ?? []
    return list.some((l: string) => getFacultyAnchor(l) === normLecturer)
  })
}

// ── Avatar color palette (deterministic per name) ────────────────────────────
const PALETTE = [
  '#1e3a5f', '#e87722', '#009fdf', '#2e5280', '#c95e0a', '#495057'
]
const avatarColor = (name: string): string => {
  if (!name) return PALETTE[0]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return PALETTE[Math.abs(hash) % PALETTE.length]
}

// ── Helper: infer affiliation badge details ──────────────────────────────────
const getAffiliation = (member: any, group?: any, subgroup?: any): { label: string, icon: string, iconColor: string, code: string } => {
  if (member.institution) {
    const inst = member.institution
    if (/vgu/i.test(inst)) return { label: 'Vietnamese-German University', icon: 'i-lucide-school', iconColor: 'text-orange-500', code: 'VGU' }
    if (/fraunhofer/i.test(inst)) return { label: 'Fraunhofer IMWS Halle', icon: 'i-lucide-building-2', iconColor: 'text-emerald-600', code: 'Fraunhofer' }
    if (/freiberg/i.test(inst)) return { label: 'TU Bergakademie Freiberg', icon: 'i-lucide-building-2', iconColor: 'text-emerald-600', code: 'TU Freiberg' }
    const firstPart = inst.split(',')[0].split('(')[0].trim()
    return { label: firstPart || inst, icon: 'i-lucide-building', iconColor: 'text-[#1E3A5F]', code: 'Partner' }
  }
  if (group?.id === 'vgu-core' || group?.id === 'support') {
    return { label: 'Vietnamese-German University', icon: 'i-lucide-school', iconColor: 'text-orange-500', code: 'VGU' }
  }
  if (subgroup?.title) {
    return { label: subgroup.title, icon: 'i-lucide-landmark', iconColor: 'text-[#009FDF]', code: 'OVGU' }
  }
  return { label: 'Otto von Guericke University', icon: 'i-lucide-landmark', iconColor: 'text-[#009FDF]', code: 'OVGU' }
}

const isProfessor = (name: string): boolean => {
  return /prof\./i.test(name)
}

// Smooth scroll to targeted faculty member card if hash present
const scrollToTargetFaculty = () => {
  if (route.hash) {
    nextTick(() => {
      const el = document.querySelector(route.hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
  }
}

onMounted(() => {
  setTimeout(scrollToTargetFaculty, 150)
})

watch(() => route.hash, () => {
  scrollToTargetFaculty()
})
</script>

<template>
  <div class="w-full flex flex-col gap-14 font-sans">
    <div v-if="groups.length === 0" class="text-center py-12 text-slate-500 bg-white rounded-3xl border border-slate-200 text-sm shadow-xs">
      <p>No partner groups found.</p>
    </div>

    <!-- Iterate over groups as distinguished sections directly on page layout -->
    <section
      v-for="group in groups"
      :key="group.id || group.title"
      class="flex flex-col gap-7"
    >
      <!-- Group Section Header with Gradient Accent Bar -->
      <div class="flex flex-col gap-2 pb-4 border-b border-slate-200/90">
        <div class="flex items-center gap-3">
          <div class="h-8 w-1.5 rounded-full bg-gradient-to-b from-orange-500 to-amber-500 shrink-0" />
          <h2 class="text-2xl sm:text-3xl font-black text-[#1E3A5F] tracking-tight">
            {{ group.title }}
          </h2>
        </div>
        <p v-if="group.description" class="text-sm sm:text-base text-slate-600 leading-relaxed max-w-4xl pl-4">
          {{ group.description }}
        </p>
      </div>

      <!-- Direct Members Grid (High-contrast, elevated pure white cards) -->
      <div
        v-if="group.members && group.members.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
      >
        <div
          v-for="member in group.members"
          :id="getFacultyAnchor(member.name)"
          :key="member.name"
          class="relative rounded-3xl bg-white border border-slate-200/90 shadow-[0_4px_20px_-2px_rgba(30,58,95,0.08),0_2px_6px_-1px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_35px_-8px_rgba(30,58,95,0.16)] hover:border-orange-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden group scroll-mt-28 target:ring-4 target:ring-orange-500/80 target:shadow-2xl target:border-orange-400 target:-translate-y-2"
        >
          <!-- Distinct Top Accent Line -->
          <div
            class="h-1.5 w-full shrink-0"
            :class="member.is_management
              ? 'bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600'
              : (getAffiliation(member, group).code === 'VGU'
                  ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-[#1E3A5F]'
                  : 'bg-gradient-to-r from-[#1E3A5F] via-[#009FDF] to-orange-500')"
          />

          <!-- Top Institutional Header Bar -->
          <div class="px-5 sm:px-6 py-3 bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/70 flex items-center justify-between gap-2.5 flex-wrap">
            <div class="flex items-center gap-2 min-w-0">
              <UIcon :name="getAffiliation(member, group).icon" class="size-4 shrink-0" :class="getAffiliation(member, group).iconColor" />
              <span class="text-xs font-bold text-[#1E3A5F] truncate max-w-[200px] sm:max-w-[280px]" :title="getAffiliation(member, group).label">
                {{ getAffiliation(member, group).label }}
              </span>
            </div>

            <!-- Role / Management Badge -->
            <div class="flex items-center gap-1.5 shrink-0">
              <UBadge
                v-if="member.is_management"
                :color="member.management_role?.toLowerCase().includes('director') || member.management_role?.toLowerCase().includes('giám đốc') ? 'primary' : 'secondary'"
                variant="solid"
                size="xs"
                class="font-black text-[11px] px-2.5 py-0.5 rounded-lg shadow-2xs flex items-center gap-1"
              >
                <UIcon name="i-lucide-shield-check" class="size-3" />
                <span>{{ member.management_role }}</span>
              </UBadge>
              <UBadge
                v-else
                color="neutral"
                variant="subtle"
                size="xs"
                class="font-bold text-[10px] uppercase tracking-wider text-slate-600 px-2 py-0.5 rounded-md"
              >
                {{ isProfessor(member.name) ? 'Professor' : (group.id === 'support' ? 'Laboratory Engineer' : 'Faculty Member') }}
              </UBadge>
            </div>
          </div>

          <!-- Main Card Body -->
          <div class="p-5 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 flex-1">
            <!-- Framed Portrait with Ring -->
            <div class="relative shrink-0">
              <div class="relative rounded-2xl p-1 bg-gradient-to-tr from-slate-200 via-white to-slate-200 shadow-md group-hover:shadow-lg ring-2 ring-slate-100 group-hover:ring-orange-300 transition-all">
                <NuxtImg
                  v-if="member.image"
                  :src="member.image"
                  :alt="member.name"
                  class="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div
                  v-else
                  class="w-24 h-24 sm:w-28 sm:h-28 rounded-xl flex items-center justify-center text-2xl font-black text-white shadow-inner"
                  :style="{ background: avatarColor(member.name) }"
                >
                  {{ getInitials(member.name) }}
                </div>
              </div>
            </div>

            <!-- Info Column -->
            <div class="flex flex-col gap-2 min-w-0 flex-1 w-full">
              <!-- Full Name -->
              <h3 class="text-lg sm:text-xl font-black text-[#1E3A5F] group-hover:text-orange-600 transition-colors leading-snug tracking-tight">
                {{ member.name }}
              </h3>

              <!-- Academic Roles & Chairs -->
              <p v-if="member.roles" class="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                {{ member.roles }}
              </p>

              <!-- External Institution Link (if any) -->
              <div v-if="member.institution" class="flex justify-center sm:justify-start">
                <a
                  v-if="member.institution_link"
                  :href="member.institution_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-orange-600 hover:underline"
                >
                  <UIcon name="i-lucide-building-2" class="size-3.5 text-slate-400" />
                  <span>{{ member.institution }}</span>
                  <UIcon name="i-lucide-external-link" class="size-3 text-slate-400" />
                </a>
                <span v-else class="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                  <UIcon name="i-lucide-building-2" class="size-3.5 text-slate-400" />
                  <span>{{ member.institution }}</span>
                </span>
              </div>

              <!-- Email Chip -->
              <div v-if="member.email" class="pt-0.5 flex justify-center sm:justify-start">
                <a
                  :href="`mailto:${member.email}`"
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold text-[#1E3A5F] bg-slate-100 hover:bg-orange-500 hover:text-white border border-slate-200/80 hover:border-orange-500 transition-all duration-200 shadow-2xs group/mail"
                >
                  <UIcon name="i-lucide-mail" class="size-3.5 text-orange-500 group-hover/mail:text-white transition-colors" />
                  <span>{{ member.email }}</span>
                </a>
              </div>

              <!-- Module Chips Deep-Linked to Handbook (#slug) -->
              <div
                v-if="getLecturerModules(member.name).length > 0"
                class="pt-3 flex flex-col gap-1.5 border-t border-slate-100 mt-1"
              >
                <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1 justify-center sm:justify-start">
                  <UIcon name="i-lucide-book-open" class="size-3 text-orange-500" />
                  <span>{{ locale === 'vi' ? 'Môn học phụ trách:' : 'Courses Taught in MSI:' }}</span>
                </span>
                <div class="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                  <NuxtLink
                    v-for="mod in getLecturerModules(member.name)"
                    :key="mod.path || mod.id"
                    :to="`${localePath ? localePath('/program-structure/modules') : '/program-structure/modules'}#${getModuleSlug(mod)}`"
                    :title="`View ${mod.title} syllabus in Handbook`"
                    class="group/modlink"
                  >
                    <span
                      class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-800 bg-slate-50 hover:bg-[#1E3A5F] hover:text-white border border-slate-200 hover:border-[#1E3A5F] transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer"
                    >
                      <span>{{ mod.title }}</span>
                      <UIcon name="i-lucide-arrow-up-right" class="size-3 text-slate-400 group-hover/modlink:text-orange-400 transition-colors" />
                    </span>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Subgroups (Chairs / Partner Institutes) -->
      <div
        v-if="group.subgroups && group.subgroups.length > 0"
        class="flex flex-col gap-8 mt-2"
      >
        <div
          v-for="subgroup in group.subgroups"
          :key="subgroup.title"
          class="flex flex-col gap-6 p-6 sm:p-8 rounded-3xl bg-slate-200/50 border border-slate-200/90 shadow-2xs"
        >
          <!-- Subgroup Header -->
          <div class="flex items-center justify-between gap-4 flex-wrap border-b border-slate-200 pb-4">
            <div>
              <h3 class="text-xl font-black text-[#1E3A5F] tracking-tight flex items-center gap-2">
                <UIcon name="i-lucide-award" class="size-5 text-orange-500 shrink-0" />
                <span>{{ subgroup.title }}</span>
              </h3>
              <p v-if="subgroup.description" class="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                {{ subgroup.description }}
              </p>
            </div>
            <a
              v-if="subgroup.link"
              :href="subgroup.link"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 bg-white px-3.5 py-2 rounded-xl border border-slate-200 hover:border-orange-300 shadow-2xs hover:shadow-xs transition-colors"
            >
              <span>Chair Website</span>
              <UIcon name="i-lucide-external-link" class="size-3.5" />
            </a>
          </div>

          <!-- Subgroup Members Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div
              v-for="member in subgroup.members"
              :id="getFacultyAnchor(member.name)"
              :key="member.name"
              class="relative rounded-3xl bg-white border border-slate-200/90 shadow-[0_4px_20px_-2px_rgba(30,58,95,0.08),0_2px_6px_-1px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_35px_-8px_rgba(30,58,95,0.16)] hover:border-orange-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden group scroll-mt-28 target:ring-4 target:ring-orange-500/80 target:shadow-2xl target:border-orange-400 target:-translate-y-2"
            >
              <!-- Distinct Top Accent Line -->
              <div
                class="h-1.5 w-full shrink-0"
                :class="member.is_management
                  ? 'bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600'
                  : 'bg-gradient-to-r from-[#1E3A5F] via-[#009FDF] to-orange-500'"
              />

              <!-- Top Institutional Header Bar -->
              <div class="px-5 sm:px-6 py-3 bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/70 flex items-center justify-between gap-2.5 flex-wrap">
                <div class="flex items-center gap-2 min-w-0">
                  <UIcon :name="getAffiliation(member, group, subgroup).icon" class="size-4 shrink-0" :class="getAffiliation(member, group, subgroup).iconColor" />
                  <span class="text-xs font-bold text-[#1E3A5F] truncate max-w-[200px] sm:max-w-[280px]" :title="getAffiliation(member, group, subgroup).label">
                    {{ getAffiliation(member, group, subgroup).label }}
                  </span>
                </div>

                <!-- Role / Management Badge -->
                <div class="flex items-center gap-1.5 shrink-0">
                  <UBadge
                    v-if="member.is_management"
                    :color="member.management_role?.toLowerCase().includes('director') || member.management_role?.toLowerCase().includes('giám đốc') ? 'primary' : 'secondary'"
                    variant="solid"
                    size="xs"
                    class="font-black text-[11px] px-2.5 py-0.5 rounded-lg shadow-2xs flex items-center gap-1"
                  >
                    <UIcon name="i-lucide-shield-check" class="size-3" />
                    <span>{{ member.management_role }}</span>
                  </UBadge>
                  <UBadge
                    v-else
                    color="neutral"
                    variant="subtle"
                    size="xs"
                    class="font-bold text-[10px] uppercase tracking-wider text-slate-600 px-2 py-0.5 rounded-md"
                  >
                    {{ isProfessor(member.name) ? 'Professor' : 'Faculty Member' }}
                  </UBadge>
                </div>
              </div>

              <!-- Main Card Body -->
              <div class="p-5 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 flex-1">
                <!-- Framed Portrait with Ring -->
                <div class="relative shrink-0">
                  <div class="relative rounded-2xl p-1 bg-gradient-to-tr from-slate-200 via-white to-slate-200 shadow-md group-hover:shadow-lg ring-2 ring-slate-100 group-hover:ring-orange-300 transition-all">
                    <NuxtImg
                      v-if="member.image"
                      :src="member.image"
                      :alt="member.name"
                      class="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div
                      v-else
                      class="w-24 h-24 sm:w-28 sm:h-28 rounded-xl flex items-center justify-center text-2xl font-black text-white shadow-inner"
                      :style="{ background: avatarColor(member.name) }"
                    >
                      {{ getInitials(member.name) }}
                    </div>
                  </div>
                </div>

                <!-- Info Column -->
                <div class="flex flex-col gap-2 min-w-0 flex-1 w-full">
                  <!-- Full Name -->
                  <h4 class="text-lg sm:text-xl font-black text-[#1E3A5F] group-hover:text-orange-600 transition-colors leading-snug tracking-tight">
                    {{ member.name }}
                  </h4>

                  <!-- Academic Roles & Chairs -->
                  <p v-if="member.roles" class="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {{ member.roles }}
                  </p>

                  <!-- Email Chip -->
                  <div v-if="member.email" class="pt-0.5 flex justify-center sm:justify-start">
                    <a
                      :href="`mailto:${member.email}`"
                      class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold text-[#1E3A5F] bg-slate-100 hover:bg-orange-500 hover:text-white border border-slate-200/80 hover:border-orange-500 transition-all duration-200 shadow-2xs group/mail"
                    >
                      <UIcon name="i-lucide-mail" class="size-3.5 text-orange-500 group-hover/mail:text-white transition-colors" />
                      <span>{{ member.email }}</span>
                    </a>
                  </div>

                  <!-- Module Chips Deep-Linked to Handbook (#slug) -->
                  <div
                    v-if="getLecturerModules(member.name).length > 0"
                    class="pt-3 flex flex-col gap-1.5 border-t border-slate-100 mt-1"
                  >
                    <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1 justify-center sm:justify-start">
                      <UIcon name="i-lucide-book-open" class="size-3 text-orange-500" />
                      <span>{{ locale === 'vi' ? 'Môn học phụ trách:' : 'Courses Taught in MSI:' }}</span>
                    </span>
                    <div class="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                      <NuxtLink
                        v-for="mod in getLecturerModules(member.name)"
                        :key="mod.path || mod.id"
                        :to="`${localePath ? localePath('/program-structure/modules') : '/program-structure/modules'}#${getModuleSlug(mod)}`"
                        :title="`View ${mod.title} syllabus in Handbook`"
                        class="group/modlink"
                      >
                        <span
                          class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-800 bg-slate-50 hover:bg-[#1E3A5F] hover:text-white border border-slate-200 hover:border-[#1E3A5F] transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer"
                        >
                          <span>{{ mod.title }}</span>
                          <UIcon name="i-lucide-arrow-up-right" class="size-3 text-slate-400 group-hover/modlink:text-orange-400 transition-colors" />
                        </span>
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
