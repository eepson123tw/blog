import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Allen's blog",
  description: 'A VitePress Site',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'FrontEnd',
        items: [
          { text: 'dom', link: '/view/posts/dom' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    sidebar: [
      {
        text: 'FrontEnd',
        items: [{ text: 'dom', link: '/view/posts/dom' }],
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
