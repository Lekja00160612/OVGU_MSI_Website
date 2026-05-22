<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface KeyFact {
  label: string
  value: string
}

const props = withDefaults(defineProps<{
  coverImage: string
  labelImage?: string
  opportunityTitle?: string
  description?: string
  keyFacts?: KeyFact[]
  fileUrl?: string
  fileLabel?: string
}>(), {
  labelImage: '/images/scholarships/MSI_DAAD_Label.png',
  opportunityTitle: 'YOUR OPPORTUNITY AT VIETNAMESE-GERMAN UNIVERSITY',
  description: '',
  keyFacts: () => [],
  fileUrl: '',
  fileLabel: 'More Details'
})

const activeIndex = ref(0)
let timer: any = null

function nextFact() {
  if (props.keyFacts && props.keyFacts.length > 0) {
    activeIndex.value = (activeIndex.value + 1) % props.keyFacts.length
  }
}

function prevFact() {
  if (props.keyFacts && props.keyFacts.length > 0) {
    activeIndex.value = (activeIndex.value - 1 + props.keyFacts.length) % props.keyFacts.length
  }
}

function selectFact(index: number) {
  activeIndex.value = index
  resetTimer()
}

function startTimer() {
  timer = setInterval(nextFact, 5000)
}

function resetTimer() {
  if (timer) {
    clearInterval(timer)
    startTimer()
  }
}

onMounted(() => {
  if (props.keyFacts && props.keyFacts.length > 1) {
    startTimer()
  }
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<template>
  <div class="daad-scholarship-card">
    <!-- Cover image container with relative overlay label -->
    <div class="cover-wrapper">
      <NuxtImg 
        :src="coverImage" 
        alt="Scholarship Cover" 
        class="cover-image"
        placeholder
      />
      <div v-if="labelImage" class="label-overlay">
        <NuxtImg 
          :src="labelImage" 
          alt="DAAD Label Logo" 
          class="label-image"
        />
      </div>
    </div>

    <!-- Opportunity Header -->
    <div class="opportunity-header">
      <h3>{{ opportunityTitle }}</h3>
    </div>

    <!-- Description Details -->
    <div class="description-section">
      <p class="description-text">{{ description }}</p>
    </div>

    <!-- Key Facts Slider -->
    <div v-if="keyFacts && keyFacts.length > 0" class="key-facts-section">
      <div class="key-facts-header">
        <h4>KEY FACTS</h4>
      </div>

      <div class="slider-stage">
        <!-- Prev Button -->
        <button 
          class="slide-btn prev-btn" 
          aria-label="Previous Fact" 
          @click="prevFact(); resetTimer()"
        >
          <span class="chevron left"></span>
        </button>

        <!-- Slider Content -->
        <div class="slider-viewport">
          <Transition name="slide-fade" mode="out-in">
            <div :key="activeIndex" class="fact-slide">
              <div class="fact-label-box">
                <span class="fact-label">{{ keyFacts[activeIndex]?.label }}</span>
              </div>
              <div class="fact-value-box">
                <span class="fact-value">{{ keyFacts[activeIndex]?.value }}</span>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Next Button -->
        <button 
          class="slide-btn next-btn" 
          aria-label="Next Fact" 
          @click="nextFact(); resetTimer()"
        >
          <span class="chevron right"></span>
        </button>
      </div>

      <!-- Slide indicators -->
      <div class="slider-indicators">
        <button
          v-for="(fact, index) in keyFacts"
          :key="index"
          class="indicator-dot"
          :class="{ active: index === activeIndex }"
          :aria-label="`Go to fact ${index + 1}`"
          @click="selectFact(index)"
        ></button>
      </div>
    </div>

    <!-- Detail action button -->
    <div v-if="fileUrl" class="card-footer-actions">
      <a :href="fileUrl" class="detail-download-btn" download target="_blank">
        <span class="btn-icon">📥</span>
        <span class="btn-text">{{ fileLabel }}</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.daad-scholarship-card {
  max-width: 680px;
  margin: 2.5rem auto;
  background: var(--color-white);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-gray-200);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all var(--duration-base) var(--ease-out);
}

.daad-scholarship-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

/* Cover & Label styles */
.cover-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 6;
  background: var(--color-gray-100);
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
}

