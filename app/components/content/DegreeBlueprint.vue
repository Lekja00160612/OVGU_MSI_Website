<script setup lang="ts">
import { computed } from 'vue'

const localePath = useLocalePath()
const { locale, t } = useI18n()

// Props for MDC customization
interface Props {
  showAccreditation?: boolean
  showRoadmap?: boolean
  showStudyModel?: boolean
  showGateways?: boolean
}

withDefaults(defineProps<Props>(), {
  showAccreditation: true,
  showRoadmap: true,
  showStudyModel: true,
  showGateways: true
})

const ectsBreakdown = computed(() => [
  {
    title: locale.value === 'vi' ? '15 Môn Cốt Lõi' : '15 Compulsory Modules',
    credits: '75 ECTS',
    desc: locale.value === 'vi'
      ? 'Nền tảng khoa học vật liệu cơ bản: Vật lý chất rắn, Cơ học môi trường liên tục, Đặc tính vật liệu, Gốm sứ, Kim loại, Polyme.'
      : 'Core scientific foundation: Solid state physics, continuum mechanics, characterization, ceramics, metals, polymers.',
    color: '#1E3A5F',
    bg: 'bg-slate-900',
    icon: 'i-lucide-book-open'
  },
  {
    title: locale.value === 'vi' ? '3 Môn Tự Chọn' : '3 Elective Modules',
    credits: '15 ECTS',
    desc: locale.value === 'vi'
      ? 'Chuyên sâu theo định hướng: Cơ học tính toán, Vật liệu nano, Vật liệu y sinh, Cảm biến bán dẫn hoặc Quản trị.'
      : 'Specialization tracks: Computational mechanics, nano-materials, biomaterials, smart sensorics, or management.',
    color: '#009FDF',
    bg: 'bg-sky-600',
    icon: 'i-lucide-flask-conical'
  },
  {
    title: locale.value === 'vi' ? 'Dự Án & Lab Thực Nghiệm' : 'Research Lab & Team Project',
    credits: '15 ECTS',
    desc: locale.value === 'vi'
      ? 'Thao tác trực tiếp trên 22+ thiết bị phân tích hiện đại tại VGU (SEM, XRD, TGA) và nghiên cứu tài liệu khoa học theo nhóm.'
      : 'Direct hands-on training on 22+ characterization instruments (SEM, XRD, TGA) and collaborative literature research.',
    color: '#E87722',
    bg: 'bg-orange-500',
    icon: 'i-lucide-microscope'
  },
  {
    title: locale.value === 'vi' ? 'Luận Văn Thạc Sĩ' : 'Master Thesis & Defense',
    credits: '30 ECTS',
    desc: locale.value === 'vi'
      ? 'Đề tài nghiên cứu độc lập 6 tháng dưới sự hướng dẫn song phương của giáo sư OVGU Magdeburg và VGU.'
      : '6-month independent capstone research project supervised jointly by OVGU Magdeburg and VGU faculty.',
    color: '#C2410C',
    bg: 'bg-amber-600',
    icon: 'i-lucide-graduation-cap'
  }
])

const semesterRoadmap = computed(() => [
  {
    semester: 'Semester 1',
    credits: '30 ECTS',
    title: locale.value === 'vi' ? 'Nền Tảng Cơ Học & Vật Lý' : 'Mechanics & Physical Foundations',
    courses: [
      'Solid State Physics',
      'Continuum Mechanics',
      'Physical & Chemical Sensor Principles',
      'Engineering Ceramics',
      'Metals & Microstructures'
    ],
    highlight: locale.value === 'vi' ? 'Xây dựng tư duy vật lý và cơ học định lượng' : 'Building rigorous theoretical & quantitative foundations',
    colorBorder: 'border-l-orange-500'
  },
  {
    semester: 'Semester 2',
    credits: '30 ECTS',
    title: locale.value === 'vi' ? 'Vật Liệu Nâng Cao & Thực Hành Lab' : 'Advanced Materials & Characterization',
    courses: [
      'Polymers & Soft Matter',
      'Glass & Inorganic Binders',
      'Materials Characterization (SEM, XRD)',
      'Research Lab Properties Testing',
      'Powder Metallurgy & Sintering'
    ],
    highlight: locale.value === 'vi' ? '100% sinh viên tự tay vận hành thiết bị phân tích' : '100% hands-on equipment operation without outsourcing',
    colorBorder: 'border-l-msi-navy'
  },
  {
    semester: 'Semester 3',
    credits: '30 ECTS',
    title: locale.value === 'vi' ? 'Chuyên Sâu & Trao Đổi Đức (OVGU)' : 'Specialization & Germany Exchange',
    courses: [
      '3 Elective Specialization Modules (15 ECTS)',
      'Scientific Team Project & Literature (15 ECTS)',
      'Optional: Exchange Semester at OVGU Magdeburg'
    ],
    highlight: locale.value === 'vi' ? 'Cơ hội nhận học bổng DAAD học tại CHLB Đức' : 'DAAD Mobility grant opportunity to study in Germany',
    colorBorder: 'border-l-sky-500'
  },
  {
    semester: 'Semester 4',
    credits: '30 ECTS',
    title: locale.value === 'vi' ? 'Luận Văn Thạc Sĩ & Bảo Vệ' : 'Master Thesis & Colloquium',
    courses: [
      'Independent Scientific Research (30 ECTS)',
      'Joint Supervision: OVGU Magdeburg & VGU',
      'Public Defense Colloquium'
    ],
    highlight: locale.value === 'vi' ? 'Công bố bài báo quốc tế hoặc ứng dụng công nghiệp' : 'Publishable scientific papers or industrial innovation',
    colorBorder: 'border-l-emerald-600'
  }
])

