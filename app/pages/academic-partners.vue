<script setup lang="ts">
import { provide, computed } from 'vue'

definePageMeta({
  alias: ['/partners-lecturers']
})

const { locale } = useI18n()
const localePath = useLocalePath()

// Fetch localized page content
const pagePath = computed(() => locale.value === 'vi' ? '/vi/partners-lecturers' : '/partners-lecturers')
const { data: pageData } = await useAsyncData(`academic-partners-page-${locale.value}`, () =>
  queryCollection('content').path(pagePath.value).first()
)

// SEO Metadata targeting OVGU-VGU collaborative faculty, academic excellence, and international professors
useSeoMeta({
  title: () => pageData.value?.title ? `${pageData.value.title} - Academic Faculty | MSI VGU` : 'Academic Faculty, Lecturers & Research Chairs - Materials Science & Innovation | VGU',
  ogTitle: () => pageData.value?.title ? `${pageData.value.title} - Academic Faculty | MSI VGU` : 'Academic Faculty, Lecturers & Research Chairs - Materials Science & Innovation | VGU',
  description: () => pageData.value?.meta?.description || 'Meet the outstanding international faculty and professors from Otto von Guericke University Magdeburg (OVGU) and VGU delivering world-class lectures in Materials Science & Innovation.',
  ogDescription: () => pageData.value?.meta?.description || 'Meet the outstanding international faculty and professors from Otto von Guericke University Magdeburg (OVGU) and VGU delivering world-class lectures in Materials Science & Innovation.',
})

// Fetch all modules to build lecturers associations
const { data: allModules } = await useAsyncData('partners-modules', () =>
  queryCollection('modules').all()
)

// Provide pageData to PartnersGrid component
provide('pageData', {
  page: pageData,
  allModules,
  localePath
})
</script>

<template>
  <div class="min-h-[80vh] bg-slate-100/75 pb-20 font-sans">
    <!-- Header -->
    <PageHeader :title="pageData?.title || (locale === 'vi' ? 'Đội Ngũ Giảng Viên & Bộ Môn Học Thuật' : 'Academic Faculty & Research Chairs')" :description="pageData?.meta?.description" />

    <!-- Intro Markdown -->
    <div v-if="pageData" class="max-w-6xl mx-auto px-4 sm:px-6 my-10">
      <div class="prose max-w-none text-slate-700 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-md">
        <ContentRenderer :value="pageData" />
      </div>
    </div>

    <!-- Academic Faculty & Chairs Grid -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <PartnersGrid />
    </div>

    <!-- Link Banner to Industry Connections Page -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 mt-16">
      <CalloutBanner
        variant="white"
        icon="i-lucide-building-2"
        :title="locale === 'vi' ? 'Khám Phá Kết Nối Doanh Nghiệp & Điểm Đến Kiến Tập' : 'Explore Industry Connections & Plant Visits'"
        :description="locale === 'vi'
          ? 'Tìm hiểu các doanh nghiệp sản xuất và cơ sở công nghệ mà học viên MSI đã đến tham quan, kiến tập dây chuyền sản xuất thực tế trong chương trình.'
          : 'Learn about the manufacturing plants, industrial facilities, and technology sites explored by MSI Master students during educational excursions.'"
        :to="localePath('/industrial-partners')"
        :button-text="locale === 'vi' ? 'Xem Kết Nối Doanh Nghiệp' : 'View Industry Connections'"
        button-icon="i-lucide-arrow-right"
      />
    </div>
  </div>
</template>
