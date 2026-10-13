<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { thesisTopics, type ThesisTopic } from '~/data/thesisTopics'
import { getModuleSlug } from '~/utils/faculty'

const route = useRoute()
const localePath = useLocalePath()
const { locale } = useI18n()

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

function syncFromRoute() {
  let target = ''

  // 1. Check URL hash (e.g. #glass)
  if (route.hash) {
    const raw = route.hash.replace(/^#/, '').trim().toLowerCase()
    const matched = thesisTopics.find(t => getModuleSlug(t.module) === raw)
    if (matched) {
      target = matched.module
    } else if (raw) {
      target = raw
    }
  }

  // 2. Fallback to query param
  if (!target && (route.query.module || route.query.search)) {
    target = ((route.query.module as string) || (route.query.search as string)).trim()
  }

  if (target) {
    searchQuery.value = target
    openTopicIds.value = thesisTopics
      .filter(t => t.module.toLowerCase().includes(target.toLowerCase()) || t.title.toLowerCase().includes(target.toLowerCase()))
      .map(t => t.id)
  }
}

onMounted(() => {
  syncFromRoute()
})

watch(() => [route.hash, route.query], () => {
  syncFromRoute()
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
          {{ locale === 'vi' ? 'Đề Tài Luận Văn Thạc Sĩ & Cơ Hội Nghiên Cứu' : 'Master’s Thesis Topics & Research Opportunities' }}
        </h2>
        <UBadge color="primary" variant="subtle" size="md" class="font-bold rounded-full">
          {{ filteredTopics.length }} {{ locale === 'vi' ? 'Đề Tài' : 'Topics Offered' }}
        </UBadge>
      </div>
      <p class="text-slate-600 text-sm leading-relaxed max-w-4xl">
        {{ locale === 'vi'
          ? 'Các dự án luận văn thạc sĩ được thực hiện dưới sự hướng dẫn học thuật từ các bộ môn và nhóm nghiên cứu tại OVGU Magdeburg và VGU. Học viên có thể liên hệ trực tiếp với giảng viên phụ trách môn học để trao đổi về đề tài hoặc đề xuất hướng nghiên cứu mong muốn.'
          : 'Master’s Thesis projects are conducted under the academic supervision of participating chairs and research groups at OVGU and VGU. Students are encouraged to contact individual module lecturers or department professors directly to discuss topic availability or propose research directions — the list below outlines representative thesis offers across our core specialization modules.'
        }}
      </p>
    </div>

    <!-- Search Input Bar with Nuxt UI UInput -->
    <div class="mb-6 flex flex-col gap-2">
      <div class="flex items-center gap-3">
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          size="lg"
          :placeholder="locale === 'vi' ? 'Tìm kiếm đề tài theo từ khóa, môn học, giáo sư hướng dẫn...' : 'Search thesis topics by keyword, module, or supervisor...'"
          class="w-full"
          :ui="{ root: 'w-full' }"
        />
        <UButton
          v-if="searchQuery"
          color="neutral"
          variant="subtle"
          size="lg"
          icon="i-lucide-x"
          class="shrink-0 font-bold"
          @click="searchQuery = ''"
        >
          {{ locale === 'vi' ? 'Xem tất cả' : 'Show All' }}
        </UButton>
      </div>

      <div v-if="searchQuery" class="flex items-center gap-2 px-1 text-xs text-slate-500">
        <span>{{ locale === 'vi' ? 'Đang lọc theo:' : 'Filtered by:' }} <strong class="text-orange-600 font-bold">{{ searchQuery }}</strong></span>
      </div>
    </div>

    <!-- Accordion List Container -->
    <div class="flex flex-col gap-3">
      <div v-if="filteredTopics.length === 0" class="text-center py-12 text-slate-500 bg-white rounded-3xl border border-slate-200 text-sm shadow-xs">
        <p>{{ locale === 'vi' ? `Không tìm thấy đề tài phù hợp với "${searchQuery}".` : `No thesis topics found matching "${searchQuery}".` }}</p>
        <UButton
          color="primary"
          variant="soft"
          size="sm"
          class="mt-3 font-bold"
          @click="searchQuery = ''"
        >
          {{ locale === 'vi' ? 'Xem tất cả đề tài' : 'View all topics' }}
        </UButton>
      </div>

      <div
        v-for="(topic, idx) in filteredTopics"
        :key="topic.id"
        class="bg-white border rounded-3xl transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md"
        :class="isOpen(topic.id) ? 'border-primary-400 ring-1 ring-primary-400/20 shadow-md' : 'border-slate-200/90 hover:border-slate-300'"
      >
        <!-- Item Header -->
        <button
          type="button"
          class="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-slate-900 hover:bg-slate-50/50 transition-colors cursor-pointer gap-4"
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
            <!-- Normalized clickable module chip linking with clean hash (#slug) -->
            <NuxtLink
              :to="`${localePath('/program-structure/modules')}#${getModuleSlug(topic.module)}`"
              class="inline-block group/badge"
              :title="`View ${topic.module} module syllabus in handbook`"
            >
              <span
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 bg-slate-50 hover:bg-orange-500 hover:text-white border border-slate-200/90 hover:border-orange-500 transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer"
              >
                <span>{{ topic.module }}</span>
                <UIcon name="i-lucide-arrow-up-right" class="size-3 text-slate-400 group-hover/badge:text-white transition-colors" />
              </span>
            </NuxtLink>
          </div>
          
          <p class="text-slate-600 leading-relaxed">{{ topic.description }}</p>

          <div v-if="topic.tasks && topic.tasks.length > 0" class="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              {{ locale === 'vi' ? 'Nội dung thực hiện & Mục tiêu trọng tâm:' : 'Candidate Tasks & Key Objectives:' }}
            </h4>
            <ul class="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
              <li v-for="(task, tIdx) in topic.tasks" :key="tIdx">
                {{ task }}
              </li>
            </ul>
          </div>

          <div class="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/70 text-xs text-orange-950 font-medium">
            <UIcon name='i-lucide-info' class='size-4 text-primary-500 inline mr-1' />
            <em>{{ locale === 'vi'
              ? 'Quan tâm đến đề tài nghiên cứu này hoặc muốn đề xuất hướng nghiên cứu mới? Vui lòng liên hệ trực tiếp với giảng viên phụ trách môn học hoặc trưởng bộ môn.'
              : 'Interested in this research project or wishing to propose a related topic? Please reach out directly to the responsible module lecturer or department chair.'
            }}</em>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
