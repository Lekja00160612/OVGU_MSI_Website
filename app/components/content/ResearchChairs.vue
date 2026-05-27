<script setup lang="ts">
import { inject, ref, computed } from 'vue'

const { locale, t } = useI18n()

// Props support for passing custom chairs array
const props = defineProps<{
  chairs?: any[]
}>()

const pageData = inject('pageData', null) as any
const chairs = pageData?.chairs

// Fallback data if chairs is not injected or passed
const defaultChairs = [
  {
    id: 'comp-mech',
    title: 'Chair of Computational Mechanics',
    title_vi: 'Bộ môn Cơ học Tính toán',
    head: 'Prof. Dr.-Ing. Daniel Juhre',
    head_avatar: '/Lecturer_Avatar/Daniel Juhre.jpg',
    cover_image: '/images/research/comp-mech.png',
    link_to_introduction: 'https://www.nm.ovgu.de/nm/en/',
    topics: [
      'Constitutive modeling of polymers and elastomers',
      'Finite Element Method (FEM) code developments',
      'Multi-physical field couplings (electro-viscoelasticity)',
      'Anisotropic fracture behaviors in biological tissues'
    ],
    topics_vi: [
      'Xây dựng mô hình cấu trúc cho polyme và chất đàn hồi',
      'Phát triển mã nguồn Phương pháp Phần tử Hữu hạn (FEM)',
      'Liên kết trường đa vật lý (hiện tượng nhớt đàn hồi điện)',
      'Đặc tính phá hủy dị hướng trong các mô sinh học'
    ],
    projects: 'DFG projects on rubber fatigue; polymer aging simulations.',
    projects_vi: 'Các dự án DFG về độ mỏi của cao su; mô phỏng quá trình lão hóa polyme.'
  },
  {
    id: 'solid-state',
    title: 'Chair of Solid State Physics',
    title_vi: 'Bộ môn Vật lý Chất rắn',
    head: 'Prof. Dr. rer. nat. Jürgen Christen',
    head_avatar: '/Lecturer_Avatar/Jurgen Christen.jpg',
    cover_image: '/images/research/solid-state.png',
    link_to_introduction: 'https://www.physik.ovgu.de/Abteilungen+des+IfP/Festkörperphysik_+spez_+Halbleiterphysik-p-8.html',
    topics: [
      'Micro-photoluminescence and cathodoluminescence spectroscopy',
      'Optical properties of wide-bandgap semiconductors (GaN, AlN)',
      'Spatial characterization of nanostructures and quantum wells',
      'High-resolution scanning electron microscopy (SEM) characterization'
    ],
    topics_vi: [
      'Quang phổ vi phát quang và phân cực catốt',
      'Tính chất quang học của bán dẫn khe bán dẫn rộng (GaN, AlN)',
      'Phân tích cấu trúc không gian của cấu trúc nano và giếng lượng tử',
      'Kính hiển vi điện tử quét (SEM) độ phân giải cao'
    ],
    projects: 'Nanowire LED optoelectronic structures; quantum emitter tracking.',
    projects_vi: 'Cấu trúc quang điện tử LED dây nano; theo dõi phát xạ lượng tử.'
  },
  {
    id: 'hi-temp',
    title: 'Chair of High Temperature Materials',
    title_vi: 'Bộ môn Vật liệu Chịu nhiệt độ cao',
    head: 'Prof. Dr.-Ing. Manja Krüger',
    head_avatar: '/Lecturer_Avatar/Manja Kruger.jpg',
    cover_image: '/images/research/hi-temp.png',
    link_to_introduction: 'https://www.ht-materials.ovgu.de/',
    topics: [
      'Development of multi-component refractory silicide alloys',
      'Powder metallurgical processing (Sintering, Spark Plasma Sintering)',
      'Oxidation resistance coatings for high-temperature turbines',
      'Mechanical testing at temperatures up to 1500°C'
    ],
    topics_vi: [
      'Phát triển hợp kim silicide chịu lửa đa thành phần',
      'Xử lý luyện kim bột (Thiêu kết, Thiêu kết Plasma dòng điện cực mạnh)',
      'Lớp phủ chống oxy hóa cho tuabin nhiệt độ cao',
      'Kiểm tra cơ học ở nhiệt độ lên tới 1500°C'
    ],
    projects: 'Mo-Si-B gas turbine blade testing; ultra-high temperature ceramics.',
    projects_vi: 'Thử nghiệm cánh tuabin khí Mo-Si-B; gốm chịu nhiệt độ siêu cao.'
  },
  {
    id: 'metallic',
    title: 'Chair of Metallic Materials',
    title_vi: 'Bộ môn Vật liệu Kim loại',
    head: 'Prof. Dr.-Ing. Thorsten Halle',
    head_avatar: '/Lecturer_Avatar/Thorsten Halle.jpg',
    cover_image: '/images/research/metallic.png',
    link_to_introduction: 'https://www.metalle.ovgu.de/',
    topics: [
      'Design of advanced high-strength steels and metal matrix composites',
      'Dynamic mechanical behavior (split-Hopkinson pressure bar)',
      'Microstructural changes during severe plastic deformation',
      'Additive manufacturing post-processing treatments'
    ],
    topics_vi: [
      'Thiết kế thép cường độ cao và vật liệu composite nền kim loại tiên tiến',
      'Đặc tính cơ học động lực học (sử dụng thanh ép Hopkinson)',
      'Thay đổi vi cấu trúc trong quá trình biến dạng dẻo nghiêm trọng',
      'Các phương pháp xử lý sau sản xuất bồi đắp (in 3D kim loại)'
    ],
    projects: 'High-strain-rate impact testing; metallic phase transformations.',
    projects_vi: 'Kiểm tra va đập tốc độ biến dạng cao; chuyển pha kim loại.'
  },
  {
    id: 'non-metallic',
    title: 'Chair of Non-Metallic Materials',
    title_vi: 'Bộ môn Vật liệu Phi kim loại (Gốm sứ)',
    head: 'Prof. Dr. rer. nat. Michael Scheffler',
    head_avatar: '/Lecturer_Avatar/Michael Scheffler.jpg',
    cover_image: '/images/research/non-metallic.png',
    link_to_introduction: 'https://www.ceramics.ovgu.de/',
    topics: [
      'Polymer-derived ceramics (PDCs) and porous cellular structures',
      'Recycling of industrial wastes into functional insulation components',
      'Surface coating and functionalization of structural ceramic filters',
      'Bio-compatible ceramic scaffoldings for bone engineering'
    ],
    topics_vi: [
      'Gốm nguồn gốc polyme (PDCs) và cấu trúc tế bào xốp',
      'Tái chế chất thải công nghiệp thành các cấu kiện cách nhiệt chức năng',
      'Phủ bề mặt và chức năng hóa bộ lọc gốm cấu trúc',
      'Khung gốm tương thích sinh học cho kỹ thuật mô xương'
    ],
    projects: 'Waste-to-ceramic thermal barriers; filter systems for molten steel.',
    projects_vi: 'Lớp chắn nhiệt từ chất thải gốm; hệ thống lọc cho thép nóng chảy.'
  },
  {
    id: 'eng-mechanics',
    title: 'Chair of Engineering Mechanics',
    title_vi: 'Bộ môn Cơ học Kỹ thuật',
    head: 'Prof. Dr.-Ing. habil. Holm Altenbach (Emeritus)',
    head_avatar: '/Lecturer_Avatar/Holm Altenbach.jpg',
    cover_image: '/images/research/eng-mechanics.png',
    link_to_introduction: 'https://www.tm.ovgu.de/tm/en/',
    topics: [
      'Viscoelasticity, creep, and damage modeling of structures',
      'Theory of plates and shells under complex loadings',
      'Non-linear mechanics of composites and smart structural materials',
      'Mathematical modeling in classical continuum mechanics'
    ],
    topics_vi: [
      'Mô hình hóa hiện tượng nhớt đàn hồi, độ từ biến và phá hủy của kết cấu',
      'Lý thuyết tấm và vỏ dưới tải trọng phức tạp',
      'Cơ học phi tuyến của vật liệu composite và vật liệu kết cấu thông minh',
      'Mô hình hóa toán học trong cơ học môi trường liên tục cổ điển'
    ],
    projects: 'Creep behavior of thin-walled vessels; composite panel load optimization.',
    projects_vi: 'Đặc tính từ biến của bình vỏ mỏng; tối ưu hóa tải trọng tấm composite.'
  }
]

