<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  activity: {
    type: Object,
    required: true
  }
})

const { locale } = useI18n()

// ── Core data ──────────────────────────────────────────────────────────────
const ticketLink = computed(() => props.activity?.ticketLink || 'https://vgu.edu.vn')
const coverImage = computed(() => props.activity?.image || '/images/academic_activities/daad-scholarships-cover.jpg')

const displayDate = computed(() => {
  if (locale.value === 'vi') return props.activity?.eventDate_vi || props.activity?.eventDate || 'Chủ Nhật, 28 Tháng 6, 2026'
  return props.activity?.eventDate || 'Sunday, 28 June 2026'
})

const displayTime = computed(() => {
  if (locale.value === 'vi') return props.activity?.eventTime_vi || '8:30 Sáng – 4:00 Chiều'
  return props.activity?.eventTime || '8:30 AM – 4:00 PM'
})

const displayAddress = computed(() => {
  if (locale.value === 'vi') return props.activity?.eventAddress_vi || 'Khuôn viên VGU, Đường Vành Đai 4, Bến Cát, Bình Dương'
  return props.activity?.eventAddress || 'VGU Campus, Ring Road 4, Ben Cat, Binh Duong'
})

const focusTitleText = computed(() => {
  if (locale.value === 'vi') return props.activity?.focusTitle_vi || 'TIÊU ĐIỂM: KHOA HỌC VẬT LIỆU (MSI)'
  return props.activity?.focusTitle || 'SPECIAL FOCUS: MATERIALS SCIENCE (MSI)'
})

const focusBodyText = computed(() => {
  if (locale.value === 'vi') return props.activity?.focusText_vi || 'Khám phá chương trình Thạc sĩ Khoa học Vật liệu & Đổi mới (MSI) tại VGU – xem trình diễn kính hiển vi tiên tiến và trao đổi cùng giảng viên Đức.'
  return props.activity?.focusText || 'Discover the MSI program. Tour state-of-the-art laboratories, see advanced microscope demonstrations and connect directly with faculty and current students.'
})

const freeBadgeText = computed(() => {
  if (locale.value === 'vi') return props.activity?.freeBadgeText_vi || 'SỰ KIỆN MIỄN PHÍ'
  return props.activity?.freeBadgeText || 'FREE – Open to All'
})

const shuttleBusText = computed(() => {
  if (locale.value === 'vi') return props.activity?.shuttleBusInfo_vi || 'Xe đưa đón miễn phí từ Hồ Con Rùa, Quận 3'
  return props.activity?.shuttleBusInfo || 'Free Shuttle from Ho Con Rua, District 3, HCMC'
})

// ── ALL schedule items from md file ────────────────────────────────────────
const scheduleItems = computed(() => {
  if (props.activity?.schedule && props.activity.schedule.length > 0) {
    return props.activity.schedule.map((item: any) => ({
      time: item.time,
      title: locale.value === 'vi' ? (item.title_vi || item.title) : item.title
    }))
  }
  return []
})

// Three collage images for the right panel
const collageImagesList = computed(() => {
  if (props.activity?.collageImages && props.activity.collageImages.length >= 3) {
    return props.activity.collageImages.slice(0, 3)
  }
  return [
    '/images/academic_activities/sem-xrd-tour-cover.jpg',
    '/images/academic_activities/polymer-labs-cover.jpg',
    '/images/academic_activities/knauf-trip-cover.jpg'
  ]
})

// Background images for the subtle grid watermark
const bgImagesList = computed(() => {
  if (props.activity?.bgImages && props.activity.bgImages.length > 0) return props.activity.bgImages
  return [
    '/images/labs/scanning-electron-microscope-semedsebsd/SEM EDS EBSD.jpg',
    '/images/labs/cleanroom-facility/Cleanroom.jpg',
    '/images/labs/nanolithography-system/Nanolithography.jpg',
    '/images/labs/micro-raman-spectrometer/Micro-raman spectrometer.jpg',
    '/images/labs/e-beam-evaporator/E-beam Evaporator.jpg',
    '/images/labs/glovebox-workstations/Glovebox Workstations.jpg',
    '/images/labs/automated-material-microscope/Automated Material Microscope.jpg',
    '/images/labs/x-ray-fluorescence-spectrometer-xrf/X-ray Fluorescence spectrometer (XRF).jpg',
    '/images/labs/differential-scanning-calorimeter-dsc/Differential Scanning Calorimeter (DSC).jpg',
    '/images/labs/environmental-chamber/environment chamber.jpg',
    '/images/labs/high-temperature-chamber-furnace/High Temperature Chamber Furnace with protective insert gas.jpg',
    '/images/labs/microlithography-system/Microlithography.jpg'
  ]
})

