<script setup lang="ts">
import { ref, computed, watch, useId } from 'vue'

interface PathwayNode {
  id: string
  label: string
  sub?: string
  desc: string
  todoText: string
  link?: string
  color?: string
  arrowColor?: string
  arrowType?: 'solid' | 'dashed'
}

interface PathwayTab {
  id: string
  label: string
  nodes: PathwayNode[]
}

const props = withDefaults(defineProps<{
  tabs?: PathwayTab[]
  layout?: 'horizontal' | 'vertical' | 'zigzag'
}>(), {
  tabs: () => [],
  layout: 'zigzag'
})

const { locale } = useI18n()

// Active tab and selected node index
const activeTabId = ref('')
const selectedNodeIndex = ref(0)

// Unique filter ID to avoid conflicts when rendering multiple components and ensure valid characters for SVG IDs
const componentId = 'pathway-filter-' + useId().replace(/[^a-zA-Z0-9-_]/g, '')

// Initialize/Sync active tab
watch(() => props.tabs, (newTabs) => {
  if (newTabs && newTabs.length > 0) {
    if (!activeTabId.value || !newTabs.some(t => t.id === activeTabId.value)) {
      activeTabId.value = newTabs[0].id
    }
  }
}, { immediate: true })

watch(activeTabId, () => {
  selectedNodeIndex.value = 0
})

// Computed properties
const activeTab = computed(() => {
  return props.tabs.find(tab => tab.id === activeTabId.value) || props.tabs[0] || null
})

const currentNodes = computed<PathwayNode[]>(() => {
  return activeTab.value ? activeTab.value.nodes : []
})

const activeNode = computed<PathwayNode | null>(() => {
  return currentNodes.value[selectedNodeIndex.value] || currentNodes.value[0] || null
})

// Step navigation
function prevNode() {
  if (selectedNodeIndex.value > 0) {
    selectedNodeIndex.value--
  }
}

function nextNode() {
  if (selectedNodeIndex.value < currentNodes.value.length - 1) {
    selectedNodeIndex.value++
  }
}

// Custom simple markdown compiler to render html safely inside the detail card
function parseMarkdown(text: string): string {
  if (!text) return ''
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  
  // Bold (**bold**)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  
  // Links ([text](url))
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener" class="md-link">$1</a>')
  
  // Lists (- item)
  const lines = html.split('\n')
  let inList = false
  const processedLines = lines.map(line => {
    const trimmed = line.trim()
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const content = trimmed.substring(2)
      let prefix = ''
      if (!inList) {
        prefix = '<ul class="md-list">'
        inList = true
      }
      return `${prefix}<li>${content}</li>`
    } else {
      let suffix = ''
      if (inList) {
        suffix = '</ul>'
        inList = false
      }
      if (trimmed === '') {
        return suffix
      }
      return `${suffix}<p class="md-para">${trimmed}</p>`
    }
  })
  
  if (inList) {
    processedLines.push('</ul>')
  }
  
  return processedLines.join('\n')
}

// SVG layout parameters (always horizontal)
const svgWidth = computed(() => {
  if (currentNodes.value.length === 0) return 300
  return currentNodes.value.length * 290 + 20
})

const svgHeight = computed(() => {
  return 170
})

const layoutNodes = computed(() => {
  return currentNodes.value.map((node, i) => {
    const w = 240
    const h = 110
    const gap = 290
    const x = 20 + i * gap
    const y = 30
    const cx = x + 35
    const cy = y + 55
    const r = 18

    return {
      ...node,
      index: i,
      x, y, w, h, cx, cy, r
    }
  })
})

const layoutArrows = computed(() => {
  const arrows = []
  const nodes = layoutNodes.value

  for (let i = 0; i < nodes.length - 1; i++) {
    const fromNode = nodes[i]
    const toNode = nodes[i + 1]
    
    const startX = fromNode.x + fromNode.w
    const startY = fromNode.y + fromNode.h / 2
    const endX = toNode.x
    const endY = toNode.y + toNode.h / 2

    const d = `M ${startX} ${startY} L ${endX} ${endY}`

    arrows.push({
      d,
      color: fromNode.arrowColor || fromNode.color || 'var(--color-primary)',
      type: fromNode.arrowType || 'dashed'
    })
  }

  return arrows
})
</script>

