<script setup lang="ts">
import { inject, computed } from 'vue'

const { page, allModules, localePath } = inject('pageData') as any

// Resolve the page groups from meta (mirrors the partners-lecturers.vue pattern)
const groups = computed<any[]>(() => {
  // Support both page.value?.meta?.groups and page.value?.groups
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

// ── Helper: modules taught by a given lecturer ───────────────────────────────
const getLecturerModules = (lecturerName: string): any[] => {
  if (!allModules?.value || !lecturerName) return []
  const needle = lecturerName.toLowerCase().trim()
  return allModules.value.filter((mod: any) => {
    const list: string[] = mod.lecturers ?? mod.meta?.lecturers ?? []
    return list.some((l: string) => l.toLowerCase().trim() === needle)
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
</script>

<template>
  <div class="partners-grid">

    <div v-if="groups.length === 0" class="empty-state">
      <p>No partner groups found.</p>
    </div>

    <!-- Iterate over groups -->
    <div
      v-for="group in groups"
      :key="group.id || group.title"
      class="group-card"
    >
      <!-- Group header -->
      <div class="group-header">
        <h2 class="group-title">{{ group.title }}</h2>
        <p v-if="group.description" class="group-desc">{{ group.description }}</p>
      </div>

      <!-- Direct members grid -->
      <div
        v-if="group.members && group.members.length > 0"
        class="faculty-grid"
      >
        <div
          v-for="member in group.members"
          :key="member.name"
          class="faculty-card"
          :class="{ 'management-card': member.is_management }"
        >
          <!-- Avatar -->
          <div
            class="faculty-avatar"
            :class="{ 'management-avatar': member.is_management }"
            :style="{ background: member.image ? 'transparent' : avatarColor(member.name) }"
          >
            <img
              v-if="member.image"
              :src="member.image"
              :alt="member.name"
              class="avatar-img"
            />
            <span v-else class="avatar-initials">{{ getInitials(member.name) }}</span>
          </div>

          <!-- Info -->
          <div class="faculty-info">
            <div class="faculty-name-row">
              <h3 class="faculty-name">{{ member.name }}</h3>
              <span v-if="member.is_management" class="mgmt-badge" :class="member.management_role?.toLowerCase().includes('director') || member.management_role?.toLowerCase().includes('giám đốc') ? 'director' : 'coordinator'">
                {{ member.management_role }}
              </span>
            </div>

            <UBadge
              v-if="member.institution"
              color="primary"
              variant="solid"
              size="xs"
              class="inst-badge"
            >
              <a v-if="member.institution_link" :href="member.institution_link" target="_blank" class="inst-link">
                {{ member.institution }}
              </a>
              <template v-else>{{ member.institution }}</template>
            </UBadge>

            <p v-if="member.roles" class="faculty-roles">{{ member.roles }}</p>

            <!-- Exposed Email -->
            <div v-if="member.email" class="faculty-email-row">
              <a :href="`mailto:${member.email}`" class="faculty-email">
                <span class="email-icon">✉</span>
                {{ member.email }}
              </a>
            </div>

            <!-- Module tags -->
            <div
              v-if="getLecturerModules(member.name).length > 0"
              class="module-tags-wrap"
            >
              <span class="module-tags-label">Lecturer of:</span>
              <div class="module-tags">
                <NuxtLink
                  v-for="mod in getLecturerModules(member.name)"
                  :key="mod.path || mod.id"
                  :to="localePath ? localePath('/program-structure') : '/program-structure'"
                  class="module-tag"
                >
                  <UBadge color="primary" variant="soft" size="xs">
                    {{ mod.title }}
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
        class="subgroups-container"
      >
        <div
          v-for="subgroup in group.subgroups"
          :key="subgroup.title"
          class="subgroup-block"
        >
          <!-- Subgroup header -->
          <div class="subgroup-header">
            <h3 class="subgroup-title">{{ subgroup.title }}</h3>
            <a
              v-if="subgroup.link"
              :href="subgroup.link"
              target="_blank"
              class="subgroup-link"
            >
              Visit Institute →
            </a>
          </div>

          <!-- Subgroup members -->
          <div
            v-if="subgroup.members && subgroup.members.length > 0"
            class="faculty-grid"
          >
            <div
              v-for="member in subgroup.members"
              :key="member.name"
              class="faculty-card"
              :class="{ 'management-card': member.is_management }"
            >
              <div
                class="faculty-avatar"
                :class="{ 'management-avatar': member.is_management }"
                :style="{ background: member.image ? 'transparent' : avatarColor(member.name) }"
              >
                <img
                  v-if="member.image"
                  :src="member.image"
                  :alt="member.name"
                  class="avatar-img"
                />
                <span v-else class="avatar-initials">{{ getInitials(member.name) }}</span>
              </div>

              <div class="faculty-info">
                <div class="faculty-name-row">
                  <h3 class="faculty-name">{{ member.name }}</h3>
                  <span v-if="member.is_management" class="mgmt-badge" :class="member.management_role?.toLowerCase().includes('director') || member.management_role?.toLowerCase().includes('giám đốc') ? 'director' : 'coordinator'">
                    {{ member.management_role }}
                  </span>
                </div>

                <UBadge
                  v-if="member.institution"
                  color="primary"
                  variant="solid"
                  size="xs"
                  class="inst-badge"
                >
                  <a v-if="member.institution_link" :href="member.institution_link" target="_blank" class="inst-link">
                    {{ member.institution }}
                  </a>
                  <template v-else>{{ member.institution }}</template>
                </UBadge>

                <p v-if="member.roles" class="faculty-roles">{{ member.roles }}</p>

                <!-- Exposed Email -->
                <div v-if="member.email" class="faculty-email-row">
                  <a :href="`mailto:${member.email}`" class="faculty-email">
                    <span class="email-icon">✉</span>
                    {{ member.email }}
                  </a>
                </div>

                <div
                  v-if="getLecturerModules(member.name).length > 0"
                  class="module-tags-wrap"
                >
                  <span class="module-tags-label">Lecturer of:</span>
                  <div class="module-tags">
                    <NuxtLink
                      v-for="mod in getLecturerModules(member.name)"
                      :key="mod.path || mod.id"
                      :to="localePath ? localePath('/program-structure') : '/program-structure'"
                      class="module-tag"
                    >
                      <UBadge color="primary" variant="soft" size="xs">
                        {{ mod.title }}
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

<style scoped>
.partners-grid {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--color-gray-500, #6b7280);
  font-size: 1rem;
}

/* ── Group card ─────────────────────────── */
.group-card {
  background: #fff;
  border: 1px solid var(--color-gray-200, #e5e7eb);
  border-radius: var(--radius-xl, 16px);
  padding: 2.25rem 2.5rem;
  box-shadow: var(--shadow-md, 0 4px 12px rgba(0,0,0,.08));
}

.group-header {
  margin-bottom: 1.75rem;
}

.group-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--color-primary-dark, #0f2240);
  /* Orange underline accent */
  display: inline-block;
  border-bottom: 3px solid var(--color-accent, #e87722);
  padding-bottom: 0.35rem;
  margin-bottom: 0.75rem;
}

.group-desc {
  font-size: 1rem;
  color: var(--color-gray-600, #4b5563);
  line-height: 1.7;
  max-width: 760px;
}

/* ── Faculty grid ───────────────────────── */
.faculty-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}
@media (min-width: 640px) {
  .faculty-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .faculty-grid { grid-template-columns: repeat(2, 1fr); }
}

/* ── Faculty card ───────────────────────── */
.faculty-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: #fff;
  border: 1px solid var(--color-gray-200, #e5e7eb);
  border-radius: var(--radius-md, 8px);
  padding: 1.25rem;
  box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,.06));
  transition: transform 200ms, box-shadow 200ms;
}
.faculty-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md, 0 4px 12px rgba(0,0,0,.1));
}

/* Management Card & Avatar */
.management-card {
  border: 1.5px solid rgba(232, 119, 34, 0.3) !important;
  background: linear-gradient(135deg, #ffffff 0%, #fffbf8 100%);
  box-shadow: 0 4px 15px rgba(232, 119, 34, 0.04) !important;
}
.management-card:hover {
  border-color: var(--color-accent) !important;
  box-shadow: 0 6px 20px rgba(232, 119, 34, 0.08) !important;
}
.management-avatar {
  border: 2px solid var(--color-accent) !important;
}

/* ── Avatar ─────────────────────────────── */
.faculty-avatar {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255,255,255,0.3);
}
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.avatar-initials {
  font-size: 1.35rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.03em;
  font-family: var(--font-display, sans-serif);
}

/* ── Faculty info ───────────────────────── */
.faculty-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  min-width: 0;
}
.faculty-name-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.15rem;
}
.faculty-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-primary-dark, #0f2240);
  line-height: 1.25;
}

