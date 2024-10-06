import { resolve } from "node:path";
import { createRequire } from "node:module";
import { defineConfig } from "vite";
import type { UserConfig } from "vite";
import UnoCSS from "unocss/vite";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import Components from "unplugin-vue-components/vite";
import dnsPrefetchPlugin from "./utils/dns-prefetch-plugin";
import compression from "vite-plugin-compression";
import cssnano from "cssnano";
import htmlMinifier from "vite-plugin-html-minifier";

import { visualizer } from "rollup-plugin-visualizer";

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
      // https://github.com/vuejs/vitepress/issues/3820
      {
        name: "patch-vitepress-symbol",
        transform(code, id) {
          if (id.includes("vitepress/dist/client/app/data.js")) {
            return code.replace(
              "const dataSymbol = Symbol();",
              'const dataSymbol = "__vitepress_data__";'
            );
          }
        },
      },
      // custom
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
      compression({ algorithm: "brotliCompress" }),
      htmlMinifier({
        minify: true,
      }),
      visualizer({ open: false }), // only open when you need to analyze the bundle
    ],
    css: {
      postcss: {
        plugins: [require("postcss-nested"), cssnano()],
      },
    },
    build: {
      rollupOptions: {
        treeShaking: true,
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return id.toString().split("node_modules/")[1].split("/")[0].toString();
            }
          },
        },
      },
      chunkSizeWarningLimit: 5000,
      esbuild: {
        minify: true,
        treeShaking: true,
      },
    },

    optimizeDeps: {
      exclude: ["js-big-decimal"],
    },
  };
});
