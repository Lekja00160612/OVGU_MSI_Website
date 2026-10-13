<script setup lang="ts">
import { computed } from 'vue'

definePageMeta({
  alias: ['/partners-lecturers/industrial']
})

const { locale } = useI18n()
const localePath = useLocalePath()

// SEO Metadata
useSeoMeta({
  title: () => locale.value === 'vi' ? 'Kết Nối Doanh Nghiệp & Kiến Tập Thực Địa - MSI VGU' : 'Industry Connections & Plant Excursions - Materials Science & Innovation | VGU',
  ogTitle: () => locale.value === 'vi' ? 'Kết Nối Doanh Nghiệp & Kiến Tập Thực Địa - MSI VGU' : 'Industry Connections & Plant Excursions - Materials Science & Innovation | VGU',
  description: () => locale.value === 'vi'
    ? 'Tìm hiểu các doanh nghiệp sản xuất và cơ sở công nghệ mà học viên MSI đã đến tham quan, kiến tập thực tế dây chuyền và mở rộng kết nối nghề nghiệp.'
    : 'Discover the industrial manufacturing plants, technology facilities, and engineering enterprises explored by MSI Master students during educational excursions.',
  ogDescription: () => locale.value === 'vi'
    ? 'Tìm hiểu các doanh nghiệp sản xuất và cơ sở công nghệ mà học viên MSI đã đến tham quan, kiến tập thực tế dây chuyền và mở rộng kết nối nghề nghiệp.'
    : 'Discover the industrial manufacturing plants, technology facilities, and engineering enterprises explored by MSI Master students during educational excursions.',
})

// Educational excursion & plant visit destinations
const industrialConnections = computed(() => [
  {
    name: 'Knauf Vietnam',
    sector: locale.value === 'vi' ? 'Vật Liệu Thạch Cao & Hệ Thống Xây Dựng Hiện Đại' : 'Gypsum & Building Systems',
    description: locale.value === 'vi'
      ? 'Tập đoàn đa quốc gia hàng đầu về vật liệu thạch cao và cách nhiệt. Học viên MSI trực tiếp tham quan dây chuyền sản xuất tự động hóa cao, tìm hiểu hóa học thạch cao công nghiệp và kiểm soát chất lượng tấm hoàn thiện.'
      : 'Leading global manufacturer of gypsum and building systems. MSI students undertake on-site industrial plant excursions, exploring automated manufacturing thermodynamics and high-precision finishing technologies.',
    tag: locale.value === 'vi' ? 'Kiến tập Nhà máy & Vật liệu Vô cơ' : 'Plant Excursion & Inorganic Materials',
    activitySlug: 'knauf-trip',
    icon: 'i-lucide-factory'
  },
  {
    name: 'Vina Kraft Paper (SCG Packaging)',
    sector: locale.value === 'vi' ? 'Công Nghệ Bột Giấy & Vật Liệu Bao Bì Bền Vững' : 'Pulp Processing & Packaging Engineering',
    description: locale.value === 'vi'
      ? 'Nhà máy giấy bao bì công nghiệp quy mô lớn tại Bình Dương. Sinh viên MSI tiếp cận trực tiếp dây chuyền tái chế sợi cellulose tuần hoàn, công nghệ xử lý bề mặt và thử nghiệm độ bền chịu tải cơ học.'
      : 'Large-scale industrial paper plant in Binh Duong. MSI students explore continuous industrial cellulose chemistry, fiber recycling optimization, and mechanical testing of sustainable packaging materials.',
    tag: locale.value === 'vi' ? 'Hóa học Cellulose & Kinh tế Tuần hoàn' : 'Cellulose Chemistry & Circular Economy',
    activitySlug: 'vina-kraft-trip',
    icon: 'i-lucide-recycle'
  },
  {
    name: 'Bosch Vietnam',
    sector: locale.value === 'vi' ? 'Công Nghệ Kỹ Thuật Ô Tô & Linh Kiện Chính Xác' : 'Automotive & Precision Materials',
    description: locale.value === 'vi'
      ? 'Tập đoàn kỹ thuật và công nghệ toàn cầu với nhà máy chế tạo dây đai truyền động CVT công nghệ cao. Kết nối trong đào tạo độ bền mỏi vật liệu, phân tích cơ tính kim loại và định hướng nghề nghiệp kỹ sư R&D.'
      : 'Global engineering and technology leader with high-tech CVT pushbelt manufacturing in Dong Nai. Technical engagement spans metal fatigue testing, precision materials analysis, and career development pathways for MSI graduates.',
    tag: locale.value === 'vi' ? 'Cơ tính Kim loại & Phân tích Mỏi' : 'Fatigue Limits & Precision Metallurgy',
    activitySlug: null,
    icon: 'i-lucide-cog'
  },
  {
    name: 'Long An AAC & Mekong Concrete',
    sector: locale.value === 'vi' ? 'Bê Tông Khí Chưng Áp & Chất Kết Dính Vô Cơ' : 'Autoclaved Aerated Concrete & Binders',
    description: locale.value === 'vi'
      ? 'Các đơn vị sản xuất vật liệu xây dựng xanh tiên tiến. Học viên MSI tìm hiểu thực tế phản ứng thủy nhiệt chưng áp tạo pha khoáng tobermorite, công thức phụ gia khoáng và thử nghiệm cường độ nén.'
      : 'Specialized green building materials producers. Students experience hydrothermal tobermorite autoclave synthesis, mineral admixture formulations, and compressive strength characterization.',
    tag: locale.value === 'vi' ? 'Vật liệu Xanh & Thủy nhiệt Chưng áp' : 'Green Building & Hydrothermal Synthesis',
    activitySlug: 'construction-materials-trip',
    icon: 'i-lucide-box'
  }
])
</script>

