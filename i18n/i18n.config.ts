const year = new Date().getFullYear();

export default defineI18nConfig(() => ({
  legacy: false,
  fallbackLocale: 'en',
  messages: {
    'en': {
      'title': 'Language',
      'subtitle': 'Choose your language',
      'createTime': 'Create time',
      'readTime': 'Read time',
      'Aaron\'s Blog': 'Aaron\'s Blog',
      'FrontEnd': 'FrontEnd',
      'BackEnd': 'BackEnd',
      'AIEnd': 'AIEnd',
      'SmallTalk': 'SmallTalk',
      'Star on GitHub': 'Star on GitHub',
      'Create Issues': 'Create Issues',
      'footer': {
        credits: `All right reserved © ${year} Aaron\'s Blog`,
      },
    },
    'zh-TW': {
      'title': '選擇語言',
      'subtitle': '選擇您的語言',
      'createTime': '創建時間',
      'readTime': '閱讀時間',
      'Aaron\'s Blog': 'Aaron 的部落格',
      'FrontEnd': '前端戰場',
      'BackEnd': '後端空投',
      'AIEnd': 'AI 索求',
      'SmallTalk': '開發迷霧',
      'Star on GitHub': '在 GitHub 上加星',
      'Create Issues': '建立問題',
      'footer': {
        credits: `版權所有 © ${year} Aaron 的部落格`,
      },
    },
    'ja': {
      'title': '言語',
      'subtitle': '言語を選択してください',
      'createTime': '作成日',
      'readTime': '読了時間',
      'Aaron\'s Blog': 'Aaron のブログ',
      'FrontEnd': 'フロントエンド',
      'BackEnd': 'バックエンド',
      'AIEnd': 'AI開発',
      'SmallTalk': '雑談',
      'Star on GitHub': 'GitHub でスター',
      'Create Issues': 'Issue を作成',
      'footer': {
        credits: `© ${year} Aaron のブログ 無断転載禁止`,
      },
    },
  },
}));
