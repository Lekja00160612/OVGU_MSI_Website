<script setup lang="ts">
const { locale } = useI18n()
const localePath = useLocalePath()

// Fetch localized page content
const pagePath = locale.value === 'vi' ? '/vi/partners-lecturers' : '/partners-lecturers'
const { data: pageData } = await useAsyncData(`partners-page-${locale.value}`, () =>
  queryCollection('content').path(pagePath).first()
)

// SEO Metadata targeting OVGU-VGU collaborative faculty, academic excellence, and international professors
useSeoMeta({
  title: () => pageData.value?.title ? `${pageData.value.title} - Faculty & Partners | MSI VGU` : 'German Faculty, Lecturers & Partners - Materials Science & Innovation | VGU',
  ogTitle: () => pageData.value?.title ? `${pageData.value.title} - Faculty & Partners | MSI VGU` : 'German Faculty, Lecturers & Partners - Materials Science & Innovation | VGU',
  description: () => pageData.value?.description || 'Meet the outstanding international faculty and professors from Otto von Guericke University Magdeburg (OVGU) and VGU delivering world-class lectures in Materials Science & Innovation.',
  ogDescription: () => pageData.value?.description || 'Meet the outstanding international faculty and professors from Otto von Guericke University Magdeburg (OVGU) and VGU delivering world-class lectures in Materials Science & Innovation.',
})

// Fetch all modules to build lecturers associations
const { data: allModules } = await useAsyncData('partners-modules', () =>
  queryCollection('modules').all()
)

// Helper to get initials if image is missing
const getInitials = (name: string) => {
  if (!name) return 'L'
  const parts = name.replace(/^(Dr\.|Prof\.|apl\.|Ing\.|rer\.|nat\.|habil\.|h\. c\.|mult\.|Mr\.)\s*/gi, '').trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return parts[0][0].toUpperCase()
}

// Find modules taught by a specific lecturer
const getLecturerModules = (lecturerName: string) => {
  if (!allModules.value) return []
  return allModules.value.filter(mod => {
    const list = mod.lecturers || mod.meta?.lecturers || []
    return list.some((l: string) => l.toLowerCase().trim() === lecturerName.toLowerCase().trim())
  })
}

// @nuxt/content v3: rich frontmatter properties (headline, intro, groups) live in .meta
const page = computed(() => pageData.value?.meta ?? {})

const renderMarkdown = (text: string) => {
  if (!text) return ''
  return text
    .split(/\n\s*\n/)
    .map(para => {
      const trimmed = para.trim()
      if (!trimmed) return ''
      if (trimmed.startsWith('- ')) {
        const items = trimmed.split(/\n\s*-\s+/)
          .map(item => {
            const cleanItem = item.replace(/^-\s+/, '').trim()
            if (!cleanItem) return ''
            return `<li class="intro-li">${cleanItem}</li>`
          })
          .filter(Boolean)
          .join('')
        return `<ul class="intro-ul">${items}</ul>`
      }
      return `<p class="intro-paragraph">${trimmed.replace(/\n/g, ' ')}</p>`
    })
    .join('')
}
</script>