function triggerPrint() {
  window.print()
}
</script>

<template>
  <div class="fb-page-wrapper">

    <!-- Screen-only print button -->
    <button @click="triggerPrint" class="fb-print-fab no-print" title="Print / Save PDF">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 6 2 18 2 18 9"></polyline>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
        <rect x="6" y="14" width="12" height="8"></rect>
      </svg>
      <span>{{ locale === 'vi' ? 'In / Tải PDF' : 'Print / Save PDF' }}</span>
    </button>

    <!-- ══════════════════════════════════════════════════════════════
         FACEBOOK POST CANVAS  –  1200 × 630 px
         ══════════════════════════════════════════════════════════════ -->
    <div class="fb-canvas">

      <!-- Subtle background grid watermark -->
      <div class="fb-bg-grid">
        <div
          v-for="(img, idx) in bgImagesList"
          :key="idx"
          :class="['fb-bg-cell', `fb-span-${(idx % 6) + 1}`]"
        >
          <NuxtImg :src="img" class="fb-bg-img" loading="lazy" />
        </div>
        <div class="fb-bg-overlay" />
      </div>

      <!-- ── LEFT PANEL (dark navy, ~44% width) ── -->
      <div class="fb-left">

        <!-- Logos row -->
        <div class="fb-logos">
          <div class="fb-logo-capsule">
            <NuxtImg src="/Logo/VGU_Logo.png" alt="VGU Logo" class="fb-logo-vgu" />
          </div>
          <div class="fb-logo-x">×</div>
          <div class="fb-logo-capsule">
            <NuxtImg src="/Logo/OVGU_Logo.png" alt="OVGU Logo" class="fb-logo-ovgu" />
          </div>
          <div class="fb-free-badge">{{ freeBadgeText }}</div>
        </div>

        <!-- Title + date/time/location -->
        <div class="fb-title-block">
          <div class="fb-eyebrow">{{ locale === 'vi' ? 'TRÂN TRỌNG MỜI' : 'YOU\'RE INVITED' }}</div>
          <h1 class="fb-main-title">
            {{ locale === 'vi' ? 'NGÀY HỘI THÔNG TIN THẠC SĨ VGU' : 'VGU MASTER INFORMATION DAY' }}
            <span class="fb-year-badge">2026</span>
          </h1>
          <div class="fb-subtitle">
            {{ locale === 'vi' ? '& THAM QUAN PHÒNG LAB MSI' : '& MATERIALS SCIENCE LAB TOUR' }}
          </div>
        </div>

        <!-- Date / Time / Location chips -->
        <div class="fb-info-chips">
          <div class="fb-chip"><span class="fb-chip-icon">📅</span><span class="fb-chip-text">{{ displayDate }}</span></div>
          <div class="fb-chip"><span class="fb-chip-icon">🕒</span><span class="fb-chip-text">{{ displayTime }}</span></div>
          <div class="fb-chip"><span class="fb-chip-icon">📍</span><span class="fb-chip-text">{{ displayAddress }}</span></div>
          <div class="fb-chip"><span class="fb-chip-icon">🚌</span><span class="fb-chip-text">{{ shuttleBusText }}</span></div>
        </div>

        <!-- ── FULL SCHEDULE (all items from md, 2-column grid) ── -->
        <div v-if="scheduleItems.length" class="fb-schedule">
          <div class="fb-schedule-label">{{ locale === 'vi' ? '⏱ Chương trình ngày hội' : '⏱ Event Schedule' }}</div>
          <div class="fb-sched-grid">
            <div v-for="(item, idx) in scheduleItems" :key="idx" class="fb-sched-row">
              <span class="fb-sched-time">{{ item.time }}</span>
              <span class="fb-sched-title">{{ item.title }}</span>
            </div>
          </div>
        </div>

        <!-- Contact row -->
        <div class="fb-contact-row">
          <span>msi.vgu.edu.vn</span>
          <span class="fb-dot-sep">·</span>
          <span>masterinfo@vgu.edu.vn</span>
          <span class="fb-dot-sep">·</span>
          <span>0988 629 705</span>
        </div>

      </div><!-- /fb-left -->

      <!-- ── CENTRE PANEL (cover image + focus card, ~28% width) ── -->
      <div class="fb-centre">

        <!-- Hero cover image — fills full panel height -->
        <div class="fb-hero-img-wrap">
          <NuxtImg :src="coverImage" alt="Event Banner" class="fb-hero-img" />
          <!-- Navy gradient overlay at bottom for text legibility -->
          <div class="fb-hero-gradient" />
        </div>

        <!-- Focus card pinned at bottom over the image -->
        <div class="fb-focus-card">
          <div class="fb-focus-title">{{ focusTitleText }}</div>
          <p class="fb-focus-body">{{ focusBodyText }}</p>
        </div>

      </div><!-- /fb-centre -->

      <!-- ── RIGHT PANEL (collage + QR, ~28% width) ── -->
      <div class="fb-right">

        <!-- 3-image collage: first image spans 2 rows -->
        <div class="fb-collage">
          <div
            v-for="(imgUrl, cIdx) in collageImagesList"
            :key="cIdx"
            class="fb-collage-item"
          >
            <NuxtImg :src="imgUrl" :alt="`Lab image ${cIdx + 1}`" class="fb-collage-img" />
          </div>
        </div>

        <!-- QR code + register CTA -->
        <div class="fb-qr-section">
          <a :href="ticketLink" target="_blank" rel="noopener noreferrer" class="fb-qr-link">
            <div class="fb-qr-box">
              <QrCode :value="ticketLink" :margin="1" color-dark="#0f2240" />
            </div>
          </a>
          <div class="fb-register-cta">
            <div class="fb-register-title">{{ locale === 'vi' ? 'ĐĂNG KÝ NGAY!' : 'REGISTER NOW!' }}</div>
            <div class="fb-register-sub">{{ locale === 'vi' ? 'Quét mã QR hoặc truy cập' : 'Scan QR or visit' }}</div>
            <div class="fb-register-url">msi.vgu.edu.vn</div>
          </div>
        </div>

        <!-- Watermark tagline -->
        <div class="fb-watermark">WORK READY – WORLD READY</div>

      </div><!-- /fb-right -->

      <!-- Orange accent bar at very bottom -->
      <div class="fb-bottom-bar" />

    </div><!-- /fb-canvas -->

  </div><!-- /fb-page-wrapper -->
