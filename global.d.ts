/// <reference types="vite-plugin-pwa/client" />
/// <reference types="vite-plugin-pwa/vue" />

declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}
declare module 'virtual:pwa-register/vue' {
  // eslint-disable-next-line ts/prefer-ts-expect-error
  // @ts-ignore ignore when vue is not installed
  import type { RegisterSWOptions } from 'vite-plugin-pwa/types';
  import type { Ref } from 'vue';

  export type { RegisterSWOptions };

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: Ref<boolean>;
    offlineReady: Ref<boolean>;
    /**
     * Reloads the current window to allow the service worker take the control.
     *
     * @param reloadPage From version 0.13.2+ this param is not used anymore.
     */
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
  };
}

declare module 'html-minifier' {
  import { MarkdownIt } from 'markdown-it';

  export interface MinifyOptions {
    removeComments?: boolean;
    collapseWhitespace?: boolean;
    minifyCSS?: boolean;
    minifyJS?: boolean;
    keepClosingSlash?: boolean;
  }

  export function minify(input: string, options?: MinifyOptions): string;
}
