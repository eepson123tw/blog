import { defineConfig } from "vitepress";

// static file
import generateSiteMap from "./plugins/sitemap";
import generateFeed from "./plugins/feed";
import generateMeta from "./plugins/head";
import { nav, sidebar } from "../router/index";
import { github, keywords } from "./meta";

const links: {
  url: string;
  lastmod?: number | RegExpMatchArray | null | undefined;
  changefreq: string;
  priority: number;
}[] = [];
const hostname: string = "https://allenvitepress.zeabur.app";

export default defineConfig({
  title: "前端異聞錄",
  description: keywords,
  lastUpdated: true,
  appearance: true,
  cleanUrls: true, //clear the Url Html
  markdown: {
    theme: {
      light: "min-dark",
      dark: "one-dark-pro",
    },
    lineNumbers: true,
    config: (md) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      md.use(require("markdown-it-task-lists"));
    },
  },
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
    logo: "/logo.png",
    nav,
    sidebar,
    siteTitle: "Allen's Blog",
    editLink: {
      pattern: `${github}/tree/feature/vitepress/docs/:path`,
      text: "在 GitHub 上編輯此頁",
    },
    lastUpdatedText: "最後一次更新",
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2021-present Allen Shih",
    },
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/eepson123tw/eepson123tw.github.io",
      },
    ],
    algolia: {
      appId: "JQ4IJY9BK1",
      apiKey: "78d9ab43228a430dd43bed1ffd1965d6",
      indexName: "AllenBlog",
      placeholder: "關鍵字",
      translations: {
        button: {
          buttonText: "搜尋DOC",
        },
      },
    },
  },
});
