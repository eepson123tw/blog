import { withPwa } from '@vite-pwa/vitepress';
import mdItCustomAttrs from 'markdown-it-custom-attrs';
import taskLists from 'markdown-it-task-lists';
import type { UserConfig } from 'vitepress';
import { defineConfig } from 'vitepress';
import { withMermaid } from 'vitepress-plugin-mermaid';

import { nav, sidebar } from '../router/index';
import { github, keywords } from './meta';
import generateFeed from './plugins/feed';
import generateMeta from './plugins/head';
import generateSiteMap from './plugins/sitemap';
import pwaConfig from './pwa.config';

const links: {
  url: string;
  lastmod?: number | RegExpMatchArray | null | undefined;
  changefreq: string;
  priority: number;
}[] = [];

const hostname: string = 'https://www.aaron-shih.com';

const year = new Date().getFullYear();

export default withPwa(
  withMermaid(
    defineConfig(<UserConfig>{
      // lang: "zh-TW", // will infer to algolia
      title: '前端異聞錄',
      description: keywords,
      appearance: 'dark',
      lastUpdated: true,
      cleanUrls: true, // 清理 URL 中的 .html 后缀
      head: generateMeta(),
      transformHtml: (_: any, id: string, { pageData }: any) => {
        const regex = /[0-9]{0,4}-[0-9]{0,2}-[0-9]{0,2}/gm;
        const condition = pageData.frontmatter.date
          ? `${pageData.frontmatter.date}`.match(regex)
          : pageData.lastUpdated;
        if (!/[\\/]404\.html$/.test(id)) {
          links.push({
            url: pageData.relativePath.replace(/((^|\/)index)?\.md$/, '$2'),
            lastmod: condition,
            changefreq: 'weekly',
            priority: 0.7,
          });
        }
      },
      buildEnd: async ({ outDir }: { outDir: string }) => {
        await generateSiteMap(outDir, links);
        await generateFeed(hostname, outDir);
      },
      onwarn(warning: { code: string; message: string | string[] }, warn: (arg0: any) => void) {
        // Ignore specific warnings
        if (
          warning.code === 'INVALID_ANNOTATION' ||
          warning.message.includes('maximumFileSizeToCacheInBytes')
        ) {
          return;
        }
        warn(warning);
      },
      pwa: pwaConfig,
      themeConfig: {
        logo: '/logo.webp',
        nav,
        sidebar,
        siteTitle: 'Aaron\'s Blog',
        editLink: {
          pattern: `${github}/tree/master/docs/:path`,
          text: '在 GitHub 上編輯此頁',
        },
        lastUpdatedText: '最後一次更新',
        footer: {
          message: 'Released under the MIT License.',
          copyright: `Copyright © 2021~${year} Aaron Shih`,
        },
        socialLinks: [
          {
            icon: 'github',
            link: 'https://github.com/eepson123tw/blog',
          },
          {
            icon: 'linkedin',
            link: 'https://www.linkedin.com/in/aaron-shih/',
          },
        ],
        algolia: {
          appId: 'INTUTOQ9K2',
          apiKey: '49bdcd9a0696af68521ffbde79f80e10',
          indexName: 'aaron-shih',
          placeholder: '關鍵字',
          translations: {
            button: {
              buttonText: '搜尋DOC',
            },
          },
        },
      },
      markdown: {
        theme: {
          light: 'min-dark',
          dark: 'one-dark-pro',
        },
        math: true,
        lineNumbers: true,
        config: (md: any) => {
          md.use(taskLists);
          md.use(mdItCustomAttrs, 'image', {
            'data-fancybox': 'gallery',
          });
        },
      },
      ignoreDeadLinks: 'localhostLinks',
    }),
  ),
);
