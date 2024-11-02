import { createRequire } from 'node:module';
import { resolve } from 'node:path';

import cssnano from 'cssnano';
import { visualizer } from 'rollup-plugin-visualizer';
import UnoCSS from 'unocss/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import Components from 'unplugin-vue-components/vite';
import type { UserConfig } from 'vite';
import { defineConfig } from 'vite';
import compression from 'vite-plugin-compression';
import htmlMinifier from 'vite-plugin-html-minifier';

import dnsPrefetchPlugin from './utils/dns-prefetch-plugin';

const require = createRequire(import.meta.url);

export default defineConfig(async () => {
  return <UserConfig>{
    assetsInclude: ['**/*.png'],
    server: {
      hmr: {
        overlay: false,
      },
      fs: {
        allow: [resolve(__dirname, '..')],
      },
    },
    plugins: [
      // https://github.com/vuejs/vitepress/issues/3820
      {
        name: 'patch-vitepress-symbol',
        transform(code, id) {
          if (id.includes('vitepress/dist/client/app/data.js')) {
            return code.replace(
              'const dataSymbol = Symbol();',
              'const dataSymbol = "__vitepress_data__";',
            );
          }
        },
      },
      // custom
      // plugins
      Components({
        dirs: resolve(__dirname, './component'),
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        resolvers: [
          IconsResolver({
            componentPrefix: '',
          }),
        ],
        dts: './.vitepress/components.d.ts',
        transformer: 'vue3',
      }),
      Icons({
        compiler: 'vue3',
        autoInstall: true,
        defaultStyle: 'display: inline-block',
      }),
      UnoCSS(),
      dnsPrefetchPlugin(),
      compression({ algorithm: 'brotliCompress' }),
      htmlMinifier({
        minify: true,
      }),
      visualizer({ open: false }), // only open when you need to analyze the bundle
    ],
    css: {
      postcss: {
        plugins: [require('postcss-nested'), cssnano()],
      },
    },
    build: {
      commonjsOptions: {
        include: [/@braintree\/sanitize-url/],
      },
      rollupOptions: {
        treeShaking: true,
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
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
    resolve: {
      alias: {
        '@braintree/sanitize-url': '@braintree/sanitize-url/dist/index.js',
      },
    },
    optimizeDeps: {
      exclude: ['js-big-decimal'],
      include: ['@braintree/sanitize-url'],
    },
  };
});
