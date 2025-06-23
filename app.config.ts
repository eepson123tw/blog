
export default defineAppConfig({
  shadcnDocs: {
    site: {
      name: 'Aaron\'s blog',
      description: '前端開發、React、Vue、自主學習，專注於 3D 模組、AI、資料視覺化與數據分析的探索，助力網頁設計與轉職之路。',
      ogImageComponent: 'BlogPost',
      ogImageColor: 'dark',
    },
    theme: {
      customizable: true,
      color: 'orange',
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
      nav: [
        {
          title: 'FrontEnd',
          to: '/frontend',
        },
        { title: 'BackEnd', to: '/backend' },
        {
          title: 'AIEnd',
          to: '/aiend',
        },
        { title: 'SmallTalk', to: '/smalltalk' },

      ],
      links: [{
        icon: 'lucide:github',
        to: 'https://github.com/eepson123tw',
        target: '_blank',
      }],
    },
    aside: {
      useLevel: true,
      collapse: false,
      collapseLevel: 1,
      folderStyle: 'default',
    },
    main: {
      breadCrumb: true,
      showTitle: true,
    },
    banner: {
      enable: true,
      showClose: true,
      content: 'Welcome to **Aaron Blog**! en and jp version is now updating! 🎉',
      to: '/',
      target: '_self',
      border: true,
    },
    footer: {
      credits:'footer.credits',
      links: [{
        icon: 'lucide:qr-code',
        to: 'https://bento.me/routing-in-the-dev',
        target: '_blank',
      }, {
        icon: 'lucide:linkedin',
        to: 'https://www.linkedin.com/in/aaron-shih',
        target: '_blank',
      }, {
        icon: 'lucide:rss',
        to: 'https://www.aaron-shih.com/rss.xml',
        target: '_blank',
      }],
    },
    toc: {
      enable: true,
      enableInMobile: false,
      enableInHomepage: false,
      title: 'On This Page',
      links: [{
        title: 'Star on GitHub',
        icon: 'lucide:star',
        to: 'https://github.com/eepson123tw/blog',
        target: '_blank',
      }, {
        title: 'Create Issues',
        icon: 'lucide:circle-dot',
        to: 'https://github.com/eepson123tw/blog/issues',
        target: '_blank',
      }],
    },
    search: {
      enable: true,
      inAside: false,
      style: 'input',
    },
    gitTalk: {
      enable: true,
    },
  },
});
