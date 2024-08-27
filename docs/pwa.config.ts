import { dirname } from "node:path";
import { resolve } from "path";
import { fileURLToPath } from "node:url";

const _dirname = dirname(fileURLToPath(import.meta.url));

const pwaConfig = {
  mode: "development",
  registerType: "autoUpdate",
  injectRegister: "script-defer",
  includeAssets: ["favicon.svg"],
  manifest: {
    name: "VitePress PWA",
    short_name: "VitePressPWA",
    theme_color: "#ffffff",
  },
  pwaAssets: {
    config: true,
  },
  workbox: {
    globPatterns: ["**/*.{css,js,html,svg,png,ico,txt,woff2}"],
  },
  experimental: {
    includeAllowlist: true,
  },
  devOptions: {
    enabled: false,
    suppressWarnings: true,
    navigateFallback: [""],
  },

  // enabled: true,
  // mode: "development",
  // registerType: "autoUpdate",
  // includeManifestIcons: false,
  // injectRegister: "script-defer",
  // includeAssets: ["favicon.svg"],
  // manifest: {
  //   id: "/",
  //   name: "Aaron Shih",
  //   short_name: "Aaron Blog",
  //   description: "Aaron Shih's blog",
  //   theme_color: "#ffffff",
  // },
  // pwaAssets: {
  //   config: true,
  // },
  // workbox: {
  //   globPatterns: ["**/*.{css,js,html,svg,png,ico,txt,woff2}"],
  // },
  // experimental: {
  //   includeAllowlist: true,
  // },
  // devOptions: {
  //   enabled: false,
  //   suppressWarnings: true,
  //   navigateFallback: "/",
  // },
};
export default pwaConfig;