</template>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════════════
   PAGE WRAPPER
   ═══════════════════════════════════════════════════════════════════════════ */
.fb-page-wrapper {
  background: #060b13;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  font-family: 'Be Vietnam Pro', system-ui, sans-serif;
  position: relative;
}

/* ═══════════════════════════════════════════════════════════════════════════
   PRINT STYLES — DEFINITIVE
   Strategy: position:fixed on the canvas pins it to the print viewport.
   - Removes canvas from document flow → NO second page.
   - box-sizing:border-box on panels → borders included in width, no overflow.
   - Percentages relative to the fixed canvas (44+28+28=100%).
   ═══════════════════════════════════════════════════════════════════════════ */
@media print {
  @page {
    size: 297mm 157mm;
    margin: 0;
  }

  /* Hide everything first, then selectively show the canvas */
  .no-print { display: none !important; }

  /* Collapse the page wrapper completely — it must not generate any height */
  .fb-page-wrapper {
    display: block !important;
    width: 0 !important;
    height: 0 !important;
    min-height: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
    overflow: visible !important;
    background: transparent !important;
  }

  /* ── Canvas: fixed to top-left of the print page ─────────────────────── */
  /* position:fixed removes it from flow (no second page) and pins it to    */
  /* exactly the 297×157mm viewport defined by @page.                       */
  .fb-canvas {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 297mm !important;
    height: 157mm !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    transform: none !important;
    display: flex !important;
    flex-direction: row !important;
    overflow: hidden !important;
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }

  /* ── Left panel (44%) ────────────────────────────────────────────────── */
  .fb-left {
    box-sizing: border-box !important; /* border included in 44% width */
    width: 44% !important;
    flex-shrink: 0 !important;
    height: 157mm !important;
    padding: 7mm 9mm 6mm 9mm !important;
    gap: 3.5mm !important;
    background: #091322 !important;
    border-right: 3px solid #e87722 !important;
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }
  .fb-logo-capsule {
    background: #ffffff !important;
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }
  .fb-logo-vgu  { height: 16px !important; }
  .fb-logo-ovgu { height: 18px !important; }
  .fb-logos { padding-bottom: 3mm !important; }
  .fb-free-badge {
    background: #e87722 !important;
    color: #ffffff !important;
    font-size: 5.5pt !important;
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }
  .fb-main-title { font-size: 11pt !important; }
  .fb-year-badge {
    background: #e87722 !important;
    color: #ffffff !important;
    font-size: 9pt !important;
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }
  .fb-chip-text  { font-size: 6.5pt !important; }
  .fb-chip-icon  { font-size: 7pt !important; }
  .fb-info-chips { gap: 2mm !important; }

  /* Schedule — all items in 2 columns */
  .fb-schedule       { overflow: hidden !important; }
  .fb-schedule-label { font-size: 5.5pt !important; margin-bottom: 2mm !important; }
  .fb-sched-grid     { grid-template-columns: 1fr 1fr !important; gap: 2px 8px !important; }
  .fb-sched-time {
    background: #e87722 !important;
    color: #ffffff !important;
    font-size: 5.5pt !important;
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }
  .fb-sched-title { font-size: 5.8pt !important; }
  .fb-sched-row   { margin-bottom: 1px !important; }
  .fb-contact-row { font-size: 5.5pt !important; }

  /* ── Centre panel (28%) ──────────────────────────────────────────────── */
  .fb-centre {
    box-sizing: border-box !important;
    width: 28% !important;
    flex-shrink: 0 !important;
    height: 157mm !important;
    overflow: hidden !important;
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }
  .fb-hero-img-wrap { flex: 1 !important; overflow: hidden !important; }
  .fb-focus-card    { padding: 5mm 5mm 6mm 5mm !important; }
  .fb-focus-title   { font-size: 5.5pt !important; }
  .fb-focus-body    { font-size: 6pt !important; }

  /* ── Right panel (28%) — explicit, NOT flex:1 ────────────────────────── */
  .fb-right {
    box-sizing: border-box !important;
    width: 28% !important;
    flex-shrink: 0 !important;
    height: 157mm !important;
    padding: 5mm 6mm 6mm 6mm !important;
    gap: 3mm !important;
    overflow: hidden !important;
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }

  /* Collage: exact height = 157mm - top pad(5mm) - bot pad(6mm)
     - gap×2(6mm) - QR section(~24mm) - watermark(4mm) = 112mm        */
  .fb-collage {
    box-sizing: border-box !important;
    height: 112mm !important;
    flex: none !important;
    min-height: 0 !important;
    gap: 3px !important;
  }
  .fb-collage-item {
    box-sizing: border-box !important;
    border-radius: 4px !important;
    border: 1px solid #ffffff !important;
    overflow: hidden !important;
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }
  .fb-collage-img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    display: block !important;
  }

  /* QR section */
  .fb-qr-section {
    flex: none !important;
    padding: 3mm 4mm !important;
    gap: 3mm !important;
    border-radius: 5px !important;
    background: rgba(15,34,64,0.04) !important;
    border: 1px solid rgba(15,34,64,0.1) !important;
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }
  .fb-qr-box {
    width: 18mm !important;
    height: 18mm !important;
    background: #ffffff !important;
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }
  .fb-qr-box :deep(svg),
  .fb-qr-box svg { width: 100% !important; height: 100% !important; display: block !important; }
  .fb-register-title { font-size: 8.5pt !important; }
  .fb-register-sub   { font-size: 5.5pt !important; }
  .fb-register-url   { font-size: 6.5pt !important; }
  .fb-watermark      { font-size: 5pt !important; }

  /* Orange bottom bar */
  .fb-bottom-bar {
    background: #e87722 !important;
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }

  /* Background watermark grid */
  .fb-bg-grid {
    opacity: 0.09 !important;
    display: grid !important;
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   CANVAS — 1200 × 630 px (Facebook recommended)
   ═══════════════════════════════════════════════════════════════════════════ */
.fb-canvas {
  position: relative;
  width: 1200px;
  height: 630px;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: row;
  transform-origin: top center;
}

@media (max-width: 1260px) {
  .fb-canvas {
    transform: scale(calc((100vw - 32px) / 1200));
    margin-bottom: calc(-630px + (100vw - 32px) * 630 / 1200);
  }
}

/* ── BACKGROUND GRID WATERMARK ─────────────────────────────────────────── */
.fb-bg-grid {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(4, 1fr);
  grid-auto-flow: dense;
  gap: 3px;
  opacity: 0.07;
  z-index: 0;
  pointer-events: none;
}
.fb-span-1 { grid-column: span 2; grid-row: span 2; }
.fb-span-2 { grid-column: span 1; grid-row: span 1; }
.fb-span-3 { grid-column: span 1; grid-row: span 2; }
.fb-span-4 { grid-column: span 2; grid-row: span 1; }
.fb-span-5 { grid-column: span 1; grid-row: span 1; }
.fb-span-6 { grid-column: span 1; grid-row: span 1; }
.fb-bg-cell { width: 100%; height: 100%; overflow: hidden; }
.fb-bg-img  { width: 100%; height: 100%; object-fit: cover; }
.fb-bg-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(rgba(232, 119, 34, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(232, 119, 34, 0.04) 1px, transparent 1px);
  background-size: 30px 30px;
}

/* ══════════════════════════════════════════════════════════════════════════
   LEFT PANEL — dark navy, ~528px (44%)
   Holds: logos, title, date chips, full schedule, contacts
   ══════════════════════════════════════════════════════════════════════════ */
.fb-left {
  position: relative;
  z-index: 2;
  width: 44%;
  flex-shrink: 0;
  background: linear-gradient(160deg, #091322 0%, #152d4e 55%, #0d1f38 100%);
  padding: 20px 24px 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-right: 3px solid #e87722;
  overflow: hidden; /* Clips anything that would exceed 630px */
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
}

/* Logos row */
.fb-logos {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  flex-shrink: 0;
}
.fb-logo-capsule {
  background: #ffffff;
  padding: 3px 8px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
}
.fb-logo-vgu  { height: 24px; width: auto; object-fit: contain; }
.fb-logo-ovgu { height: 26px; width: auto; object-fit: contain; }
.fb-logo-x    { color: rgba(255,255,255,0.3); font-size: 0.9rem; font-weight: 300; }
.fb-free-badge {
  margin-left: auto;
  background: #e87722;
  color: #ffffff;
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 4px;
  white-space: nowrap;
  flex-shrink: 0;
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
}

/* Title block */
.fb-title-block { display: flex; flex-direction: column; gap: 2px; flex-shrink: 0; }
.fb-eyebrow {
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  color: #e87722;
  text-transform: uppercase;
}
.fb-main-title {
  font-size: 1.35rem;
  font-weight: 900;
  color: #ffffff;
  line-height: 1.15;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  margin: 0;
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
}
.fb-year-badge {
  display: inline-block;
  background: #e87722;
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 900;
  padding: 1px 8px;
  border-radius: 4px;
  letter-spacing: 0.06em;
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
}
.fb-subtitle {
  font-size: 0.7rem;
  font-weight: 700;
  color: rgba(255,255,255,0.7);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

/* Info chips */
.fb-info-chips { display: flex; flex-direction: column; gap: 4px; flex-shrink: 0; }
.fb-chip       { display: flex; align-items: flex-start; gap: 6px; }
.fb-chip-icon  { font-size: 0.78rem; line-height: 1.4; flex-shrink: 0; }
.fb-chip-text  { font-size: 0.72rem; font-weight: 600; color: rgba(255,255,255,0.88); line-height: 1.4; }

/* ── Schedule (all items, 2-column) ──────────────────────────────────────── */
.fb-schedule {
  flex: 1;
  min-height: 0;  /* Allows flex child to shrink below content size */
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.fb-schedule-label {
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #e87722;
  margin-bottom: 5px;
  border-left: 3px solid #e87722;
  padding-left: 5px;
  flex-shrink: 0;
}
.fb-sched-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;  /* 2-column grid fits all 8 items */
  gap: 3px 10px;
  overflow: hidden;
}
.fb-sched-row    { display: flex; align-items: baseline; gap: 4px; }
.fb-sched-time {
  font-size: 0.55rem;
  font-weight: 800;
  color: #ffffff;
  background: #e87722;
  padding: 1px 4px;
  border-radius: 2px;
  white-space: nowrap;
  flex-shrink: 0;
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
}
.fb-sched-title {
  font-size: 0.6rem;
  font-weight: 600;
  color: rgba(255,255,255,0.85);
  line-height: 1.25;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Contact row */
.fb-contact-row {
  flex-shrink: 0;
  font-size: 0.62rem;
  font-weight: 700;
  color: rgba(255,255,255,0.45);
  display: flex;
  gap: 5px;
  align-items: center;
  flex-wrap: wrap;
  letter-spacing: 0.02em;
}
.fb-dot-sep { opacity: 0.4; }

/* ══════════════════════════════════════════════════════════════════════════
   CENTRE PANEL — cover image fills full height + focus card overlay
   ~336px (28%)
   ══════════════════════════════════════════════════════════════════════════ */
.fb-centre {
  position: relative;
  z-index: 2;
  width: 28%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(30, 58, 95, 0.1);
  overflow: hidden;
}

/* Hero image fills whole panel */
.fb-hero-img-wrap {
  position: relative;
  flex: 1;
  overflow: hidden;
}
.fb-hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
/* Navy-to-transparent gradient at bottom, behind focus card */
.fb-hero-gradient {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 55%;
  background: linear-gradient(to bottom, transparent 0%, rgba(9,19,34,0.92) 100%);
}

/* Focus card — absolutely pinned to bottom of the centre panel */
.fb-focus-card {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  z-index: 3;
  padding: 12px 14px 14px 14px;
}
.fb-focus-title {
  font-size: 0.58rem;
  font-weight: 900;
  color: #e87722;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.fb-focus-body {
  font-size: 0.65rem;
  color: rgba(255,255,255,0.9);
  line-height: 1.45;
  margin: 0;
}

/* ══════════════════════════════════════════════════════════════════════════
   RIGHT PANEL — collage + QR, ~336px (28%)
   ══════════════════════════════════════════════════════════════════════════ */
.fb-right {
  position: relative;
  z-index: 2;
  flex: 1;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  padding: 14px 16px 18px 16px;
  gap: 10px;
  overflow: hidden;
}

/* 3-image collage — first image spans 2 rows */
.fb-collage {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 5px;
  flex: 1;          /* Takes all available height */
  min-height: 0;
}
.fb-collage-item {
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid #ffffff;
  box-shadow: 0 3px 8px rgba(0,0,0,0.1);
}
.fb-collage-item:first-child { grid-row: span 2; }
.fb-collage-img { width: 100%; height: 100%; object-fit: cover; display: block; }

/* QR + CTA section */
.fb-qr-section {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(15, 34, 64, 0.04);
  border: 1px solid rgba(15, 34, 64, 0.1);
  border-radius: 8px;
  padding: 9px 12px;
  flex-shrink: 0;
}
.fb-qr-link { flex-shrink: 0; text-decoration: none; }
.fb-qr-box {
  width: 68px;
  height: 68px;
  background: #ffffff;
  padding: 4px;
  border-radius: 6px;
  border: 1px solid rgba(15, 34, 64, 0.1);
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
}
.fb-qr-box :deep(svg) { width: 100%; height: 100%; display: block; }
.fb-register-cta { display: flex; flex-direction: column; gap: 1px; }
.fb-register-title { font-size: 0.9rem; font-weight: 900; color: #0f2240; }
.fb-register-sub   { font-size: 0.6rem; color: #6b7280; }
.fb-register-url   { font-size: 0.72rem; font-weight: 700; color: #e87722; }

/* Watermark */
.fb-watermark {
  flex-shrink: 0;
  font-size: 0.55rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: rgba(30,58,95,0.25);
  text-align: right;
}

/* Orange bottom stripe */
.fb-bottom-bar {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 5px;
  background: linear-gradient(90deg, #e87722 0%, #f5a623 50%, #e87722 100%);
  z-index: 10;
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
}

/* ═══════════════════════════════════════════════════════════════════════════
   PRINT FAB (screen only)
   ═══════════════════════════════════════════════════════════════════════════ */
.fb-print-fab {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 99;
  background: #e87722;
  color: #ffffff;
  border: none;
  border-radius: 50px;
  padding: 0.85rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  box-shadow: 0 8px 25px rgba(232, 119, 34, 0.45);
  transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1), background-color 200ms;
  font-family: 'Be Vietnam Pro', system-ui, sans-serif;
}
.fb-print-fab:hover {
  background: #d96512;
  transform: translateY(-3px) scale(1.03);
}
</style>
