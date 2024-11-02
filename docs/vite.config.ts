import { createRequire } from 'node:module';
import { resolve } from 'node:path';

import commonjs from '@rollup/plugin-commonjs';
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
import requireTransform from 'vite-plugin-require-transform';

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
      commonjs({
        // Optimize commonjs transformation
        transformMixedEsModules: true,
        exclude: [/\/core-js\//],
      }),
      requireTransform({
        fileRegex: /.js$|.ts$/,
      }),
      // Previous plugins remain the same...
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
      compression({
        algorithm: 'brotliCompress',
        // Enhanced compression options
        threshold: 1024, // Only compress files bigger than 1KB
        compressionOptions: {
          level: 11,
        },
      }),
      htmlMinifier({
        minify: true,
      }),
      visualizer({
        open: false,
        template: 'treemap', // Better visualization for large chunks
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    css: {
      postcss: {
        plugins: [require('postcss-nested'), cssnano()],
      },
    },
    build: {
      commonjsOptions: {
        include: ['mermaid'],
        // Optimize CommonJS dependencies
        defaultIsModuleExports: true,
      },
      rollupOptions: {
        treeshake: {
          moduleSideEffects: true,
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false,
        },
        onwarn(warning, warn) {
        // Ignore specific warnings
          if (warning.code === 'INVALID_ANNOTATION' ||
            warning.message.includes('maximumFileSizeToCacheInBytes')) {
            return;
          }
          warn(warning);
        },
        output: {
          manualChunks(id) {
            // Enhanced chunk splitting logic
            if (id.includes('node_modules')) {
              if (id.includes('flowchart-elk')) {
                // Split elk into smaller functional chunks
                const subPath = id.split('flowchart-elk/')[1];
                if (subPath) {
                  const feature = subPath.split('/')[0];
                  return `elk-${feature}`;
                }
                return 'elk-core';
              }
              // Group common dependencies
              const pkg = id.toString().split('node_modules/')[1].split('/')[0].toString();
              if (['mermaid', '@antv', 'dagre', 'khroma'].includes(pkg)) {
                return `vendor-${pkg}`;
              }
              return 'vendor';
            }
          },
          // Optimize chunk output
          chunkFileNames: (chunkInfo) => {
            const name = chunkInfo.name;
            if (name.includes('elk-')) {
              return 'assets/elk/[name]-[hash].js';
            }
            return 'assets/chunks/[name]-[hash].js';
          },
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
      chunkSizeWarningLimit: 5000,
      esbuild: {
        minify: true,
        treeShaking: true,
        target: ['es2020'],
        drop: ['console', 'debugger'],
        legalComments: 'none',
      },
      // Enable source map optimization
      sourcemap: false,
      // Minimize module IDs
      modulePreload: {
        polyfill: false,
      },
    },
    resolve: {
      alias: {
        '@braintree/sanitize-url': '@braintree/sanitize-url/dist/index.js',
      },
    },
    optimizeDeps: {
      exclude: ['js-big-decimal'],
      // Pre-bundle heavy dependencies
      include: ['mermaid'],
      esbuildOptions: {
        target: 'es2020',
        supported: {
          'top-level-await': true,
        },
      },
    },
  };
});
