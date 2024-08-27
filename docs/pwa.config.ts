import { dirname } from "node:path";
import { resolve } from "path";
import { fileURLToPath } from "node:url";

const _dirname = dirname(fileURLToPath(import.meta.url));

const pwaConfig = {
  outDir: resolve(_dirname, "../dist"),
  // mode: "development",
  registerType: "autoUpdate",
  injectRegister: "script-defer",
  strategies: "generateSW",
  includeAssets: ["favicon.svg"],
  manifest: {
    name: "VitePress PWA",
    short_name: "VitePressPWA",
    theme_color: "#ffffff",
    start_url: "/",
  },
  pwaAssets: {
    config: true,
  },
  workbox: {
    globDirectory: resolve(__dirname, "dist"),
    globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
  },
  experimental: {
    includeAllowlist: true,
  },
  devOptions: {
    enabled: process.env.SW_DEV === "true",
    navigateFallback: "/",
    suppressWarnings: true,
    cleanupOutdatedCaches: false,
    sourcemap: true,
  },
};
export default pwaConfig;
