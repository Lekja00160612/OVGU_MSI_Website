<script setup lang="ts">
const { locale } = useI18n()

const documents = [
  {
    id: 'booklet',
    icon: '📘',
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
    icon: '📄',
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
    icon: '🎓',
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
  <section class="docs-section section">
    <div class="container">

      <div class="section-header">
        <span class="section-eyebrow">
          {{ locale === 'vi' ? 'TÀI LIỆU THAM KHẢO' : 'PROGRAM RESOURCES' }}
        </span>
        <h2 class="section-title">
          {{ locale === 'vi' ? 'Tải tài liệu MSI' : 'Download MSI Materials' }}
        </h2>
        <p class="section-subtitle">
          {{ locale === 'vi'
            ? 'Tất cả tài liệu bạn cần để tìm hiểu và đăng ký chương trình Thạc sĩ Khoa học Vật liệu & Đổi mới.'
            : 'Everything you need to explore and apply to the Master of Science in Materials Science & Innovation program.'
          }}
        </p>
      </div>

      <div class="docs-grid">
        <div
          v-for="doc in documents"
          :key="doc.id"
          class="doc-card card"
        >
          <!-- Icon + type badge -->
          <div class="doc-top">
            <span class="doc-icon" :style="{ color: doc.iconColor }">{{ doc.icon }}</span>
            <span class="doc-type">{{ t(doc, 'label') }}</span>
            <span class="doc-badge">{{ doc.badge }}</span>
          </div>

          <h3 class="doc-title">{{ t(doc, 'title') }}</h3>
          <p class="doc-desc">{{ t(doc, 'desc') }}</p>

          <!-- Note (booklet only) -->
          <p v-if="t(doc, 'note')" class="doc-note">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink:0;margin-top:2px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {{ t(doc, 'note') }}
          </p>

          <a
            :href="doc.url"
            target="_blank"
            rel="noopener noreferrer"
            class="doc-btn btn btn-outline"
            :id="`doc-download-${doc.id}`"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            {{ locale === 'vi' ? (doc.labelVi === 'PDF' ? 'Mở PDF' : 'Tải xuống') : (doc.labelEn === 'PDF' ? 'Open PDF' : 'Download') }}
          </a>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* Uses the same design tokens as the rest of the site */
.docs-section {
  background: var(--color-gray-50);
}

/* ── Section header (matches PageHeader / section-header pattern) ── */
.section-header {
  text-align: center;
  margin-bottom: 2.5rem;
}
.section-eyebrow {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: 0.5rem;
}
.section-title {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 700;
  color: var(--color-primary);
  margin: 0 0 0.75rem;
  line-height: 1.2;
}
.section-subtitle {
  font-size: 0.975rem;
  color: var(--color-gray-600);
  max-width: 540px;
  margin: 0 auto;
  line-height: 1.7;
}

/* ── Grid ── */
.docs-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}
@media (min-width: 640px)  { .docs-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .docs-grid { grid-template-columns: repeat(3, 1fr); } }

/* ── Card (inherits .card from main.css) ── */
.doc-card {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding: 1.75rem;
}

/* Top row: icon + badges */
.doc-top {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.doc-icon {
  font-size: 1.6rem;
  line-height: 1;
}
.doc-type {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: var(--color-primary);
  color: #fff;
  padding: 2px 6px;
  border-radius: 4px;
}
.doc-badge {
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--color-accent);
  background: var(--color-accent-50, rgba(232,119,34,0.08));
  border: 1px solid var(--color-accent-100, rgba(232,119,34,0.2));
  padding: 2px 6px;
  border-radius: 4px;
}

/* Title */
.doc-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1.35;
  margin: 0;
}

/* Description */
.doc-desc {
  font-size: 0.875rem;
  color: var(--color-gray-600);
  line-height: 1.65;
  margin: 0;
  flex: 1;
}

/* Note */
.doc-note {
  display: flex;
  align-items: flex-start;
  gap: 5px;
  font-size: 0.78rem;
  color: var(--color-gray-500);
  background: var(--color-gray-100);
  border-left: 3px solid var(--color-accent);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  padding: 0.5rem 0.75rem;
  margin: 0;
  line-height: 1.5;
}

/* Download button */
.doc-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: auto;
  width: fit-content;
}
</style>
