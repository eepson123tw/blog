import { defineConfig } from 'vitepress'
import { createWriteStream } from 'node:fs'
import { resolve } from 'node:path'
import { SitemapStream } from 'sitemap'

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
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'FrontEnd',
        items: [{ text: 'DOM', link: '/view/posts/dom' }]
      }
    ],

    sidebar: [
      {
        text: 'FrontEnd',
        items: [{ text: 'DOM', link: '/view/posts/dom' }],
        collapsed: true
      }
    ],

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/eepson123tw/eepson123tw.github.io'
      }
    ]
  }
})
