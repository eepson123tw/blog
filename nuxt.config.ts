// https://nuxt.com/docs/api/configuration/nuxt-config
import process from 'node:process';
import { imageConfig, nitroConfig, viteConfig } from './config';

const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://www.aaron-shih.com';

export default defineNuxtConfig({
  extends: ['docus'],

  // Internationalization（Docus 會把 code 轉小寫、strategy 強制為 prefix → /zh-tw、/en、/ja）
  i18n: {
    defaultLocale: 'zh-TW',
    locales: [
      { code: 'zh-TW', name: '繁體中文', language: 'zh-TW' },
      { code: 'en', name: 'English', language: 'en-US' },
      { code: 'ja', name: '日本語', language: 'ja-JP' },
    ],
  },

  modules: ['@nuxtjs/i18n'],

  // Content
  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark',
          },
          langs: ['bash', 'diff', 'json', 'js', 'ts', 'jsx', 'tsx', 'html', 'css', 'vue', 'shell', 'mdc', 'md', 'yaml', 'dockerfile', 'mermaid', 'toml', 'python', 'java', 'sql', 'go'],
        },
      },
    },
  },

  // App Head
  app: {
    head: {
      htmlAttrs: { lang: 'zh-TW' },
      link: [
        { rel: 'icon', href: '/favicon.ico' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      ],
      meta: [
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'referrer', content: 'no-referrer-when-downgrade' },
        { name: 'author', content: 'Aaron Shih' },
        { name: 'keywords', content: '前端開發、React、Vue、Coding、自主學習' },
        { name: 'application-name', content: 'Aaron' },
        { name: 'apple-mobile-web-app-title', content: 'Aaron' },
      ],
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

  // SEO - Sitemap
  sitemap: {
    xsl: false,
    defaults: {
      changefreq: 'daily',
      priority: 0.8,
    },
  },

  // Experimental Features
  experimental: {
    appManifest: false,
  },

  compatibilityDate: '2025-07-22',
});
