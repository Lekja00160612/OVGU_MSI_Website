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
      <CalloutBanner
        :badge="locale === 'vi' ? '30 ECTS Capstone Research' : '30 ECTS Capstone Research'"
        :title="locale === 'vi' ? 'Cổng Đề Tài Luận Văn Thạc Sĩ' : 'Master Thesis Topics & Supervision Portal'"
        :description="locale === 'vi'
          ? 'Khám phá các đề tài nghiên cứu mở dưới sự đồng hướng dẫn của giáo sư VGU và trưởng bộ môn OVGU Magdeburg.'
          : 'Explore open master thesis projects co-supervised by VGU researchers and chair directors at OVGU Magdeburg.'"
        :to="localePath('/program-structure/thesis')"
        :button-text="locale === 'vi' ? 'Xem các đề tài luận văn' : 'View Open Thesis Topics'"
        button-icon="i-lucide-arrow-right"
        variant="navy"
      />

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
