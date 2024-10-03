import { withMermaid } from "vitepress-plugin-mermaid";
import { minify } from "html-minifier";
import mdItCustomAttrs from "markdown-it-custom-attrs";
import taskLists from "markdown-it-task-lists";
import { withPwa } from "@vite-pwa/vitepress";

import generateSiteMap from "./plugins/sitemap";
import generateFeed from "./plugins/feed";
import generateMeta from "./plugins/head";
import { nav, sidebar } from "../router/index";
import { github, keywords } from "./meta";
import pwaConfig from "./pwa.config";

const links: {
  url: string;
  lastmod?: number | RegExpMatchArray | null | undefined;
  changefreq: string;
  priority: number;
}[] = [];

const hostname: string = "https://www.aaron-shih.com";

const year = new Date().getFullYear();

export default withPwa(
  withMermaid({
    assetsDir: "assets",
    vite: {
      logLevel: "info",
    },
    // lang: "zh-TW", // will infer to algolia
    title: "前端異聞錄",
    description: keywords,
    appearance: "dark",
    lastUpdated: true,
    cleanUrls: true, // 清理 URL 中的 .html 后缀
    head: generateMeta(),
    transformHtml: (_, id, { pageData }) => {
      const regex = /[0-9]{0,4}-[0-9]{0,2}-[0-9]{0,2}/gm;
      const condition = pageData.frontmatter.date
        ? `${pageData.frontmatter.date}`.match(regex)
        : pageData.lastUpdated;
      if (!/[\\/]404\.html$/.test(id)) {
        links.push({
          url: pageData.relativePath.replace(/((^|\/)index)?\.md$/, "$2"),
          lastmod: condition,
          changefreq: "weekly",
          priority: 0.7,
        });
      }
    },
    buildEnd: async ({ outDir }) => {
      await generateSiteMap(outDir, links);
      await generateFeed(hostname, outDir);
    },
    themeConfig: {
      logo: "/logo.webp",
      nav,
      sidebar,
      siteTitle: "Aaron's Blog",
      editLink: {
        pattern: `${github}/tree/master/docs/:path`,
        text: "在 GitHub 上編輯此頁",
      },
      lastUpdatedText: "最後一次更新",
      footer: {
        message: "Released under the MIT License.",
        copyright: `Copyright © 2021~${year} Aaron Shih`,
      },
      socialLinks: [
        {
          icon: "github",
          link: "https://github.com/eepson123tw/blog",
        },
        {
          icon: "linkedin",
          link: "https://www.linkedin.com/in/aaron-shih/",
        },
      ],
      algolia: {
        appId: "INTUTOQ9K2",
        apiKey: "49bdcd9a0696af68521ffbde79f80e10",
        indexName: "aaron-shih",
        placeholder: "關鍵字",
        translations: {
          button: {
            buttonText: "搜尋DOC",
          },
        },
      },
      pwa: pwaConfig,
    },
    // Minify the generated HTML to compress the markdown content
    transformPageData: (pageData) => {
      if (pageData.html) {
        pageData.html = minify(pageData.html, {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeEmptyAttributes: true,
          minifyCSS: true,
          minifyJS: true,
        });
      }
      return pageData;
    },
    markdown: {
      theme: {
        light: "min-dark",
        dark: "one-dark-pro",
      },
      math: true,
      lineNumbers: true,
      config: (md) => {
        md.use(taskLists);
        md.use(mdItCustomAttrs, "image", {
          "data-fancybox": "gallery",
        });
      },
    },
  })
);
