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
  ];
}
