// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon.ico'
        }
      ]
    }
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@nuxt/ui', '@nuxt/image', '@nuxtjs/i18n', 'nuxt-studio'],
  css: ['~/assets/css/main.css'],
  colorMode: { preference: 'light' },
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