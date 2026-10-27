export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  // Google Analytics
  if (config.public.gaId) {
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${config.public.gaId}`;
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', config.public.gaId);
  }

  // Google Site Verification (add meta tag)
  if (config.public.googleSiteVerification) {
    const meta = document.createElement('meta');
    meta.name = 'google-site-verification';
    meta.content = config.public.googleSiteVerification;
    document.head.appendChild(meta);
  }
});

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}