<template>
  <div class="page-partners">
    <!-- Header -->
    <PageHeader :title="pageData?.title || 'Partners & Lecturers'" :description="pageData?.description" />
    
    <!-- Intro -->
    <div class="container intro-section text-center">
      <div class="intro-text" v-html="renderMarkdown(page.intro)" />
    </div>

    <!-- Groups -->
    <div v-if="page.groups" class="container content-section">
      <div v-for="group in page.groups" :key="group.id" class="faculty-group">
        <h2 class="group-title">{{ group.title }}</h2>
        <p v-if="group.description" class="group-desc">{{ group.description }}</p>

        <!-- Direct Members -->
        <div v-if="group.members && group.members.length > 0" class="faculty-grid mt-6">
          <div 
            v-for="member in group.members" 
            :key="member.name" 
            class="faculty-card"
            :class="{ 'management-card': member.is_management }"
          >
            <div class="faculty-avatar" :class="{ 'management-avatar': member.is_management }">
              <img v-if="member.image" :src="member.image" :alt="member.name" class="avatar-img" />
              <div v-else class="avatar-placeholder">{{ getInitials(member.name) }}</div>
            </div>
            <div class="faculty-info">
              <div class="faculty-name-row">
                <h3 class="faculty-name">{{ member.name }}</h3>
                <span v-if="member.is_management" class="mgmt-badge" :class="member.management_role?.toLowerCase().includes('director') || member.management_role?.toLowerCase().includes('giám đốc') ? 'director' : 'coordinator'">
                  {{ member.management_role }}
                </span>
              </div>
              <span v-if="member.institution" class="faculty-inst">
                <a v-if="member.institution_link" :href="member.institution_link" target="_blank" class="inst-link">
                  {{ member.institution }}
                </a>
                <template v-else>{{ member.institution }}</template>
              </span>
              <p class="faculty-roles">{{ member.roles }}</p>
              
              <!-- Exposed Email -->
              <div v-if="member.email" class="faculty-email-row">
                <a :href="`mailto:${member.email}`" class="faculty-email">
                  <span class="email-icon">✉</span>
                  {{ member.email }}
                </a>
              </div>
              
              <!-- Taught Modules -->
              <div v-if="getLecturerModules(member.name).length > 0" class="lecturer-modules mt-2">
                <span class="modules-lbl">Lecturer of:</span>
                <div class="modules-links">
                  <NuxtLink 
                    v-for="mod in getLecturerModules(member.name)" 
                    :key="mod.path" 
                    :to="localePath('/program-structure')" 
                    class="mod-tag-link"
                  >
                    {{ mod.title }}
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Subgroups (Chairs) -->
        <div v-if="group.subgroups && group.subgroups.length > 0" class="subgroups-container mt-8">
          <div v-for="subgroup in group.subgroups" :key="subgroup.title" class="subgroup-block">
            <div class="subgroup-header">
              <h3 class="subgroup-title">{{ subgroup.title }}</h3>
              <a v-if="subgroup.link" :href="subgroup.link" target="_blank" class="subgroup-link">Visit Institute &rarr;</a>
            </div>
            <div class="faculty-grid">
              <div 
                v-for="member in subgroup.members" 
                :key="member.name" 
                class="faculty-card"
                :class="{ 'management-card': member.is_management }"
              >
                <div class="faculty-avatar" :class="{ 'management-avatar': member.is_management }">
                  <img v-if="member.image" :src="member.image" :alt="member.name" class="avatar-img" />
                  <div v-else class="avatar-placeholder">{{ getInitials(member.name) }}</div>
                </div>
                <div class="faculty-info">
                  <div class="faculty-name-row">
                    <h3 class="faculty-name">{{ member.name }}</h3>
                    <span v-if="member.is_management" class="mgmt-badge" :class="member.management_role?.toLowerCase().includes('director') || member.management_role?.toLowerCase().includes('giám đốc') ? 'director' : 'coordinator'">
                      {{ member.management_role }}
                    </span>
                  </div>
                  <span v-if="member.institution" class="faculty-inst">
                    <a v-if="member.institution_link" :href="member.institution_link" target="_blank" class="inst-link">
                      {{ member.institution }}
                    </a>
                    <template v-else>{{ member.institution }}</template>
                  </span>
                  <p class="faculty-roles">{{ member.roles }}</p>
                  
                  <!-- Exposed Email -->
                  <div v-if="member.email" class="faculty-email-row">
                    <a :href="`mailto:${member.email}`" class="faculty-email">
                      <span class="email-icon">✉</span>
                      {{ member.email }}
                    </a>
                  </div>
                  
                  <!-- Taught Modules -->
                  <div v-if="getLecturerModules(member.name).length > 0" class="lecturer-modules mt-2">
                    <span class="modules-lbl">Lecturer of:</span>
                    <div class="modules-links">
                      <NuxtLink 
                        v-for="mod in getLecturerModules(member.name)" 
                        :key="mod.path" 
                        :to="localePath('/program-structure')" 
                        class="mod-tag-link"
                      >
                        {{ mod.title }}
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

  </div>
</template>

<style scoped>
.page-partners { min-height: 80vh; background: var(--color-gray-50); padding-bottom: 5rem; }

