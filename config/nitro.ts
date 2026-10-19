export const nitroConfig = {
  publicAssets: [
    {
      baseURL: '/',
      dir: 'public',
    },
  ],
  compressPublicAssets: {
    gzip: true,
    brotli: true,
  },
  prerender: {
    crawlLinks: true,
    concurrency: 4,
    failOnError: false,
    routes: ['/sitemap_index.xml', '/rss.xml'],
    // 新版 Nuxt 會把 /sitemap.xml（含 /en、/ja）當頁面預渲染出空殼；正式站由 Caddy 301 到 sitemap_index.xml
    ignore: ['/sitemap.xml', '/en/sitemap.xml', '/ja/sitemap.xml'],
  },
  watchOptions: {
    ignored: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.git/**',
    ],
  },
};
