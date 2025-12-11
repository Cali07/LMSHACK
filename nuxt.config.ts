import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: false,

  modules: [
    '@pinia/nuxt',
    '@vite-pwa/nuxt',
    '@nuxtjs/leaflet',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    }
  ],
  leaflet: {
    heat: true
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'W&RSETA Learner Management',
      short_name: 'LMS',
      description: 'Capture learners, assessors, and moderators with verification-ready workflows.',
      display: 'standalone',
      start_url: '/',
      background_color: '#ffffff',
      theme_color: '#0f172a',
      lang: 'en',
      icons: [
        { src: '/icons/icon-48x48.png', sizes: '48x48', type: 'image/png' },
        { src: '/icons/icon-72x72.png', sizes: '72x72', type: 'image/png' },
        { src: '/icons/icon-96x96.png', sizes: '96x96', type: 'image/png' },
        { src: '/icons/icon-128x128.png', sizes: '128x128', type: 'image/png' },
        { src: '/icons/icon-144x144.png', sizes: '144x144', type: 'image/png' },
        { src: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
        { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icons/icon-256x256.png', sizes: '256x256', type: 'image/png' },
        { src: '/icons/icon-384x384.png', sizes: '384x384', type: 'image/png' },
        { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' }
      ]
    },
    workbox: {
      navigateFallback: '/'
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }
  },

  css: ['~/assets/main.css', 'leaflet/dist/leaflet.css'],

  build: {
    transpile: ['vuetify'],
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      }
    }
  },

  app: {
    head: {
      link: [
        { rel: 'manifest', href: '/manifest.webmanifest' }
      ],
      meta: [
        { name: 'theme-color', content: '#0f172a' }
      ]
    }
  },

  runtimeConfig: {
    public: {
      API_URL: process.env.API_URL,
      APP_VERSION: process.env.APP_VERSION,
      GEOAPIFY_KEY: process.env.GEOAPIFY_KEY,
    }
  }
})
