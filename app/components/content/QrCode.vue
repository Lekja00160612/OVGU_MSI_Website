<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import QRCode from 'qrcode'

const props = defineProps({
  value: {
    type: String,
    required: true
  },
  margin: {
    type: Number,
    default: 1
  },
  colorDark: {
    type: String,
    default: '#000000'
  },
  colorLight: {
    type: String,
    default: '#ffffff'
  }
})

const qrSvg = ref('')

async function generateQr() {
  if (!props.value) return
  try {
    const svgString = await QRCode.toString(props.value, {
      type: 'svg',
      margin: props.margin,
      width: 500, // Force high-resolution vector coordinate space (prevents blurry upscaling on print)
      color: {
        dark: props.colorDark,
        light: props.colorLight
      }
    })
    qrSvg.value = svgString
  } catch (err) {
    console.error('Failed to generate QR code:', err)
  }
}

onMounted(() => {
  generateQr()
})

watch(() => props.value, () => {
  generateQr()
})
watch(() => props.colorDark, () => {
  generateQr()
})
watch(() => props.colorLight, () => {
  generateQr()
})
</script>

<template>
  <div class="qr-code-wrapper" v-html="qrSvg" />
</template>

<style scoped>
.qr-code-wrapper {
  display: inline-block;
  width: 100%;
  height: 100%;
}
.qr-code-wrapper :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
