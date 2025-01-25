export default defineAppConfig({
  shadcnDocs: {
    site: {
      // umami:{
      //   enable: true,
      //   src: 'https://umami.shadcn.com/umami.js',
      //   dataWebsiteId: '2199c498-99bb-4248-adae-96f3e317e817',
      // },
      name: 'Aaron\'s blog',
      description: '前端開發、React、Vue、自主學習，專注於 3D 模組、AI、資料視覺化與數據分析的探索，助力網頁設計與轉職之路。',
    },
    theme: {
      customizable: true,
      color: 'zinc',
      radius: 0.5,
    },
    header: {
      title: 'Aaron\'s Blog',
      showTitle: true,
      darkModeToggle: true,
      logo: {
        light: '/logo.png',
        dark: '/logo.png',
      },
      nav: [],
      links: [{
        icon: 'lucide:github',
        to: 'https://github.com/eepson123tw/blog',
        target: '_blank',
      }],
    },
    aside: {
      useLevel: true,
      collapse: false,
    },
    main: {
      breadCrumb: true,
      showTitle: true,
    },
    footer: {
      credits: 'Copyright ©' + new Date().getFullYear(),
      links: [{
        icon: 'lucide:github',
        to: '',
        target: '_blank',
      }],
    },
    toc: {
      enable: true,
      title: 'On This Page',
      links: [{
        title: 'Star on GitHub',
        icon: 'lucide:star',
        to: '',
        target: '_blank',
      }, {
        title: 'Create Issues',
        icon: 'lucide:circle-dot',
        to: '',
        target: '_blank',
      }],
    },
    search: {
      enable: true,
      inAside: false,
    },
  }
});
