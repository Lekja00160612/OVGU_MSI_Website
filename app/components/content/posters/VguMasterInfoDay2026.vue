<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps({
  activity: {
    type: Object,
    required: true
  }
})

const { locale, t } = useI18n()
const localePath = useLocalePath()

// Crucial schema fields
const ticketLink = computed(() => props.activity?.ticketLink || 'https://vgu.edu.vn')
const coverImage = computed(() => props.activity?.image || '/images/academic_activities/daad-scholarships-cover.jpg')

// Fallback/Default date formatted based on locale
const displayDate = computed(() => {
  if (locale.value === 'vi') {
    return props.activity?.eventDate_vi || props.activity?.eventDate || 'Chủ Nhật, 28 Tháng 6, 2026'
  }
  return props.activity?.eventDate || 'Sunday, 28 June 2026'
})

const displayTime = computed(() => {
  if (locale.value === 'vi') {
    return props.activity?.eventTime_vi || '8:30 Sáng - 2:00 Chiều (bao gồm tham quan phòng Lab)'
  }
  return props.activity?.eventTime || '8:30 AM - 2:00 PM (incorporating lab tour)'
})

const displayAddress = computed(() => {
  if (locale.value === 'vi') {
    return props.activity?.eventAddress_vi || 'Khuôn viên VGU, Đường Vành Đai 4, Bến Cát, Bình Dương'
  }
  return props.activity?.eventAddress || 'VGU Campus, Ring Road 4, Ben Cat, Binh Duong'
})

// Dynamic background images collage
const bgImagesList = computed(() => {
  if (props.activity?.bgImages && props.activity.bgImages.length > 0) {
    return props.activity.bgImages
  }
  // Standard list of 26 high-tech laboratory equipment images from this website
  return [
    '/images/labs/analytical-balance/Analytical Balance.jpg',
    '/images/labs/automated-material-microscope/Automated Material Microscope.jpg',
    '/images/labs/cleanroom-facility/Cleanroom.jpg',
    '/images/labs/convection-oven/Convection Oven.jpg',
    '/images/labs/deionized-water-purifier/water purifier.jpg',
    '/images/labs/differential-scanning-calorimeter-dsc/Differential Scanning Calorimeter (DSC).jpg',
    '/images/labs/e-beam-evaporator/E-beam Evaporator.jpg',
    '/images/labs/environmental-chamber/environment chamber.jpg',
    '/images/labs/flammable-storage-cabinets/Flammable Storage Cabinets.jpg',
    '/images/labs/freezer-25c/Freezer -25 degree Celsius.jpg',
    '/images/labs/fume-hood/fume hood.jpg',
    '/images/labs/glovebox-workstations/Glovebox Workstations.jpg',
    '/images/labs/high-temperature-chamber-furnace/High Temperature Chamber Furnace with protective insert gas.jpg',
    '/images/labs/hotplate/Hotplate.jpg',
    '/images/labs/incident-photon-to-current-efficiency-ipce/incident photon to current effect.jpg',
    '/images/labs/infrared-thermometer/Infrared thermometer.png',
    '/images/labs/laser-diffraction-particle-size-analyzer/Diffraction particle size analysis and suspension stability.jpg',
    '/images/labs/magnetic-stirrer/magnetic stirrer.jpg',
    '/images/labs/micro-hardness-tester/Micro Hardness tester.jpg',
    '/images/labs/micro-raman-spectrometer/Micro-raman spectrometer.jpg',
    '/images/labs/microlithography-system/Microlithography.jpg',
    '/images/labs/mili-q-water-purification-system/Mili-Q water purification system.jpg',
    '/images/labs/nanolithography-system/Nanolithography.jpg',
    '/images/labs/oxidation-furnace/oxidation furnace.jpg',
    '/images/labs/scanning-electron-microscope-semedsebsd/SEM+EDS+EBSD.jpg',
    '/images/labs/x-ray-fluorescence-spectrometer-xrf/X-ray Fluorescence spectrometer (XRF).jpg'
  ]
})

// Dynamic collage images (middle right column)
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

// Dynamic event focus fields
const focusTitleText = computed(() => {
  if (locale.value === 'vi') {
    return props.activity?.focusTitle_vi || 'TIÊU ĐIỂM ĐẶC BIỆT: KHOA HỌC VẬT LIỆU (MSI)'
  }
  return props.activity?.focusTitle || 'SPECIAL FOCUS: MATERIALS SCIENCE (MSI)'
})

const focusBodyText = computed(() => {
  if (locale.value === 'vi') {
    return props.activity?.focusText_vi || 'Khám phá chương trình đào tạo Thạc sĩ Khoa học Vật liệu & Đổi mới (MSI) liên kết Đức tại VGU. Xem trực tiếp các buổi thử nghiệm, trình diễn thiết bị kính hiển vi cao cấp và trao đổi trực tiếp cùng đội ngũ giảng viên, chuyên gia đầu ngành từ Đức.'
  }
  return props.activity?.focusText || 'Discover the curriculum of the Master of Science in Materials Science (MSI) program. Tour our state-of-the-art laboratory facilities, see advanced microscope demonstrations and scientific experiments, and connect directly with MSI faculty and current students.'
})

