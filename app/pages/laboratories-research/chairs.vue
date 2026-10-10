<!--
  Page: ChairsPortalPage (/laboratories-research/chairs)
  Description: Profiles and research focus areas of the 6 partner Chairs at Otto von Guericke University Magdeburg partnering with VGU MSI.
-->
<script setup lang="ts">
const { locale, t } = useI18n()
const localePath = useLocalePath()

const pagePath = computed(() => locale.value === 'vi' ? '/vi/laboratories-research/chairs' : '/laboratories-research/chairs')
const { data: pageData } = await useAsyncData(`chairs-page-${locale.value}`, () =>
  queryCollection('content').path(pagePath.value).first()
)

const { data: researchChairs } = await useAsyncData('research-chairs-list', () =>
  queryCollection('research').all()
)

useSeoMeta({
  title: () => pageData.value?.title ? `${pageData.value.title} | MSI VGU` : 'OVGU Partner Research Chairs & German Collaboration | MSI VGU',
  ogTitle: () => pageData.value?.title ? `${pageData.value.title} | MSI VGU` : 'OVGU Partner Research Chairs & German Collaboration | MSI VGU',
  description: () => pageData.value?.meta?.description || 'Explore the 6 specialized Research Chairs at OVGU Magdeburg partnering with VGU MSI. High-temperature materials, computational mechanics, solid-state physics, and metallurgy.',
  ogDescription: () => pageData.value?.meta?.description || 'Explore the 6 specialized Research Chairs at OVGU Magdeburg partnering with VGU MSI. High-temperature materials, computational mechanics, solid-state physics, and metallurgy.',
})
</script>

<template>
  <main class="min-h-[80vh] bg-slate-50 pb-20 font-sans">
    <PageHeader
      :title="pageData?.title || (locale === 'vi' ? '6 Bộ Môn Nghiên Cứu Đối Tác Tại OVGU Magdeburg' : 'OVGU Partner Research Chairs & Projects')"
      :description="pageData?.meta?.description || (locale === 'vi' ? 'Hợp tác nghiên cứu chuyên sâu, đồng hướng dẫn luận văn thạc sĩ và cơ hội thực tập tại Đức.' : 'Direct research collaboration with chair-holding German professors and opportunities for master thesis research in Magdeburg.')"
    />

    <div class="max-w-6xl mx-auto px-4 sm:px-6 mt-8 flex flex-col gap-10">

      <!-- Editorial Intro Markdown -->
      <div v-if="pageData && pageData.body" class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <ContentRenderer :value="pageData" class="prose max-w-none text-slate-700" />
      </div>

      <!-- Research Chairs Carousel -->
      <div class="w-full">
        <ResearchChairs :chairs="researchChairs || []" />
      </div>

      <!-- Master Thesis Gateway Banner -->
      <div class="bg-gradient-to-br from-[#1E3A5F] to-[#2E5280] text-white p-6 sm:p-8 rounded-3xl shadow-md border-l-8 border-l-[#E87722] flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex flex-col gap-2 text-center md:text-left">
          <span class="text-xs font-bold uppercase tracking-wider text-orange-400">
            {{ locale === 'vi' ? '30 ECTS Capstone Research' : '30 ECTS Capstone Research' }}
          </span>
          <h3 class="text-xl sm:text-2xl font-black text-white">
            {{ locale === 'vi' ? 'Cổng Đề Tài Luận Văn Thạc Sĩ' : 'Master Thesis Topics & Supervision Portal' }}
          </h3>
          <p class="text-xs sm:text-sm text-slate-200 max-w-xl">
            {{ locale === 'vi'
              ? 'Khám phá các đề tài nghiên cứu mở dưới sự đồng hướng dẫn của giáo sư VGU và trưởng bộ môn OVGU Magdeburg.'
              : 'Explore open master thesis projects co-supervised by VGU researchers and chair directors at OVGU Magdeburg.'
            }}
          </p>
        </div>
        <NuxtLink
          :to="localePath('/program-structure/thesis')"
          class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm transition-all shadow-md shrink-0 whitespace-nowrap cursor-pointer"
        >
          <span>{{ locale === 'vi' ? 'Xem các đề tài luận văn →' : 'View Open Thesis Topics →' }}</span>
        </NuxtLink>
      </div>

      <!-- Navigation Footer links -->
      <div class="flex justify-between items-center bg-white p-4 sm:p-6 rounded-2xl border border-slate-200">
        <NuxtLink
          :to="localePath('/laboratories-research')"
          class="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-orange-600 transition-colors"
        >
          <UIcon name="i-lucide-arrow-left" class="size-4 shrink-0" />
          <span>{{ locale === 'vi' ? 'Quay lại Tổng quan Lab & Nghiên cứu' : 'Back to Research Hub Overview' }}</span>
        </NuxtLink>
        <NuxtLink
          :to="localePath('/laboratories-research/equipment')"
          class="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors"
        >
          <span>{{ locale === 'vi' ? 'Xem 22+ thiết bị phân tích →' : 'Explore 22+ Equipment →' }}</span>
        </NuxtLink>
      </div>

    </div>
  </main>
</template>