<template>
  <div class="interactive-pathway-widget" v-if="tabs && tabs.length > 0">
    <!-- Pathway Guide Header -->
    <div class="guide-header-card">
      <h3 class="guide-title">
        <template v-if="locale === 'vi'">
          <span class="guide-accent-text">{{ currentNodes.length }} bước</span> trên hành trình của bạn
        </template>
        <template v-else>
          <span class="guide-accent-text">{{ currentNodes.length }} steps</span> on your journey
        </template>
      </h3>
      <p class="guide-subtitle">
        {{ locale === 'vi' ? 'Theo dõi sơ đồ lộ trình dưới đây để chuẩn bị các thủ tục cần thiết.' : 'Follow the roadmap below to understand the process and prepare your steps.' }}
      </p>
    </div>

    <!-- Custom Tab Switcher Grid -->
    <div class="tabs-grid" :style="{ '--tabs-count': tabs.length }">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="tab-btn"
        :class="{ 'tab-btn--active': activeTabId === tab.id }"
        @click="activeTabId = tab.id"
      >
        <span class="tab-btn-icon">📋</span>
        <span class="tab-btn-label">{{ tab.label }}</span>
      </button>
    </div>

    <!-- Main Workspace Layout -->
    <div class="workspace-layout">
      <!-- 1. Visual SVG Pathway (Horizontal & Scrollable) -->
      <div class="pathway-visualizer">
        <div class="visualizer-header">
          <span class="visualizer-hint">
            {{ locale === 'vi' ? '👉 Click vào các bước để xem hướng dẫn chi tiết' : '👉 Click steps to inspect details & guidance' }}
          </span>
        </div>
        
        <div class="svg-scroll-container">
          <svg :viewBox="`0 0 ${svgWidth} ${svgHeight}`" class="excalidraw-svg" :style="{ width: svgWidth + 'px', height: svgHeight + 'px' }">
            <defs>
              <marker
                id="marker-arrow"
                viewBox="0 0 10 10"
                refX="6" refY="5"
                markerWidth="6" markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--color-primary)" />
              </marker>
              <!-- Rough hand-drawn effect overlay filter -->
              <filter :id="componentId" x="-10%" y="-10%" width="120%" height="120%">
                <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>

            <!-- Draw Connection Arrows -->
            <path
              v-for="(arrow, index) in layoutArrows"
              :key="'arrow-' + index"
              :d="arrow.d"
              fill="none"
              :stroke="arrow.color"
              stroke-width="3"
              :stroke-dasharray="arrow.type === 'dashed' ? '6,5' : 'none'"
              marker-end="url(#marker-arrow)"
              :filter="componentId ? `url(#${componentId})` : 'none'"
            />

            <!-- Draw Step Nodes -->
            <g
              v-for="node in layoutNodes"
              :key="node.id"
              class="svg-node-group"
              style="cursor: pointer;"
              @click="selectedNodeIndex = node.index"
            >
              <!-- Box -->
              <rect
                :x="node.x" :y="node.y" :width="node.w" :height="node.h"
                rx="14"
                fill="#ffffff"
                :stroke="selectedNodeIndex === node.index ? 'var(--color-accent)' : (node.color || 'var(--color-primary)')"
                :stroke-width="selectedNodeIndex === node.index ? 3.5 : 2.5"
                :filter="componentId ? `url(#${componentId})` : 'none'"
                class="node-rect-elem"
              />
              
              <!-- Circle Number Index -->
              <circle
                :cx="node.cx" :cy="node.cy" :r="node.r"
                :fill="selectedNodeIndex === node.index ? 'var(--color-accent)' : (node.color || 'var(--color-primary)')"
                :filter="componentId ? `url(#${componentId})` : 'none'"
              />
              
              <text
                :x="node.cx" :y="node.cy + 5"
                fill="#ffffff"
                font-size="12"
                font-weight="800"
                text-anchor="middle"
              >{{ node.index + 1 }}</text>

              <!-- Node Labels text -->
              <text
                :x="node.cx + node.r + 12" :y="node.cy - 5"
                :fill="selectedNodeIndex === node.index ? 'var(--color-accent-dark)' : 'var(--color-primary-dark)'"
                font-size="13"
                font-weight="800"
              >{{ node.label }}</text>
              
              <text
                :x="node.cx + node.r + 12" :y="node.cy + 13"
                fill="var(--color-gray-500)"
                font-size="10.5"
                font-weight="500"
                v-if="node.sub"
              >{{ node.sub }}</text>
            </g>
          </svg>
        </div>
      </div>

      <!-- 2. Detail View Panel (Fixed Height & Scrollable Vertically) -->
      <div class="detail-panel" v-if="activeNode">
        <div class="detail-panel-inner fade-in" :key="activeNode.id">
          <div class="detail-header">
            <span class="detail-stage-tag">
              {{ locale === 'vi' ? `Bước ${selectedNodeIndex + 1} của ${currentNodes.length}` : `Step ${selectedNodeIndex + 1} of ${currentNodes.length}` }}
            </span>
            <h3 class="detail-node-title">{{ activeNode.label }}</h3>
            <span class="detail-node-sub" v-if="activeNode.sub">{{ activeNode.sub }}</span>
          </div>

          <div class="detail-scrollable-area">
            <!-- Dynamic Parsed Markdown Content -->
            <div class="parsed-markdown-content" v-html="parseMarkdown(activeNode.desc)"></div>

            <!-- Static Guidance Box -->
            <div class="guidance-box">
              <h4 class="guidance-title">
                {{ locale === 'vi' ? '💡 Hướng dẫn / Chuẩn bị:' : '💡 Guidance / Preparation:' }}
              </h4>
              <p class="guidance-text">{{ activeNode.todoText }}</p>
            </div>

            <!-- Official Website Button Link -->
            <div class="link-btn-wrapper" v-if="activeNode.link && activeNode.link !== '#'">
              <UButton
                :to="activeNode.link"
                target="_blank"
                external
                color="primary"
                variant="solid"
                size="md"
                block
                icon="i-heroicons-arrow-top-right-on-square-20-solid"
                trailing
              >
                {{ locale === 'vi' ? 'Đi đến Cổng Thông Tin Chính Thức' : 'Visit Official Portal / Resource' }}
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Navigation Buttons for easy progression -->
      <div class="navigation-controls">
        <button
          type="button"
          class="nav-control-btn"
          :disabled="selectedNodeIndex === 0"
          @click="prevNode"
        >
          &larr; {{ locale === 'vi' ? 'Trước' : 'Prev' }}
        </button>
        <button
          type="button"
          class="nav-control-btn nav-control-btn--primary"
          :disabled="selectedNodeIndex === currentNodes.length - 1"
          @click="nextNode"
        >
          {{ locale === 'vi' ? 'Tiếp theo' : 'Next' }} &rarr;
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.interactive-pathway-widget {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 1.5rem 0;
  font-family: var(--font-sans);
}

