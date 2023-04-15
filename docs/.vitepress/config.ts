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
  appearance: true,
  lastUpdated: true,
  cleanUrls: true,

  head: [
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
    nav,
    sidebar,
    // returnToTopLabel: '',
    // outlineTitle: '',
    // darkModeSwitchLabel: '',
    // sidebarMenuLabel: '',
    editLink: {
      pattern: `${github}/feature/vitepress/docs/:path`,
      text: '在 GitHub 上编辑此页'
    },
    lastUpdatedText: '最后一次更新于',
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
