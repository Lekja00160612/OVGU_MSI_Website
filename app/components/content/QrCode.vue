<!--
  Component: QrCode
  Description: Generates and renders a scalable SVG QR code with customizable colors and margins.
-->
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
      width: 500, // High-resolution vector coordinate space
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

watch([() => props.value, () => props.colorDark, () => props.colorLight], () => {
  generateQr()
})
</script>

<template>
  <div class="inline-block w-full h-full [&_svg]:w-full [&_svg]:h-full [&_svg]:block" v-html="qrSvg" />
</template>
