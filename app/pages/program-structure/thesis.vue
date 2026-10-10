<script setup lang="ts">
import { computed } from 'vue'

const { locale } = useI18n()

const pagePath = computed(() => locale.value === 'vi' ? '/vi/program-structure/thesis' : '/program-structure/thesis')
const { data: page } = await useAsyncData(`thesis-page-${locale.value}`, () =>
  queryCollection('content').path(pagePath.value).first()
)

useSeoMeta({
  title: () => locale.value === 'vi' ? 'Đề Tài Luận Văn Thạc Sĩ (30 ECTS) & Giáo Sư Hướng Dẫn | MSI VGU' : 'Master Thesis Topics (30 ECTS) & Supervision Portal | MSI VGU',
  ogTitle: () => locale.value === 'vi' ? 'Đề Tài Luận Văn Thạc Sĩ & Hướng Dẫn | MSI VGU' : 'Master Thesis Topics & Supervision Portal | MSI VGU',
  description: () => 'Explore open Master Thesis research topics in Materials Science and Innovation. Direct supervision by VGU faculty and OVGU Magdeburg professors with opportunities for experimental work in Germany.',
  ogDescription: () => 'Explore open Master Thesis research topics in Materials Science and Innovation. Direct supervision by VGU faculty and OVGU Magdeburg professors with opportunities for experimental work in Germany.',
})
</script>

<template>
  <main class="min-h-[80vh] bg-slate-50 pb-20 font-sans">
    <PageHeader
      :title="page?.title || (locale === 'vi' ? 'Đề Tài Luận Văn Thạc Sĩ & Hướng Dẫn' : 'Master Thesis Topics & Supervision Portal')"
      :description="page?.meta?.description || (locale === 'vi' ? 'Dự án nghiên cứu khoa học độc lập 30 ECTS dưới sự hướng dẫn của giáo sư OVGU và VGU.' : '30 ECTS capstone scientific research conducted under joint supervision of OVGU Magdeburg and VGU faculty.')"
    />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 mt-8 flex flex-col gap-8">
      <!-- Optional Editorial Intro Markdown -->
      <div v-if="page && page.body" class="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs">
        <ContentRenderer :value="page" class="prose max-w-none text-slate-700" />
      </div>

      <!-- Thesis Topics Explorer MDC Component -->
      <ThesisTopicsExplorer />
    </div>
  </main>
</template>