const gatewayCards = computed(() => [
  {
    title: locale.value === 'vi' ? 'Sổ Tay Môn Học Tổng Hợp' : 'Complete Course Handbook',
    desc: locale.value === 'vi'
      ? 'Khám phá toàn bộ 25+ môn học (15 cốt lõi + môn tự chọn), đề cương chi tiết và giảng viên Đức.'
      : 'Explore all 25+ courses (15 core + electives pool), complete syllabi, and German visiting lecturers.',
    to: localePath('/program-structure/modules'),
    badge: 'Core + Electives',
    icon: 'i-lucide-book-open',
    color: 'hover:border-orange-500 hover:shadow-orange-500/10'
  },
  {
    title: locale.value === 'vi' ? 'Thời Khóa Biểu & Lịch Học' : 'Semester Timetable Matrix',
    desc: locale.value === 'vi'
      ? 'Xem lịch học dạng khối (Block-modular) của từng học kỳ, ngày giảng viên Đức có mặt và tải file XLSX/ICS.'
      : 'Interactive calendar matrix for WS/SS cohorts, German professor visit weeks, and direct XLSX/ICS downloads.',
    to: localePath('/program-structure/timetable'),
    badge: 'WS 26/27 Live',
    icon: 'i-lucide-calendar',
    color: 'hover:border-sky-500 hover:shadow-sky-500/10'
  },
  {
    title: locale.value === 'vi' ? 'Đề Tài Luận Văn Thạc Sĩ' : 'Master Thesis Topics Portal',
    desc: locale.value === 'vi'
      ? 'Danh mục các đề tài nghiên cứu mở, giảng viên hướng dẫn tại VGU và giáo sư đồng hướng dẫn tại OVGU.'
      : 'Catalog of open research topics, VGU faculty advisors, and OVGU co-supervisors in Germany.',
    to: localePath('/program-structure/thesis'),
    badge: '30 ECTS Capstone',
    icon: 'i-lucide-graduation-cap',
    color: 'hover:border-indigo-500 hover:shadow-indigo-500/10'
  },
  {
    title: locale.value === 'vi' ? 'Hành Trình Sang Đức (OVGU)' : 'Path to Germany Relocation',
    desc: locale.value === 'vi'
      ? 'Cẩm nang toàn diện từ học bổng DAAD, xin visa VFS, tài khoản phong tỏa đến sinh sống tại Magdeburg.'
      : 'Comprehensive step-by-step relocation guide: DAAD selection, VFS visa, flights, and living in Magdeburg.',
    to: localePath('/student-life/germany-relocation'),
    badge: 'OVGU Magdeburg',
    icon: 'i-lucide-plane-takeoff',
    color: 'hover:border-emerald-500 hover:shadow-emerald-500/10'
  }
])
</script>

