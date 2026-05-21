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
  <div class="equipment-explorer">

    <!-- Category Filter Pills -->
    <div ref="filterBarRef" class="filter-bar">
      <UButton
        v-for="cat in categories"
        :key="cat"
        :variant="activeCategory === cat ? 'solid' : 'outline'"
        color="primary"
        size="sm"
        class="cat-pill"
        @click="selectCategory(cat)"
      >
        {{ cat }}
      </UButton>
    </div>

    <!-- Desktop: 3-column masonry-like grid -->
    <div class="equipment-grid desktop-grid">
      <div
        v-for="machine in filteredEquipments"
        :key="machine.id"
        class="grid-card"
        @click="openModal(machine)"
      >
        <div class="grid-card-img-wrap">
          <img
            v-if="machine.images && machine.images.length > 0"
            :src="machine.images[0]"
            :alt="machine.name"
            class="grid-card-img"
          />
          <div v-else class="grid-card-placeholder">🔬</div>
          <!-- Hover overlay -->
          <div class="grid-card-overlay">
            <span class="overlay-name">{{ machine.name }}</span>
            <span class="overlay-room">📍 {{ machine.room }}</span>
            <span class="overlay-cta">View Details →</span>
          </div>
        </div>
        <div class="grid-card-foot">
          <span class="grid-card-cat">{{ machine.category }}</span>
        </div>
      </div>
    </div>

    <!-- Mobile: list of cards -->
    <div class="mobile-list">
      <div
        v-for="machine in filteredEquipments"
        :key="machine.id + '-m'"
        class="mobile-card"
        @click="openModal(machine)"
      >
        <div class="mobile-card-thumb">
          <img
            v-if="machine.images && machine.images.length > 0"
            :src="machine.images[0]"
            :alt="machine.name"
            class="mobile-thumb-img"
          />
          <div v-else class="mobile-thumb-placeholder">🔬</div>
        </div>
        <div class="mobile-card-info">
          <h3 class="mobile-card-name">{{ machine.name }}</h3>
          <span class="mobile-card-room">📍 {{ machine.room }}</span>
          <span class="mobile-card-cat">{{ machine.category }}</span>
          <p v-if="machine.description" class="mobile-card-desc">
            {{ machine.description.substring(0, 90) }}…
          </p>
        </div>
        <UButton size="xs" variant="ghost" color="primary" icon="i-heroicons-chevron-right-20-solid" />
      </div>
    </div>

    <!-- UModal Detail Lightbox -->
    <UModal v-model="isModalOpen" :ui="{ width: 'max-w-3xl' }" @close="closeModal">
      <div v-if="selectedMachine" class="modal-body">
        <!-- Header row -->
        <div class="modal-header">
          <div>
            <span class="modal-room">📍 {{ selectedMachine.room }}</span>
            <h2 class="modal-title">{{ selectedMachine.name }}</h2>
            <span class="modal-cat-badge">{{ selectedMachine.category }}</span>
          </div>
          <UButton
            icon="i-heroicons-x-mark-20-solid"
            variant="ghost"
            color="gray"
            size="sm"
            class="modal-close-btn"
            @click="closeModal"
          />
        </div>

        <!-- Image gallery with prev/next -->
        <div
          v-if="selectedMachine.images && selectedMachine.images.length > 0"
          class="modal-gallery"
        >
          <img
            :src="selectedMachine.images[activeImageIndex]"
            :alt="selectedMachine.name"
            class="modal-gallery-img"
          />
          <div v-if="selectedMachine.images.length > 1" class="gallery-nav">
            <UButton
              icon="i-heroicons-chevron-left-20-solid"
              variant="solid"
              color="gray"
              size="xs"
              class="gallery-nav-btn"
              @click="prevImage"
            />
            <span class="gallery-counter">
              {{ activeImageIndex + 1 }} / {{ selectedMachine.images.length }}
            </span>
            <UButton
              icon="i-heroicons-chevron-right-20-solid"
              variant="solid"
              color="gray"
              size="xs"
              class="gallery-nav-btn"
              @click="nextImage"
            />
          </div>
          <!-- Thumbnail strip -->
          <div v-if="selectedMachine.images.length > 1" class="gallery-thumbs">
            <img
              v-for="(img, idx) in selectedMachine.images"
              :key="idx"
              :src="img"
              :alt="'thumb-' + idx"
              class="gallery-thumb"
              :class="{ 'gallery-thumb--active': idx === activeImageIndex }"
              @click="activeImageIndex = idx"
            />
          </div>
        </div>

        <!-- Description -->
        <div class="modal-scroll-body">
          <p v-if="selectedMachine.description" class="modal-desc">
            {{ selectedMachine.description }}
          </p>

          <!-- Related Activities -->
          <div v-if="getRelatedActivities(selectedMachine).length > 0" class="modal-activities">
            <h4 class="modal-activities-title">Related Academic Activities</h4>
            <ul class="modal-activities-list">
              <li
                v-for="act in getRelatedActivities(selectedMachine)"
                :key="act.path || act.id"
                class="modal-activity-item"
              >
                <NuxtLink
                  :to="localePath ? localePath(act.path?.replace('/_activities', '/academic-activities') || '/academic-activities') : '/academic-activities'"
                  class="modal-activity-link"
                  @click="closeModal"
                >
                  🔗 {{ act.title }}
                  <span v-if="act.meta?.date || act.date" class="activity-date">
                    ({{ act.meta?.date || act.date }})
                  </span>
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </UModal>
  </div>
</template>

<style scoped>
.equipment-explorer {
  width: 100%;
}

