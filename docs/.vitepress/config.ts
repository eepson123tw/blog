import {
  defineConfig,
  createContentLoader,
  type SiteConfig,
  PageData
} from 'vitepress'
import { createWriteStream, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { SitemapStream } from 'sitemap'
import { nav, sidebar } from '../router/index'
import { description, docsVersion, github, keywords, name, site } from './meta'
import { Feed } from 'feed'
import path from 'path'

const links: {
  url: string
  lastmod?: number | RegExpMatchArray | null | undefined
  changefreq: string
  priority: number
}[] = []
const hostname: string = 'https://allenvitepress.zeabur.app'

export default defineConfig({
  title: "Allen's blog",
  description: 'Keep evolving oneself through continuous iteration.',
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
    ['meta', { name: 'theme-color', content: '#3c8772' }],
    [
      'script',

      {
        async: '',
        src: 'https://www.googletagmanager.com/gtag/js?id=G-R6YQL587WJ'
      }
    ],
    [
      'script',
      {},
      "window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', 'G-R6YQL587WJ');"
    ]
  ],
  transformHtml: (_, id, { pageData }) => {
    const regex = /[0-9]{0,4}-[0-9]{0,2}-[0-9]{0,2}/gm
    const condition = pageData.frontmatter.date
      ? `${pageData.frontmatter.date}`.match(regex)
      : pageData.lastUpdated
    if (!/[\\/]404\.html$/.test(id)) {
      links.push({
        url: pageData.relativePath.replace(/((^|\/)index)?\.md$/, '$2'),
        lastmod: condition,
        changefreq: 'weekly',
        priority: 0.7
      })
    }
  },
  buildEnd: async ({ outDir }) => {
    const sitemap = new SitemapStream({
      hostname: 'https://allenvitepress.zeabur.app/',
      lastmodDateOnly: true
    })
    const writeStream = createWriteStream(resolve(outDir, 'sitemap.xml'))

    sitemap.pipe(writeStream)
    links.forEach((link) => {
      sitemap.write(link)
    })
    sitemap.end()
    await new Promise((r) => writeStream.on('finish', r))

    const feed = new Feed({
      title: 'Allen Shih',
      description: 'My personal blog',
      id: hostname,
      link: hostname,
      language: 'en',
      favicon: `${hostname}/favicon.ico`,
      copyright: 'Copyright (c) 2021-present, Allen Shih'
    })

    const posts = await createContentLoader('/view/**/*.md', {
      excerpt: true,
      render: true
    }).load()

    posts.sort(
      (a, b) =>
        +new Date(b.frontmatter.date as string) -
        +new Date(a.frontmatter.date as string)
    )

    for (const { url, excerpt, frontmatter, html } of posts) {
      feed.addItem({
        title: frontmatter.title,
        id: `${hostname}${url}`,
        link: `${hostname}${url}`,
        description: excerpt,
        content: html,
        author: [
          {
            name: 'AllenShih',
            email: 'eepson123@gmial.com',
            link: ''
          }
        ],
        date: frontmatter.date
      })
    }

    await new Promise((r) =>
      writeFileSync(path.join(outDir, 'rss.xml'), feed.rss2())
    )
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
