<script setup lang="ts">
import { inject, ref, computed, nextTick } from 'vue'

const { pageData, equipments, activities, localePath } = inject('pageData') as any

// --- State ---
const activeCategory = ref('All')
const selectedMachine = ref<any | null>(null)
const activeImageIndex = ref(0)
const isModalOpen = ref(false)
const filterBarRef = ref<HTMLElement | null>(null)

function scrollToStart() {
  nextTick(() => {
    if (filterBarRef.value) {
      const top = filterBarRef.value.getBoundingClientRect().top + window.scrollY - 96
      window.scrollTo({ top, behavior: 'smooth' })
    }
  })
}

function selectCategory(cat: string) {
  activeCategory.value = cat
  scrollToStart()
}

// --- Category filter ---
const categories = computed<string[]>(() => {
  if (!equipments?.value) return ['All']
  const unique = new Set<string>(equipments.value.map((e: any) => e.category).filter(Boolean))
  return ['All', ...Array.from(unique)]
})

const filteredEquipments = computed(() => {
  if (!equipments?.value) return []
  if (activeCategory.value === 'All') return equipments.value
  return equipments.value.filter((e: any) => e.category === activeCategory.value)
})

// --- Modal helpers ---
const openModal = (machine: any) => {
  selectedMachine.value = machine
  activeImageIndex.value = 0
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedMachine.value = null
}

const nextImage = () => {
  if (!selectedMachine.value?.images?.length) return
  activeImageIndex.value = (activeImageIndex.value + 1) % selectedMachine.value.images.length
}

const prevImage = () => {
  if (!selectedMachine.value?.images?.length) return
  const len = selectedMachine.value.images.length
  activeImageIndex.value = (activeImageIndex.value - 1 + len) % len
}

// --- Related activities cross-reference ---
const getRelatedActivities = (machine: any) => {
  if (!activities?.value || !machine) return []
  return activities.value.filter((act: any) => {
    const nameLower = machine.name?.toLowerCase() || ''
    const idLower = machine.id?.toLowerCase() || ''
    const titleMatch = act.title?.toLowerCase().includes(nameLower) ||
                       act.title?.toLowerCase().includes(idLower)
    const desc = (act.meta?.description || act.description || '').toLowerCase()
    const descMatch = desc.includes(nameLower) || desc.includes(idLower)
    return titleMatch || descMatch
  })
}
</script>

<template>
  <div class="w-full">
    <!-- Category Filter Pills -->
    <div ref="filterBarRef" class="flex flex-wrap gap-2 justify-center mb-8">
      <UButton
        v-for="cat in categories"
        :key="cat"
        :variant="activeCategory === cat ? 'solid' : 'outline'"
        color="primary"
        size="sm"
        class="rounded-full font-semibold shadow-xs"
        @click="selectCategory(cat)"
      >
        {{ cat }}
      </UButton>
    </div>

    <!-- Responsive Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="machine in filteredEquipments"
        :key="machine.id"
        class="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col group"
        @click="openModal(machine)"
      >
        <div class="relative h-48 sm:h-52 overflow-hidden bg-slate-100 flex items-center justify-center">
          <img
            v-if="machine.images && machine.images.length > 0"
            :src="machine.images[0]"
            :alt="machine.name"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <UIcon v-else name="i-lucide-microscope" class="size-10 text-slate-300" />
          
          <div class="absolute top-3 right-3">
            <UBadge color="primary" variant="subtle" size="xs" class="backdrop-blur-md bg-white/85 font-semibold">
              {{ machine.category }}
            </UBadge>
          </div>
        </div>

        <div class="p-5 flex flex-col flex-1 justify-between gap-3">
          <div>
            <h3 class="text-base font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-1">
              {{ machine.name }}
            </h3>
            <span class="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <UIcon name="i-lucide-map-pin" class="size-3.5 text-slate-400 inline shrink-0" /> {{ machine.room }}
            </span>
            <p v-if="machine.description" class="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
              {{ machine.description }}
            </p>
          </div>

          <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-primary-600">
            <span>View Details</span>
            <UIcon name="i-lucide-arrow-right" class="size-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </div>

    <!-- UModal Detail Lightbox -->
    <UModal
      v-model:open="isModalOpen"
      :title="selectedMachine?.name || 'Equipment Details'"
      :description="selectedMachine ? `${selectedMachine.room} • ${selectedMachine.category}` : ''"
      scrollable
      :ui="{
        content: 'max-w-2xl rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200',
        header: 'border-b border-slate-100 p-5 font-bold text-slate-800',
        body: 'p-6 flex flex-col gap-5'
      }"
    >
      <template #body>
        <div v-if="selectedMachine" class="flex flex-col gap-4">
          <!-- Image gallery with prev/next -->
          <div
            v-if="selectedMachine.images && selectedMachine.images.length > 0"
            class="flex flex-col gap-3"
          >
            <div class="relative w-full aspect-16/10 rounded-xl overflow-hidden bg-slate-100">
              <img
                :src="selectedMachine.images[activeImageIndex]"
                :alt="selectedMachine.name"
                class="w-full h-full object-cover"
              />
              <div v-if="selectedMachine.images.length > 1" class="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900/75 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs">
                <UButton
                  icon="i-lucide-chevron-left"
                  variant="ghost"
                  color="neutral"
                  size="xs"
                  class="text-white hover:text-white"
                  @click="prevImage"
                />
                <span class="font-semibold text-xs">
                  {{ activeImageIndex + 1 }} / {{ selectedMachine.images.length }}
                </span>
                <UButton
                  icon="i-lucide-chevron-right"
                  variant="ghost"
                  color="neutral"
                  size="xs"
                  class="text-white hover:text-white"
                  @click="nextImage"
                />
              </div>
            </div>

            <!-- Thumbnail strip -->
            <div v-if="selectedMachine.images.length > 1" class="flex gap-2 overflow-x-auto py-1">
              <img
                v-for="(img, idx) in selectedMachine.images"
                :key="idx"
                :src="img"
                :alt="'thumb-' + idx"
                class="size-14 rounded-lg object-cover cursor-pointer border-2 transition-all shrink-0"
                :class="idx === activeImageIndex ? 'border-primary-500 scale-105' : 'border-transparent opacity-70 hover:opacity-100'"
                @click="activeImageIndex = idx"
              />
            </div>
          </div>

          <!-- Description -->
          <p v-if="selectedMachine.description" class="text-sm leading-relaxed text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
            {{ selectedMachine.description }}
          </p>

          <!-- Related Activities -->
          <div v-if="getRelatedActivities(selectedMachine).length > 0">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Related Academic Activities</h4>
            <div class="flex flex-col gap-2">
              <NuxtLink
                v-for="act in getRelatedActivities(selectedMachine)"
                :key="act.path || act.id"
                :to="localePath ? localePath(act.path?.replace('/_activities', '/academic-activities') || '/academic-activities') : '/academic-activities'"
                class="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:border-orange-500 hover:bg-orange-50/20 text-slate-700 text-xs font-medium transition-all"
                @click="closeModal"
              >
                <UIcon name="i-lucide-link" class="size-4 text-orange-500 shrink-0" />
                <span class="truncate flex-1">{{ act.title }}</span>
                <span v-if="act.meta?.date || act.date" class="text-slate-400 text-xs shrink-0">
                  {{ act.meta?.date || act.date }}
                </span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end w-full">
          <UButton
            color="neutral"
            variant="outline"
            size="sm"
            class="font-semibold rounded-lg"
            @click="closeModal"
          >
            Close
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
