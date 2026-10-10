<!--
  Page: EquipmentExplorerPage (/laboratories-research/equipment)
  Description: Dedicated characterization equipment explorer at VGU with category filters, search, modal detail viewer, and PDF user manuals.
-->
<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'

const { locale, t } = useI18n()
const localePath = useLocalePath()

const pagePath = computed(() => locale.value === 'vi' ? '/vi/laboratories-research/equipment' : '/laboratories-research/equipment')
const { data: pageData } = await useAsyncData(`equip-page-${locale.value}`, () =>
  queryCollection('content').path(pagePath.value).first()
)

const { data: equipments } = await useAsyncData('all-equipments', () =>
  queryCollection('equipments').all()
)

const { data: activities } = await useAsyncData('labs-activities', () =>
  queryCollection('activities').all()
)

useSeoMeta({
  title: () => pageData.value?.title ? `${pageData.value.title} | MSI VGU` : 'Materials Characterization Equipment (22+) | MSI VGU',
  ogTitle: () => pageData.value?.title ? `${pageData.value.title} | MSI VGU` : 'Materials Characterization Equipment (22+) | MSI VGU',
  description: () => pageData.value?.meta?.description || 'Browse research-grade materials characterization equipment at VGU: SEM, XRD, TGA, SPS, and mechanical test systems. Full technical specs and user manuals.',
  ogDescription: () => pageData.value?.meta?.description || 'Browse research-grade materials characterization equipment at VGU: SEM, XRD, TGA, SPS, and mechanical test systems. Full technical specs and user manuals.',
})

// State Management
const activeCategory = ref('All')
const currentPage = ref(1)
const itemsPerPage = 6
const filterBarRef = ref<HTMLElement | null>(null)

const isDetailModalOpen = ref(false)
const selectedMachine = ref<any | null>(null)
const searchQuery = ref('')

const lightboxOpen = ref(false)
const lightboxImages = ref<string[]>([])
const lightboxActiveIndex = ref(0)

const categories = computed(() => {
  if (!equipments.value) return ['All']
  const unique = new Set(equipments.value.map((e: any) => e.category))
  return ['All', ...Array.from(unique)]
})

watch([activeCategory, searchQuery], () => {
  currentPage.value = 1
})

function selectCategory(cat: string) {
  activeCategory.value = cat
}

function clearFilters() {
  activeCategory.value = 'All'
  searchQuery.value = ''
}

const filteredEquipments = computed(() => {
  if (!equipments.value) return []
  return equipments.value.filter((e: any) => {
    const matchCat = activeCategory.value === 'All' || e.category === activeCategory.value
    if (!matchCat) return false
    const q = searchQuery.value.trim().toLowerCase()
    if (!q) return true
    const inName = (e.name || '').toLowerCase().includes(q)
    const inDesc = (e.description || '').toLowerCase().includes(q)
    const inRoom = (e.room || '').toLowerCase().includes(q)
    return inName || inDesc || inRoom
  })
})

const totalPages = computed(() =>
  Math.ceil(filteredEquipments.value.length / itemsPerPage)
)

const paginatedEquipments = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredEquipments.value.slice(start, start + itemsPerPage)
})

function openModal(machine: any) {
  selectedMachine.value = machine
  isDetailModalOpen.value = true
}

function getImages(m: any) { return m?.images || [] }
function getPdfs(m: any)   { return m?.pdfs   || [] }
function getLinks(m: any)  { return m?.links   || [] }

function getRelatedActivities(machine: any) {
  if (!activities.value || !machine) return []
  return activities.value.filter((act: any) => {
    const titleMatch = act.title?.toLowerCase().includes(machine.name.toLowerCase()) ||
                       act.title?.toLowerCase().includes(machine.id.toLowerCase())
    const descMatch  = (act.meta?.description || act.description || '').toLowerCase().includes(machine.name.toLowerCase()) ||
                       (act.meta?.description || act.description || '').toLowerCase().includes(machine.id.toLowerCase())
    return titleMatch || descMatch
  })
}

