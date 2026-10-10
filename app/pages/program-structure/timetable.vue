<script setup lang="ts">
import { computed } from 'vue'

const { locale } = useI18n()

const pagePath = computed(() => locale.value === 'vi' ? '/vi/program-structure/timetable' : '/program-structure/timetable')
const { data: page } = await useAsyncData(`timetable-page-${locale.value}`, () =>
  queryCollection('content').path(pagePath.value).first()
)

useSeoMeta({
  title: () => locale.value === 'vi' ? 'Thời Khóa Biểu & Lịch Học Khối (Block-Modular) | MSI VGU' : 'Semester Timetable & Block Schedule Matrix | MSI VGU',
  ogTitle: () => locale.value === 'vi' ? 'Thời Khóa Biểu & Lịch Học Khối | MSI VGU' : 'Semester Timetable & Block Schedule Matrix | MSI VGU',
  description: () => 'Interactive semester timetable and block schedule for MSI VGU. View lecture dates of visiting German professors from OVGU Magdeburg. Download XLSX and ICS calendar.',
  ogDescription: () => 'Interactive semester timetable and block schedule for MSI VGU. View lecture dates of visiting German professors from OVGU Magdeburg. Download XLSX and ICS calendar.',
})
</script>

<template>
  <main class="min-h-[80vh] bg-slate-50 pb-20 font-sans">
    <PageHeader
      :title="page?.title || (locale === 'vi' ? 'Thời Khóa Biểu & Lịch Học Học Kỳ' : 'Semester Timetable & Schedule Matrix')"
      :description="page?.meta?.description || (locale === 'vi' ? 'Lịch học dạng khối (Block-modular) và lịch giảng dạy của các giáo sư Đức.' : 'Block-modular course schedule matrix, visiting German professor lecture dates, and direct XLSX calendar downloads.')"
    />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 mt-8 flex flex-col gap-8">
      <!-- Optional Editorial Intro Markdown -->
      <div v-if="page && page.body" class="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs">
        <ContentRenderer :value="page" class="prose max-w-none text-slate-700" />
      </div>

      <!-- Semester Timetable MDC Component -->
      <SemesterTimetable />
    </div>
  </main>
</template>
