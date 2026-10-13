<script setup lang="ts">
import { inject, computed, onMounted, nextTick, watch } from 'vue'
import { getFacultyAnchor } from '~/utils/faculty'

const { page, allModules, localePath } = inject('pageData') as any
const route = useRoute()

// Resolve the page groups from meta (mirrors the partners-lecturers.vue pattern)
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
      class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs flex flex-col gap-8"
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
          class="p-6 rounded-3xl border transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 group hover:shadow-md scroll-mt-28 target:ring-2 target:ring-orange-500 target:bg-orange-50/80 target:shadow-lg"
          :class="member.is_management ? 'bg-orange-50/50 border-orange-200 shadow-2xs' : 'bg-slate-50/70 border-slate-200/90'"
        >
          <!-- Prominent Larger Portrait / Headshot -->
          <div class="relative shrink-0">
            <NuxtImg
              v-if="member.image"
              :src="member.image"
              :alt="member.name"
              class="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full object-cover shadow-md ring-4 ring-orange-500/20 group-hover:ring-orange-500/50 group-hover:scale-105 transition-all duration-300"
              loading="lazy"
            />
            <div
              v-else
              class="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full flex items-center justify-center text-3xl font-black text-white shadow-md ring-4 ring-orange-500/20"
              :style="{ background: avatarColor(member.name) }"
            >
              {{ getInitials(member.name) }}
            </div>
          </div>

          <!-- Info Details & Larger Badges -->
          <div class="flex flex-col gap-2.5 min-w-0 flex-1 w-full">
            <div class="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-2 flex-wrap">
              <h3 class="text-lg sm:text-xl font-black text-slate-900 leading-snug">{{ member.name }}</h3>
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
                class="font-bold text-xs px-2.5 py-1 rounded-lg"
              >
                <a v-if="member.institution_link" :href="member.institution_link" target="_blank" rel="noopener noreferrer" class="hover:underline">
                  {{ member.institution }}
                </a>
                <template v-else>{{ member.institution }}</template>
              </UBadge>
            </div>

            <p v-if="member.roles" class="text-xs sm:text-sm text-slate-600 leading-relaxed">{{ member.roles }}</p>

            <!-- Exposed Email -->
            <div v-if="member.email" class="pt-1 flex justify-center sm:justify-start">
              <a :href="`mailto:${member.email}`" class="inline-flex items-center gap-2 text-xs sm:text-sm text-orange-600 hover:text-orange-700 transition-colors font-bold">
                <UIcon name="i-lucide-mail" class="size-4 shrink-0" />
                <span>{{ member.email }}</span>
              </a>
            </div>

            <!-- Module tags with deep links to handbook -->
            <div
              v-if="getLecturerModules(member.name).length > 0"
              class="pt-3 flex flex-col gap-1.5 border-t border-slate-200/80 mt-1"
            >
              <span class="text-[11px] font-black uppercase tracking-wider text-slate-400">Lecturer of:</span>
              <div class="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                <NuxtLink
                  v-for="mod in getLecturerModules(member.name)"
                  :key="mod.path || mod.id"
                  :to="{
                    path: localePath ? localePath('/program-structure/modules') : '/program-structure/modules',
                    query: { module: mod.title }
                  }"
                  :title="`View ${mod.title} in Course Handbook & Syllabi`"
                  class="group/modlink"
                >
                  <UBadge
                    color="primary"
                    variant="subtle"
                    size="sm"
                    class="font-bold text-xs px-2.5 py-1 rounded-lg group-hover/modlink:bg-orange-500 group-hover/modlink:text-white transition-all cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>{{ mod.title }}</span>
                    <UIcon name="i-lucide-arrow-up-right" class="size-3 opacity-60 group-hover/modlink:opacity-100" />
                  </UBadge>
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
              class="p-6 rounded-3xl border bg-slate-50/70 border-slate-200/90 transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 group hover:shadow-md scroll-mt-28 target:ring-2 target:ring-orange-500 target:bg-orange-50/80 target:shadow-lg"
            >
              <!-- Prominent Larger Portrait / Headshot -->
              <div class="relative shrink-0">
                <NuxtImg
                  v-if="member.image"
                  :src="member.image"
                  :alt="member.name"
                  class="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full object-cover shadow-md ring-4 ring-orange-500/20 group-hover:ring-orange-500/50 group-hover:scale-105 transition-all duration-300"
                  loading="lazy"
                />
                <div
                  v-else
                  class="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full flex items-center justify-center text-3xl font-black text-white shadow-md ring-4 ring-orange-500/20"
                  :style="{ background: avatarColor(member.name) }"
                >
                  {{ getInitials(member.name) }}
                </div>
              </div>

              <!-- Info Details & Larger Badges -->
              <div class="flex flex-col gap-2.5 min-w-0 flex-1 w-full">
                <div class="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-2 flex-wrap">
                  <h4 class="text-lg sm:text-xl font-black text-slate-900 leading-snug">{{ member.name }}</h4>
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
                    class="font-bold text-xs px-2.5 py-1 rounded-lg"
                  >
                    <a v-if="member.institution_link" :href="member.institution_link" target="_blank" rel="noopener noreferrer" class="hover:underline">
                      {{ member.institution }}
                    </a>
                    <template v-else>{{ member.institution }}</template>
                  </UBadge>
                </div>

                <p v-if="member.roles" class="text-xs sm:text-sm text-slate-600 leading-relaxed">{{ member.roles }}</p>

                <!-- Exposed Email -->
                <div v-if="member.email" class="pt-1 flex justify-center sm:justify-start">
                  <a :href="`mailto:${member.email}`" class="inline-flex items-center gap-2 text-xs sm:text-sm text-orange-600 hover:text-orange-700 transition-colors font-bold">
                    <UIcon name="i-lucide-mail" class="size-4 shrink-0" />
                    <span>{{ member.email }}</span>
                  </a>
                </div>

                <!-- Module tags with deep links to handbook -->
                <div
                  v-if="getLecturerModules(member.name).length > 0"
                  class="pt-3 flex flex-col gap-1.5 border-t border-slate-200/80 mt-1"
                >
                  <span class="text-[11px] font-black uppercase tracking-wider text-slate-400">Lecturer of:</span>
                  <div class="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                    <NuxtLink
                      v-for="mod in getLecturerModules(member.name)"
                      :key="mod.path || mod.id"
                      :to="{
                        path: localePath ? localePath('/program-structure/modules') : '/program-structure/modules',
                        query: { module: mod.title }
                      }"
                      :title="`View ${mod.title} in Course Handbook & Syllabi`"
                      class="group/modlink"
                    >
                      <UBadge
                        color="primary"
                        variant="subtle"
                        size="sm"
                        class="font-bold text-xs px-2.5 py-1 rounded-lg group-hover/modlink:bg-orange-500 group-hover/modlink:text-white transition-all cursor-pointer inline-flex items-center gap-1"
                      >
                        <span>{{ mod.title }}</span>
                        <UIcon name="i-lucide-arrow-up-right" class="size-3 opacity-60 group-hover/modlink:opacity-100" />
                      </UBadge>
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