/* Management Badges */
.mgmt-badge {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.1rem 0.4rem;
  border-radius: var(--radius-sm, 4px);
  letter-spacing: 0.04em;
  display: inline-flex;
  align-items: center;
  line-height: 1;
}
.mgmt-badge.director {
  background-color: rgba(232, 119, 34, 0.08);
  color: var(--color-accent);
  border: 1px solid rgba(232, 119, 34, 0.2);
}
.mgmt-badge.coordinator {
  background-color: rgba(30, 58, 95, 0.08);
  color: var(--color-primary);
  border: 1px solid rgba(30, 58, 95, 0.2);
}

.inst-badge {
  align-self: flex-start;
  margin-top: 0.1rem;
}

/* Institution External Link */
.inst-link {
  color: inherit;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}
.inst-link:hover {
  text-decoration: underline;
}

/* Exposed Emails */
.faculty-email-row {
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
}
.faculty-email {
  font-weight: 500;
  font-size: 0.8rem;
  color: var(--color-gray-600);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  transition: color 150ms;
}
.faculty-email:hover {
  color: var(--color-accent);
}
.email-icon {
  font-size: 0.8rem;
  color: var(--color-accent);
}

.faculty-roles {
  font-size: 0.85rem;
  color: var(--color-gray-600, #4b5563);
  line-height: 1.5;
  margin-top: 0.15rem;
}

/* ── Module tags ────────────────────────── */
.module-tags-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-top: 0.35rem;
}
.module-tags-label {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-gray-400, #9ca3af);
}
.module-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}
.module-tag {
  text-decoration: none;
  transition: opacity 150ms;
}
.module-tag:hover { opacity: 0.78; }

/* ── Subgroups ──────────────────────────── */
.subgroups-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 2rem;
}

.subgroup-block {
  background: var(--color-gray-50, #f9fafb);
  border: 1px solid var(--color-gray-200, #e5e7eb);
  border-radius: var(--radius-lg, 12px);
  padding: 1.75rem;
}

.subgroup-header {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid var(--color-gray-200, #e5e7eb);
  padding-bottom: 0.85rem;
}
@media (min-width: 640px) {
  .subgroup-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
.subgroup-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-primary, #1e3a5f);
}
.subgroup-link {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-accent, #e87722);
  text-decoration: none;
  transition: text-decoration 150ms;
  white-space: nowrap;
}
.subgroup-link:hover { text-decoration: underline; }
</style>