// Dynamic timeline schedule
const timelineItems = computed(() => {
  if (props.activity?.schedule && props.activity.schedule.length > 0) {
    return props.activity.schedule.map((item: any) => ({
      time: item.time,
      title: locale.value === 'vi' ? (item.title_vi || item.title) : item.title,
      desc: locale.value === 'vi' ? (item.desc_vi || item.desc) : item.desc
    }))
  }

  // Default Master Info Day Schedule
  if (locale.value === 'vi') {
    return [
      { time: '8:30 - 9:00', title: 'Đăng ký & Kết nối', desc: 'Gặp gỡ cựu sinh viên VGU tại sảnh đón tiếp.' },
      { time: '9:00 - 9:30', title: 'Tổng quan Tuyển sinh Thạc sĩ VGU', desc: 'Giới thiệu các chương trình thạc sĩ & định hướng MSI.' },
      { time: '9:30 - 10:00', title: 'Trò chuyện cùng Cựu sinh viên', desc: '"Hơn cả một tấm bằng" - Chia sẻ thực tế từ cựu học viên.' },
      { time: '10:00 - 10:30', title: 'Tiệc trà & Giao lưu', desc: 'Giải lao và kết nối trực tiếp với giảng viên.' },
      { time: '10:30 - 12:00', title: 'THAM QUAN PHÒNG LAB MSI', desc: 'Trực tiếp khám phá các trang thiết bị phân tích hiện đại bậc nhất.' },
      { time: '12:00 - 1:30', title: 'Trình diễn Lab & Tư vấn 1-1', desc: 'Xem thử nghiệm thực tế & tư vấn học bổng DAAD, hồ sơ nhập học.' },
      { time: '1:30 - 2:00', title: 'Giải đáp thắc mắc & Bế mạc', desc: 'Trao đổi tự do cùng Giám đốc chương trình và kết thúc.' }
    ]
  }
  return [
    { time: '8:30 - 9:00', title: 'Check-in & Connections', desc: 'Meet VGU alumni at the reception hall.' },
    { time: '9:00 - 9:30', title: 'VGU Masters Admissions Overview', desc: 'Introducing master programs & MSI overview.' },
    { time: '9:30 - 10:00', title: 'Alumni Talk', desc: '"More than a degree" - Real sharing from graduates.' },
    { time: '10:00 - 10:30', title: 'Tea Break & Networking', desc: 'Relax and talk with professors and peers.' },
    { time: '10:30 - 12:00', title: 'MATERIALS SCIENCE (MSI) LAB TOUR', desc: 'Explore state-of-the-art laboratory facilities.' },
    { time: '12:00 - 1:30', title: 'Extended Lab Demos & 1-1 Counseling', desc: 'See real-time experiments & DAAD scholarship guidance.' },
    { time: '1:30 - 2:00', title: 'Final Questions & Closing', desc: 'Open Q&A session with Academic Coordinators.' }
  ]
})

const freeBadgeText = computed(() => {
  if (locale.value === 'vi') {
    return props.activity?.freeBadgeText_vi || 'SỰ KIỆN MIỄN PHÍ DÀNH CHO TẤT CẢ'
  }
  return props.activity?.freeBadgeText || 'FREE Event Open to All'
})

const shuttleBusText = computed(() => {
  if (locale.value === 'vi') {
    return props.activity?.shuttleBusInfo_vi || 'Có xe đưa đón miễn phí từ Hồ Con Rùa, Quận 3, TP.HCM đến VGU'
  }
  return props.activity?.shuttleBusInfo || 'Free Shuttle Bus from Ho Con Rua, District 3, HCMC to VGU available'
})

