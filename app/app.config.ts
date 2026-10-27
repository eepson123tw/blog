export default defineAppConfig({
  ui: {
    colors: {
      primary: 'orange',
      neutral: 'zinc',
    },
  },
  seo: {
    title: 'Aaron\'s Blog',
    description: '前端開發、React、Vue、自主學習，專注於 3D 模組、AI、資料視覺化與數據分析的探索，助力網頁設計與轉職之路。',
  },
  header: {
    title: 'Aaron\'s Blog',
    logo: {
      light: '/logo.png',
      dark: '/logo.png',
      alt: 'Aaron\'s Blog',
    },
  },
  navigation: {
    sub: 'header',
  },
  socials: {
    github: 'https://github.com/eepson123tw',
    linkedin: 'https://www.linkedin.com/in/aaron-shih',
  },
  toc: {
    title: '本頁目錄',
    bottom: {
      title: 'Links',
      links: [{
        icon: 'i-lucide-star',
        label: 'Star on GitHub',
        to: 'https://github.com/eepson123tw/blog',
        target: '_blank',
      }, {
        icon: 'i-lucide-circle-dot',
        label: 'Create Issues',
        to: 'https://github.com/eepson123tw/blog/issues',
        target: '_blank',
      }, {
        icon: 'i-lucide-rss',
        label: 'RSS',
        to: '/rss.xml',
        target: '_blank',
      }, {
        icon: 'i-lucide-qr-code',
        label: 'Bento',
        to: 'https://bento.me/routing-in-the-dev',
        target: '_blank',
      }],
    },
  },
  github: {
    url: 'https://github.com/eepson123tw/blog',
    branch: 'master',
    rootDir: '',
  },
});