function openLightbox(imgs: string[], idx: number) {
  lightboxImages.value = imgs
  lightboxActiveIndex.value = idx
  lightboxOpen.value = true
}
</script>

<template>
  <main class="min-h-[80vh] bg-slate-50 pb-20 font-sans">
    <PageHeader
      :title="pageData?.title || (locale === 'vi' ? 'Hệ Thống Thiết Bị Phân Tích (22+ Máy Hiện Đại)' : 'Characterization Equipment Explorer')"
      :description="pageData?.meta?.description || (locale === 'vi' ? 'Tra cứu thông số kỹ thuật, phòng thực hành và tài liệu vận hành thiết bị phân tích tại VGU.' : 'Search 22+ research-grade instruments at VGU: SEM, XRD, TGA, SPS, and mechanical test systems.')"
    />

    <div class="max-w-6xl mx-auto px-4 sm:px-6 mt-8 flex flex-col gap-8">

      <!-- Editorial Intro Markdown -->
      <div v-if="pageData && pageData.body" class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <ContentRenderer :value="pageData" class="prose max-w-none text-slate-700" />
      </div>

      <!-- Search Bar & Category Filter Pills -->
      <div ref="filterBarRef" class="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <!-- Search Input -->
        <div class="w-full md:w-80">
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            size="md"
            :placeholder="locale === 'vi' ? 'Tìm tên thiết bị, phòng lab...' : 'Search equipment, room...'"
            class="w-full"
          />
        </div>

        <!-- Category Pills -->
        <div class="flex flex-wrap gap-1.5 justify-start md:justify-end">
          <UButton
            v-for="cat in categories"
            :key="cat"
            :variant="activeCategory === cat ? 'solid' : 'outline'"
            color="primary"
            size="sm"
            class="rounded-full font-bold cursor-pointer"
            @click="selectCategory(cat)"
          >
            {{ cat === 'All' ? (locale === 'vi' ? 'Tất cả' : 'All') : cat }}
          </UButton>
        </div>
      </div>

      <!-- Equipment Grid (3 columns on desktop) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="machine in paginatedEquipments"
          :key="machine.id"
          class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer"
          @click="openModal(machine)"
        >
          <!-- Thumbnail Container -->
          <div class="relative h-48 overflow-hidden bg-slate-100 flex items-center justify-center">
            <img
              v-if="machine.images && machine.images.length > 0"
              :src="machine.images[0]"
              :alt="machine.name"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <UIcon v-else name="i-lucide-microscope" class="size-10 text-slate-300" />
            <span class="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-lg font-bold">
              <UIcon name="i-lucide-map-pin" class="size-3.5 text-slate-400 inline shrink-0" /> {{ machine.room }}
            </span>
            <UBadge color="primary" variant="subtle" size="xs" class="absolute top-3 right-3 font-bold backdrop-blur-md bg-white/85">
              {{ machine.category }}
            </UBadge>
          </div>

          <!-- Body -->
          <div class="p-5 flex flex-col flex-1 justify-between gap-3">
            <div>
              <h3 class="text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 mb-2">
                {{ machine.name }}
              </h3>
              <p class="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {{ machine.description }}
              </p>
            </div>
            <UButton
              color="primary"
              variant="solid"
              size="xs"
              icon="i-lucide-eye"
              block
              class="mt-2 font-bold justify-center rounded-xl shadow-xs cursor-pointer"
              @click.stop="openModal(machine)"
            >
              {{ locale === 'vi' ? 'Xem chi tiết thông số' : 'View Technical Details' }}
            </UButton>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredEquipments.length === 0" class="text-center py-12 bg-white rounded-3xl border border-slate-200 my-4">
        <p class="text-slate-500 mb-4 text-sm">{{ locale === 'vi' ? 'Không tìm thấy thiết bị phù hợp.' : 'No equipment found matching criteria.' }}</p>
        <UButton color="primary" variant="solid" size="sm" class="font-bold rounded-xl cursor-pointer" @click="clearFilters">
          {{ locale === 'vi' ? 'Xóa bộ lọc' : 'Clear Filters' }}
        </UButton>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center py-6">
        <UPagination
          v-model:page="currentPage"
          :total="filteredEquipments.length"
          :items-per-page="itemsPerPage"
          color="primary"
          variant="subtle"
          size="md"
        />
      </div>

      <!-- Navigation Footer links -->
      <div class="flex justify-between items-center bg-white p-4 sm:p-6 rounded-2xl border border-slate-200">
        <NuxtLink
          :to="localePath('/laboratories-research')"
          class="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-orange-600 transition-colors"
        >
          <UIcon name="i-lucide-arrow-left" class="size-4 shrink-0" />
          <span>{{ locale === 'vi' ? 'Quay lại Tổng quan Lab & Nghiên cứu' : 'Back to Research Hub Overview' }}</span>
        </NuxtLink>
        <NuxtLink
          :to="localePath('/laboratories-research/chairs')"
          class="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors"
        >
          <span>{{ locale === 'vi' ? 'Xem 6 bộ môn đối tác OVGU →' : 'Explore 6 OVGU Partner Chairs →' }}</span>
        </NuxtLink>
      </div>

    </div>

    <!-- Equipment Detail Modal -->
    <UModal
      v-model:open="isDetailModalOpen"
      :title="selectedMachine?.name || ''"
      :description="selectedMachine ? `${selectedMachine.room} • ${selectedMachine.category}` : ''"
      scrollable
      :ui="{
        content: 'max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-200',
        header: 'border-b border-slate-100 p-5 font-bold text-slate-900',
        body: 'p-6 flex flex-col gap-5'
      }"
    >
      <template #body>
        <div v-if="selectedMachine" class="flex flex-col gap-5">
          <!-- Gallery Row -->
          <div v-if="getImages(selectedMachine).length">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              {{ locale === 'vi' ? 'Thư Viện Hình Ảnh' : 'Equipment Gallery' }}
            </h4>
            <div class="flex gap-3 overflow-x-auto py-1">
              <div
                v-for="(img, idx) in getImages(selectedMachine)"
                :key="idx"
                class="relative size-24 rounded-2xl overflow-hidden cursor-pointer border border-slate-200 shrink-0 group"
                @click="openLightbox(getImages(selectedMachine), idx)"
              >
                <img :src="img" :alt="selectedMachine.name + ' image ' + (idx+1)" class="w-full h-full object-cover transition-transform group-hover:scale-105" draggable="false" />
              </div>
            </div>
          </div>

          <!-- Description -->
          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              {{ locale === 'vi' ? 'Mô Tả & Thông Số Kỹ Thuật' : 'Description & Specifications' }}
            </h4>
            <p class="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {{ selectedMachine.description }}
            </p>
            <ContentRenderer v-if="selectedMachine.body" :value="selectedMachine" class="prose max-w-none text-slate-600 text-xs mt-3" />
          </div>

          <!-- PDFs -->
          <div v-if="getPdfs(selectedMachine).length">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              {{ locale === 'vi' ? 'Tài Liệu Hướng Dẫn (PDF)' : 'Operating Manuals (PDF)' }}
            </h4>
            <div class="flex flex-col gap-2">
              <a
                v-for="(pdf, idx) in getPdfs(selectedMachine)"
                :key="idx"
                :href="pdf.url"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 hover:border-orange-500 hover:bg-orange-50/20 text-slate-700 font-semibold text-xs transition-all"
              >
                <UIcon name="i-lucide-file-text" class="size-4 text-orange-600 shrink-0" />
                <span class="truncate flex-1">{{ pdf.title }}</span>
                <UIcon name="i-lucide-external-link" class="size-3.5 text-slate-400 shrink-0" />
              </a>
            </div>
          </div>
        </div>
      </template>
    </UModal>
  </main>
</template>
