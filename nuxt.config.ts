import { readdirSync } from 'fs'
import { join } from 'path'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        { name: 'google-site-verification', content: 'wRP2u_y_uQV0Xm--5w99O6nBEhK1ChT7XyY35vZKYmc' }
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon.ico'
        }
      ]
    }
  },
  hooks: {
    'nitro:config'(nitroConfig) {
      // Automatically discover and push all activity routes into Nitro's prerender queue
      // This official configuration ensures 'nuxi generate' crawls every activity page,
      // which in turn triggers Nuxt Image to process all dynamic and markdown images.
      try {
        const activitiesDir = join(process.cwd(), 'content/_activities')
        const files = readdirSync(activitiesDir)
        
        nitroConfig.prerender = nitroConfig.prerender || {}
        nitroConfig.prerender.routes = nitroConfig.prerender.routes || []
        
        for (const file of files) {
          if (file.endsWith('.md') && !file.startsWith('00-template')) {
            const slug = file.replace('.md', '')
            nitroConfig.prerender.routes.push(`/academic-activities/${slug}`)
            nitroConfig.prerender.routes.push(`/vi/academic-activities/${slug}`)
          }
        }
      } catch (e) {
        console.warn('Could not load activity routes for prerender', e)
      }
    }
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@nuxt/ui', '@nuxt/image', '@nuxt/fonts', '@nuxtjs/i18n', 'nuxt-studio'],
  fonts: {
    defaults: {
      weights: [300, 400, 500, 600, 700, 800],
      styles: ['normal', 'italic']
    }
  },
  css: ['~/assets/css/main.css'],
  colorMode: { preference: 'light' },
  ui: {
    // Tell Nuxt UI v4 where the CSS entry point is (where @import "@nuxt/ui" lives)
    // This ensures component styles are correctly injected.
    theme: {
      colors: ['primary', 'secondary', 'success', 'info', 'warning', 'error', 'neutral']
    }
  },
  i18n: {
    baseUrl: 'https://msi.vgu.edu.vn',
    langDir: 'locales',
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'vi', language: 'vi-VN', name: 'Tiếng Việt', file: 'vi.json' }
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
    restructureDir: 'i18n'
  },
  image: {
    format: ['webp', 'png', 'jpg'],
    quality: 85
  },
  mdc: {
    headings: {
      anchorLinks: {
        h1: false,
        h2: false,
        h3: false,
        h4: false,
        h5: false,
        h6: false
      }
    }
  },
  runtimeConfig: {
    public: {
      eventToastIntervalMs: 86400000, // 24 hours
      eventToastDurationMs: 6000 // 6 seconds auto turn off
    }
  },
  studio: {
    repository: {
      provider: 'github',
      owner: 'Lekja00160612',
      repo: 'OVGU_MSI_Website',
      branch: 'main'
    },
    auth: {
      github: {
        clientId: process.env.STUDIO_GITHUB_CLIENT_ID || '',
        clientSecret: process.env.STUDIO_GITHUB_CLIENT_SECRET || ''
      }
    },
  },
  $production: {
    nitro: {
      preset: 'cloudflare_pages',
    }
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/vi'],
      autoSubfolderIndex: false,
    },
  }
})