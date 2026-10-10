<script setup lang="ts">
const route = useRoute()
const localePath = useLocalePath()
const { locale } = useI18n()

// Fetch localized Germany relocation guide content
const pagePath = computed(() => locale.value === 'vi' ? '/vi/student-life/germany-relocation' : '/student-life/germany-relocation')
const { data: page } = await useAsyncData('student-life-germany-' + locale.value, () =>
  queryCollection('content').path(pagePath.value).first()
)

// SEO Metadata optimized for prospective MSI students planning exchange in Germany
useSeoMeta({
  title: () => page.value?.title ? `${page.value.title} | MSI VGU` : 'Germany Relocation Guide & DAAD Mobility | MSI VGU',
  ogTitle: () => page.value?.title ? `${page.value.title} | MSI VGU` : 'Germany Relocation Guide & DAAD Mobility | MSI VGU',
  description: () => page.value?.meta?.description || 'Complete step-by-step roadmap for MSI Master students moving to OVGU Magdeburg in Germany: DAAD scholarships, VFS visa, blocked account, health insurance, and local registration.',
  ogDescription: () => page.value?.meta?.description || 'Complete step-by-step roadmap for MSI Master students moving to OVGU Magdeburg in Germany: DAAD scholarships, VFS visa, blocked account, health insurance, and local registration.',
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

        <!-- Back to Campus Life Link -->
        <div class="flex justify-between items-center bg-white p-4 sm:p-6 rounded-2xl border border-slate-200">
          <NuxtLink
            :to="localePath('/student-life')"
            class="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-orange-600 transition-colors"
          >
            <UIcon name="i-lucide-arrow-left" class="size-4 shrink-0" />
            <span>{{ locale === 'vi' ? 'Quay lại Đời sống sinh viên VGU' : 'Back to VGU Campus Life' }}</span>
          </NuxtLink>
          <NuxtLink
            :to="localePath('/tuition-scholarships')"
            class="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors"
          >
            <span>{{ locale === 'vi' ? 'Xem học bổng DAAD Sur-Place →' : 'View DAAD Scholarships →' }}</span>
          </NuxtLink>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="flex items-center justify-center min-h-[50vh] px-4 py-16">
        <div class="text-center max-w-md p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <UIcon name="i-lucide-file-text" class="size-12 text-slate-300 mb-4" />
          <h1 class="text-2xl font-bold text-slate-900 mb-2">Content not found</h1>
          <p class="text-slate-600 mb-6 text-sm">This page hasn't been set up yet, or the translation is missing.</p>
          <UButton :to="localePath('/student-life')" color="primary" variant="solid" size="md" icon="i-lucide-arrow-left" class="font-bold rounded-xl shadow-xs">
            Back to Student Life
          </UButton>
        </div>
      </div>
    </template>
  </main>
</template>
