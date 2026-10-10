<!--
  Component: DaadScholarshipCard
  Description: Featured DAAD scholarship card with cover image lightbox, key facts grid, and download actions.
  Nuxt UI Primitives: UButton, UModal.
-->
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
  applicationUrl?: string
  applicationLabel?: string
}>(), {
  labelImage: '/images/scholarships/MSI_DAAD_Label.png',
  opportunityTitle: 'YOUR OPPORTUNITY AT VIETNAMESE-GERMAN UNIVERSITY',
  description: '',
  keyFacts: () => [],
  fileUrl: '',
  fileLabel: 'Download Brochure',
  applicationUrl: '',
  applicationLabel: 'Download Application 2026'
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
  <div class="max-w-2xl mx-auto my-10 bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
    <!-- Cover image container: Flush fit without forced 16:9 ratio -->
    <div class="relative w-full overflow-hidden bg-slate-50 border-b border-slate-100">
      <NuxtImg 
        :src="coverImage" 
        alt="Scholarship Cover" 
        class="w-full h-auto block object-contain"
        placeholder
      />
      <div v-if="labelImage" class="absolute bottom-3 left-4 max-w-[120px] drop-shadow-md">
        <NuxtImg 
          :src="labelImage" 
          alt="DAAD Label Logo" 
          class="h-8 w-auto object-contain"
        />
      </div>
    </div>

    <!-- Opportunity Header -->
    <div class="px-6 pt-6">
      <h3 class="text-xs font-bold tracking-wider uppercase text-slate-500 mb-2">
        {{ opportunityTitle }}
      </h3>
    </div>

    <!-- Description Details -->
    <div class="px-6">
      <p class="text-sm text-slate-600 leading-relaxed">{{ description }}</p>
    </div>

    <!-- Key Facts Slider -->
    <div v-if="keyFacts && keyFacts.length > 0" class="mx-6 my-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
      <div class="text-xs font-bold tracking-wider text-slate-500 uppercase mb-3">
        <h4>KEY FACTS</h4>
      </div>

      <div class="flex items-center justify-between gap-3 min-h-[56px]">
        <!-- Prev Button -->
        <UButton
          icon="i-lucide-chevron-left"
          color="neutral"
          variant="ghost"
          size="sm"
          class="rounded-full shrink-0"
          aria-label="Previous Fact"
          @click="prevFact(); resetTimer()"
        />

        <!-- Slider Content -->
        <div class="flex-1 overflow-hidden">
          <Transition name="fade" mode="out-in">
            <div :key="activeIndex" class="flex flex-col sm:flex-row sm:items-center justify-center gap-1 sm:gap-3 text-center sm:text-left py-1">
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">
                {{ keyFacts[activeIndex]?.label }}
              </span>
              <span class="text-sm font-semibold text-slate-900">
                {{ keyFacts[activeIndex]?.value }}
              </span>
            </div>
          </Transition>
        </div>

        <!-- Next Button -->
        <UButton
          icon="i-lucide-chevron-right"
          color="neutral"
          variant="ghost"
          size="sm"
          class="rounded-full shrink-0"
          aria-label="Next Fact"
          @click="nextFact(); resetTimer()"
        />
      </div>

      <!-- Slide indicators -->
      <div class="flex justify-center items-center gap-1.5 mt-3">
        <button
          v-for="(fact, index) in keyFacts"
          :key="index"
          type="button"
          class="h-1.5 rounded-full transition-all duration-300 cursor-pointer"
          :class="index === activeIndex ? 'w-5 bg-orange-500' : 'w-2 bg-slate-300 hover:bg-slate-400'"
          :aria-label="`Go to fact ${index + 1}`"
          @click="selectFact(index)"
        />
      </div>
    </div>

    <!-- Detail and Application action buttons -->
    <div v-if="applicationUrl || fileUrl" class="p-6 pt-4 flex flex-col sm:flex-row gap-3 mt-auto border-t border-slate-100">
      <UButton 
        v-if="applicationUrl" 
        :href="applicationUrl" 
        download 
        target="_blank"
        external
        rel="noopener noreferrer"
        icon="i-lucide-file-text"
        size="md"
        class="flex-1 justify-center font-bold rounded-xl shadow-sm bg-[#1E3A5F] hover:bg-[#0F2240] text-white cursor-pointer py-2.5 transition-all text-xs sm:text-sm"
      >
        {{ applicationLabel || 'Official Application 2026 (PDF)' }}
      </UButton>
      <UButton 
        v-if="fileUrl" 
        :href="fileUrl" 
        download 
        target="_blank"
        external
        rel="noopener noreferrer"
        icon="i-lucide-download"
        color="neutral"
        variant="outline"
        size="md"
        class="flex-1 justify-center font-bold rounded-xl text-slate-700 hover:text-orange-600 hover:border-orange-500 cursor-pointer py-2.5 transition-all text-xs sm:text-sm"
      >
        {{ fileLabel || 'Download Brochure (PDF)' }}
      </UButton>
    </div>
  </div>
</template>
