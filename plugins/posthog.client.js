/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable no-undef */
import { defineNuxtPlugin } from '#app';
import posthog from 'posthog-js';

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig();
  const posthogClient = posthog.init(runtimeConfig.public.posthogPublicKey, {
    api_host: runtimeConfig.public.posthogHost,
  });

  return {
    provide: {
      posthog: () => posthogClient,
    },
  };
});