const chairsList = computed(() => {
  if (props.chairs && props.chairs.length > 0) return props.chairs
  if (chairs?.value && Array.isArray(chairs.value) && chairs.value.length > 0) return chairs.value
  return defaultChairs
})

const activeSlideIndex = ref(0)
const activeChair = computed(() => chairsList.value[activeSlideIndex.value] || chairsList.value[0])

const activeTitle = computed(() => {
  if (locale.value === 'vi' && activeChair.value.title_vi) {
    return activeChair.value.title_vi
  }
  return activeChair.value.title
})

const activeTopics = computed(() => {
  if (locale.value === 'vi' && activeChair.value.topics_vi) {
    return activeChair.value.topics_vi
  }
  return activeChair.value.topics
})

const activeProjects = computed(() => {
  if (locale.value === 'vi' && activeChair.value.projects_vi) {
    return activeChair.value.projects_vi
  }
  return activeChair.value.projects
})

const nextSlide = () => {
  activeSlideIndex.value = (activeSlideIndex.value + 1) % chairsList.value.length
}
const prevSlide = () => {
  const len = chairsList.value.length
  activeSlideIndex.value = (activeSlideIndex.value - 1 + len) % len
}
const goToSlide = (idx: number) => {
  activeSlideIndex.value = idx
}
</script>

