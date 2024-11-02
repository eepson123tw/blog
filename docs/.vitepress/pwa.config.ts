const pwaConfig = {
  registerType: 'autoUpdate',
  injectRegister: 'script-defer',
  strategies: 'generateSW',
  manifest: {
    id: '/',
    display: 'standalone',
    name: 'VitePress PWA',
    short_name: 'VitePressPWA',
    background_color: '#6563FF',
    theme_color: '#6563FF',
    orientation: 'portrait',
    includeAssets: ['robots.txt', 'fonts/*.css', 'fonts/*.woff2', '*.svg', '*.png'],
  },
  pwaAssets: {
    config: true,
  },
  workbox: {
    navigateFallback: null,
    swSrc: './service-worker.js',
    globPatterns: ['**/*.{js,css}'],
    skipWaiting: true,
    clientsClaim: true,
    maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
  },
};

export default pwaConfig;