// Metadata for Lab Equipments
const labEquipmentData = [
  { en: 'SEM+EDS+EBSD Microscope', vi: 'Kính hiển vi quét SEM+EDS+EBSD' },
  { en: 'Class 100 Cleanroom', vi: 'Phòng sạch chuẩn Class 100' },
  { en: 'Automated Material Microscope', vi: 'Kính hiển vi vật liệu tự động' },
  { en: 'Glovebox Workstations', vi: 'Hệ thống tủ thao tác găng tay' },
  { en: 'Nanolithography System', vi: 'Hệ thống khắc nano lithography' },
  { en: 'Microlithography System', vi: 'Hệ thống quang khắc vi mô' },
  { en: 'Micro-Raman Spectrometer', vi: 'Quang phổ kế vi Raman' },
  { en: 'High-Temp Chamber Furnace', vi: 'Lò nung nhiệt độ cao bảo vệ' },
  { en: 'Laser Particle Size Analyzer', vi: 'Máy phân tích kích thước hạt laser' },
  { en: 'X-ray Fluorescence (XRF)', vi: 'Quang phổ huỳnh quang tia X' },
  { en: 'Differential Scanning Calorimeter', vi: 'Nhiệt lượng kế quét vi sai DSC' },
  { en: 'E-beam Evaporator', vi: 'Hệ bốc bay chùm tia điện tử E-beam' },
  { en: 'Environmental Chamber', vi: 'Tủ thử nghiệm sốc nhiệt môi trường' },
  { en: 'Flammable Storage Cabinet', vi: 'Tủ chứa hóa chất dễ cháy an toàn' },
  { en: 'Deep Freezer -25°C', vi: 'Tủ đông sâu phòng Lab -25°C' },
  { en: 'Fume Hood Ventilation', vi: 'Tủ hút khí độc phòng thí nghiệm' },
  { en: 'Precision Lab Hotplate', vi: 'Bếp gia nhiệt kỹ thuật số' },
  { en: 'IPCE Efficiency System', vi: 'Hệ đo hiệu suất điện lượng quang tử' },
  { en: 'Infrared Thermometer', vi: 'Nhiệt kế hồng ngoại từ xa' },
  { en: 'Magnetic Stirrer', vi: 'Máy khuấy từ gia nhiệt cơ học' },
  { en: 'Micro-Hardness Tester', vi: 'Thiết bị đo độ cứng tế vi Vickers' },
  { en: 'Mili-Q Purification System', vi: 'Hệ lọc nước siêu sạch Mili-Q' },
  { en: 'Oxidation Furnace', vi: 'Lò oxy hóa khuếch tán bán dẫn' },
  { en: 'Planetary Ball Mill', vi: 'Máy nghiền bi hành tinh cao năng' },
  { en: 'Plasma Cleaner', vi: 'Thiết bị làm sạch bề mặt plasma' },
  { en: 'RIE Etching System', vi: 'Hệ thống ăn mòn ion phản ứng RIE' }
]

// 40 Calibrated coordinates and styles for dense, chaotic free-flow mood board collage
const cardPresets = [
  // LEFT COLUMN: OUTSIDE / MINIMAL COLLISION
  { top: '2%', leftOffset: '-210px', rotate: 'rotate(-15deg)', scale: 0.9, z: 1 },
  { top: '14%', leftOffset: '-230px', rotate: 'rotate(18deg)', scale: 0.95, z: 2 },
  { top: '26%', leftOffset: '-200px', rotate: 'rotate(-22deg)', scale: 1.1, z: 1 },
  { top: '38%', leftOffset: '-240px', rotate: 'rotate(12deg)', scale: 0.85, z: 3 },
  { top: '50%', leftOffset: '-210px', rotate: 'rotate(-10deg)', scale: 1.0, z: 1 },
  { top: '62%', leftOffset: '-230px', rotate: 'rotate(24deg)', scale: 0.95, z: 2 },
  { top: '74%', leftOffset: '-200px', rotate: 'rotate(-18deg)', scale: 1.15, z: 1 },
  { top: '86%', leftOffset: '-220px', rotate: 'rotate(15deg)', scale: 0.88, z: 3 },

  // RIGHT COLUMN: OUTSIDE / MINIMAL COLLISION
  { top: '4%', rightOffset: '20px', rotate: 'rotate(15deg)', scale: 0.9, z: 1 },
  { top: '16%', rightOffset: '40px', rotate: 'rotate(-18deg)', scale: 0.95, z: 2 },
  { top: '28%', rightOffset: '10px', rotate: 'rotate(22deg)', scale: 1.1, z: 1 },
  { top: '40%', rightOffset: '50px', rotate: 'rotate(-12deg)', scale: 0.85, z: 3 },
  { top: '52%', rightOffset: '20px', rotate: 'rotate(10deg)', scale: 1.0, z: 1 },
  { top: '64%', rightOffset: '40px', rotate: 'rotate(-24deg)', scale: 0.95, z: 2 },
  { top: '76%', rightOffset: '10px', rotate: 'rotate(18deg)', scale: 1.15, z: 1 },
  { top: '88%', rightOffset: '30px', rotate: 'rotate(-15deg)', scale: 0.88, z: 3 },

  // PEEKING INNER LAYER (MORE TIGHTLY CONTROLLED: overlaps by 30px max)
  { top: '8%', leftOffset: '-160px', rotate: 'rotate(8deg)', scale: 0.85, z: 2 },
  { top: '20%', rightOffset: '-30px', rotate: 'rotate(-10deg)', scale: 0.85, z: 2 },
  { top: '32%', leftOffset: '-165px', rotate: 'rotate(-14deg)', scale: 0.85, z: 2 },
  { top: '44%', rightOffset: '-25px', rotate: 'rotate(9deg)', scale: 0.85, z: 2 },
  { top: '56%', leftOffset: '-160px', rotate: 'rotate(11deg)', scale: 0.85, z: 2 },
  { top: '68%', rightOffset: '-30px', rotate: 'rotate(-8deg)', scale: 0.85, z: 2 },
  { top: '80%', leftOffset: '-165px', rotate: 'rotate(-7deg)', scale: 0.85, z: 2 },
  { top: '92%', rightOffset: '-25px', rotate: 'rotate(10deg)', scale: 0.85, z: 2 },

  // extra dense layers (outermost, strictly outside)
  { top: '10%', leftOffset: '-240px', rotate: 'rotate(-18deg)', scale: 0.8, z: 1 },
  { top: '22%', rightOffset: '60px', rotate: 'rotate(20deg)', scale: 0.8, z: 1 },
  { top: '34%', leftOffset: '-250px', rotate: 'rotate(15deg)', scale: 0.8, z: 1 },
  { top: '46%', rightOffset: '55px', rotate: 'rotate(-16deg)', scale: 0.8, z: 1 },
  { top: '58%', leftOffset: '-240px', rotate: 'rotate(-12deg)', scale: 0.8, z: 1 },
  { top: '70%', rightOffset: '65px', rotate: 'rotate(14deg)', scale: 0.8, z: 1 },
  { top: '82%', leftOffset: '-250px', rotate: 'rotate(-20deg)', scale: 0.8, z: 1 },
  { top: '94%', rightOffset: '50px', rotate: 'rotate(15deg)', scale: 0.8, z: 1 },
  
  // extra peeking layers
  { top: '6%', leftOffset: '-150px', rotate: 'rotate(10deg)', scale: 0.82, z: 2 },
  { top: '18%', rightOffset: '-20px', rotate: 'rotate(-12deg)', scale: 0.82, z: 2 },
  { top: '30%', leftOffset: '-155px', rotate: 'rotate(-8deg)', scale: 0.82, z: 2 },
  { top: '42%', rightOffset: '-15px', rotate: 'rotate(11deg)', scale: 0.82, z: 2 },
  { top: '54%', leftOffset: '-150px', rotate: 'rotate(9deg)', scale: 0.82, z: 2 },
  { top: '66%', rightOffset: '-20px', rotate: 'rotate(-10deg)', scale: 0.82, z: 2 },
  { top: '78%', leftOffset: '-155px', rotate: 'rotate(-7deg)', scale: 0.82, z: 2 },
  { top: '90%', rightOffset: '-15px', rotate: 'rotate(8deg)', scale: 0.82, z: 2 }
]

