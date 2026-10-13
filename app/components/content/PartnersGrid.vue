<script setup lang="ts">
import { inject, computed, onMounted, nextTick, watch } from 'vue'
import { getFacultyAnchor, getModuleSlug } from '~/utils/faculty'

const { page, allModules, localePath } = inject('pageData') as any
const route = useRoute()

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
  <div class="w-full flex flex-col gap-10 font-sans">
    <div v-if="groups.length === 0" class="text-center py-12 text-slate-500 bg-white rounded-3xl border border-slate-200 text-sm">
      <p>No partner groups found.</p>
    </div>

    <!-- Iterate over groups -->
    <div
      v-for="group in groups"
      :key="group.id || group.title"
      class="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm flex flex-col gap-8"
    >
      <!-- Group header -->
      <div class="border-b border-slate-100 pb-5">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">{{ group.title }}</h2>
        <p v-if="group.description" class="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">{{ group.description }}</p>
      </div>

      <!-- Direct members grid -->
      <div
        v-if="group.members && group.members.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
      >
        <div
          v-for="member in group.members"
          :id="getFacultyAnchor(member.name)"
          :key="member.name"
          class="relative p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 group scroll-mt-28 target:ring-2 target:ring-orange-500 target:shadow-2xl target:border-orange-400 overflow-hidden"
        >
          <!-- Luxury Top Accent Indicator for Management Role -->
          <div
            v-if="member.is_management"
            class="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600"
          />

          <!-- Prominent Portrait / Headshot with floating depth -->
          <div class="relative shrink-0">
            <div class="relative rounded-full p-1 bg-gradient-to-tr from-slate-100 to-slate-200 group-hover:from-orange-200 group-hover:to-amber-200 transition-colors shadow-xs">
              <NuxtImg
                v-if="member.image"
                :src="member.image"
                :alt="member.name"
                class="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover shadow-md ring-2 ring-white group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div
                v-else
                class="w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center text-3xl font-black text-white shadow-md ring-2 ring-white"
                :style="{ background: avatarColor(member.name) }"
              >
                {{ getInitials(member.name) }}
              </div>
            </div>
          </div>

          <!-- Info Details -->
          <div class="flex flex-col gap-2.5 min-w-0 flex-1 w-full">
            <div class="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-2 flex-wrap">
              <h3 class="text-lg sm:text-xl font-black text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
                {{ member.name }}
              </h3>
              <UBadge
                v-if="member.is_management"
                :color="member.management_role?.toLowerCase().includes('director') || member.management_role?.toLowerCase().includes('giám đốc') ? 'primary' : 'secondary'"
                variant="solid"
                size="sm"
                class="font-black text-xs px-2.5 py-1 rounded-lg shadow-2xs shrink-0"
              >
                {{ member.management_role }}
              </UBadge>
            </div>

            <!-- Institution Badge -->
            <div v-if="member.institution" class="flex justify-center sm:justify-start">
              <UBadge
                color="neutral"
                variant="outline"
                size="sm"
                class="font-bold text-xs px-2.5 py-1 rounded-lg hover:border-slate-400 transition-colors"
              >
                <a v-if="member.institution_link" :href="member.institution_link" target="_blank" rel="noopener noreferrer" class="hover:underline flex items-center gap-1">
                  <span>{{ member.institution }}</span>
                  <UIcon name="i-lucide-external-link" class="size-3 text-slate-400" />
                </a>
                <template v-else>{{ member.institution }}</template>
              </UBadge>
            </div>

            <p v-if="member.roles" class="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {{ member.roles }}
            </p>

            <!-- Exposed Email Chip -->
            <div v-if="member.email" class="pt-1 flex justify-center sm:justify-start">
              <a
                :href="`mailto:${member.email}`"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold text-orange-700 bg-orange-50/70 hover:bg-orange-100 hover:text-orange-800 border border-orange-200/60 transition-colors"
              >
                <UIcon name="i-lucide-mail" class="size-3.5 shrink-0 text-orange-500" />
                <span>{{ member.email }}</span>
              </a>
            </div>

            <!-- Module tags with clean canonical fragment link (#slug) -->
            <div
              v-if="getLecturerModules(member.name).length > 0"
              class="pt-3 flex flex-col gap-1.5 border-t border-slate-100 mt-1"
            >
              <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">Lecturer of:</span>
              <div class="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                <NuxtLink
                  v-for="mod in getLecturerModules(member.name)"
                  :key="mod.path || mod.id"
                  :to="`${localePath ? localePath('/program-structure/modules') : '/program-structure/modules'}#${getModuleSlug(mod)}`"
                  :title="`View ${mod.title} syllabus in Handbook`"
                  class="group/modlink"
                >
                  <span
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 bg-slate-50 hover:bg-orange-500 hover:text-white border border-slate-200/90 hover:border-orange-500 transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer"
                  >
                    <span>{{ mod.title }}</span>
                    <UIcon name="i-lucide-arrow-up-right" class="size-3 text-slate-400 group-hover/modlink:text-white transition-colors" />
                  </span>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Subgroups (chairs / institutes) -->
      <div
        v-if="group.subgroups && group.subgroups.length > 0"
        class="flex flex-col gap-10 pt-4 border-t border-slate-100"
      >
        <div
          v-for="subgroup in group.subgroups"
          :key="subgroup.title"
          class="flex flex-col gap-5"
        >
          <!-- Subgroup header -->
          <div>
            <h3 class="text-xl font-extrabold text-slate-900 mb-1">{{ subgroup.title }}</h3>
            <p v-if="subgroup.description" class="text-xs sm:text-sm text-slate-600 leading-relaxed">{{ subgroup.description }}</p>
          </div>

          <!-- Subgroup members grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div
              v-for="member in subgroup.members"
              :id="getFacultyAnchor(member.name)"
              :key="member.name"
              class="relative p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 group scroll-mt-28 target:ring-2 target:ring-orange-500 target:shadow-2xl target:border-orange-400 overflow-hidden"
            >
              <!-- Luxury Top Accent Indicator for Management Role -->
              <div
                v-if="member.is_management"
                class="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600"
              />

              <!-- Prominent Larger Portrait / Headshot with floating depth -->
              <div class="relative shrink-0">
                <div class="relative rounded-full p-1 bg-gradient-to-tr from-slate-100 to-slate-200 group-hover:from-orange-200 group-hover:to-amber-200 transition-colors shadow-xs">
                  <NuxtImg
                    v-if="member.image"
                    :src="member.image"
                    :alt="member.name"
                    class="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover shadow-md ring-2 ring-white group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div
                    v-else
                    class="w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center text-3xl font-black text-white shadow-md ring-2 ring-white"
                    :style="{ background: avatarColor(member.name) }"
                  >
                    {{ getInitials(member.name) }}
                  </div>
                </div>
              </div>

              <!-- Info Details -->
              <div class="flex flex-col gap-2.5 min-w-0 flex-1 w-full">
                <div class="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-2 flex-wrap">
                  <h4 class="text-lg sm:text-xl font-black text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
                    {{ member.name }}
                  </h4>
                  <UBadge
                    v-if="member.is_management"
                    :color="member.management_role?.toLowerCase().includes('director') || member.management_role?.toLowerCase().includes('giám đốc') ? 'primary' : 'secondary'"
                    variant="solid"
                    size="sm"
                    class="font-black text-xs px-2.5 py-1 rounded-lg shadow-2xs shrink-0"
                  >
                    {{ member.management_role }}
                  </UBadge>
                </div>

                <div v-if="member.institution" class="flex justify-center sm:justify-start">
                  <UBadge
                    color="neutral"
                    variant="outline"
                    size="sm"
                    class="font-bold text-xs px-2.5 py-1 rounded-lg hover:border-slate-400 transition-colors"
                  >
                    <a v-if="member.institution_link" :href="member.institution_link" target="_blank" rel="noopener noreferrer" class="hover:underline flex items-center gap-1">
                      <span>{{ member.institution }}</span>
                      <UIcon name="i-lucide-external-link" class="size-3 text-slate-400" />
                    </a>
                    <template v-else>{{ member.institution }}</template>
                  </UBadge>
                </div>

                <p v-if="member.roles" class="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  {{ member.roles }}
                </p>

                <!-- Exposed Email Chip -->
                <div v-if="member.email" class="pt-1 flex justify-center sm:justify-start">
                  <a
                    :href="`mailto:${member.email}`"
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold text-orange-700 bg-orange-50/70 hover:bg-orange-100 hover:text-orange-800 border border-orange-200/60 transition-colors"
                  >
                    <UIcon name="i-lucide-mail" class="size-3.5 shrink-0 text-orange-500" />
                    <span>{{ member.email }}</span>
                  </a>
                </div>

                <!-- Module tags with clean canonical fragment link (#slug) -->
                <div
                  v-if="getLecturerModules(member.name).length > 0"
                  class="pt-3 flex flex-col gap-1.5 border-t border-slate-100 mt-1"
                >
                  <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">Lecturer of:</span>
                  <div class="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                    <NuxtLink
                      v-for="mod in getLecturerModules(member.name)"
                      :key="mod.path || mod.id"
                      :to="`${localePath ? localePath('/program-structure/modules') : '/program-structure/modules'}#${getModuleSlug(mod)}`"
                      :title="`View ${mod.title} syllabus in Handbook`"
                      class="group/modlink"
                    >
                      <span
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 bg-slate-50 hover:bg-orange-500 hover:text-white border border-slate-200/90 hover:border-orange-500 transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer"
                      >
                        <span>{{ mod.title }}</span>
                        <UIcon name="i-lucide-arrow-up-right" class="size-3 text-slate-400 group-hover/modlink:text-white transition-colors" />
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
  </div>
</template>
