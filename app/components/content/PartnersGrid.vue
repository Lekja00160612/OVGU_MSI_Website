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

      <!-- Direct Members Grid (High-contrast, clean, professional white cards) -->
      <div
        v-if="group.members && group.members.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
      >
        <div
          v-for="member in group.members"
          :id="getFacultyAnchor(member.name)"
          :key="member.name"
          class="relative rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-orange-300 hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left p-5 sm:p-6 gap-5 group scroll-mt-28 target:ring-4 target:ring-orange-500/80 target:shadow-2xl target:border-orange-400 target:-translate-y-1"
        >
          <!-- Portrait with Clean Subtle Ring -->
          <div class="relative shrink-0">
            <NuxtImg
              v-if="member.image"
              :src="member.image"
              :alt="member.name"
              class="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-1 ring-slate-200 group-hover:ring-orange-300 shadow-xs group-hover:scale-105 transition-all duration-300"
            />
            <div
              v-else
              class="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-inner"
              :style="{ background: avatarColor(member.name) }"
            >
              {{ getInitials(member.name) }}
            </div>
          </div>

          <!-- Info Details -->
          <div class="flex flex-col gap-1.5 min-w-0 flex-1 w-full">
            <!-- Leadership Role Badge (Only for Program Director / Coordinator) -->
            <div v-if="member.is_management" class="flex justify-center sm:justify-start">
              <span
                class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wide"
                :class="member.management_role?.toLowerCase().includes('director') || member.management_role?.toLowerCase().includes('giám đốc')
                  ? 'bg-orange-100 text-orange-800 border border-orange-200/80'
                  : 'bg-slate-100 text-[#1E3A5F] border border-slate-200/80'"
              >
                <UIcon name="i-lucide-shield-check" class="size-3 text-orange-500" />
                <span>{{ member.management_role }}</span>
              </span>
            </div>

            <!-- Full Name -->
            <h3 class="text-lg sm:text-xl font-bold text-[#1E3A5F] group-hover:text-orange-600 transition-colors leading-snug tracking-tight">
              {{ member.name }}
            </h3>

            <!-- Position / Academic Role -->
            <p v-if="member.roles" class="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {{ member.roles }}
            </p>

            <!-- External Partner Institution (Clean link) -->
            <div v-if="member.institution" class="flex justify-center sm:justify-start">
              <a
                v-if="member.institution_link"
                :href="member.institution_link"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-orange-600 transition-colors"
              >
                <UIcon name="i-lucide-building-2" class="size-3.5 text-slate-400" />
                <span>{{ member.institution }}</span>
                <UIcon name="i-lucide-external-link" class="size-3 text-slate-400" />
              </a>
              <span v-else class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <UIcon name="i-lucide-building-2" class="size-3.5 text-slate-400" />
                <span>{{ member.institution }}</span>
              </span>
            </div>

            <!-- Email Chip -->
            <div v-if="member.email" class="pt-0.5 flex justify-center sm:justify-start">
              <a
                :href="`mailto:${member.email}`"
                class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-orange-600 transition-colors"
              >
                <UIcon name="i-lucide-mail" class="size-3.5 text-orange-500" />
                <span>{{ member.email }}</span>
              </a>
            </div>

            <!-- Courses Taught in MSI -->
            <div
              v-if="getLecturerModules(member.name).length > 0"
              class="pt-2 flex flex-wrap items-center gap-1.5 justify-center sm:justify-start"
            >
              <span class="text-[11px] font-semibold text-slate-400 mr-1">
                {{ locale === 'vi' ? 'Môn phụ trách:' : 'Courses:' }}
              </span>
              <NuxtLink
                v-for="mod in getLecturerModules(member.name)"
                :key="mod.path || mod.id"
                :to="`${localePath ? localePath('/program-structure/modules') : '/program-structure/modules'}#${getModuleSlug(mod)}`"
                :title="`View ${mod.title} syllabus in Handbook`"
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-orange-50 hover:text-orange-600 border border-slate-200/60 hover:border-orange-300 transition-colors cursor-pointer"
              >
                <span>{{ mod.title }}</span>
                <UIcon name="i-lucide-arrow-up-right" class="size-3 text-slate-400" />
              </NuxtLink>
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
              class="relative rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-orange-300 hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left p-5 sm:p-6 gap-5 group scroll-mt-28 target:ring-4 target:ring-orange-500/80 target:shadow-2xl target:border-orange-400 target:-translate-y-1"
            >
              <!-- Portrait with Clean Subtle Ring -->
              <div class="relative shrink-0">
                <NuxtImg
                  v-if="member.image"
                  :src="member.image"
                  :alt="member.name"
                  class="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-1 ring-slate-200 group-hover:ring-orange-300 shadow-xs group-hover:scale-105 transition-all duration-300"
                />
                <div
                  v-else
                  class="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-inner"
                  :style="{ background: avatarColor(member.name) }"
                >
                  {{ getInitials(member.name) }}
                </div>
              </div>

              <!-- Info Details -->
              <div class="flex flex-col gap-1.5 min-w-0 flex-1 w-full">
                <!-- Leadership Role Badge (Only for Program Director / Coordinator) -->
                <div v-if="member.is_management" class="flex justify-center sm:justify-start">
                  <span
                    class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wide"
                    :class="member.management_role?.toLowerCase().includes('director') || member.management_role?.toLowerCase().includes('giám đốc')
                      ? 'bg-orange-100 text-orange-800 border border-orange-200/80'
                      : 'bg-slate-100 text-[#1E3A5F] border border-slate-200/80'"
                  >
                    <UIcon name="i-lucide-shield-check" class="size-3 text-orange-500" />
                    <span>{{ member.management_role }}</span>
                  </span>
                </div>

                <!-- Full Name -->
                <h3 class="text-lg sm:text-xl font-bold text-[#1E3A5F] group-hover:text-orange-600 transition-colors leading-snug tracking-tight">
                  {{ member.name }}
                </h3>

                <!-- Position / Academic Role -->
                <p v-if="member.roles" class="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  {{ member.roles }}
                </p>

                <!-- External Partner Institution (Clean link) -->
                <div v-if="member.institution" class="flex justify-center sm:justify-start">
                  <a
                    v-if="member.institution_link"
                    :href="member.institution_link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-orange-600 transition-colors"
                  >
                    <UIcon name="i-lucide-building-2" class="size-3.5 text-slate-400" />
                    <span>{{ member.institution }}</span>
                    <UIcon name="i-lucide-external-link" class="size-3 text-slate-400" />
                  </a>
                  <span v-else class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <UIcon name="i-lucide-building-2" class="size-3.5 text-slate-400" />
                    <span>{{ member.institution }}</span>
                  </span>
                </div>

                <!-- Email Chip -->
                <div v-if="member.email" class="pt-0.5 flex justify-center sm:justify-start">
                  <a
                    :href="`mailto:${member.email}`"
                    class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-orange-600 transition-colors"
                  >
                    <UIcon name="i-lucide-mail" class="size-3.5 text-orange-500" />
                    <span>{{ member.email }}</span>
                  </a>
                </div>

                <!-- Courses Taught in MSI -->
                <div
                  v-if="getLecturerModules(member.name).length > 0"
                  class="pt-2 flex flex-wrap items-center gap-1.5 justify-center sm:justify-start"
                >
                  <span class="text-[11px] font-semibold text-slate-400 mr-1">
                    {{ locale === 'vi' ? 'Môn phụ trách:' : 'Courses:' }}
                  </span>
                  <NuxtLink
                    v-for="mod in getLecturerModules(member.name)"
                    :key="mod.path || mod.id"
                    :to="`${localePath ? localePath('/program-structure/modules') : '/program-structure/modules'}#${getModuleSlug(mod)}`"
                    :title="`View ${mod.title} syllabus in Handbook`"
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-orange-50 hover:text-orange-600 border border-slate-200/60 hover:border-orange-300 transition-colors cursor-pointer"
                  >
                    <span>{{ mod.title }}</span>
                    <UIcon name="i-lucide-arrow-up-right" class="size-3 text-slate-400" />
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