// Compute full properties of 40 floating elements
const floatingCardsList = computed(() => {
  const list = []
  const images = bgImagesList.value
  if (!images || images.length === 0) return []

  for (let i = 0; i < Math.min(40, cardPresets.length); i++) {
    const preset = cardPresets[i]
    const imgUrl = images[i % images.length]
    const equipment = labEquipmentData[i % labEquipmentData.length]
    
    const styleObj: any = {
      top: preset.top,
      transform: `${preset.rotate} scale(${preset.scale})`,
      zIndex: preset.z || 1,
      transitionDelay: `${i * 8}ms`
    }
    
    if (preset.leftOffset) {
      styleObj.left = `calc(50% - 460px + ${preset.leftOffset})`
    } else if (preset.rightOffset) {
      styleObj.left = `calc(50% + 460px + ${preset.rightOffset})`
    }
    
    list.push({
      src: imgUrl,
      label: locale.value === 'vi' ? equipment.vi : equipment.en,
      style: styleObj
    })
  }
  return list
})

// Trigger native browser printing
function triggerPrint() {
  window.print()
}
</script>

<template>
  <div class="poster-page-wrapper">
    
    <!-- Screen-only Back Link -->
    <div class="no-print back-link-row container">
      <NuxtLink :to="localePath('/academic-activities')" class="back-link">
        &larr; {{ t('activities.back_to_activities') }}
      </NuxtLink>
    </div>

    <!-- FLOATING SLANTED LAB IMAGES LAYER (FREE FLOW LAYER) - PLACED OUTSIDE TO AVOID CONTAINER CLIPPING -->
    <div class="floating-bg-assets no-print">
      <div 
        v-for="(card, idx) in floatingCardsList" 
        :key="idx" 
        class="floating-asset" 
        :style="card.style"
      >
        <NuxtImg :src="card.src" class="floating-img" loading="lazy" />
        <div class="floating-label">
          <span class="label-dot"></span>
          <span class="label-text">{{ card.label }}</span>
        </div>
      </div>
    </div>

    <!-- MAIN POSTER CONTAINER (Sized for print and screen) -->
    <div class="poster-container">
      
      <!-- BACKGROUND collage grid for premium design -->
      <div class="poster-bg-grid">
        <div 
          v-for="(img, idx) in bgImagesList" 
          :key="idx" 
          :class="['bg-grid-item', `grid-span-${(idx % 12) + 1}`]"
        >
          <NuxtImg :src="img" class="bg-img" loading="lazy" />
        </div>
        <div class="bg-overlay" />
      </div>

      <!-- TOP BANNER HEADER -->
      <div class="poster-header">
        <div class="header-logos">
          <!-- VGU & OVGU logos placed in white background capsules to preserve brand colors on screen and print -->
          <div class="logo-capsule">
            <NuxtImg src="/Logo/VGU_Logo.png" alt="VGU Logo" class="logo-vgu" />
          </div>
          <div class="logo-capsule">
            <NuxtImg src="/Logo/OVGU_Logo.png" alt="OVGU Logo" class="logo-ovgu" />
          </div>
        </div>
        <h1 class="poster-main-title">
          {{ locale === 'vi' ? 'NGÀY HỘI THÔNG TIN THẠC SĨ VGU 2026' : 'VGU MASTER INFORMATION DAY 2026' }}
          <span class="highlight-text">&amp; {{ locale === 'vi' ? 'CHUYẾN THAM QUAN PHÒNG THÍ NGHIỆM (MSI) MỞ RỘNG' : 'EXTENSIVE MATERIALS SCIENCE (MSI) LAB TOUR' }}</span>
        </h1>
        <p class="poster-subtitle">
          {{ locale === 'vi' ? 'Khám phá tương lai của bạn trong ngành Khoa học Vật liệu. Chào đón các học viên tương lai của chương trình Thạc sĩ Khoa học Vật liệu & Đổi mới (MSI)!' : 'Exploring Your Future in Materials Science. Welcoming Future Students of the Master Of MATERIALS SCIENCE (MSI) Program!' }}
        </p>
      </div>

      <!-- SAVE THE DATE & QUICK CARD SECTION -->
      <div class="date-hero-section">
        <div class="save-date-card">
          <h2 class="save-title">SAVE THE DATE</h2>
          <div class="info-list">
            <div class="info-item">
              <span class="info-icon">📅</span>
              <div class="info-text">
                <strong class="info-label">{{ locale === 'vi' ? 'Thời gian' : 'Date' }}:</strong>
                <span>{{ displayDate }}</span>
              </div>
            </div>
            <div class="info-item">
              <span class="info-icon">🕒</span>
              <div class="info-text">
                <strong class="info-label">{{ locale === 'vi' ? 'Giờ giấc' : 'Time' }}:</strong>
                <span>{{ displayTime }}</span>
              </div>
            </div>
            <div class="info-item">
              <span class="info-icon">📍</span>
              <div class="info-text">
                <strong class="info-label">{{ locale === 'vi' ? 'Địa điểm' : 'Address' }}:</strong>
                <span>{{ displayAddress }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="hero-image-wrap">
          <NuxtImg :src="coverImage" alt="Event Banner Image" class="hero-banner-img" />
        </div>
      </div>

      <!-- MIDDLE SPLIT SECTION: TIMELINE VS DETAILS -->
      <div class="middle-layout">
        
        <!-- LEFT: SCHEDULE TIMELINE -->
        <div class="schedule-column">
          <h3 class="section-title">
            <span class="title-icon">⏱️</span>
            {{ locale === 'vi' ? 'Chương Trình Chi Tiết' : 'Event Schedule' }}
          </h3>
          <div class="timeline-container">
            <div 
              v-for="(item, idx) in timelineItems" 
              :key="idx" 
              class="timeline-item"
            >
              <div class="timeline-badge-col">
                <div class="timeline-badge">
                  <span class="badge-dot" />
                </div>
                <div v-if="idx < timelineItems.length - 1" class="timeline-line" />
              </div>
              <div class="timeline-content-col">
                <span class="timeline-time">{{ item.time }}</span>
                <h4 class="timeline-title">{{ item.title }}</h4>
                <p class="timeline-desc">{{ item.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT: SPECIAL FOCUS & IMAGE COLLAGE -->
        <div class="details-column">
          <div class="focus-card">
            <h4 class="focus-card-title">
              {{ focusTitleText }}
            </h4>
            <p class="focus-card-text">
              {{ focusBodyText }}
            </p>
          </div>

          <!-- Collage of Laboratory/Event Images -->
          <div class="collage-container">
            <div 
              v-for="(imgUrl, collageIdx) in collageImagesList" 
              :key="collageIdx" 
              :class="`collage-item collage-item-${collageIdx + 1}`"
            >
              <NuxtImg :src="imgUrl" :alt="`Lab collage image ${collageIdx + 1}`" class="collage-img" />
            </div>
          </div>
        </div>
      </div>

      <!-- BOTTOM REGISTRATION & FOOTER CARD -->
      <div class="poster-footer-card">
        <div class="footer-left">
          <h3 class="register-title">{{ locale === 'vi' ? 'ĐĂNG KÝ NGAY!' : 'REGISTER NOW!' }}</h3>
          <p class="register-subtitle">
            {{ locale === 'vi' ? 'Số lượng chỗ ngồi có hạn. Hãy đăng ký ngay để giữ chỗ và sắp xếp xe đưa đón.' : 'Limited seats. Ensure your spot & bus transfer.' }}
          </p>
          <div class="free-badge">
            {{ freeBadgeText }}
          </div>
          <div class="contact-details-grid">
            <div><strong>{{ locale === 'vi' ? 'Trang web' : 'Website' }}:</strong> www.vgu.edu.vn</div>
            <div><strong>Hotline:</strong> 0988 629 705</div>
            <div><strong>General Email:</strong> masterinfo@vgu.edu.vn</div>
            <div><strong>MSI Email:</strong> msi.info@vgu.edu.vn</div>
          </div>
        </div>
        
        <!-- QR CODE MODULE -->
        <div class="footer-right">
          <div class="qr-box">
            <QrCode :value="ticketLink" :margin="1" color-dark="#0f2240" />
          </div>
          <span class="qr-text">{{ locale === 'vi' ? 'Quét mã để đăng ký' : 'Scan to Register' }}</span>
        </div>
      </div>

      <!-- FOOTER BOTTOM INFOBAR -->
      <div class="bottom-infobar">
        <span class="shuttle-info">
          🚌 {{ shuttleBusText }}
        </span>
        <div class="footer-watermark-text">WORK READY - WORLD READY</div>
      </div>

    </div>

    <!-- FLOATING PRINT FAB (SCREEN ONLY) -->
    <button 
      @click="triggerPrint" 
      class="print-fab no-print" 
      :title="locale === 'vi' ? 'In vé / Lưu PDF' : 'Print Ticket / Save PDF'"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="print-icon">
        <polyline points="6 9 6 2 18 2 18 9"></polyline>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
        <rect x="6" y="14" width="12" height="8"></rect>
      </svg>
      <span class="print-fab-text">{{ locale === 'vi' ? 'In / Tải PDF' : 'Print / Save PDF' }}</span>
    </button>
  </div>
</template>

<style scoped>
/* ==========================================================================
   SCREEN PRESENTATION STYLES (Frosted Glass & Background Collage Effect)
   ========================================================================== */
.poster-page-wrapper {
  background: #060b13; /* Deep cybernetic space backdrop */
  min-height: 100vh;
  padding: 4rem 1rem;
  font-family: 'Be Vietnam Pro', system-ui, sans-serif;
  color: #1e3a5f;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow-x: hidden; /* Prevent horizontal scrollbars from floating assets */
}

.back-link-row {
  width: 100%;
  max-width: 920px;
  margin-bottom: 1.5rem;
  z-index: 10;
}
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #ffffff;
  font-weight: 700;
  text-decoration: none;
  font-size: 0.95rem;
  transition: transform 200ms, color 200ms;
}
.back-link:hover {
  transform: translateX(-4px);
  color: #e87722;
}

/* Base ticket container styling on screen with Glassmorphism */
.poster-container {
  width: 100%;
  max-width: 920px;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-radius: var(--radius-3xl, 32px);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.45), 0 0 1px 1px rgba(255, 255, 255, 0.2) inset;
  border: 1.5px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  position: relative;
  z-index: 5;
}

/* Background grid styling */
.poster-bg-grid {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(8, 1fr);
  grid-auto-flow: dense; /* Packs different sized cards cleanly together without gaps */
  gap: 4px;
  opacity: 0.08; /* Subtle watermark layout backdrop for text visibility */
  z-index: -2;
  pointer-events: none;
}

/* Asymmetric grid span classes for a chaotic, premium collage layout */
.grid-span-1 { grid-column: span 2; grid-row: span 2; }
.grid-span-2 { grid-column: span 1; grid-row: span 1; }
.grid-span-3 { grid-column: span 1; grid-row: span 2; }
.grid-span-4 { grid-column: span 2; grid-row: span 1; }
.grid-span-5 { grid-column: span 1; grid-row: span 1; }
.grid-span-6 { grid-column: span 1; grid-row: span 1; }
.grid-span-7 { grid-column: span 2; grid-row: span 1; }
.grid-span-8 { grid-column: span 1; grid-row: span 2; }
.grid-span-9 { grid-column: span 1; grid-row: span 1; }
.grid-span-10 { grid-column: span 2; grid-row: span 2; }
.grid-span-11 { grid-column: span 1; grid-row: span 1; }
.grid-span-12 { grid-column: span 1; grid-row: span 1; }

.bg-grid-item {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(15%) brightness(92%) contrast(115%); /* Highly visible colors and details! */
}
.bg-overlay {
  position: absolute;
  inset: 0;
  /* Glowing cybernetic micro-grid pattern overlay */
  background: 
    radial-gradient(circle at center, transparent 30%, rgba(6, 11, 19, 0.25) 90%),
    linear-gradient(rgba(232, 119, 34, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(232, 119, 34, 0.06) 1px, transparent 1px);
  background-size: 100% 100%, 25px 25px, 25px 25px;
}

/* Floating slanted lab images layer (free flow layer) */
.floating-bg-assets {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* Floating Asset Card Layout */
.floating-asset {
  position: absolute;
  width: 190px;
  height: 135px;
  border-radius: 12px;
  overflow: hidden;
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.1) inset;
  transition: transform 300ms cubic-bezier(0.25, 0.8, 0.25, 1), border-color 300ms ease, box-shadow 300ms ease, opacity 300ms ease;
  will-change: transform;
  display: flex;
  flex-direction: column;
  pointer-events: auto; /* Allow hovering on screen */
  cursor: pointer;
  opacity: 0.88; /* Highly visible lab images */
}

.floating-img {
  width: 100%;
  height: calc(100% - 25px);
  object-fit: cover;
  filter: grayscale(25%) brightness(85%) contrast(110%);
  transition: filter 300ms ease;
}

.floating-label {
  height: 25px;
  background: rgba(9, 19, 34, 0.9);
  border-top: 1px solid rgba(232, 119, 34, 0.35);
  padding: 0 8px;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: background-color 300ms, border-color 300ms;
}

.label-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #e87722;
  box-shadow: 0 0 6px #e87722;
  flex-shrink: 0;
}

.label-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.65rem;
  font-weight: 750;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

/* Floating Asset Hover State */
.floating-asset:hover {
  transform: rotate(0deg) scale(1.22) !important;
  z-index: 50 !important; /* Flies to the front, above the central card! */
  border-color: rgba(232, 119, 34, 0.85);
  box-shadow: 0 20px 45px rgba(232, 119, 34, 0.5), 0 0 15px rgba(232, 119, 34, 0.3);
  opacity: 1.0;
}

.floating-asset:hover .floating-img {
  filter: grayscale(0%) brightness(105%) contrast(100%);
}

.floating-asset:hover .floating-label {
  background: rgba(232, 119, 34, 0.95);
  border-top-color: #ffffff;
}

.floating-asset:hover .label-dot {
  background: #ffffff;
  box-shadow: 0 0 6px #ffffff;
}

.floating-asset:hover .label-text {
  color: #ffffff;
}

/* Hide floating layer on smaller screens to avoid overflow */
@media (max-width: 1420px) {
  .floating-bg-assets {
    display: none;
  }
}

/* TOP BANNER HEADER */
.poster-header {
  background: linear-gradient(135deg, #091322 0%, #152d4e 100%);
  margin: -3rem -3rem 0 -3rem;
  padding: 3rem;
  text-align: center;
  color: #ffffff;
  position: relative;
  border-bottom: 2px solid #e87722;
}
.header-logos {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1.25rem;
}
.logo-capsule {
  background: #ffffff;
  padding: 0.4rem 0.85rem;
  border-radius: var(--radius-md, 8px);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}
.logo-vgu {
  height: 38px;
  width: auto;
  object-fit: contain;
}
.logo-ovgu {
  height: 40px;
  width: auto;
  object-fit: contain;
}
.poster-main-title {
  font-size: clamp(1.4rem, 4vw, 2.3rem);
  font-weight: 900;
  line-height: 1.25;
  letter-spacing: -0.015em;
  margin-bottom: 0.85rem;
  text-transform: uppercase;
}
.highlight-text {
  display: block;
  color: #e87722;
  font-weight: 900;
  text-shadow: 0 2px 10px rgba(232, 119, 34, 0.2);
}
.poster-subtitle {
  font-size: 0.98rem;
  color: #ffffff;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
}

/* SAVE THE DATE SECTION */
.date-hero-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}
@media (min-width: 768px) {
  .date-hero-section {
    grid-template-columns: 1.25fr 0.75fr;
  }
}
.save-date-card {
  border: 1px solid rgba(30, 58, 95, 0.15);
  border-radius: var(--radius-2xl, 20px);
  padding: 1.75rem;
  background: rgba(249, 250, 251, 0.7);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
}
.save-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: #e87722;
  margin-bottom: 1.25rem;
  letter-spacing: 0.06em;
  border-bottom: 2.5px solid #e87722;
  padding-bottom: 5px;
  width: fit-content;
}
.info-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.info-item {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
}
.info-icon {
  font-size: 1.3rem;
  margin-top: 1px;
}
.info-text {
  display: flex;
  flex-direction: column;
  font-size: 0.98rem;
  color: #0f2240;
  line-height: 1.45;
}
.info-label {
  color: #0f2240;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin-bottom: 0.15rem;
}

