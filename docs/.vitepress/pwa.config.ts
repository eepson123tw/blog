import { dirname } from "node:path";
import { resolve } from "path";
import { fileURLToPath } from "node:url";

// Correct the variable name to _dirname

const pwaConfig = {
  // outDir: resolve(_dirname, "../dist"),
  registerType: "autoUpdate",
  injectRegister: "script-defer",
  strategies: "generateSW",
  manifest: {
    id: "/",
    display: "standalone",
    name: "VitePress PWA",
    short_name: "VitePressPWA",
    background_color: "#6563FF",
    theme_color: "#6563FF",
    orientation: "portrait",
    includeAssets: ["robots.txt", "fonts/*.css", "fonts/*.woff2", "*.svg", "*.png"],
    // Include icons and screenshots to avoid warnings
    icons: [
      {
        src: "/path/to/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/path/to/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    screenshots: [
      {
        src: "/path/to/screenshot-mobile.png",
        sizes: "375x667",
        type: "image/png",
        form_factor: "narrow", // for mobile
      },
      {
        src: "/path/to/screenshot-desktop.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide", // for desktop
      },
    ],
  },
  pwaAssets: {
    config: true,
  },
  workbox: {
    navigateFallback: null,
    swSrc: "./service-worker.js",
    globPatterns: ["**/*.{js,css}"],
    skipWaiting: true,
    clientsClaim: true,
    maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
  },
  // workbox: {
  //   clientsClaim: true,
  //   skipWaiting: true,
  //   // globPatterns: ["**/*.{js,css}"],
  //   navigateFallback: null,
  // },

  // pwaAssets: {
  //   config: true,
  // },
  // workbox: {
  //   // globDirectory: resolve(_dirname, "dist"), // Fixed _dirname reference
  //   globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
  // },
  // experimental: {
  //   includeAllowlist: true,
  // },
  // devOptions: {
  //   enabled: process.env.SW_DEV === "true", // Ensure this environment variable is set properly
  //   navigateFallback: "/",
  //   suppressWarnings: true,
  //   cleanupOutdatedCaches: false,
  //   sourcemap: true,
  // },
};

export default pwaConfig;
