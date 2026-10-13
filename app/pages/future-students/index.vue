<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()
const localePath = useLocalePath()
const { locale, t } = useI18n()

// Fetch localized Future Students overview page
const pagePath = computed(() => locale.value === 'vi' ? '/vi/future-students' : '/future-students')
const { data: page } = await useAsyncData('fs-page-overview-' + locale.value, () =>
  queryCollection('content').path(pagePath.value).first()
)

// SEO Metadata optimized for prospective applicants
useSeoMeta({
  title: () => page.value?.title ? `${page.value.title} | MSI VGU` : 'Admissions & Eligibility Guide - Materials Science and Innovation | VGU',
  ogTitle: () => page.value?.title ? `${page.value.title} | MSI VGU` : 'Admissions & Eligibility Guide - Materials Science and Innovation | VGU',
  description: () => page.value?.meta?.description || 'Learn about admission criteria, eligibility requirements, degree values, and gateways for the German-standard Master of Science in Materials Science and Innovation at VGU.',
  ogDescription: () => page.value?.meta?.description || 'Learn about admission criteria, eligibility requirements, degree values, and gateways for the German-standard Master of Science in Materials Science and Innovation at VGU.',
})

const gatewayCards = computed(() => [
  {
    title: locale.value === 'vi' ? 'Sơ Đồ Lộ Trình Tuyển Sinh' : 'Application Pathways Explorer',
    badge: locale.value === 'vi' ? 'Trực Quan & Tương Tác' : 'Interactive Flowchart',
    desc: locale.value === 'vi'
      ? 'So sánh lộ trình nộp hồ sơ dành cho thí sinh Ngành Đúng và thí sinh Liên Ngành chuyển hướng.'
      : 'Compare milestones for Direct Entry candidates and Non-traditional / Bridging applicants.',
    to: localePath('/future-students/pathways'),
    icon: 'i-lucide-git-branch',
  },
  {
    title: locale.value === 'vi' ? 'Chia Sẻ Cựu Sinh Viên & Việc Làm' : 'Alumni Stories & Career Prospects',
    badge: locale.value === 'vi' ? 'Góc Nhìn Thực Tế' : 'Real Testimonials',
    desc: locale.value === 'vi'
      ? 'Lắng nghe trải nghiệm học tập thực tế và khám phá cơ hội việc làm tại Intel, Bosch, VinFast.'
      : 'Read insights from graduates and discover career paths in semiconductor, automotive, and energy R&D.',
    to: localePath('/future-students/alumni'),
    icon: 'i-lucide-users',
  },
  {
    title: locale.value === 'vi' ? 'Học Phí & Học Bổng Toàn Phần DAAD' : 'Tuition & DAAD Scholarships',
    badge: locale.value === 'vi' ? 'Tài Trợ Toàn Phần' : '100% Full Funding',
    desc: locale.value === 'vi'
      ? 'Mức học phí minh bạch và học bổng DAAD Sur-Place chi trả 100% học phí cùng sinh hoạt phí.'
      : 'Fixed transparent tuition fees and prestigious DAAD Sur-Place scholarships with monthly living stipends.',
    to: localePath('/tuition-scholarships'),
    icon: 'i-lucide-award',
  },
  {
    title: locale.value === 'vi' ? 'Sổ Tay Môn Học & Đề Cương (25+ Môn)' : 'Course Handbook & Syllabi',
    badge: locale.value === 'vi' ? '15 Môn Cốt Lõi' : '15 Core Modules',
    desc: locale.value === 'vi'
      ? 'Khám phá 15 môn bắt buộc và hơn 10 môn tự chọn cùng thông tin các Giáo sư Đức từ Magdeburg.'
      : 'Browse 15 compulsory core modules and 10+ electives taught in English by visiting German professors.',
    to: localePath('/program-structure/modules'),
    icon: 'i-lucide-book-open',
  }
])
</script>

<template>
  <main class="min-h-[80vh] bg-slate-50 pb-20 font-sans">
    <template v-if="page">
      <!-- Premium Hero Banner -->
      <PageHeader :title="page.title" :description="page.meta?.description" />

      <!-- Main Body Container -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 mt-8 flex flex-col gap-10">

        <!-- Intro Content Card -->
        <div class="bg-white p-6 sm:p-10 md:p-12 rounded-3xl border border-slate-200 shadow-xs max-w-4xl mx-auto w-full">
          <ContentRenderer :value="page" class="prose max-w-none text-slate-700" />
        </div>

        <!-- 4 Prominent Gateway Cards (The Big Doors) -->
        <div class="flex flex-col gap-4">
          <div class="text-center max-w-2xl mx-auto">
            <h3 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {{ locale === 'vi' ? 'Cổng Thông Tin Chi Tiết Dành Cho Thí Sinh' : 'Key Portals for Future Students' }}
            </h3>
            <p class="text-xs sm:text-sm text-slate-500 mt-1">
              {{ locale === 'vi' ? 'Truy cập nhanh các cẩm nang hướng dẫn chuyên sâu của chương trình' : 'Quickly access dedicated guides to make your admission decision' }}
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <NuxtLink
              v-for="gate in gatewayCards"
              :key="gate.to"
              :to="gate.to"
              class="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between gap-4 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-primary-500 hover:shadow-primary-500/5 group"
            >
              <div>
                <div class="flex items-center justify-between gap-2 mb-3">
                  <span class="size-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <UIcon :name="gate.icon" class="size-5" />
                  </span>
                  <UBadge color="neutral" variant="subtle" size="xs" class="font-bold">
                    {{ gate.badge }}
                  </UBadge>
                </div>
                <h4 class="text-base font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
                  {{ gate.title }}
                </h4>
                <p class="text-xs text-slate-600 mt-2 leading-relaxed">
                  {{ gate.desc }}
                </p>
              </div>
              <div class="pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-orange-600 group-hover:translate-x-1 transition-transform">
                <span>{{ locale === 'vi' ? 'Khám phá ngay' : 'Access guide' }} &rarr;</span>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Official Regulatory Documents Section -->
        <MsiDocuments />

      </div>
    </template>
    <template v-else>
      <div class="flex items-center justify-center min-h-[50vh] px-4 py-16">
        <div class="text-center max-w-md p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <UIcon name="i-lucide-file-text" class="size-12 text-slate-300 mb-4" />
          <h1 class="text-2xl font-bold text-slate-900 mb-2">Content not found</h1>
          <p class="text-slate-600 mb-6 text-sm">This page hasn't been set up yet, or the translation is missing.</p>
          <UButton :to="localePath('/')" color="primary" variant="solid" size="md" icon="i-lucide-arrow-left" class="font-bold rounded-xl shadow-xs">
            Back to Home
          </UButton>
        </div>
      </div>
    </template>
  </main>
</template>
