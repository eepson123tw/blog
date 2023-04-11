import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Allen's blog",
  description: 'A VitePress Site',
  head: [
    [
      'meta',
      {
        name: 'google-site-verification',
        content: 'SH2b8gzgTJT_CWEMppSWf_YLQ130Q9PDunRkjaf6EM'
      }
    ]
  ],
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
