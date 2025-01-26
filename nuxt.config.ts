// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  extends: ['shadcn-docs-nuxt'],
  compatibilityDate: '2024-07-06',
  i18n: {
    vueI18n: './locales/i18n.config.ts',
    locales: [
      { code: 'zh-Hant', language: 'zh-Hant', name: '繁體中文', file: 'zh-Hant.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'ja', language: 'ja', name: '日本語', file: 'ja.json' },
    ],
    defaultLocale: 'en',
    langDir: '../locales',
    strategy: 'no_prefix',
    lazy: true,
  },
  modules: ['@nuxtjs/i18n', '@nuxtjs/robots', '@nuxtjs/sitemap'],
  components: {
    dirs: [
      {
        path: './components',
        ignore: ['**/*.ts'],
      },
    ],
  },
  app: {
    head: {
      charset: 'utf-8',
      htmlAttrs: {
        lang: 'zh-TW',
      },
      title: 'Aaron\'s Blog',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.ico' },
        // { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        {
          rel: 'prefetch',
          // href: 'https://www.youtube.com/iframe_api',
        },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Frontend development, React, Vue, self-learning, focusing on 3D modules, AI, data visualization, and data analysis exploration, supporting web design and career transition.' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: 'white' },
        { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: 'black' },
      ],
    },
  },
  site: {
    url: 'https://www.aaron-shih.com/',
    name: 'My Awesome Website',
  },
  runtimeConfig: {
    public: {
      posthogPublicKey: 'phc_fzR4XnxYjp4sB38xz1F8L1halakmuZtr1sIRkIaCpNG',
      posthogHost: 'https://us.i.posthog.com',
    },
  },
});
