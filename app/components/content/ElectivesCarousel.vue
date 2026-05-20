<script setup lang="ts">
import { inject, ref, computed, unref } from 'vue'

const { electiveModules } = inject('pageData') as any

type ViewMode = 'carousel' | 'compact'

const viewMode = ref<ViewMode>('carousel')
const carouselIndex = ref(0)

const modules = computed(() => {
  const arr = unref(electiveModules)
  return Array.isArray(arr) ? arr : []
})
const totalSlides = computed(() => Math.ceil(modules.value.length / 2))

function prev() {
  if (carouselIndex.value > 0) {
    carouselIndex.value -= 2
  }
}

function next() {
  if (carouselIndex.value + 2 < modules.value.length) {
    carouselIndex.value += 2
  }
}

function goToSlide(slideIdx: number) {
  carouselIndex.value = slideIdx * 2
}

const currentSlide = computed(() => Math.floor(carouselIndex.value / 2))

function getSemesterColor(sem: number): string {
  if (sem === 1) return '#E87722'
  if (sem === 2) return '#1E3A5F'
  if (sem === 3) return '#10B981'
  return '#8B5CF6'
}

const leftCard = computed(() => modules.value[carouselIndex.value] || null)
const rightCard = computed(() => modules.value[carouselIndex.value + 1] || null)
</script>

<template>
  <div class="electives-carousel">
    <!-- View Toggle -->
    <div class="toggle-bar">
      <span class="toggle-label">Elective Modules</span>
      <div class="toggle-group">
        <UButton
          :variant="viewMode === 'carousel' ? 'solid' : 'ghost'"
          color="primary"
          size="sm"
          icon="i-heroicons-squares-2x2"
          @click="viewMode = 'carousel'"
        >
          Carousel
        </UButton>
        <UButton
          :variant="viewMode === 'compact' ? 'solid' : 'ghost'"
          color="primary"
          size="sm"
          icon="i-heroicons-list-bullet"
          @click="viewMode = 'compact'"
        >
          Compact
        </UButton>
      </div>
    </div>

    <!-- ── Carousel View ── -->
    <div v-if="viewMode === 'carousel'" class="carousel-view">
      <div class="carousel-stage">
        <!-- Prev Button -->
        <UButton
          icon="i-heroicons-chevron-left"
          color="gray"
          variant="ghost"
          size="lg"
          :disabled="carouselIndex === 0"
          class="nav-btn nav-btn-prev"
          @click="prev"
        />

        <!-- Cards -->
        <div class="carousel-cards">
          <UCard v-if="leftCard" class="carousel-card" :key="'left-' + carouselIndex">
            <template #header>
              <div class="card-header-row">
                <span
                  class="sem-badge"
                  :style="{
                    backgroundColor: getSemesterColor(leftCard.semester || leftCard.sem || 4) + '22',
                    color: getSemesterColor(leftCard.semester || leftCard.sem || 4),
                    borderColor: getSemesterColor(leftCard.semester || leftCard.sem || 4) + '55'
                  }"
                >
                  Sem {{ leftCard.semester || leftCard.sem || 4 }}
                </span>
                <UBadge color="violet" variant="soft" size="xs">Elective</UBadge>
              </div>
              <h3 class="card-title">{{ leftCard.title }}</h3>
            </template>

            <div class="card-body-scroll">
              <ContentRenderer v-if="leftCard.body" :value="leftCard" class="prose card-prose" />
              <p v-else-if="leftCard.description" class="card-description">{{ leftCard.description }}</p>
            </div>
          </UCard>

          <UCard v-if="rightCard" class="carousel-card" :key="'right-' + carouselIndex">
            <template #header>
              <div class="card-header-row">
                <span
                  class="sem-badge"
                  :style="{
                    backgroundColor: getSemesterColor(rightCard.semester || rightCard.sem || 4) + '22',
                    color: getSemesterColor(rightCard.semester || rightCard.sem || 4),
                    borderColor: getSemesterColor(rightCard.semester || rightCard.sem || 4) + '55'
                  }"
                >
                  Sem {{ rightCard.semester || rightCard.sem || 4 }}
                </span>
                <UBadge color="violet" variant="soft" size="xs">Elective</UBadge>
              </div>
              <h3 class="card-title">{{ rightCard.title }}</h3>
            </template>

            <div class="card-body-scroll">
              <ContentRenderer v-if="rightCard.body" :value="rightCard" class="prose card-prose" />
              <p v-else-if="rightCard.description" class="card-description">{{ rightCard.description }}</p>
            </div>
          </UCard>

          <!-- Placeholder when odd number -->
          <div v-if="leftCard && !rightCard" class="carousel-card carousel-placeholder">
            <div class="placeholder-inner">
              <span class="placeholder-icon">✨</span>
              <p>More electives coming soon</p>
            </div>
          </div>
        </div>

        <!-- Next Button -->
        <UButton
          icon="i-heroicons-chevron-right"
          color="gray"
          variant="ghost"
          size="lg"
          :disabled="carouselIndex + 2 >= modules.length"
          class="nav-btn nav-btn-next"
          @click="next"
        />
      </div>

      <!-- Bullet Dots -->
      <div class="carousel-dots">
        <button
          v-for="i in totalSlides"
          :key="i"
          class="dot"
          :class="{ active: currentSlide === i - 1 }"
          @click="goToSlide(i - 1)"
        />
      </div>

      <!-- Slide counter -->
      <p class="slide-counter">{{ currentSlide + 1 }} / {{ totalSlides }}</p>
    </div>

    <!-- ── Compact Grid View ── -->
    <div v-else class="compact-view">
      <div
        v-for="mod in modules"
        :key="mod._path || mod.title"
        class="compact-card"
        :style="{ borderTopColor: getSemesterColor(mod.semester || mod.sem || 4) }"
      >
        <div class="compact-top">
          <span
            class="sem-badge"
            :style="{
              backgroundColor: getSemesterColor(mod.semester || mod.sem || 4) + '22',
              color: getSemesterColor(mod.semester || mod.sem || 4),
              borderColor: getSemesterColor(mod.semester || mod.sem || 4) + '55'
            }"
          >
            Sem {{ mod.semester || mod.sem || 4 }}
          </span>
          <UBadge color="violet" variant="soft" size="xs">Elective</UBadge>
        </div>
        <h4 class="compact-title">{{ mod.title }}</h4>
        <p v-if="mod.description" class="compact-description">{{ mod.description }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.electives-carousel {
  font-family: var(--font-sans);
}

/* Toggle bar */
.toggle-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.toggle-label {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-primary);
}

