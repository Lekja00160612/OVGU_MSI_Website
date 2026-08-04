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
  <div class="thesis-topics-section">
    <!-- Header & Professional Guidance Text -->
    <div class="thesis-header text-left">
      <div class="header-top-row">
        <h2 class="thesis-title">Master’s Thesis Topics & Research Opportunities</h2>
        <span class="topic-count-badge">{{ filteredTopics.length }} Topics Offered</span>
      </div>
      <p class="thesis-intro">
        Master’s Thesis projects are conducted under the academic supervision of participating chairs and research groups at OVGU and VGU. Students are encouraged to contact individual module lecturers or department professors directly to discuss topic availability or propose research directions — the list below outlines representative thesis offers across our core specialization modules.
      </p>
    </div>

    <!-- Search Input Bar -->
    <div class="search-box-wrapper mb-4">
      <div class="search-box-input-group">
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="Search in thesis offers"
          aria-label="Search in thesis offers"
        />
        <button type="button" class="search-btn" aria-label="Search">
          <svg class="w-5 h-5 search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Accordion List Container: Scrollable box with max-height -->
    <div class="thesis-accordion-box custom-scrollbar">
      <div v-if="filteredTopics.length === 0" class="no-topics-found">
        No thesis topics found matching "{{ searchQuery }}".
      </div>

      <div
        v-for="(topic, idx) in filteredTopics"
        :key="topic.id"
        class="thesis-accordion-item"
        :class="{ 'thesis-accordion-item--open': isOpen(topic.id) }"
      >
        <!-- Item Header -->
        <button
          type="button"
          class="thesis-item-header"
          @click="toggleTopic(topic.id)"
          :aria-expanded="isOpen(topic.id)"
        >
          <span class="thesis-item-title">
            <strong class="topic-index">[{{ idx + 1 }}]</strong> {{ topic.title }}
          </span>
          <span class="accordion-icon">{{ isOpen(topic.id) ? '−' : '+' }}</span>
        </button>

        <!-- Item Expandable Content -->
        <div v-if="isOpen(topic.id)" class="thesis-item-content fade-in">
          <div class="module-badge-tag">
            <span class="badge-dot"></span> {{ topic.module }}
          </div>
          
          <p class="topic-desc">{{ topic.description }}</p>

          <div v-if="topic.tasks && topic.tasks.length > 0" class="topic-tasks-section">
            <h4 class="tasks-heading">Candidate Tasks & Key Objectives:</h4>
            <ul class="tasks-list">
              <li v-for="(task, tIdx) in topic.tasks" :key="tIdx">
                {{ task }}
              </li>
            </ul>
          </div>

          <div class="topic-contact-note">
            💡 <em>Interested in this research project or wishing to propose a related topic? Please reach out directly to the responsible module lecturer or department chair.</em>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.thesis-topics-section {
  width: 100%;
  max-width: 1050px;
  margin: 3.5rem auto 4rem auto;
  font-family: var(--font-sans, inherit);
}

.thesis-header {
  margin-bottom: 1.5rem;
}

.header-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
}

.thesis-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--color-primary-dark, #1E3A5F);
  margin: 0;
}

.topic-count-badge {
  font-size: 0.75rem;
  font-weight: 700;
  color: #1E3A5F;
  background: rgba(30, 58, 95, 0.08);
  border: 1px solid rgba(30, 58, 95, 0.15);
  padding: 0.3rem 0.75rem;
  border-radius: 20px;
  letter-spacing: 0.03em;
  white-space: nowrap;
}

.thesis-intro {
  font-size: 0.98rem;
  color: var(--color-gray-700, #4A5568);
  line-height: 1.65;
  max-width: 960px;
}

/* Search Box matching the image */
.search-box-wrapper {
  width: 100%;
}

.search-box-input-group {
  display: flex;
  align-items: center;
  border: 1px solid #CBD5E1;
  border-radius: 6px;
  background: #ffffff;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-box-input-group:focus-within {
  border-color: #0A2540;
  box-shadow: 0 0 0 3px rgba(10, 37, 64, 0.1);
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0.85rem 1.25rem;
  font-size: 0.95rem;
  color: #1A202C;
  background: transparent;
}

.search-input::placeholder {
  color: #94A3B8;
}

.search-btn {
  background: #ffffff;
  border: none;
  border-left: 1px solid #E2E8F0;
  padding: 0.85rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748B;
  transition: background 0.2s, color 0.2s;
}

.search-btn:hover {
  background: #F8FAFC;
  color: #0A2540;
}

.search-icon {
  width: 20px;
  height: 20px;
}

/* Accordion Box: Light blue background with left accent border and scrollable fixed height */
.thesis-accordion-box {
  background-color: #EBF3FA; /* Light blue box matching attached image */
  border-left: 5px solid #1E3A5F; /* Thick blue left accent border */
  border-radius: 6px;
  padding: 0.25rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  max-height: 460px; /* Limits visible topics to ~4 header rows, rest scrollable */
  overflow-y: auto;
  scroll-behavior: smooth;
}

/* Custom polished scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(30, 58, 95, 0.05);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(30, 58, 95, 0.25);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(30, 58, 95, 0.45);
}

.no-topics-found {
  padding: 2rem;
  text-align: center;
  color: #64748B;
  font-size: 0.95rem;
}

.thesis-accordion-item {
  border-bottom: 1px solid rgba(30, 58, 95, 0.12);
  transition: background-color 0.2s ease;
}

.thesis-accordion-item:last-child {
  border-bottom: none;
}

.thesis-item-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.1rem 1.5rem;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease;
}

.thesis-item-header:hover {
  background-color: rgba(30, 58, 95, 0.06);
}

.thesis-item-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #1A202C;
  line-height: 1.4;
  padding-right: 1rem;
}

.topic-index {
  color: #1E3A5F;
  margin-right: 0.35rem;
}

.accordion-icon {
  font-size: 1.35rem;
  font-weight: 400;
  color: #2D3748;
  flex-shrink: 0;
  line-height: 1;
  width: 24px;
  text-align: center;
}

/* Expandable Content Area */
.thesis-item-content {
  padding: 0.5rem 1.5rem 1.5rem 1.5rem;
  color: #2D3748;
  font-size: 0.95rem;
  line-height: 1.65;
}

.module-badge-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #1E3A5F;
  background: rgba(30, 58, 95, 0.1);
  padding: 0.25rem 0.65rem;
  border-radius: 4px;
  margin-bottom: 0.85rem;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #E87722;
}

.topic-desc {
  margin-bottom: 1rem;
  color: #334155;
}

.topic-tasks-section {
  background: #ffffff;
  border-radius: 6px;
  padding: 1rem 1.25rem;
  border: 1px solid #E2E8F0;
  margin-bottom: 1rem;
}

.tasks-heading {
  font-size: 0.88rem;
  font-weight: 700;
  color: #1E3A5F;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.tasks-list {
  list-style-type: disc;
  padding-left: 1.25rem;
  margin: 0;
}

.tasks-list li {
  margin-bottom: 0.4rem;
  font-size: 0.92rem;
  color: #475569;
}

.tasks-list li:last-child {
  margin-bottom: 0;
}

.topic-contact-note {
  font-size: 0.85rem;
  color: #475569;
  background: rgba(232, 119, 34, 0.08);
  border-left: 3px solid #E87722;
  padding: 0.6rem 0.9rem;
  border-radius: 0 4px 4px 0;
}

.fade-in {
  animation: fadeIn 0.25s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
