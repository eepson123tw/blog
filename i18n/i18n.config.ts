export default defineI18nConfig(() => ({
  legacy: false,
  fallbackLocale: 'en',
  messages: {
    'en': {
      title: 'Language',
      subtitle: 'Choose your language',
      createTime: 'Create time',
      readTime: 'Read time',
    },
    'zh-TW': {
      title: '選擇語言',
      subtitle: '選擇您的語言',
      createTime: '創建時間',
      readTime: '閱讀時間',
    },
    'ja': {
      title: '言語',
      subtitle: '言語を選択してください',
      createTime: '作成日',
      readTime: '読了時間',
    },
  },
}));
