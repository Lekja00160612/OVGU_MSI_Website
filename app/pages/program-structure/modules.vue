<script setup lang="ts">
import { computed } from 'vue'

const { locale } = useI18n()

const pagePath = computed(() => locale.value === 'vi' ? '/vi/program-structure/modules' : '/program-structure/modules')
const { data: page } = await useAsyncData(`modules-page-${locale.value}`, () =>
  queryCollection('content').path(pagePath.value).first()
)

const { data: allModules } = await useAsyncData('modules-catalog-schema', () =>
  queryCollection('modules').all()
)

useSeoMeta({
  title: () => locale.value === 'vi' ? 'Sổ Tay Môn Học & Đề Cương (15 Môn Cốt Lõi + Tự Chọn) | MSI VGU' : 'Module Handbook & Syllabi — Core & Elective Courses | MSI VGU',
  ogTitle: () => locale.value === 'vi' ? 'Sổ Tay Môn Học & Đề Cương | MSI VGU' : 'Module Handbook & Syllabi — Core & Elective Courses | MSI VGU',
  description: () => 'Comprehensive course catalog of the Master in Materials Science & Innovation (MSI). Explore 15 core compulsory modules and specialization electives with visiting German professors from OVGU Magdeburg.',
  ogDescription: () => 'Comprehensive course catalog of the Master in Materials Science & Innovation (MSI). Explore 15 core compulsory modules and specialization electives with visiting German professors from OVGU Magdeburg.',
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => {
        if (!allModules.value || allModules.value.length === 0) return ''
        return JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          'name': locale.value === 'vi' ? 'Danh Mục Môn Học Thạc Sĩ MSI' : 'MSI Master Program Course Catalog',
          'description': 'Master of Science in Materials Science and Innovation curriculum comprising core compulsory modules and specialized electives.',
          'numberOfItems': allModules.value.length,
          'itemListElement': allModules.value.map((mod: any, idx: number) => ({
            '@type': 'ListItem',
            'position': idx + 1,
            'item': {
              '@type': 'Course',
              'name': mod.title,
              'courseCode': mod.path.replace('/_modules/', ''),
              'description': mod.description ? mod.description.replace(/\n/g, ' ').substring(0, 300) : `${mod.title} module at VGU & OVGU Magdeburg.`,
              'provider': {
                '@type': 'CollegeOrUniversity',
                'name': 'Vietnamese-German University & Otto von Guericke University Magdeburg'
              },
              'instructor': mod.lecturers ? mod.lecturers.map((lec: string) => ({
                '@type': 'Person',
                'name': lec
              })) : undefined,
              'hasCourseInstance': {
                '@type': 'CourseInstance',
                'courseMode': 'hybrid',
                'courseWorkload': '5 ECTS'
              }
            }
          }))
        })
      })
    }
  ]
})
</script>

<template>
  <main class="min-h-[80vh] bg-slate-50 pb-20 font-sans">
    <PageHeader
      :title="page?.title || (locale === 'vi' ? 'Sổ Tay Môn Học & Đề Cương Chi Tiết' : 'Course Handbook & Syllabi')"
      :description="page?.meta?.description || (locale === 'vi' ? 'Danh mục tổng hợp 15 môn học cốt lõi và các môn tự chọn chuyên sâu.' : 'Comprehensive catalog of all 15 core compulsory modules and curated specialization electives.')"
    />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 mt-8 flex flex-col gap-8">
      <!-- Optional Editorial Intro Markdown -->
      <div v-if="page && page.body" class="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs">
        <ContentRenderer :value="page" class="prose max-w-none text-slate-700" />
      </div>

      <!-- Unified Module Handbook MDC Component -->
      <ModuleHandbook />
    </div>
  </main>
</template>
