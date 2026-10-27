// Docus 用自己的 i18n 字串；部落格自訂的少量字串放這裡，依目前語系取用
const messages = {
  'zh-tw': {
    createTime: '建立時間',
    readTime: '閱讀時間',
    minutes: '分鐘',
    latestPosts: '最新文章',
    seriesProgress: (current: number, total: number) => `系列第 ${current}／${total} 篇`,
  },
  'en': {
    createTime: 'Created',
    readTime: 'Read time',
    minutes: 'min',
    latestPosts: 'Latest posts',
    seriesProgress: (current: number, total: number) => `Part ${current} of ${total}`,
  },
  'ja': {
    createTime: '作成日',
    readTime: '読了時間',
    minutes: '分',
    latestPosts: '最新記事',
    seriesProgress: (current: number, total: number) => `シリーズ ${current}／${total}`,
  },
};

export function useBlog() {
  const { locale } = useDocusI18n();
  const code = computed(() => (locale.value in messages ? locale.value : 'zh-tw') as keyof typeof messages);
  // 與 Docus 的 collection 命名一致：docs_zh_tw、docs_en、docs_ja
  const collection = computed(() => `docs_${code.value.replace(/-/g, '_')}`);
  const m = computed(() => messages[code.value]);
  return { locale: code, collection, m };
}