/* ── Filter pills ─────────────────────────── */
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 2rem;
}
.cat-pill {
  border-radius: var(--radius-full, 9999px) !important;
  font-size: 0.875rem;
  font-weight: 600;
}

/* ── Desktop 3-col grid ───────────────────── */
.desktop-grid {
  display: none;
}
@media (min-width: 768px) {
  .desktop-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
  }
  .mobile-list { display: none; }
}

.grid-card {
  border-radius: var(--radius-lg, 12px);
  overflow: hidden;
  background: #fff;
  border: 1px solid var(--color-gray-200, #e5e7eb);
  box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,.07));
  cursor: pointer;
  transition: transform 250ms, box-shadow 250ms;
  display: flex;
  flex-direction: column;
}
.grid-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md, 0 4px 12px rgba(0,0,0,.1));
}

.grid-card-img-wrap {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: var(--color-gray-100, #f3f4f6);
  display: flex;
  align-items: center;
  justify-content: center;
}
.grid-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 300ms;
}
.grid-card:hover .grid-card-img { transform: scale(1.06); }
.grid-card-placeholder { font-size: 3rem; opacity: 0.5; }

/* Hover overlay */
.grid-card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 34, 64, 0.72);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  opacity: 0;
  transition: opacity 220ms;
  padding: 1rem;
}
.grid-card:hover .grid-card-overlay { opacity: 1; }
.overlay-name {
  color: #fff;
  font-size: 1.05rem;
  font-weight: 800;
  text-align: center;
  line-height: 1.25;
}
.overlay-room {
  color: rgba(255,255,255,0.85);
  font-size: 0.8rem;
  font-weight: 600;
}
.overlay-cta {
  margin-top: 0.5rem;
  background: var(--color-accent, #e87722);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.3rem 0.8rem;
  border-radius: var(--radius-sm, 6px);
}

.grid-card-foot {
  padding: 0.6rem 0.85rem;
  border-top: 1px solid var(--color-gray-100, #f3f4f6);
}
.grid-card-cat {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-accent, #e87722);
}

/* ── Mobile card list ─────────────────────── */
.mobile-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 420px;
  overflow-y: auto;
}
.mobile-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #fff;
  border: 1px solid var(--color-gray-200, #e5e7eb);
  border-radius: var(--radius-lg, 12px);
  padding: 1rem;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: transform 200ms, box-shadow 200ms;
}
.mobile-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
.mobile-card-thumb {
  width: 72px;
  height: 72px;
  flex-shrink: 0;
  border-radius: var(--radius-md, 8px);
  overflow: hidden;
  background: var(--color-gray-100, #f3f4f6);
  display: flex;
  align-items: center;
  justify-content: center;
}
.mobile-thumb-img { width: 100%; height: 100%; object-fit: cover; }
.mobile-thumb-placeholder { font-size: 2rem; opacity: 0.5; }
.mobile-card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}
.mobile-card-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-primary-dark, #0f2240);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mobile-card-room { font-size: 0.75rem; color: var(--color-gray-500, #6b7280); }
.mobile-card-cat {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-accent, #e87722);
}
.mobile-card-desc {
  font-size: 0.8rem;
  color: var(--color-gray-600, #4b5563);
  line-height: 1.4;
}

/* ── Modal ────────────────────────────────── */
.modal-body {
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}
.modal-room {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-accent, #e87722);
  letter-spacing: 0.05em;
  display: block;
  margin-bottom: 0.25rem;
}
.modal-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-primary-dark, #0f2240);
  line-height: 1.2;
  margin-bottom: 0.5rem;
}
.modal-cat-badge {
  display: inline-block;
  background: var(--color-primary-50, #e8eef8);
  color: var(--color-primary, #1e3a5f);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.65rem;
  border-radius: var(--radius-sm, 6px);
}
.modal-close-btn { flex-shrink: 0; }

/* Gallery */
.modal-gallery {
  position: relative;
  background: #000;
  border-radius: var(--radius-lg, 12px);
  overflow: hidden;
  max-height: 320px;
}
.modal-gallery-img {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  display: block;
}
.gallery-nav {
  position: absolute;
  bottom: 0.75rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(0,0,0,0.55);
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius-full, 9999px);
  backdrop-filter: blur(4px);
}
.gallery-nav-btn { opacity: 0.9; }
.gallery-counter {
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  white-space: nowrap;
}
.gallery-thumbs {
  display: flex;
  gap: 0.4rem;
  padding: 0.5rem;
  background: rgba(0,0,0,0.7);
  overflow-x: auto;
}
.gallery-thumb {
  width: 54px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0.65;
  border: 2px solid transparent;
  transition: opacity 150ms, border-color 150ms;
  flex-shrink: 0;
}
.gallery-thumb--active {
  opacity: 1;
  border-color: var(--color-accent, #e87722);
}

/* Scroll body */
.modal-scroll-body {
  max-height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.modal-desc {
  font-size: 0.95rem;
  color: var(--color-gray-700, #374151);
  line-height: 1.7;
}

/* Activities */
.modal-activities {
  border-top: 1px solid var(--color-gray-200, #e5e7eb);
  padding-top: 1rem;
}
.modal-activities-title {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-primary, #1e3a5f);
  letter-spacing: 0.05em;
  margin-bottom: 0.6rem;
}
.modal-activities-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.modal-activity-link {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-primary, #1e3a5f);
  text-decoration: none;
  transition: color 150ms;
}
.modal-activity-link:hover { color: var(--color-accent, #e87722); text-decoration: underline; }
.activity-date { font-weight: 400; color: var(--color-gray-500, #6b7280); font-size: 0.8rem; }
</style>
