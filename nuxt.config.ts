// https://nuxt.com/docs/api/configuration/nuxt-config
import process from 'node:process';
import { imageConfig, nitroConfig, viteConfig } from './config';

const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://www.aaron-shih.com';

export default defineNuxtConfig({
  srcDir: '.',
  devtools: { enabled: true },
  extends: ['shadcn-docs-nuxt'],

  // Internationalization
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'zh-TW',
    locales: [
      { code: 'en', name: 'English', language: 'en-US' },
      { code: 'zh-TW', name: '繁體中文', language: 'zh-TW' },
      { code: 'ja', name: '日本語', language: 'ja-JP' },
    ],
  },

  // Modules
  modules: [
    'nuxt-og-image',
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
  ],

  // Components
  components: {
    dirs: [
      {
        path: './components',
        ignore: ['**/*.ts'],
      },
    ],
  },

  // Content
  content: {
    highlight: {
      theme: {
        default: 'github-light',
        dark: 'github-dark',
        sepia: 'monokai',
      },
      preload: ['dockerfile', 'mermaid', 'yaml', 'toml', 'python'],
    },
  },

  // OG Image
  ogImage: {
    fonts: ['Noto+Sans+SC:400'],
  },

  // App Head
  app: {
    head: {
      charset: 'utf-8',
      htmlAttrs: { lang: 'zh-TW' },
      title: 'Aaron\'s Blog',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.ico' },
        { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
        { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'preconnect', crossorigin: 'anonymous', href: 'https://fonts.gstatic.com' },
        { rel: 'preconnect', crossorigin: 'anonymous', href: 'https://fonts.googleapis.com' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Frontend development, React, Vue, self-learning, focusing on 3D modules, AI, data visualization, and data analysis exploration, supporting web design and career transition.' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: 'white' },
        { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: 'black' },
        { name: 'referrer', content: 'no-referrer-when-downgrade' },
        { name: 'author', content: 'Aaron Shih' },
        { name: 'keywords', content: '前端開發、React、Vue、Coding、自主學習' },
        { name: 'application-name', content: 'Aaron' },
        { name: 'apple-mobile-web-app-title', content: 'Aaron' },
      ],
      script: [],
    },
  },

  // Site
  site: {
    url: siteUrl,
    name: 'Aaron\'s Blog',
  },

  // Runtime Config (Environment Variables)
  runtimeConfig: {
    public: {
      siteUrl,
      gaId: process.env.NUXT_PUBLIC_GA_ID || '',
      googleSiteVerification: process.env.NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
      posthogPublicKey: process.env.NUXT_PUBLIC_POSTHOG_KEY || '',
      posthogHost: process.env.NUXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      gitalkClientId: process.env.NUXT_PUBLIC_GITALK_CLIENT_ID || '',
      gitalkClientSecret: process.env.NUXT_PUBLIC_GITALK_CLIENT_SECRET || '',
      gitalkRepo: process.env.NUXT_PUBLIC_GITALK_REPO || 'blog',
      gitalkOwner: process.env.NUXT_PUBLIC_GITALK_OWNER || 'eepson123tw',
    },
  },

  // Nitro (Server)
  nitro: nitroConfig,

  // Image Optimization
  image: imageConfig,

  // Vite Build
  vite: viteConfig,

  // SEO - Robots
  robots: {
    sitemap: `${siteUrl}/sitemap.xml`,
  },

  // SEO - Sitemap
  sitemap: {
    xsl: false,
    defaults: {
      changefreq: 'daily',
      priority: 0.8,
      lastmod: new Date().toISOString(),
    },
  },

  // Experimental Features
  experimental: {
    appManifest: false,
  },

  compatibilityDate: '2024-10-29',
});
