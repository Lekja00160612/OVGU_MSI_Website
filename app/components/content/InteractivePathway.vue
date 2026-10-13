<!--
  Component: InteractivePathway
  Description: Interactive SVG academic pathway explorer with step tabs, animated connector lines, and detail cards.
  Nuxt UI Primitives: UButton, UBadge.
-->
<script setup lang="ts">
import { ref, computed, watch, useId } from 'vue'

interface PathwayNode {
  id: string
  tabId: string
  tabLabel: string
  label: string
  sub?: string
  desc: string
  todoText: string
  link?: string
  color?: string
  arrowColor?: string
  arrowType?: 'solid' | 'dashed'
}

const props = withDefaults(defineProps<{
  nodes?: PathwayNode[]
}>(), {
  nodes: () => []
})

const { locale } = useI18n()

// Active tab and selected node index
const activeTabId = ref('')
const selectedNodeIndex = ref(0)

// Unique filter ID to avoid conflicts when rendering multiple components and ensure valid characters for SVG IDs
const componentId = 'pathway-filter-' + useId().replace(/[^a-zA-Z0-9-_]/g, '')

// Compute tabs dynamically by grouping nodes by tabId
const computedTabs = computed(() => {
  const map = new Map<string, { id: string; label: string; nodes: PathwayNode[] }>()
  props.nodes.forEach((node) => {
    const tabId = node.tabId || 'default'
    const tabLabel = node.tabLabel || tabId
    if (!map.has(tabId)) {
      map.set(tabId, { id: tabId, label: tabLabel, nodes: [] })
    }
    map.get(tabId)!.nodes.push(node)
  })
  return Array.from(map.values())
})