.label-overlay {
  position: absolute;
  left: 1.25rem;
  bottom: 0rem;
  /* background: var(--color-white); */
  /* padding: 0.5rem 0.75rem; */
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
  /* border: 1px solid var(--color-gray-200); */
  max-width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.label-image {
  max-height: 48px;
  max-width: 100%;
  height: auto;
  object-fit: contain;
}

/* Opportunity Header */
.opportunity-header {
  background: var(--color-primary);
  color: var(--color-white);
  padding: 1rem 1.5rem;
  text-align: center;
}

.opportunity-header h3 {
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: var(--color-white) !important;
  margin: 0;
  line-height: 1.4;
  text-transform: uppercase;
}

/* Description Section */
.description-section {
  padding: 1.5rem;
  background: var(--color-white);
  border-bottom: 1px solid var(--color-gray-100);
}

.description-text {
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--color-gray-700);
  margin: 0;
  text-align: justify;
}

/* Key Facts section */
.key-facts-section {
  background: var(--color-gray-50);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.key-facts-header {
  background: var(--color-primary-light);
  color: var(--color-white);
  padding: 0.5rem 1rem;
  text-align: center;
  border-radius: var(--radius-sm);
}

.key-facts-header h4 {
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--color-white) !important;
  margin: 0;
}

/* Slider mechanism */
.slider-stage {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 90px;
}

.slide-btn {
  background: var(--color-white);
  border: 1px solid var(--color-gray-300);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-xs);
  transition: all var(--duration-fast) var(--ease-out);
  flex-shrink: 0;
}

.slide-btn:hover {
  background: var(--color-primary-50);
  border-color: var(--color-primary-100);
  color: var(--color-primary);
  transform: scale(1.05);
}

.chevron {
  display: inline-block;
  border-right: 2px solid var(--color-primary);
  border-bottom: 2px solid var(--color-primary);
  width: 8px;
  height: 8px;
}

.chevron.left {
  transform: rotate(135deg);
  margin-left: 2px;
}

.chevron.right {
  transform: rotate(-45deg);
  margin-right: 2px;
}

.slider-viewport {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.fact-slide {
  display: flex;
  gap: 0.5rem;
  width: 100%;
  align-items: stretch;
}

.fact-label-box {
  background: var(--color-primary);
  color: var(--color-white);
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: var(--radius-sm);
  width: 140px;
  min-height: 52px;
  text-align: center;
  flex-shrink: 0;
}

.fact-value-box {
  background: var(--color-accent);
  color: var(--color-white);
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: center;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: var(--radius-sm);
  flex: 1;
  min-height: 52px;
  line-height: 1.4;
}

/* Indicators */
.slider-indicators {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-gray-300);
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all var(--duration-fast) var(--ease-out);
}

.indicator-dot.active {
  background: var(--color-primary);
  transform: scale(1.2);
}

/* Transitions */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.25s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

/* Card Footer actions */
.card-footer-actions {
  padding: 1.5rem;
  display: flex;
  justify-content: center;
  border-top: 1px solid var(--color-gray-100);
}

.detail-download-btn {
  background: linear-gradient(135deg, #FFA055 0%, var(--color-accent) 55%, var(--color-accent-dark) 100%);
  color: var(--color-white) !important;
  font-weight: 700;
  font-size: 0.95rem;
  padding: 0.75rem 2rem;
  border-radius: var(--radius-full);
  text-decoration: none !important;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(232, 119, 34, 0.2);
  transition: all var(--duration-base) var(--ease-out);
}

.detail-download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(232, 119, 34, 0.4);
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .label-overlay {
    left: 0.75rem;
    bottom: 0.75rem;
    max-width: 140px;
    padding: 0.35rem 0.5rem;
  }
  
  .label-image {
    max-height: 32px;
  }
  
  .fact-slide {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .fact-label-box {
    width: 100%;
    min-height: auto;
    padding: 0.4rem;
  }
  
  .fact-value-box {
    width: 100%;
    min-height: auto;
    text-align: center;
    justify-content: center;
    padding: 0.6rem;
  }
  
  .slider-stage {
    min-height: 120px;
  }
}
</style>
