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
  <div class="w-full max-w-4xl mx-auto flex flex-col gap-6">
    <!-- Slide Card -->
    <div class="w-full">
      <div
        class="rounded-3xl p-6 sm:p-8 text-white shadow-xl relative min-h-[440px] flex flex-col justify-between overflow-hidden transition-all duration-300"
        :style="{
          backgroundImage: `linear-gradient(rgba(15, 34, 64, 0.88), rgba(15, 34, 64, 0.96)), url(${activeChair.cover_image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }"
        :key="activeChair.id"
      >
        <!-- Top row: Title + counter badge -->
        <div class="flex items-start justify-between gap-4">
          <h3 class="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight">
            {{ activeTitle }}
          </h3>
          <UBadge color="neutral" variant="subtle" size="xs" class="bg-white/20 text-white font-bold backdrop-blur-md shrink-0">
            {{ activeSlideIndex + 1 }} / {{ chairsList.length }}
          </UBadge>
        </div>

        <!-- Head info with prominent portrait -->
        <div class="flex items-center gap-4 my-4">
          <NuxtImg
            v-if="activeChair.head_avatar"
            :src="activeChair.head_avatar"
            :alt="activeChair.head"
            class="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-4 ring-orange-500/40 shadow-lg shrink-0"
            loading="lazy"
          />
          <div class="flex flex-col">
            <span class="text-xs uppercase tracking-wider text-orange-400 font-extrabold mb-0.5">
              {{ locale === 'vi' ? 'Trưởng bộ môn / Giám đốc nghiên cứu' : 'Head of Chair & Research Director' }}
            </span>
            <span class="text-lg sm:text-xl font-black text-white leading-tight">
              {{ activeChair.head }}
            </span>
          </div>
        </div>

        <!-- Topics list -->
        <div class="bg-black/25 backdrop-blur-sm p-4 rounded-2xl border border-white/10 my-2">
          <h4 class="text-xs font-bold uppercase tracking-wider text-orange-300 mb-2">
            {{ locale === 'vi' ? 'Hướng nghiên cứu chính' : 'Core Research Focus Areas' }}
          </h4>
          <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200">
            <li v-for="(topic, idx) in activeTopics" :key="idx" class="flex items-start gap-1.5">
              <span class="text-orange-400 font-bold">•</span>
              <span>{{ topic }}</span>
            </li>
          </ul>
        </div>

        <!-- Projects & Introduction Link -->
        <div class="pt-4 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-2">
          <div v-if="activeProjects" class="text-xs text-slate-200">
            <strong class="text-white">{{ locale === 'vi' ? 'Dự án tiêu biểu: ' : 'Sample Projects: ' }}</strong>
            <span>{{ activeProjects }}</span>
          </div>
          <div class="flex gap-2 flex-wrap shrink-0">
            <UButton
              v-if="activeChair.pdf_introduction"
              :href="activeChair.pdf_introduction"
              target="_blank"
              external
              rel="noopener"
              icon="i-lucide-file-text"
              color="primary"
              variant="subtle"
              size="xs"
              class="font-bold rounded-lg bg-white/20 text-white hover:bg-white/30"
            >
              {{ locale === 'vi' ? 'Giới thiệu (PDF)' : 'Intro (PDF)' }}
            </UButton>
            <UButton
              v-if="activeChair.link_to_introduction"
              :href="activeChair.link_to_introduction"
              target="_blank"
              external
              rel="noopener"
              trailing-icon="i-lucide-arrow-right"
              color="primary"
              variant="solid"
              size="xs"
              class="font-bold rounded-lg shadow-xs"
            >
              {{ $t('labs.visit_chair') }}
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Controls: Prev | Dots | Next -->
    <div class="flex items-center justify-center gap-4">
      <UButton
        icon="i-lucide-chevron-left"
        color="neutral"
        variant="outline"
        size="sm"
        class="rounded-full"
        aria-label="Previous chair"
        @click="prevSlide"
      />

      <div class="flex items-center gap-1.5" role="tablist" aria-label="Chair slides">
        <button
          v-for="(chair, idx) in chairsList"
          :key="chair.id"
          class="h-2 rounded-full transition-all duration-300 cursor-pointer"
          :class="idx === activeSlideIndex ? 'w-6 bg-primary-600' : 'w-2 bg-slate-300 hover:bg-slate-400'"
          :aria-label="`Go to ${chair.title}`"
          :aria-selected="idx === activeSlideIndex"
          role="tab"
          @click="goToSlide(idx)"
        />
      </div>

      <UButton
        icon="i-lucide-chevron-right"
        color="neutral"
        variant="outline"
        size="sm"
        class="rounded-full"
        aria-label="Next chair"
        @click="nextSlide"
      />
    </div>
  </div>
</template>