// Initialize/Sync active tab
watch(() => computedTabs.value, (newTabs) => {
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
  return computedTabs.value.find(tab => tab.id === activeTabId.value) || computedTabs.value[0] || null
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

// SVG layout parameters (zigzag circles with titles on top)
const svgWidth = computed(() => {
  if (currentNodes.value.length === 0) return 300
  // Standard gap is 240px. Plus padding at the start (100px) and end (100px).
  return (currentNodes.value.length - 1) * 240 + 200
})

const svgHeight = computed(() => {
  return 210 // More compact height for the zigzag pathway
})

const layoutNodes = computed(() => {
  const r = 28 // Circle radius
  const xGap = 240 // Horizontal gap
  const yTop = 70 // Top row Y coordinate
  const yBottom = 150 // Bottom row Y coordinate

  return currentNodes.value.map((node, i) => {
    const cx = 100 + i * xGap
    const cy = i % 2 === 0 ? yTop : yBottom

    return {
      ...node,
      index: i,
      cx,
      cy,
      r
    }
  })
})

const layoutArrows = computed(() => {
  const arrows = []
  const nodes = layoutNodes.value
  const markerOffset = 8 // Space before circle boundary for the arrow marker

  for (let i = 0; i < nodes.length - 1; i++) {
    const fromNode = nodes[i]
    const toNode = nodes[i + 1]

    const dx = toNode.cx - fromNode.cx
    const dy = toNode.cy - fromNode.cy
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist > 0) {
      const ux = dx / dist
      const uy = dy / dist

      // Start at fromNode boundary
      const startX = fromNode.cx + fromNode.r * ux
      const startY = fromNode.cy + fromNode.r * uy

      // End at toNode boundary (taking markerOffset into account)
      const endX = toNode.cx - (toNode.r + markerOffset) * ux
      const endY = toNode.cy - (toNode.r + markerOffset) * uy

      // Calculate control point for organic curvature
      const mx = (startX + endX) / 2
      const my = (startY + endY) / 2
      const px = -uy
      const py = ux
      
      // Alternate curvature to create a beautiful flowing wave
      const curveOffset = i % 2 === 0 ? -25 : 25
      const controlX = mx + px * curveOffset
      const controlY = my + py * curveOffset

      const d = `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`

      arrows.push({
        d,
        color: fromNode.arrowColor || fromNode.color || 'var(--color-primary)',
        type: fromNode.arrowType || 'dashed'
      })
    }
  }

  return arrows
})
</script>

<template>
  <div class="w-full flex flex-col gap-6 my-6 font-sans" v-if="nodes && nodes.length > 0">
    <!-- Pathway Guide Header -->
    <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs text-center max-w-xl mx-auto w-full flex flex-col items-center gap-1">
      <h3 class="text-lg font-extrabold text-slate-900 m-0">
        <template v-if="locale === 'vi'">
          <span class="text-orange-600 font-extrabold">{{ currentNodes.length }} bước</span> trên hành trình của bạn
        </template>
        <template v-else>
          <span class="text-orange-600 font-extrabold">{{ currentNodes.length }} steps</span> on your journey
        </template>
      </h3>
      <p class="text-sm text-slate-600 font-medium leading-relaxed m-0">
        {{ locale === 'vi' ? 'Theo dõi sơ đồ lộ trình dưới đây để chuẩn bị các thủ tục cần thiết.' : 'Follow the roadmap below to understand the process and prepare your steps.' }}
      </p>
    </div>

    <!-- Custom Tab Switcher Grid (Navy Active & Slate Inactive for high contrast) -->
    <div class="flex flex-wrap justify-center gap-2.5 mb-2">
      <button
        v-for="tab in computedTabs"
        :key="tab.id"
        type="button"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer shadow-2xs"
        :class="activeTabId === tab.id
          ? 'bg-[#1E3A5F] text-white shadow-sm ring-1 ring-[#1E3A5F]'
          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/90'"
        @click="activeTabId = tab.id"
      >
        <UIcon name="i-lucide-route" class="size-4" :class="activeTabId === tab.id ? 'text-orange-400' : 'text-slate-500'" />
        <span>{{ tab.label }}</span>
      </button>
    </div>

    <!-- Main Workspace Layout -->
    <div class="w-full flex flex-col gap-6">
      <!-- 1. Visual SVG Pathway (Horizontal & Scrollable) -->
      <div class="w-full bg-slate-50 border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-inner overflow-x-auto">
        <div class="flex justify-center min-w-fit mx-auto">
          <svg :viewBox="`0 0 ${svgWidth} ${svgHeight}`" :style="{ width: svgWidth + 'px', height: svgHeight + 'px' }">
            <defs>
              <marker
                id="marker-arrow"
                viewBox="0 0 10 10"
                refX="6" refY="5"
                markerWidth="6" markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#1E3A5F" />
              </marker>
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
            />

            <!-- Draw Step Nodes -->
            <g
              v-for="node in layoutNodes"
              :key="node.id"
              class="cursor-pointer transition-transform hover:scale-105"
              @click="selectedNodeIndex = node.index"
            >
              <!-- Node Circle -->
              <circle
                :cx="node.cx" :cy="node.cy" :r="node.r"
                :fill="selectedNodeIndex === node.index ? '#E87722' : (node.color || '#1E3A5F')"
                :stroke="selectedNodeIndex === node.index ? '#C95E0A' : 'transparent'"
                stroke-width="3.5"
              />
              
              <!-- Number Index -->
              <text
                :x="node.cx" :y="node.cy + 6"
                fill="#ffffff"
                font-size="16"
                font-weight="900"
                text-anchor="middle"
              >{{ node.index + 1 }}</text>

              <!-- Node Labels (centered on top of the circle) -->
              <text
                :x="node.cx" :y="node.cy - node.r - 20"
                :fill="selectedNodeIndex === node.index ? '#E87722' : '#0F2240'"
                font-size="12.5"
                font-weight="800"
                text-anchor="middle"
              >{{ node.label }}</text>
              
              <text
                :x="node.cx" :y="node.cy - node.r - 6"
                fill="#64748B"
                font-size="10"
                font-weight="600"
                text-anchor="middle"
                v-if="node.sub"
              >{{ node.sub }}</text>
            </g>
          </svg>
        </div>
      </div>

      <!-- 2. Detail View Panel (Stabilized Height to Prevent CLS) -->
      <div
        v-if="activeNode"
        class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between max-w-2xl mx-auto w-full min-h-[380px] sm:min-h-[340px] transition-all duration-200"
      >
        <div class="flex flex-col gap-3">
          <div>
            <UBadge color="neutral" variant="subtle" size="sm" class="mb-2 font-bold text-slate-700">
              {{ locale === 'vi' ? `Bước ${selectedNodeIndex + 1} của ${currentNodes.length}` : `Step ${selectedNodeIndex + 1} of ${currentNodes.length}` }}
            </UBadge>
            <h3 class="text-xl sm:text-2xl font-black text-slate-900 mb-1 leading-snug">{{ activeNode.label }}</h3>
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider block" v-if="activeNode.sub">{{ activeNode.sub }}</span>
          </div>

          <div class="flex flex-col gap-4 text-sm text-slate-700 leading-relaxed">
            <!-- Dynamic Parsed Markdown Content -->
            <div class="prose max-w-none text-slate-700 text-sm leading-relaxed" v-html="parseMarkdown(activeNode.desc)"></div>

            <!-- Static Guidance Box: Reassuring Slate Neutral Card -->
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-start gap-3.5 my-1">
              <div class="size-8 rounded-xl bg-slate-200/80 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 ring-1 ring-slate-300/50">
                <UIcon name="i-lucide-clipboard-check" class="size-4.5" />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  {{ locale === 'vi' ? 'Hướng dẫn / Chuẩn bị:' : 'Guidance / Preparation:' }}
                </h4>
                <p class="text-xs sm:text-sm font-medium text-slate-700 m-0 leading-relaxed">{{ activeNode.todoText }}</p>
              </div>
            </div>

            <!-- Official Website Button Link: Vibrant VGU Orange CTA -->
            <div v-if="activeNode.link && activeNode.link !== '#'" class="mt-2">
              <UButton
                :to="activeNode.link"
                target="_blank"
                external
                color="primary"
                variant="solid"
                size="md"
                block
                trailing-icon="i-lucide-external-link"
                class="font-bold rounded-xl justify-center shadow-xs !text-white text-white"
              >
                {{ locale === 'vi' ? 'Đi đến Cổng Thông Tin Chính Thức' : 'Visit Official Portal / Resource' }}
              </UButton>
            </div>
          </div>
        </div>

        <!-- 3. Navigation Buttons for easy progression (Locked at bottom of card) -->
        <div class="flex justify-between items-center gap-3 pt-6 mt-4 border-t border-slate-100">
          <UButton
            color="neutral"
            variant="outline"
            size="sm"
            icon="i-lucide-chevron-left"
            class="font-semibold rounded-xl cursor-pointer"
            :disabled="selectedNodeIndex === 0"
            @click="prevNode"
          >
            {{ locale === 'vi' ? 'Trước' : 'Prev' }}
          </UButton>
          <UButton
            color="primary"
            variant="solid"
            size="sm"
            trailing-icon="i-lucide-chevron-right"
            class="font-semibold rounded-xl shadow-xs text-white cursor-pointer"
            :disabled="selectedNodeIndex === currentNodes.length - 1"
            @click="nextNode"
          >
            {{ locale === 'vi' ? 'Tiếp theo' : 'Next' }}
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
