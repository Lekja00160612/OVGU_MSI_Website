<script setup lang="ts">
const { locale } = useI18n()

const documents = [
  {
    id: 'booklet',
    icon: 'i-lucide-book-open',
    labelEn: 'PDF',
    labelVi: 'PDF',
    titleEn: 'MSI Program Booklet',
    titleVi: 'Cẩm nang Chương trình MSI',
    descEn: 'A comprehensive guide to the MSI curriculum, specialisations, laboratory facilities, faculty, and admission process.',
    descVi: 'Tài liệu toàn diện về chương trình MSI, chuyên ngành, phòng thí nghiệm, giảng viên và quy trình tuyển sinh.',
    noteEn: 'Scholarship information is not included. To view scholarships, see the MSI Scholarships file.',
    noteVi: 'Không bao gồm thông tin học bổng. Để xem học bổng, hãy tải tệp MSI Scholarships.',
    url: '/Documents/Booklet MSI (updated 06.2026).pdf',
    badge: 'Updated Jun 2026',
    iconColor: 'var(--color-primary)',
  },
  {
    id: 'leaflet',
    icon: 'i-lucide-file-text',
    labelEn: 'PDF',
    labelVi: 'PDF',
    titleEn: 'MSI Quick-Guide Leaflet',
    titleVi: 'Tờ rơi Giới thiệu Nhanh MSI',
    descEn: 'A compact at-a-glance overview of the MSI program — perfect for sharing with friends and family.',
    descVi: 'Tổng quan ngắn gọn về chương trình MSI — lý tưởng để chia sẻ với bạn bè và gia đình.',
    noteEn: null,
    noteVi: null,
    url: '/Documents/MSI leaflet 2026.pdf',
    badge: '2026 Edition',
    iconColor: 'var(--color-ovgu-blue)',
  },
  {
    id: 'scholarships',
    icon: 'i-lucide-graduation-cap',
    labelEn: 'PDF',
    labelVi: 'PDF',
    titleEn: 'MSI Scholarships',
    titleVi: 'Học bổng MSI',
    descEn: 'Full details on available scholarships, eligibility criteria, application deadlines and funding opportunities.',
    descVi: 'Thông tin đầy đủ về học bổng, tiêu chí xét duyệt, hạn nộp hồ sơ và cơ hội tài trợ.',
    noteEn: null,
    noteVi: null,
    url: '/Documents/MSI_Scholarships_Brochure.pdf',
    badge: 'Scholarships',
    iconColor: 'var(--color-accent)',
  },
]

function t(item: any, key: string) {
  return locale.value === 'vi' ? item[`${key}Vi`] : item[`${key}En`]
}
</script>

<template>
  <section class="py-16 bg-slate-50 border-t border-slate-200">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Header -->
      <div class="text-center max-w-2xl mx-auto mb-10">
        <span class="inline-block text-xs font-bold tracking-widest uppercase text-primary-600 mb-2">
          {{ locale === 'vi' ? 'TÀI LIỆU THAM KHẢO' : 'PROGRAM RESOURCES' }}
        </span>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
          {{ locale === 'vi' ? 'Tải tài liệu MSI' : 'Download MSI Materials' }}
        </h2>
        <p class="text-sm sm:text-base text-slate-600 leading-relaxed">
          {{ locale === 'vi'
            ? 'Tất cả tài liệu bạn cần để tìm hiểu và đăng ký chương trình Thạc sĩ Khoa học Vật liệu & Đổi mới.'
            : 'Everything you need to explore and apply to the Master of Science in Materials Science & Innovation program.'
          }}
        </p>
      </div>

      <!-- Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <UCard
          v-for="doc in documents"
          :key="doc.id"
          variant="outline"
          class="rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between bg-white border-slate-200"
          :ui="{ body: 'flex flex-col h-full justify-between gap-4 p-6' }"
        >
          <div>
            <!-- Icon + type badge -->
            <div class="flex items-center justify-between mb-4">
              <span class="text-3xl">{{ doc.icon }}</span>
              <div class="flex items-center gap-1.5">
                <UBadge color="neutral" variant="subtle" size="xs">{{ t(doc, 'label') }}</UBadge>
                <UBadge color="primary" variant="subtle" size="xs">{{ doc.badge }}</UBadge>
              </div>
            </div>

            <h3 class="text-lg font-bold text-slate-900 mb-2">{{ t(doc, 'title') }}</h3>
            <p class="text-sm text-slate-600 leading-relaxed mb-3">{{ t(doc, 'desc') }}</p>

            <!-- Note (booklet only) -->
            <div v-if="t(doc, 'note')" class="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-start gap-1.5">
              <UIcon name="i-lucide-info" class="size-4 text-primary-600 shrink-0 mt-0.5" />
              <span>{{ t(doc, 'note') }}</span>
            </div>
          </div>

          <UButton
            :href="doc.url"
            target="_blank"
            external
            rel="noopener noreferrer"
            icon="i-lucide-file-text"
            color="primary"
            variant="solid"
            size="md"
            block
            class="mt-4 font-bold rounded-xl justify-center shadow-xs"
            :id="`doc-download-${doc.id}`"
          >
            {{ locale === 'vi' ? (doc.labelVi === 'PDF' ? 'Mở PDF' : 'Tải xuống') : (doc.labelEn === 'PDF' ? 'Open PDF' : 'Download') }}
          </UButton>
        </UCard>
      </div>

    </div>
  </section>
</template>