.hero-image-wrap {
  border-radius: var(--radius-2xl, 20px);
  overflow: hidden;
  height: 100%;
  min-height: 180px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}
.hero-banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* MIDDLE LAYOUT SECTION */
.middle-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
}
@media (min-width: 768px) {
  .middle-layout {
    grid-template-columns: 1.15fr 0.85fr;
  }
}

/* LEFT COLUMN - TIMELINE */
.schedule-column {
  display: flex;
  flex-direction: column;
}
.section-title {
  font-size: 1.2rem;
  font-weight: 850;
  text-transform: uppercase;
  color: #0f2240;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  border-left: 5px solid #e87722;
  padding-left: 0.6rem;
}
.timeline-container {
  display: flex;
  flex-direction: column;
}
.timeline-item {
  display: flex;
  gap: 1.2rem;
}
.timeline-badge-col {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.timeline-badge {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  border: 3.5px solid #e87722;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 4px;
  box-shadow: 0 0 0 3px rgba(232, 119, 34, 0.15);
}
.badge-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #e87722;
}
.timeline-line {
  width: 2px;
  flex: 1;
  background: linear-gradient(to bottom, #e87722 0%, rgba(232, 119, 34, 0.15) 100%);
  margin: 6px 0;
}
.timeline-content-col {
  padding-bottom: 1.5rem;
  flex: 1;
}
.timeline-time {
  font-size: 0.82rem;
  font-weight: 850;
  color: #ffffff;
  background: #e87722;
  padding: 0.18rem 0.6rem;
  border-radius: 5px;
  display: inline-block;
  margin-bottom: 0.35rem;
  box-shadow: 0 2px 6px rgba(232, 119, 34, 0.25);
}
.timeline-title {
  font-size: 0.98rem;
  font-weight: 750;
  color: #0f2240;
  margin-bottom: 0.2rem;
}
.timeline-desc {
  font-size: 0.88rem;
  color: #1f2937;
  line-height: 1.45;
  margin: 0;
}

/* RIGHT COLUMN - SPECIAL FOCUS & COLLAGE */
.details-column {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.focus-card {
  border: 1px solid rgba(232, 119, 34, 0.2);
  background: rgba(232, 119, 34, 0.03);
  border-radius: var(--radius-2xl, 20px);
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(232, 119, 34, 0.02);
}
.focus-card-title {
  font-size: 0.95rem;
  font-weight: 850;
  color: #e87722;
  letter-spacing: 0.06em;
  margin-bottom: 0.65rem;
  text-transform: uppercase;
}
.focus-card-text {
  font-size: 0.92rem;
  color: #0f2240;
  line-height: 1.65;
  margin: 0;
}

/* Premium collage styling */
.collage-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
.collage-item {
  border-radius: var(--radius-2xl, 16px);
  overflow: hidden;
  height: 125px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  border: 3px solid #ffffff;
  transition: transform 300ms ease, box-shadow 300ms;
}
.collage-item:hover {
  transform: translateY(-4px) scale(1.03);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.12);
}
.collage-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* BOTTOM REGISTER CARD */
.poster-footer-card {
  background: rgba(249, 250, 251, 0.85);
  border: 1px solid rgba(30, 58, 95, 0.15);
  border-radius: var(--radius-2xl, 20px);
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  align-items: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
}
@media (min-width: 640px) {
  .poster-footer-card {
    flex-direction: row;
    justify-content: space-between;
  }
}
.footer-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.register-title {
  font-size: 1.5rem;
  font-weight: 900;
  color: #0f2240;
  margin: 0;
  letter-spacing: -0.01em;
}
.register-subtitle {
  font-size: 0.92rem;
  color: #1f2937;
  margin: 0;
}
.free-badge {
  background: #0f2240;
  color: #ffffff;
  padding: 0.4rem 0.85rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 750;
  width: fit-content;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-top: 0.35rem;
}
.contact-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.35rem 1.25rem;
  font-size: 0.85rem;
  color: #1f2937;
  margin-top: 0.85rem;
}
@media (min-width: 480px) {
  .contact-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.footer-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  width: 150px;
}
.qr-box {
  width: 130px;
  height: 130px;
  background: #ffffff;
  padding: 0.6rem;
  border-radius: var(--radius-2xl, 16px);
  box-shadow: 0 6px 16px rgba(15, 34, 64, 0.08);
  border: 1px solid rgba(15, 34, 64, 0.08);
}
.qr-box :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}
.qr-text {
  font-size: 0.78rem;
  font-weight: 850;
  color: #0f2240;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

/* INFOBAR */
.bottom-infobar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: -1rem;
  border-top: 1px dashed rgba(30, 58, 95, 0.2);
  padding-top: 1.25rem;
  text-align: center;
}
@media (min-width: 640px) {
  .bottom-infobar {
    flex-direction: row;
    justify-content: space-between;
  }
}
.shuttle-info {
  font-size: 0.85rem;
  font-weight: 750;
  color: #0f2240;
}
.footer-watermark-text {
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  color: rgba(30, 58, 95, 0.45);
}

/* FLOATING PRINT FAB */
.print-fab {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 99;
  background: #e87722;
  color: #ffffff;
  border: none;
  border-radius: 50px;
  padding: 0.9rem 1.65rem;
  font-size: 0.98rem;
  font-weight: 750;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  box-shadow: 0 8px 25px rgba(232, 119, 34, 0.45);
  transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1), background-color 200ms;
}
.print-fab:hover {
  background: #d96512;
  transform: translateY(-3px) scale(1.03);
}
.print-fab:active {
  transform: translateY(0) scale(1);
}
.print-icon {
  width: 20px;
  height: 20px;
}

</style>
