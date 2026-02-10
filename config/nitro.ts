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
    crawlLinks: false,
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
