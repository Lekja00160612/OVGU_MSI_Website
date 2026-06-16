import { readdirSync } from 'fs'
import { join } from 'path'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon.ico'
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap'
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
  modules: ['@nuxt/content', '@nuxt/ui', '@nuxt/image', '@nuxtjs/i18n', 'nuxt-studio'],
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
      eventToastDurationMs: 6000, // 6 seconds auto turn off
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
      }
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
  nitro: {
    preset: 'cloudflare_pages',
    prerender: {
      crawlLinks: true,
      routes: ['/', '/vi'],
      autoSubfolderIndex: false,
    },
    // PLEASE CHANGE CLOUDFLARE BUILD TO: npx nuxi generate
    // 
    // cloudflare: {
    //   pages: {
    //     routes: {
    //       exclude: [
    //         '/Documents/*',
    //         '/Logo/*',
    //         '/Thumbnail/*',
    //         '/images/*',
    //         '/Hybrid_Learning/*',
    //         '/OVGU_Campus/*',
    //         '/Lecturer_Avatar/*',
    //         '/academic-activities/*',
    //         '/academic-activities',
    //         '/future-students/*',
    //         '/future-students',
    //         '/laboratories-research/*',
    //         '/laboratories-research',
    //         '/partners-lecturers/*',
    //         '/partners-lecturers',
    //         '/potential-candidates/*',
    //         '/potential-candidates',
    //         '/program-structure/*',
    //         '/program-structure',
    //         '/student-life/*',
    //         '/student-life',
    //         '/tuition-scholarships/*',
    //         '/tuition-scholarships',
    //         '/vi/*',
    //         '/vi',
    //         '/admin/*',
    //         '/admin',
    //         '/__nuxt_content/*',
    //         '/_i18n/*',
    //         '/dump*',
    //       ]
    //     }
    //   }
    // }
  },
})