.intro-section { max-width: 900px; margin: 0 auto 5rem auto; }
.intro-text { font-size: 1.15rem; color: var(--color-gray-700); line-height: 1.8; margin-bottom: 2.5rem; }
.intro-text :deep(.intro-paragraph) {
  margin-bottom: 1.5rem;
}
.intro-text :deep(.intro-paragraph:last-child) {
  margin-bottom: 0;
}
.intro-text :deep(.intro-ul) {
  list-style: none;
  padding-left: 0;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  text-align: left;
}
.intro-text :deep(.intro-li) {
  padding: 0.25rem 0 0.25rem 1.5rem;
  position: relative;
}
.intro-text :deep(.intro-li::before) {
  content: '▸';
  position: absolute;
  left: 0;
  color: var(--color-accent);
  font-size: 0.85em;
}

.content-section { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 4rem; }

.faculty-group { background: #fff; border-radius: var(--radius-xl); padding: 3rem; box-shadow: var(--shadow-md); border: 1px solid var(--color-gray-200); }
@media (max-width: 768px) {
  .faculty-group {
    background: transparent;
    border: none;
    box-shadow: none;
    padding: 0;
  }
  .subgroup-block {
    padding: 1.25rem;
  }
}
.group-title { font-size: 2rem; font-weight: 800; color: var(--color-primary-dark); border-bottom: 3px solid var(--color-accent); padding-bottom: 0.5rem; display: inline-block; margin-bottom: 1rem; }
.group-desc { font-size: 1.05rem; color: var(--color-gray-600); margin-bottom: 2rem; max-width: 800px; }

.subgroups-container { display: flex; flex-direction: column; gap: 3rem; }
.subgroup-block { background: var(--color-gray-50); border: 1px solid var(--color-gray-200); border-radius: var(--radius-lg); padding: 2rem; }
.subgroup-header { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--color-gray-200); padding-bottom: 1rem; }
@media (min-width: 768px) { .subgroup-header { flex-direction: row; justify-content: space-between; align-items: center; } }
.subgroup-title { font-size: 1.4rem; font-weight: 700; color: var(--color-primary); }
.subgroup-link { color: var(--color-accent); font-weight: 600; text-decoration: none; font-size: 0.95rem; }
.subgroup-link:hover { text-decoration: underline; }

.faculty-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
@media (min-width: 768px) { .faculty-grid { grid-template-columns: repeat(2, 1fr); } }

.faculty-card { display: flex; align-items: flex-start; gap: 1.25rem; background: #fff; padding: 1.5rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border: 1px solid var(--color-gray-200); transition: transform 200ms, box-shadow 200ms; }
.faculty-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: var(--color-gray-300); }

/* Management Card & Avatar styles */
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

.faculty-avatar { width: 70px; height: 70px; flex-shrink: 0; border-radius: 50%; overflow: hidden; background: var(--color-gray-100); border: 2px solid var(--color-gray-200); display: flex; align-items: center; justify-content: center; }
.avatar-img { width: 100%; height: 100%; object-fit: cover; }
.avatar-placeholder { font-size: 1.5rem; font-weight: 800; color: var(--color-gray-400); font-family: var(--font-display); }

.faculty-info { display: flex; flex-direction: column; gap: 0.35rem; }

.faculty-name-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.15rem;
}

.faculty-name { font-size: 1.15rem; font-weight: 700; color: var(--color-primary-dark); line-height: 1.2; }

/* Management Badges */
.mgmt-badge {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.15rem 0.45rem;
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

.faculty-inst { display: inline-block; font-size: 0.75rem; font-weight: 700; color: #fff; background: var(--color-primary); padding: 0.2rem 0.5rem; border-radius: var(--radius-sm); align-self: flex-start; }

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
  font-size: 0.82rem;
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
  font-size: 0.85rem;
  color: var(--color-accent);
}

.faculty-roles { font-size: 0.9rem; color: var(--color-gray-600); line-height: 1.5; margin-top: 0.25rem; }

.lecturer-modules { display: flex; flex-direction: column; gap: 0.25rem; }
.modules-lbl { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--color-gray-400); letter-spacing: 0.05em; }
.modules-links { display: flex; flex-wrap: wrap; gap: 0.35rem; }
.mod-tag-link { font-size: 0.75rem; font-weight: 600; color: var(--color-primary); background: var(--color-primary-50); border: 1px solid var(--color-primary-100); padding: 0.15rem 0.5rem; border-radius: var(--radius-sm); text-decoration: none; transition: all 150ms; }
.mod-tag-link:hover { background: var(--color-accent); color: #fff; border-color: var(--color-accent); }
</style>
