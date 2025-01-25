// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
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
  modules: ['@nuxtjs/i18n'],
  components: {
    dirs: [
      {
        path: './components',
        ignore: ['**/*.ts'],
      },
    ],
  },
});