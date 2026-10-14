<script setup lang="ts">
import type { NuxtError } from '#app'
import { clearError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <UApp>
    <div class="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
      <!-- Minimal Branded Header -->
      <header class="bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-3">
          <NuxtImg
            src="/Logo/vgu_logo.png"
            alt="VGU Logo"
            class="h-9 sm:h-10 w-auto object-contain"
          />
          <div class="h-5 w-px bg-slate-300 hidden sm:block" />
          <span class="text-sm font-extrabold text-msi-navy tracking-tight hidden sm:inline">MSI Master's Program</span>
        </NuxtLink>
        <UButton
          to="/"
          color="neutral"
          variant="ghost"
          size="sm"
          icon="i-lucide-home"
          class="font-bold rounded-lg"
        >
          Home
        </UButton>
      </header>

      <!-- Main Content -->
      <main class="flex-1 flex items-center justify-center p-4 sm:p-6 text-center">
        <div class="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100 flex flex-col items-center">
          <div class="size-16 sm:size-20 rounded-2xl bg-orange-50 text-primary-500 flex items-center justify-center mb-6 ring-8 ring-orange-50/50">
            <UIcon name="i-lucide-alert-triangle" class="size-8 sm:size-10" />
          </div>

          <h1 class="text-4xl sm:text-5xl font-black text-msi-navy tracking-tight mb-2">
            {{ props.error?.statusCode || 404 }}
          </h1>

          <h2 class="text-lg sm:text-xl font-bold text-slate-900 mb-3">
            {{ props.error?.statusCode === 404 ? 'Page Not Found' : 'Something went wrong' }}
          </h2>

          <p class="text-sm text-slate-600 mb-8 leading-relaxed">
            The page you are looking for does not exist or may have been relocated.
          </p>

          <div class="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <UButton
              color="primary"
              variant="solid"
              size="lg"
              class="font-bold justify-center rounded-xl shadow-xs"
              icon="i-lucide-arrow-left"
              @click="handleError"
            >
              Return Home
            </UButton>
            <UButton
              to="/program-structure"
              color="neutral"
              variant="outline"
              size="lg"
              class="font-bold justify-center rounded-xl"
            >
              Curriculum
            </UButton>
          </div>
        </div>
      </main>

      <!-- Minimal Footer -->
      <footer class="bg-white border-t border-slate-200/80 px-6 py-4 text-center text-xs text-slate-500">
        &copy; {{ new Date().getFullYear() }} Materials Science &amp; Innovation (MSI) &mdash; VGU &amp; OVGU Magdeburg
      </footer>
    </div>
  </UApp>
</template>