<template>
  <div class="research-chairs">
    <!-- Slide Card -->
    <div class="slide-wrapper">
      <div
        class="slide-card"
        :style="{
          backgroundImage: `linear-gradient(rgba(15, 34, 64, 0.85), rgba(15, 34, 64, 0.95)), url(${activeChair.cover_image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }"
        :key="activeChair.id"
      >
        <!-- Badge counter -->
        <div class="slide-badge">
          {{ activeSlideIndex + 1 }} / {{ chairsList.length }}
        </div>

        <!-- Title -->
        <h3 class="slide-title">{{ activeTitle }}</h3>

        <!-- Head info with circular avatar -->
        <div class="slide-head-row">
          <img
            :src="activeChair.head_avatar"
            :alt="activeChair.head"
            class="slide-head-avatar"
            onerror="this.src='/Lecturer_Avatar/default.jpg'"
          />
          <div class="slide-head-info">
            <span class="slide-head-label">{{ locale === 'vi' ? 'Trưởng bộ môn' : 'Head of Chair' }}</span>
            <span class="slide-head-name">{{ activeChair.head }}</span>
          </div>
        </div>

        <!-- Topics list — scrollable -->
        <div class="slide-topics-box">
          <h4 class="topics-heading">{{ locale === 'vi' ? 'Hướng nghiên cứu chính' : 'Core Research Focus Areas' }}</h4>
          <ul class="topics-list">
            <li v-for="(topic, idx) in activeTopics" :key="idx" class="topic-item">
              <span class="topic-bullet" aria-hidden="true">•</span>
              {{ topic }}
            </li>
          </ul>
        </div>

        <!-- Projects & Introduction Link -->
        <div class="slide-footer">
          <div class="slide-footer-content">
            <div class="footer-text-wrap" v-if="activeProjects">
              <strong class="footer-label">{{ locale === 'vi' ? 'Dự án tiêu biểu: ' : 'Sample Projects: ' }}</strong>
              <span class="footer-text">{{ activeProjects }}</span>
            </div>
            <div class="footer-actions flex gap-2 flex-wrap shrink-0">
              <a
                v-if="activeChair.pdf_introduction"
                :href="activeChair.pdf_introduction"
                target="_blank"
                rel="noopener"
                class="intro-pdf-btn"
              >
                📄 {{ locale === 'vi' ? 'Giới thiệu (PDF)' : 'Intro (PDF)' }}
              </a>
              <a
                v-if="activeChair.link_to_introduction"
                :href="activeChair.link_to_introduction"
                target="_blank"
                rel="noopener"
                class="intro-btn"
              >
                {{ $t('labs.visit_chair') }} &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Controls: Prev | Dots | Next -->
    <div class="carousel-controls">
      <button
        class="control-btn"
        aria-label="Previous chair"
        @click="prevSlide"
      >
        ←
      </button>

      <div class="dot-track" role="tablist" aria-label="Chair slides">
        <button
          v-for="(chair, idx) in chairsList"
          :key="chair.id"
          class="dot"
          :class="{ 'dot--active': idx === activeSlideIndex }"
          :aria-label="`Go to ${chair.title}`"
          :aria-selected="idx === activeSlideIndex"
          role="tab"
          @click="goToSlide(idx)"
        />
      </div>

      <button
        class="control-btn"
        aria-label="Next chair"
        @click="nextSlide"
      >
        →
      </button>
    </div>
  </div>
</template>

<style scoped>
.research-chairs {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ── Slide card ──────────────────────────── */
.slide-wrapper {
  perspective: 1000px;
}

.slide-card {
  border-radius: var(--radius-xl, 16px);
  padding: 2rem 2.25rem;
  color: #fff;
  box-shadow: var(--shadow-lg, 0 10px 40px rgba(0,0,0,.18));
  position: relative;
  height: 440px;
  display: flex;
  flex-direction: column;
  animation: slideIn 350ms var(--ease-out, cubic-bezier(0.16,1,0.3,1)) forwards;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(12px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0)   scale(1);    }
}

.slide-badge {
  position: absolute;
  top: 1.5rem;
  right: 2rem;
  font-size: 0.78rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.18);
  padding: 0.2rem 0.7rem;
  border-radius: var(--radius-full, 9999px);
  backdrop-filter: blur(4px);
  letter-spacing: 0.04em;
}

.slide-title {
  font-size: 1.65rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.25rem;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

/* Head info row with circular avatar */
.slide-head-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.15rem;
  background: rgba(255, 255, 255, 0.06);
  padding: 0.6rem 1.15rem;
  border-radius: var(--radius-lg, 12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  align-self: flex-start;
}

.slide-head-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-accent, #e87722);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}

.slide-head-info {
  display: flex;
  flex-direction: column;
}

.slide-head-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.05em;
}

.slide-head-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
}

/* Topics box — scrollable */
.slide-topics-box {
  flex: 1;
  margin-bottom: 1rem;
}
.topics-heading {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255,255,255,0.75);
  margin-bottom: 0.5rem;
}
.topics-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 110px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.3) transparent;
}
.topics-list::-webkit-scrollbar { width: 4px; }
.topics-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 4px; }
.topic-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.95rem;
  line-height: 1.5;
  color: rgba(255,255,255,0.95);
}
.topic-bullet {
  flex-shrink: 0;
  font-size: 1.1rem;
  color: var(--color-accent, #e87722);
  margin-top: -0.1rem;
  line-height: 1;
}

/* Footer */
.slide-footer {
  border-top: 1px solid rgba(255,255,255,0.2);
  padding-top: 1.1rem;
  font-size: 0.9rem;
  color: rgba(255,255,255,0.85);
  line-height: 1.6;
}
.slide-footer-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
@media (min-width: 640px) {
  .slide-footer-content {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
.footer-text-wrap {
  flex: 1;
  padding-right: 1rem;
}
.footer-label { color: rgba(255,255,255,0.95); }
.footer-text { font-style: italic; }

.footer-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: center;
  align-self: flex-start;
}

.intro-pdf-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.55rem 1.35rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  border: 1.5px solid rgba(255, 255, 255, 0.25);
  border-radius: var(--radius-lg, 12px);
  text-decoration: none;
  transition: all 200ms;
  white-space: nowrap;
}
.intro-pdf-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
}

.intro-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.55rem 1.35rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
  background: var(--color-accent);
  border: 1px solid var(--color-accent);
  border-radius: var(--radius-lg, 12px);
  text-decoration: none;
  transition: all 200ms;
  white-space: nowrap;
  align-self: flex-start;
}
.intro-btn:hover {
  background: var(--color-accent-dark, #c95e0a);
  border-color: var(--color-accent-dark, #c95e0a);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(232, 119, 34, 0.25);
}

/* ── Controls ────────────────────────────── */
.carousel-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
}
.control-btn {
  background: #fff;
  border: 1px solid var(--color-gray-200, #e5e7eb);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05));
  transition: all 200ms;
  color: var(--color-primary, #1e3a5f);
  flex-shrink: 0;
}
.control-btn:hover {
  background: var(--color-primary, #1e3a5f);
  color: #fff;
  border-color: var(--color-primary, #1e3a5f);
}

.dot-track {
  display: flex;
  gap: 0.45rem;
  align-items: center;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-gray-300, #d1d5db);
  border: none;
  cursor: pointer;
  transition: background 200ms, width 200ms, border-radius 200ms;
  padding: 0;
}
.dot--active {
  background: var(--color-primary, #1e3a5f);
  width: 24px;
  border-radius: 4px;
}

@media (max-width: 640px) {
  .slide-card {
    padding: 1.75rem 1.5rem;
    min-height: 400px;
  }
  .slide-title { font-size: 1.35rem; }
  .slide-head-row {
    padding: 0.5rem 0.75rem;
    gap: 0.75rem;
  }
  .slide-head-avatar {
    width: 40px;
    height: 40px;
  }
}
</style>
