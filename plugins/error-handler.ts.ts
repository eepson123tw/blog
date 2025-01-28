/* eslint-disable node/prefer-global/process */

import { showError } from '#imports';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    console.error('Vue Error:', error);
    console.error('Component:', instance);
    console.error('Error Info:', info);

    if (process.client) {
      showError({
        statusCode: 500,
        message: 'Something went wrong on the client',
      });
    }
  };

  if (process.client) {
    window.addEventListener('unhandledrejection', (event) => {
      showError({
        statusCode: 500,
        message: `Unhandled Promise Rejection: ${event.reason}`,
      });
    });
  }
});