<template>
  <div class="flex flex-col gap-12 font-sans">

    <!-- === SECTION 1: Dual Degree Accreditation & 120 ECTS Breakdown === -->
    <div v-if="showAccreditation" class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
        <div>
          <UBadge color="primary" variant="subtle" size="sm" class="font-extrabold uppercase tracking-wider mb-2">
            German-Standard Accreditation
          </UBadge>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {{ locale === 'vi' ? 'Khung Đào Tạo Chuẩn Đức — 120 Tín Chỉ ECTS' : 'Dual-Degree Curriculum Framework — 120 ECTS' }}
          </h2>
          <p class="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
            {{ locale === 'vi'
              ? 'Học viên hoàn thành chương trình nhận 02 văn bằng Thạc sĩ độc lập từ Đại học Otto von Guericke Magdeburg (CHLB Đức) và Trường Đại học Việt Đức (VGU).'
              : 'Graduates earn two independent Master of Science degrees awarded by Otto von Guericke University Magdeburg (Germany) and Vietnamese-German University (Vietnam).'
            }}
          </p>
        </div>
        <div class="shrink-0 flex items-center gap-3 bg-slate-50 border border-slate-200 px-5 py-3 rounded-2xl">
          <div class="text-center">
            <span class="block text-3xl font-black text-orange-500 leading-none">120</span>
            <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">ECTS Credits</span>
          </div>
          <div class="h-8 w-px bg-slate-200" />
          <div class="text-center">
            <span class="block text-3xl font-black text-slate-800 leading-none">4</span>
            <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Semesters</span>
          </div>
        </div>
      </div>

      <!-- 4 Pillars Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <div
          v-for="item in ectsBreakdown"
          :key="item.title"
          class="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/60 flex flex-col justify-between gap-3 shadow-2xs hover:shadow-sm transition-all"
        >
          <div>
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="size-9 rounded-xl flex items-center justify-center text-white" :class="item.bg">
                <UIcon :name="item.icon" class="size-5" />
              </span>
              <UBadge color="neutral" variant="subtle" size="xs" class="font-bold">
                {{ item.credits }}
              </UBadge>
            </div>
            <h3 class="text-base font-bold text-slate-900 leading-snug">{{ item.title }}</h3>
            <p class="text-xs text-slate-600 mt-2 leading-relaxed">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- === SECTION 2: The Block-Modular Study Model (Working Professional Focus) === -->
    <div v-if="showStudyModel" class="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-msi-navy text-white p-6 sm:p-10 shadow-lg relative overflow-hidden">
      <div class="relative z-10 max-w-4xl">
        <UBadge color="primary" variant="solid" size="sm" class="font-extrabold uppercase tracking-wider mb-3">
          {{ locale === 'vi' ? 'Phương Thức Đào Tạo Độc Bản' : 'Unique Teaching Model' }}
        </UBadge>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mb-4">
          {{ locale === 'vi' ? 'Mô Hình Học Dạng Khối (Block-Modular) Cho Kỹ Sư Đi Làm' : 'The Block-Modular Format — Built for Working Engineers' }}
        </h2>
        <p class="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
          {{ locale === 'vi'
            ? 'Các giáo sư từ OVGU Magdeburg trực tiếp bay sang Việt Nam giảng dạy theo từng đợt tập trung (2–3 tuần). Các buổi thực hành và hướng dẫn tại VGU được bố trí linh hoạt vào cuối tuần và buổi tối, giúp học viên đang đi làm hoàn toàn có thể sắp xếp công việc và học tập hiệu quả.'
            : 'Visiting professors from OVGU Magdeburg deliver intensive 2–3 week lecture blocks on-site in Vietnam. Combined with hybrid weekend and evening lab sessions, full-time working engineers can complete an authentic German master degree without interrupting their careers.'
          }}
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-slate-900">
          <div class="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xs">
            <span class="text-orange-600 font-extrabold text-lg block mb-1">01. No Prerequisites</span>
            <span class="text-xs text-slate-600 leading-relaxed block">
              {{ locale === 'vi' ? 'Không yêu cầu môn tiên quyết — học viên có thể học các môn theo tiến độ phù hợp.' : 'No strict course sequence required — take modules flexibly around work commitments.' }}
            </span>
          </div>
          <div class="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xs">
            <span class="text-orange-600 font-extrabold text-lg block mb-1">02. Direct German Faculty</span>
            <span class="text-xs text-slate-600 leading-relaxed block">
              {{ locale === 'vi' ? 'Học trực tiếp với các giáo sư đầu ngành từ Đức bằng 100% tiếng Anh.' : 'Direct face-to-face interaction with premier German chair holders in 100% English.' }}
            </span>
          </div>
          <div class="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xs">
            <span class="text-orange-600 font-extrabold text-lg block mb-1">03. All-Inclusive Lab</span>
            <span class="text-xs text-slate-600 leading-relaxed block">
              {{ locale === 'vi' ? 'Sử dụng tự do 22+ thiết bị phòng thí nghiệm, không thu thêm phí phụ thu.' : 'Direct access to 22+ characterization tools (SEM, XRD, TGA) with zero extra sample fees.' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- === SECTION 3: The 4-Semester Progression Roadmap === -->
    <div v-if="showRoadmap" class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
      <div class="text-center max-w-2xl mx-auto mb-10">
        <UBadge color="primary" variant="subtle" size="sm" class="font-extrabold uppercase tracking-wider mb-2">
          Study Journey
        </UBadge>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {{ locale === 'vi' ? 'Lộ Trình Tiến Trình 4 Học Kỳ' : 'The 4-Semester Progression Roadmap' }}
        </h2>
        <p class="text-sm text-slate-600 mt-2">
          {{ locale === 'vi' ? 'Hành trình từ kiến thức cơ bản đến nhà khoa học độc lập có năng lực quốc tế.' : 'From foundational materials science to independent scientific researcher.' }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          v-for="sem in semesterRoadmap"
          :key="sem.semester"
          class="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 flex flex-col justify-between border-l-4 shadow-2xs hover:shadow-md transition-all"
          :class="sem.colorBorder"
        >
          <div>
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="text-xs font-black text-slate-500 uppercase tracking-wider">{{ sem.semester }}</span>
              <UBadge color="neutral" variant="subtle" size="xs" class="font-bold">{{ sem.credits }}</UBadge>
            </div>
            <h3 class="text-base font-extrabold text-slate-900 mb-3 leading-snug">{{ sem.title }}</h3>
            <ul class="space-y-1.5 text-xs text-slate-600 mb-4">
              <li v-for="c in sem.courses" :key="c" class="flex items-start gap-1.5 leading-relaxed">
                <span class="text-orange-500 font-bold shrink-0">▸</span>
                <span>{{ c }}</span>
              </li>
            </ul>
          </div>
          <div class="pt-3 border-t border-slate-200/80">
            <span class="text-[11px] font-bold text-slate-500 block leading-tight">
              <UIcon name="i-lucide-lightbulb" class="size-4 text-orange-500 inline shrink-0 mr-1" /><span>{{ sem.highlight }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- === SECTION 4: The 4 Gateway Navigators (The "Big Doors") === -->
    <div v-if="showGateways" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <NuxtLink
        v-for="gate in gatewayCards"
        :key="gate.to"
        :to="gate.to"
        class="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between gap-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group"
        :class="gate.color"
      >
        <div>
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="size-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <UIcon :name="gate.icon" class="size-5" />
            </span>
            <UBadge color="neutral" variant="subtle" size="xs" class="font-bold">
              {{ gate.badge }}
            </UBadge>
          </div>
          <h3 class="text-base font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
            {{ gate.title }}
          </h3>
          <p class="text-xs text-slate-600 mt-2 leading-relaxed">
            {{ gate.desc }}
          </p>
        </div>
        <div class="pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-orange-600 group-hover:translate-x-1 transition-transform">
          <span>{{ locale === 'vi' ? 'Khám phá ngay' : 'Access resource' }} &rarr;</span>
        </div>
      </NuxtLink>
    </div>

    <!-- Official PDF Download CTA -->
    <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
      <div class="flex items-center gap-4">
        <span class="size-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
          <UIcon name="i-lucide-file-text" class="size-6" />
        </span>
        <div>
          <h4 class="text-base font-extrabold text-slate-900 leading-tight">
            {{ locale === 'vi' ? 'Sổ Tay Khung Chương Trình Chính Thức (PDF)' : 'Official MSI Module Catalogue & Framework (PDF)' }}
          </h4>
          <p class="text-xs text-slate-500 mt-1">
            {{ locale === 'vi' ? 'Tài liệu đầy đủ các môn học, quy chế thi cử và mô tả chi tiết bằng tiếng Anh.' : 'Complete course descriptions, credit allocations, and examination regulations.' }}
          </p>
        </div>
      </div>
      <UButton
        to="/Documents/MODULE CATALOGUE MSI.pdf"
        :external="true"
        target="_blank"
        color="primary"
        variant="solid"
        size="md"
        icon="i-lucide-download"
        class="shrink-0 font-bold rounded-full px-6 py-2.5 shadow-md"
      >
        {{ locale === 'vi' ? 'Tải Sổ Tay (PDF)' : 'Download Catalogue (PDF)' }}
      </UButton>
    </div>

  </div>
</template>
