const pwaConfig = {
  registerType: 'autoUpdate',
  injectRegister: 'script-defer',
  strategy: 'generateSW',
  manifest: {
    id: '/',
    display: 'standalone',
    name: 'VitePress PWA',
    short_name: 'VitePressPWA',
    background_color: '#6563FF',
    theme_color: '#6563FF',
    orientation: 'portrait',
    includeAssets: ['robots.txt', 'fonts/*.css', 'fonts/*.woff2', '*.svg', '*.png'],
    start_url: '/',
    categories: ['education', 'productivity'],
  },
  pwaAssets: {
    config: true,
    optimization: true, // Enable assets optimization
  },
  workbox: {
    cleanupOutdatedCaches: true,
    navigationPreload: false,
    dontCacheBustURLsMatching: /^assets\//,
    navigateFallback: null,
    skipWaiting: true,
    clientsClaim: true,
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,

    // Refined glob patterns
    globPatterns: [
      // Core assets
      '**/*.{css,html,ico,woff2}',
      // Images
      'assets/images/**/*.{png,svg,webp}',
      // Scripts excluding large chunks
      'assets/!(chunks)/**/*.js',
      // JSON files
      '**/*.json',
    ],

    // More specific glob ignores
    globIgnores: [
      // ELK related files
      '**/flowchart-elk-definition-*.js',
      '**/flowchart-elk-*.js',
      '**/elk-*.js',
      // Service worker files
      'sw.js',
      'workbox-*.js',
      // Development files
      '**/*.map',
      '**/stats.html',
    ],

    // Enhanced runtime caching strategy
    runtimeCaching: [
      // ELK chunks specific handling
      {
        urlPattern: /.*[\\/]flowchart-elk.*\.js$/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'elk-chunks',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
          networkTimeoutSeconds: 3,
        },
      },
      // General JS files
      {
        urlPattern: /\.(?:js)$/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'js-cache',
          expiration: {
            maxEntries: 50, // Increased from 10
            maxAgeSeconds: 365 * 24 * 60 * 60, // 365 days
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
          matchOptions: {
            ignoreSearch: true,
          },
        },
      },
      // Add cache for static assets
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'images-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      // Cache for API calls if you have any
      {
        urlPattern: /\/api\//i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 24 * 60 * 60, // 1 day
          },
          networkTimeoutSeconds: 5,
        },
      },
    ],
  },
};

export default pwaConfig;
