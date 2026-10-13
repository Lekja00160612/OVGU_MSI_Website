<script setup lang="ts">
const route = useRoute()
const localePath = useLocalePath()
const { locale } = useI18n()

// Fetch localized Student Life page content
const pagePath = computed(() => locale.value === 'vi' ? '/vi/student-life' : '/student-life')
const { data: page } = await useAsyncData('student-life-index-' + locale.value, () =>
  queryCollection('content').path(pagePath.value).first()
)

// SEO Metadata optimized for prospective MSI students interested in campus life and accommodation
useSeoMeta({
  title: () => page.value?.title ? `${page.value.title} | MSI VGU` : 'Campus Life & Facilities - Materials Science and Innovation | VGU',
  ogTitle: () => page.value?.title ? `${page.value.title} | MSI VGU` : 'Campus Life & Facilities - Materials Science and Innovation | VGU',
  description: () => page.value?.meta?.description || 'Explore the peaceful and dynamic campus life at VGU in Binh Duong. Discover modern dormitories, Olympic sports facilities, student clubs, and daily bus services.',
  ogDescription: () => page.value?.meta?.description || 'Explore the peaceful and dynamic campus life at VGU in Binh Duong. Discover modern dormitories, Olympic sports facilities, student clubs, and daily bus services.',
})
</script>

<template>
  <main class="min-h-[80vh] bg-slate-50 pb-20 font-sans">
    <template v-if="page">
      <!-- Premium Hero Banner -->
      <PageHeader :title="page.title" :description="page.meta?.description" />

      <!-- Main Body Container -->
      <div class="max-w-4xl mx-auto px-4 sm:px-6 mt-8 flex flex-col gap-8">
        <div class="bg-white p-6 sm:p-10 md:p-12 rounded-3xl border border-slate-200 shadow-xs">
          <ContentRenderer :value="page" class="prose max-w-none text-slate-700" />
        </div>

        <!-- Gateway Card to Germany Relocation Guide -->
        <CalloutBanner
          :badge="locale === 'vi' ? 'Học Bổng Trao Đổi DAAD' : 'DAAD Mobility Opportunity'"
          :title="locale === 'vi' ? 'Cẩm Nang Hướng Dẫn Sang Đức (OVGU)' : 'Path to Germany & OVGU Relocation Guide'"
          :description="locale === 'vi'
            ? 'Tìm hiểu chi tiết quy trình xin visa VFS, mở tài khoản phong tỏa Sperrkonto, bảo hiểm y tế và kinh nghiệm lưu trú tại Magdeburg.'
            : 'Step-by-step roadmap for study and Master Thesis research at OVGU: visa processing, blocked accounts, flights, and living in Magdeburg.'"
          :to="localePath('/student-life/germany-relocation')"
          :button-text="locale === 'vi' ? 'Khám phá cẩm nang' : 'Explore Guide'"
          button-icon="i-lucide-arrow-right"
          variant="navy"
        />
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
