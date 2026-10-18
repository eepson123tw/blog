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
    routes: ['/sitemap.xml', '/rss.xml'],
  },
  watchOptions: {
    ignored: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.git/**',
    ],
  },
};
