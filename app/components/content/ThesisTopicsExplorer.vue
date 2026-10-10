<script setup lang="ts">
import { ref, computed } from 'vue'
import { thesisTopics, type ThesisTopic } from '~/data/thesisTopics'

const searchQuery = ref('')
const openTopicIds = ref<number[]>([])

const filteredTopics = computed(() => {
  if (!searchQuery.value.trim()) return thesisTopics
  const query = searchQuery.value.toLowerCase().trim()
  return thesisTopics.filter(topic =>
    topic.title.toLowerCase().includes(query) ||
    topic.module.toLowerCase().includes(query) ||
    topic.description.toLowerCase().includes(query) ||
    topic.tasks.some(task => task.toLowerCase().includes(query))
  )
})

function toggleTopic(id: number) {
  if (openTopicIds.value.includes(id)) {
    openTopicIds.value = openTopicIds.value.filter(i => i !== id)
  } else {
    openTopicIds.value.push(id)
  }
}

function isOpen(id: number) {
  return openTopicIds.value.includes(id)
}
</script>

<template>
  <div class="w-full max-w-5xl mx-auto my-12 font-sans">
    <!-- Header & Guidance Text -->
    <div class="mb-6">
      <div class="flex items-center justify-between gap-4 flex-wrap mb-3">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Master’s Thesis Topics & Research Opportunities
        </h2>
        <UBadge color="primary" variant="subtle" size="md" class="font-bold rounded-full">
          {{ filteredTopics.length }} Topics Offered
        </UBadge>
      </div>
      <p class="text-slate-600 text-sm leading-relaxed max-w-4xl">
        Master’s Thesis projects are conducted under the academic supervision of participating chairs and research groups at OVGU and VGU. Students are encouraged to contact individual module lecturers or department professors directly to discuss topic availability or propose research directions — the list below outlines representative thesis offers across our core specialization modules.
      </p>
    </div>

    <!-- Search Input Bar with Nuxt UI UInput -->
    <div class="mb-6">
      <UInput
        v-model="searchQuery"
        icon="i-lucide-search"
        size="lg"
        placeholder="Search thesis topics by keyword, module, or supervisor..."
        class="w-full"
        :ui="{ root: 'w-full' }"
      />
    </div>

    <!-- Accordion List Container -->
    <div class="flex flex-col gap-3">
      <div v-if="filteredTopics.length === 0" class="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 text-sm">
        No thesis topics found matching "{{ searchQuery }}".
      </div>

      <div
        v-for="(topic, idx) in filteredTopics"
        :key="topic.id"
        class="bg-white border rounded-2xl transition-all duration-200 overflow-hidden shadow-xs"
        :class="isOpen(topic.id) ? 'border-primary-400 ring-1 ring-primary-400/20' : 'border-slate-200 hover:border-slate-300'"
      >
        <!-- Item Header -->
        <button
          type="button"
          class="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-slate-900 hover:bg-slate-50/60 transition-colors cursor-pointer gap-4"
          @click="toggleTopic(topic.id)"
          :aria-expanded="isOpen(topic.id)"
        >
          <span class="text-sm sm:text-base flex items-start gap-2">
            <span class="text-primary-600 font-extrabold shrink-0">[{{ idx + 1 }}]</span>
            <span>{{ topic.title }}</span>
          </span>
          <UIcon
            :name="isOpen(topic.id) ? 'i-lucide-minus' : 'i-lucide-plus'"
            class="size-5 text-slate-400 shrink-0 transition-transform"
          />
        </button>

        <!-- Item Expandable Content -->
        <div v-if="isOpen(topic.id)" class="px-5 pb-5 pt-2 border-t border-slate-100 flex flex-col gap-4 text-sm text-slate-700">
          <div>
            <UBadge color="secondary" variant="subtle" size="sm" class="font-semibold">
              {{ topic.module }}
            </UBadge>
          </div>
          
          <p class="text-slate-600 leading-relaxed">{{ topic.description }}</p>

          <div v-if="topic.tasks && topic.tasks.length > 0" class="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Candidate Tasks & Key Objectives:
            </h4>
            <ul class="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
              <li v-for="(task, tIdx) in topic.tasks" :key="tIdx">
                {{ task }}
              </li>
            </ul>
          </div>

          <div class="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200/60 text-xs text-orange-950 font-medium">
            <UIcon name='i-lucide-info' class='size-4 text-primary-500 inline mr-1' /><em>Interested in this research project or wishing to propose a related topic? Please reach out directly to the responsible module lecturer or department chair.</em>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