<template>
  <div class="min-h-[80vh] bg-slate-50 pb-24 font-sans">
    <!-- Header -->
    <PageHeader
      :title="locale === 'vi' ? 'Kết Nối Doanh Nghiệp & Kiến Tập Thực Địa' : 'Industry Connections & Plant Excursions'"
      :description="locale === 'vi'
        ? 'Trải nghiệm thực tế tại các dây chuyền sản xuất tiên tiến và cơ hội hợp tác nghiên cứu ứng dụng cùng chương trình MSI.'
        : 'Real-world exposure to advanced manufacturing lines and collaborative research opportunities with the MSI Master program.'"
    />

    <div class="max-w-6xl mx-auto px-4 sm:px-6 my-10 flex flex-col gap-12">
      <!-- Pedagogical & Technical Connection Statement -->
      <div class="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs flex flex-col gap-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold w-fit">
          <UIcon name="i-lucide-info" class="size-3.5" />
          <span>{{ locale === 'vi' ? 'Gắn Kết Học Thuật & Thực Tiễn Sản Xuất' : 'Academic Rigor & Industrial Practice' }}</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {{ locale === 'vi' ? 'Kiến Tập Thực Tế & Trải Nghiệm Môi Trường Công Nghiệp' : 'Hands-On Plant Excursions & Industrial Immersion' }}
        </h2>
        <p class="text-sm sm:text-base text-slate-600 leading-relaxed max-w-4xl">
          {{ locale === 'vi'
            ? 'Trong suốt quá trình đào tạo, học viên chương trình Thạc sĩ MSI được tạo điều kiện tiếp cận trực tiếp với các nhà máy sản xuất, trung tâm kỹ thuật và dây chuyền chế tạo công nghệ cao. Các hoạt động kiến tập thực địa và đối thoại kỹ thuật này giúp học viên gắn kết nền tảng lý thuyết với bài toán thực tiễn của ngành vật liệu, đồng thời mở rộng tầm nhìn về quy trình kiểm soát chất lượng, tự động hóa và phát triển bền vững.'
            : 'Throughout the MSI Master of Science program, students gain direct, first-hand exposure to operational manufacturing plants, testing facilities, and high-tech engineering lines. These educational field trips and technical dialogues bridge theoretical classroom mechanics with industrial realities, providing deep insights into quality assurance, automation, and sustainable materials processing.'
          }}
        </p>
      </div>

      <!-- Facilities & Companies Visited Section -->
      <div class="flex flex-col gap-6">
        <div class="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h3 class="text-xl sm:text-2xl font-black text-slate-900">
              {{ locale === 'vi' ? 'Doanh Nghiệp & Địa Điểm Kiến Tập Tiêu Biểu' : 'Featured Industrial Excursion Destinations' }}
            </h3>
            <p class="text-xs sm:text-sm text-slate-500 mt-1">
              {{ locale === 'vi' ? 'Các cơ sở sản xuất học viên MSI đã trực tiếp đến tham quan và tìm hiểu kỹ thuật' : 'Manufacturing facilities explored by MSI students for process immersion' }}
            </p>
          </div>
          <UBadge color="neutral" variant="subtle" size="sm" class="font-bold self-start sm:self-auto shrink-0">
            {{ locale === 'vi' ? 'Kiến tập Nhà máy Thực địa' : 'Educational Field Visits' }}
          </UBadge>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="partner in industrialConnections"
            :key="partner.name"
            class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-5 group"
          >
            <div class="flex flex-col gap-3">
              <div class="flex items-center gap-3">
                <div class="size-11 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 ring-1 ring-orange-200/60 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-200">
                  <UIcon :name="partner.icon" class="size-5" />
                </div>
                <div>
                  <h4 class="text-lg font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                    {{ partner.name }}
                  </h4>
                  <p class="text-xs font-semibold text-slate-500">
                    {{ partner.sector }}
                  </p>
                </div>
              </div>

              <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {{ partner.description }}
              </p>
            </div>

            <div class="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 flex-wrap">
              <UBadge color="neutral" variant="subtle" size="sm" class="font-bold text-xs rounded-lg">
                {{ partner.tag }}
              </UBadge>

              <NuxtLink
                v-if="partner.activitySlug"
                :to="localePath(`/academic-activities/${partner.activitySlug}`)"
                class="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
              >
                <span>{{ locale === 'vi' ? 'Xem bài viết hoạt động' : 'View Excursion Story' }}</span>
                <UIcon name="i-lucide-arrow-right" class="size-3.5" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Open Call for Collaboration & Applied Research -->
      <div class="bg-gradient-to-br from-msi-dark to-msi-navy text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-700/50 relative overflow-hidden">
        <div class="absolute -right-20 -top-20 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div class="relative z-10 flex flex-col gap-8">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-700/60 pb-6">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold tracking-wide uppercase mb-3">
                <UIcon name="i-lucide-mail" class="size-3.5" />
                <span>{{ locale === 'vi' ? 'Cơ Hội Hợp Tác Kỹ Thuật' : 'Collaboration Inquiries' }}</span>
              </div>
              <h3 class="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {{ locale === 'vi' ? 'Chào Đón Các Cơ Hội Hợp Tác Nghiên Cứu Ứng Dụng' : 'Welcoming Industrial Collaboration Inquiries' }}
              </h3>
              <p class="text-slate-300 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
                {{ locale === 'vi'
                  ? 'Quý doanh nghiệp và viện nghiên cứu quan tâm đến việc hợp tác đo lường phân tích vật liệu trên hệ thống 22+ thiết bị của VGU, đề xuất bài toán kỹ thuật làm đề tài luận văn thạc sĩ, hoặc chia sẻ chuyên đề kỹ thuật cùng học viên xin vui lòng liên hệ ban điều phối chương trình.'
                  : 'Enterprises and research organizations interested in joint material testing on our 22+ characterization instruments, proposing factory engineering challenges for Master thesis topics, or co-hosting technical seminars are warmly invited to get in touch.'
                }}
              </p>
            </div>
            <div class="shrink-0">
              <UButton
                href="mailto:msi.info@vgu.edu.vn?subject=Industrial%20Inquiry%20-%20MSI%20Program"
                color="primary"
                variant="solid"
                size="lg"
                icon="i-lucide-mail"
                class="font-bold shadow-lg hover:shadow-orange-500/25 transition-all text-white px-6 py-3 rounded-full cursor-pointer"
              >
                {{ locale === 'vi' ? 'Liên Hệ Hợp Tác' : 'Contact Coordinator' }}
              </UButton>
            </div>
          </div>

          <!-- Direct Contact Strip -->
          <div class="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs sm:text-sm">
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-mail" class="size-5 text-orange-400 shrink-0" />
              <div>
                <span class="text-slate-400 block text-xs">{{ locale === 'vi' ? 'Email Điều Phối Chương Trình MSI' : 'MSI Academic & Liaison Email' }}:</span>
                <a href="mailto:msi.info@vgu.edu.vn" class="text-white hover:text-orange-400 font-bold transition-colors">
                  msi.info@vgu.edu.vn
                </a>
              </div>
            </div>
            <div class="flex items-center gap-2 text-slate-400">
              <UIcon name="i-lucide-map-pin" class="size-4 text-slate-400 shrink-0" />
              <span>Vietnamese-German University, Ring Road 4, Ben Cat, Binh Duong</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Back to Academic Faculty -->
      <div class="flex justify-center">
        <NuxtLink :to="localePath('/academic-partners')">
          <UButton
            color="neutral"
            variant="outline"
            size="md"
            icon="i-lucide-arrow-left"
            class="font-bold rounded-xl px-5 py-2.5"
          >
            {{ locale === 'vi' ? '← Xem Đội Ngũ Giảng Viên & Bộ Môn' : '← View Academic Faculty & Research Chairs' }}
          </UButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