/* Guide Header Card (More Compact, No Icon) */
.guide-header-card {
  background: #ffffff;
  border: 1px solid var(--color-gray-200, #e9ecef);
  border-radius: var(--radius-lg, 16px);
  padding: 1rem 1.5rem;
  box-shadow: var(--shadow-sm);
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.guide-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--color-primary-dark, #0F2240);
  margin: 0;
}

.guide-subtitle {
  font-size: 0.88rem;
  color: var(--color-gray-600, #6c757d);
  font-weight: 500;
  line-height: 1.4;
  margin: 0;
}

.guide-accent-text {
  color: var(--color-accent, #E87722);
  font-weight: 800;
}

/* Custom Tab Switcher */
.tabs-grid {
  display: grid;
  grid-template-columns: repeat(var(--tabs-count, 2), 1fr);
  gap: 1rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.tab-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.85rem 1rem;
  background: #ffffff;
  border: 2px solid var(--color-gray-200, #e9ecef);
  border-radius: var(--radius-md, 12px);
  cursor: pointer;
  transition: all var(--duration-base) var(--ease-out);
  box-shadow: var(--shadow-xs);
  text-align: center;
}

.tab-btn:hover {
  border-color: var(--color-primary-light, #2E5280);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.tab-btn--active {
  border-color: var(--color-accent, #E87722);
  background: var(--color-accent-50, #FFF4EB);
  box-shadow: var(--shadow-accent);
}

.tab-btn-icon {
  font-size: 1.1rem;
}

.tab-btn-label {
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--color-primary-dark, #0F2240);
}

.tab-btn--active .tab-btn-label {
  color: var(--color-accent-dark, #C95E0A);
}

/* Main Workspace Layout */
.workspace-layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

/* Visualizer (SVG scrollable) */
.pathway-visualizer {
  background: #ffffff;
  border: 1px solid var(--color-gray-200, #e9ecef);
  border-radius: var(--radius-xl, 16px);
  padding: 1.25rem 1.5rem;
  box-shadow: var(--shadow-sm);
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.visualizer-header {
  text-align: center;
}

.visualizer-hint {
  font-size: 0.8rem;
  font-weight: 800;
  color: var(--color-primary-light, #2E5280);
  background: var(--color-primary-50, #EEF3FB);
  padding: 0.3rem 0.85rem;
  border-radius: var(--radius-full);
}

.svg-scroll-container {
  width: 100%;
  overflow-x: auto;
  padding: 0.5rem 0;
  -webkit-overflow-scrolling: touch;
  display: flex;
  justify-content: flex-start;
  scrollbar-width: thin;
  scrollbar-color: var(--color-gray-300, #cbd5e1) transparent;
}

.svg-scroll-container::-webkit-scrollbar {
  height: 6px;
}

.svg-scroll-container::-webkit-scrollbar-track {
  background: transparent;
}

.svg-scroll-container::-webkit-scrollbar-thumb {
  background-color: var(--color-gray-300, #cbd5e1);
  border-radius: 3px;
}

.excalidraw-svg {
  flex-shrink: 0;
}

.node-rect-elem {
  transition: all var(--duration-fast) ease;
}

.svg-node-group:hover .node-rect-elem {
  stroke-width: 4px;
}

/* Detail Panel (Fixed Height & Scrollable Vertically) */
.detail-panel {
  background: #ffffff;
  border: 1px solid var(--color-gray-200, #e9ecef);
  border-radius: var(--radius-xl, 16px);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  height: 380px;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.detail-panel-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.detail-header {
  flex-shrink: 0;
  border-bottom: 1px solid var(--color-gray-100, #f1f3f5);
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;
}

.detail-stage-tag {
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-accent, #E87722);
}

.detail-node-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--color-primary-dark, #0F2240);
  line-height: 1.25;
  margin: 0.15rem 0 0 0;
}

.detail-node-sub {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-gray-500);
  display: block;
  margin-top: 0.15rem;
}

.detail-scrollable-area {
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  scrollbar-width: thin;
  scrollbar-color: var(--color-gray-300, #cbd5e1) transparent;
}

.detail-scrollable-area::-webkit-scrollbar {
  width: 5px;
}

.detail-scrollable-area::-webkit-scrollbar-track {
  background: transparent;
}

.detail-scrollable-area::-webkit-scrollbar-thumb {
  background-color: var(--color-gray-300, #cbd5e1);
  border-radius: 3px;
}

/* Compiled Markdown layout styles */
.parsed-markdown-content :deep(.md-para) {
  font-size: 0.92rem;
  color: var(--color-gray-700);
  line-height: 1.6;
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.parsed-markdown-content :deep(.md-para:last-child) {
  margin-bottom: 0;
}

.parsed-markdown-content :deep(.md-list) {
  list-style-type: none;
  padding-left: 0;
  margin: 0.75rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.parsed-markdown-content :deep(.md-list li) {
  padding-left: 1.25rem;
  position: relative;
  font-size: 0.88rem;
  color: var(--color-gray-700);
  font-weight: 500;
}

.parsed-markdown-content :deep(.md-list li::before) {
  content: '▸';
  position: absolute;
  left: 0;
  color: var(--color-accent);
  font-weight: 800;
}

.parsed-markdown-content :deep(.md-link) {
  color: var(--color-accent);
  text-decoration: none;
  font-weight: 700;
  border-bottom: 1.5px dashed var(--color-accent);
  transition: all var(--duration-fast);
}

.parsed-markdown-content :deep(.md-link:hover) {
  color: var(--color-accent-dark);
  border-bottom-style: solid;
}

/* Guidance box (replaces progress checklist) */
.guidance-box {
  background: var(--color-gray-50, #f8f9fa);
  border: 1px solid var(--color-gray-200, #e9ecef);
  border-radius: var(--radius-md, 10px);
  padding: 1rem;
}

.guidance-title {
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-primary-light, #2E5280);
  margin: 0 0 0.5rem 0;
}

.guidance-text {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--color-gray-800, #343a40);
  line-height: 1.4;
  margin: 0;
}

.link-btn-wrapper {
  width: 100%;
}

/* Navigation control buttons */
.navigation-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  width: 100%;
}

.nav-control-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  font-weight: 800;
  border-radius: var(--radius-md, 10px);
  background: #ffffff;
  border: 1.5px solid var(--color-gray-200, #e9ecef);
  color: var(--color-gray-700);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.nav-control-btn:hover:not(:disabled) {
  border-color: var(--color-gray-400);
  background: var(--color-gray-50);
}

.nav-control-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.nav-control-btn--primary {
  background: var(--color-accent-50, #FFF4EB);
  border-color: rgba(232, 119, 34, 0.2);
  color: var(--color-accent-dark, #C95E0A);
}

.nav-control-btn--primary:hover:not(:disabled) {
  background: var(--color-accent-100, #FFE5D1);
  border-color: var(--color-accent);
}

/* Fade animation */
.fade-in {
  animation: fadeIn 280ms ease forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
