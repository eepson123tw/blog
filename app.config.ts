export default defineAppConfig({
  shadcnDocs: {
    site: {
      name: 'Aaron\'s blog',
      description: '前端開發、React、Vue、自主學習，專注於 3D 模組、AI、資料視覺化與數據分析的探索，助力網頁設計與轉職之路。',
      ogImageComponent: 'NuxtSeo',
      ogImageColor: 'light',
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
          links: [{
            title: 'ESM',
            to: '/frontend/esm',
            description: 'ESM 模組化',
            icon: 'lucide:rocket',
          }],
        },
        { title: 'BackEnd', to: '/backend' },
        { title: 'SmallTalk', to: '/smalltalk' },

      ],
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
    banner: {
      enable: true,
      showClose: true,
      content: 'Welcome to **Aaron Blog** Renewal! 🎉  currently moving old post QQ',
      to: '/',
      target: '_self',
      border: true,
    },
    footer: {
      credits: `All right reserved © ${new Date().getFullYear()} Aaron's Blog`,
      links: [{
        icon: 'lucide:file-user',
        to: 'https://ph-portfolio.zeabur.app/',
        target: '_blank',
      }, {
        icon: 'lucide:linkedin',
        to: 'https://www.linkedin.com/in/aaron-shih',
        target: '_blank',
      }],
    },
    toc: {
      enable: true,
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
    },
    gitTalk: {
      enable: true,
    },
  },
});
