import { defineConfig } from 'vitepress'
import { createWriteStream } from 'node:fs'
import { resolve } from 'node:path'
import { SitemapStream } from 'sitemap'
import { nav, sidebar } from '../router/index'
import { description, docsVersion, github, keywords, name, site } from './meta'

const links = []

export default defineConfig({
  title: "Allen's blog",
  description: 'A VitePress Site',
  // appearance: 'light', // default theme
  lastUpdated: true,
  cleanUrls: true, //clear the Url Html
  markdown: {
    theme: {
      light: 'min-dark',
      dark: 'one-dark-pro'
    },
    lineNumbers: true,
    config: (md) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      md.use(require('markdown-it-task-lists'))
    }
  },
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png'
      }
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png'
      }
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png'
      }
    ],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    [
      'link',
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#3a0839' }
    ],
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
    ['meta', { name: 'msapplication-TileColor', content: '#3a0839' }],
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    [
      'meta',
      {
        name: 'google-site-verification',
        content: 'SH2b8gzgTJT_CWEMppSWf_YLQ130Q9PDunRkjaf6EM'
      }
    ],
    ['meta', { name: 'theme-color', content: '#3c8772' }]
  ],
  transformHtml: (_, id, { pageData }) => {
    if (!/[\\/]404\.html$/.test(id))
      links.push({
        url: pageData.relativePath.replace(/((^|\/)index)?\.md$/, '$2'),
        lastmod: pageData.lastUpdated
      })
  },
  buildEnd: async ({ outDir }) => {
    const sitemap = new SitemapStream({
      hostname: 'https://allenvitepress.zeabur.app/'
    })
    const writeStream = createWriteStream(resolve(outDir, 'sitemap.xml'))
    sitemap.pipe(writeStream)
    links.forEach((link) => sitemap.write(link))
    sitemap.end()
    await new Promise((r) => writeStream.on('finish', r))
  },
  themeConfig: {
    logo: '/logo.png',
    nav,
    sidebar,
    siteTitle: "Allen's Blog",
    // returnToTopLabel: '',
    // outlineTitle: '',
    // darkModeSwitchLabel: '',
    // sidebarMenuLabel: '',
    editLink: {
      pattern: `${github}/tree/feature/vitepress/docs/:path`,
      text: '在 GitHub 上編輯此頁'
    },
    lastUpdatedText: '最後一次更新',
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2021-present Allen Shih'
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/eepson123tw/eepson123tw.github.io'
      }
    ],
    algolia: {
      appId: 'JQ4IJY9BK1',
      apiKey: '78d9ab43228a430dd43bed1ffd1965d6',
      indexName: 'AllenBlog',
      placeholder: '關鍵字',
      translations: {
        button: {
          buttonText: '搜尋DOC'
        }
      }
    }
  }
})