.toggle-group {
  display: flex;
  gap: 0.375rem;
  background: var(--color-gray-100);
  padding: 0.25rem;
  border-radius: var(--radius-md);
}

/* ── Carousel view ── */
.carousel-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.carousel-stage {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
}

.nav-btn {
  flex-shrink: 0;
}

.carousel-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  flex: 1;
  min-width: 0;
}

@media (max-width: 680px) {
  .carousel-cards {
    grid-template-columns: 1fr;
  }
  .nav-btn {
    display: none;
  }
}

/* Carousel card */
.carousel-card {
  max-height: 400px;
  overflow-y: auto;
  transition: transform var(--duration-base) var(--ease-out);
}

.carousel-card:hover {
  transform: translateY(-3px);
}

.card-header-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
}

.card-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1.3;
  margin: 0;
}

.card-body-scroll {
  overflow: hidden;
}

.card-prose :deep(p),
.card-description {
  font-size: 0.875rem;
  color: var(--color-gray-700);
  line-height: 1.65;
  margin-bottom: 0.5rem;
}

.card-prose :deep(h2),
.card-prose :deep(h3) {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0.75rem 0 0.35rem;
}

.card-prose :deep(ul) {
  padding-left: 1.2rem;
}

.card-prose :deep(li) {
  font-size: 0.84rem;
  color: var(--color-gray-700);
  margin-bottom: 0.2rem;
}

/* Placeholder */
.carousel-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-gray-50);
  border: 2px dashed var(--color-gray-300);
  border-radius: var(--radius-lg);
}

.placeholder-inner {
  text-align: center;
  padding: 2rem;
  color: var(--color-gray-400);
}

.placeholder-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
}

/* Dots */
.carousel-dots {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-gray-300);
  border: none;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  padding: 0;
}

.dot.active {
  background: var(--color-primary);
  width: 24px;
  border-radius: var(--radius-full);
}

.slide-counter {
  font-size: 0.8rem;
  color: var(--color-gray-500);
  font-weight: 600;
}

/* ── Compact grid ── */
.compact-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.875rem;
}

.compact-card {
  background: #fff;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-gray-200);
  border-top: 3px solid;
  padding: 1rem;
  transition: all var(--duration-base) var(--ease-out);
  box-shadow: var(--shadow-xs);
}

.compact-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.compact-top {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.5rem;
}

.compact-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1.3;
  margin: 0 0 0.4rem;
}

.compact-description {
  font-size: 0.8rem;
  color: var(--color-gray-600);
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Semester badge */
.sem-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  padding: 0.18rem 0.55rem;
  border-radius: var(--radius-full);
  border: 1.5px solid;
  flex-shrink: 0;
}
</style>
