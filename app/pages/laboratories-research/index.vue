<script setup lang="ts">
const { locale, t } = useI18n()
const localePath = useLocalePath()

const pagePath = computed(() => locale.value === 'vi' ? '/vi/laboratories-research' : '/laboratories-research')
const { data: page } = await useAsyncData(`labs-overview-${locale.value}`, () =>
  queryCollection('content').path(pagePath.value).first()
)

useSeoMeta({
  title: () => page.value?.title ? `${page.value.title} | MSI VGU` : 'Research Facilities & Laboratories Overview | MSI VGU',
  ogTitle: () => page.value?.title ? `${page.value.title} | MSI VGU` : 'Research Facilities & Laboratories Overview | MSI VGU',
  description: () => page.value?.meta?.description || 'Explore the research laboratories and characterization facilities at VGU. Hands-on equipment access and collaboration with 6 partner chairs at OVGU Magdeburg.',
  ogDescription: () => page.value?.meta?.description || 'Explore the research laboratories and characterization facilities at VGU. Hands-on equipment access and collaboration with 6 partner chairs at OVGU Magdeburg.',
})
</script>

<template>
  <main class="min-h-[80vh] bg-slate-50 pb-20 font-sans">
    <PageHeader
      :title="page?.title || (locale === 'vi' ? 'Hệ Thống Phòng Thí Nghiệm & Nghiên Cứu' : 'Research Facilities & Laboratories Hub')"
      :description="page?.meta?.description || (locale === 'vi' ? 'Trải nghiệm vận hành trực tiếp hơn 22 thiết bị phân tích hiện đại tại VGU và hợp tác nghiên cứu với 6 bộ môn tại OVGU Magdeburg.' : 'Direct student access to 22+ research-grade instruments at VGU and scientific collaboration across 6 specialist chairs at OVGU Magdeburg.')"
    />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 mt-8 flex flex-col gap-10">

      <!-- Editorial Intro Card -->
      <div v-if="page && (page.body?.value?.length || page.body?.children?.length)" class="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs">
        <ContentRenderer :value="page" class="prose max-w-none text-slate-700" />
      </div>

      <!-- Core Distinction Highlights -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col gap-3 group">
          <div class="size-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold ring-1 ring-orange-200/80 group-hover:bg-orange-500 group-hover:text-white transition-all duration-200">
            <UIcon name="i-lucide-microscope" class="size-6" />
          </div>
          <h3 class="text-base sm:text-lg font-black text-slate-900 group-hover:text-orange-600 transition-colors">
            {{ locale === 'vi' ? 'Trực Tiếp Thao Tác (Hands-On)' : '100% Hands-On Operation' }}
          </h3>
          <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {{ locale === 'vi'
              ? 'Sinh viên được đào tạo và trực tiếp vận hành thiết bị phân tích (SEM, XRD, TGA), không qua trung gian kỹ thuật viên.'
              : 'Master students are personally certified and directly operate instruments rather than handing samples to external operators.'
            }}
          </p>
        </div>

        <div class="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col gap-3 group">
          <div class="size-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold ring-1 ring-sky-200/80 group-hover:bg-sky-600 group-hover:text-white transition-all duration-200">
            <UIcon name="i-lucide-shield-check" class="size-6" />
          </div>
          <h3 class="text-base sm:text-lg font-black text-slate-900 group-hover:text-sky-600 transition-colors">
            {{ locale === 'vi' ? 'Không Thu Phí Đo Mẫu Phụ' : 'Zero Hidden Analysis Fees' }}
          </h3>
          <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {{ locale === 'vi'
              ? 'Tất cả chi phí vận hành máy và vật tư tiêu hao trong nghiên cứu được bao gồm trọn gói trong học phí học kỳ của VGU.'
              : 'All regular machine operating time, vacuum maintenance, and standard consumables are fully covered by your semester fee.'
            }}
          </p>
        </div>

        <div class="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col gap-3 group">
          <div class="size-12 rounded-2xl bg-slate-100 text-[#1E3A5F] flex items-center justify-center font-bold ring-1 ring-slate-200/80 group-hover:bg-[#1E3A5F] group-hover:text-white transition-all duration-200">
            <UIcon name="i-lucide-globe" class="size-6" />
          </div>
          <h3 class="text-base sm:text-lg font-black text-slate-900 group-hover:text-[#1E3A5F] transition-colors">
            {{ locale === 'vi' ? 'Kết Nối Nghiên Cứu Đức' : 'Direct German Supervision' }}
          </h3>
          <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {{ locale === 'vi'
              ? 'Đề tài luận văn thạc sĩ gắn liền với các hướng nghiên cứu trọng điểm của các giáo sư trưởng bộ môn OVGU Magdeburg.'
              : 'Capstone thesis research is directly co-supervised by German chair holders with opportunities for experimental work in Magdeburg.'
            }}
          </p>
        </div>
      </div>

      <!-- 2 Main Gateway Navigation Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

        <!-- Gateway 1: Equipment Explorer -->
        <NuxtLink
          :to="localePath('/laboratories-research/equipment')"
          class="group bg-white p-8 rounded-3xl border border-slate-200 hover:border-orange-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[280px]"
        >
          <div class="flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                22+ Characterization Instruments
              </span>
              <UIcon name="i-lucide-arrow-right" class="size-5 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h2 class="text-2xl font-black text-slate-900 group-hover:text-orange-600 transition-colors">
              {{ locale === 'vi' ? 'Hệ Thống Thiết Bị Phân Tích (SEM, XRD, TGA)' : 'Laboratory Equipment & Instruments Explorer' }}
            </h2>
            <p class="text-sm text-slate-600 leading-relaxed">
              {{ locale === 'vi'
                ? 'Tra cứu thông số kỹ thuật, phòng thực hành, hình ảnh và tài liệu hướng dẫn của hơn 22 thiết bị nghiên cứu cao cấp tại khuôn viên VGU.'
                : 'Search and inspect technical parameters, room locations, photo galleries, and user manuals for 22+ research-grade instruments at VGU.'
              }}
            </p>
          </div>
          <div class="pt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
            <span>{{ locale === 'vi' ? 'Xem danh mục thiết bị →' : 'Explore Equipment Catalog →' }}</span>
            <span class="text-orange-600">VGU Binh Duong Campus</span>
          </div>
        </NuxtLink>

        <!-- Gateway 2: OVGU Partner Chairs -->
        <NuxtLink
          :to="localePath('/laboratories-research/chairs')"
          class="group bg-white p-8 rounded-3xl border border-slate-200 hover:border-sky-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[280px]"
        >
          <div class="flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
                6 OVGU Partner Chairs
              </span>
              <UIcon name="i-lucide-arrow-right" class="size-5 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h2 class="text-2xl font-black text-slate-900 group-hover:text-sky-600 transition-colors">
              {{ locale === 'vi' ? '6 Bộ Môn Nghiên Cứu Đối Tác Tại OVGU Magdeburg' : 'OVGU Partner Research Chairs & Projects' }}
            </h2>
            <p class="text-sm text-slate-600 leading-relaxed">
              {{ locale === 'vi'
                ? 'Khám phá các hướng nghiên cứu chuyên sâu, hồ sơ giáo sư trưởng bộ môn và các dự án DFG/quốc tế tại Đại học Otto von Guericke Magdeburg.'
                : 'Discover cutting-edge research focus areas, chair director profiles, and DFG projects across 6 specialized partner institutes in Germany.'
              }}
            </p>
          </div>
          <div class="pt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
            <span>{{ locale === 'vi' ? 'Khám phá các bộ môn Đức →' : 'Explore German Chairs →' }}</span>
            <span class="text-sky-600">OVGU Magdeburg, Germany</span>
          </div>
        </NuxtLink>

      </div>

    </div>
  </main>
</template>
