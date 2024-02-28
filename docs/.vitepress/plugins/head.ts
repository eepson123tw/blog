import { description, docsVersion, github, keywords, name, site } from "../meta";
export default function generateMeta(): Array<any> {
  return [
    //icon
    ["link", { rel: "icon", href: "/favicon.ico" }],
    [
      "link",
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
    ],
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
    ],
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
    ],
    ["link", { rel: "manifest", href: "/site.webmanifest" }],
    ["link", { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#3a0839" }],
    ["link", { rel: "shortcut icon", href: "/favicon.ico" }],
    ["meta", { name: "msapplication-TileColor", content: "#3a0839" }],
    ["meta", { name: "theme-color", content: "#ffffff" }],
    // meta
    ["meta", { name: "referrer", content: "no-referrer-when-downgrade" }],
    ["meta", { name: "keywords", content: keywords }],
    ["meta", { name: "author", content: "Allen Shih" }],
    ["meta", { property: "og:type", content: "article" }],
    ["meta", { name: "application-name", content: name }],
    ["meta", { name: "apple-mobile-web-app-title", content: name }],
    ["meta", { name: "apple-mobile-web-app-status-bar-style", content: "default" }],
    // webfont
    ["link", { rel: "dns-prefetch", href: "https://fonts.googleapis.com" }],
    ["link", { rel: "dns-prefetch", href: "https://fonts.gstatic.com" }],
    [
      "link",
      {
        rel: "preconnect",
        crossorigin: "anonymous",
        href: "https://fonts.googleapis.com",
      },
    ],
    [
      "link",
      {
        rel: "preconnect",
        crossorigin: "anonymous",
        href: "https://fonts.gstatic.com",
      },
    ],
    // og
    ["meta", { property: "og:description", content: description }],
    ["meta", { property: "og:url", content: site }],
    ["meta", { property: "og:locale", content: "zh_TW" }],
    // analytics
    [
      "meta",
      {
        name: "google-site-verification",
        content: "SH2b8gzgTJT_CWEMppSWf_YLQ130Q9PDunRkjaf6EM",
      },
    ],
    [
      "script",

      {
        async: "",
        src: "https://www.googletagmanager.com/gtag/js?id=G-R6YQL587WJ",
      },
    ],
    [
      "script",
      {},
      "window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', 'G-R6YQL587WJ');",
    ],
    [
      "script",
      {},
      `;(() => {
        !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
        posthog.init('phc_fzR4XnxYjp4sB38xz1F8L1halakmuZtr1sIRkIaCpNG', {api_host: 'https://app.posthog.com'})
      })()`,
    ],
  ];
}
