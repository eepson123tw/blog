import { resolve } from "node:path";
import { createRequire } from "node:module";
import { defineConfig, resolveConfig } from "vite";
import type { UserConfig } from "vite";
import UnoCSS from "unocss/vite";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import Components from "unplugin-vue-components/vite";
import dnsPrefetchPlugin from "./utils/dns-prefetch-plugin";
import { type VitePluginPWAAPI, VitePWA } from "vite-plugin-pwa";
import pwa from "../docs/.vitepress/pwa.config";
// import { MarkdownTransform } from "./utils/markdown-pipe";

const require = createRequire(import.meta.url);
export default defineConfig(async () => {
  return <UserConfig>{
    assetsInclude: ["**/*.png"],
    server: {
      hmr: {
        overlay: false,
      },
      fs: {
        allow: [resolve(__dirname, "..")],
      },
    },
    plugins: [
      // custom
      // MarkdownTransform(),
      // plugins
      Components({
        dirs: resolve(__dirname, "./component"),
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        resolvers: [
          IconsResolver({
            componentPrefix: "",
          }),
        ],
        dts: "./.vitepress/components.d.ts",
        transformer: "vue3",
      }),
      Icons({
        compiler: "vue3",
        autoInstall: true,
        defaultStyle: "display: inline-block",
      }),
      UnoCSS(),
      dnsPrefetchPlugin(),
    ],
    css: {
      postcss: {
        plugins: [require("postcss-nested")],
      },
    },
    build: {
      chunkSizeWarningLimit: 5000,
    },
    optimizeDeps: {
      exclude: ["js-big-decimal"],
    },
  };
});
