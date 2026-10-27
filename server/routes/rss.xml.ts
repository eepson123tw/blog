import { queryCollection } from '@nuxt/content/server';
import RSS from 'rss';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const siteUrl = config.public.siteUrl || 'https://www.aaron-shih.com';
  // 中文文章（Docus 的 docs_zh_tw collection）；date、authors 不在 schema 裡，放在 meta
  const docs = await queryCollection(event, 'docs_zh_tw')
    .select('path', 'title', 'description', 'meta')
    .all();

  const feed = new RSS({
    title: 'Aaron\'s Blog',
    description: 'Frontend development, React, Vue, self-learning, focusing on 3D modules, AI, data visualization, and data analysis exploration.',
    feed_url: `${siteUrl}/rss.xml`,
    site_url: siteUrl,
    language: 'zh-TW',
    pubDate: new Date(),
  });

  const posts = docs
    .filter(doc => doc.title && doc.meta?.date && doc.path !== '/zh-tw/intro')
    .sort((a, b) => new Date(b.meta.date as string).getTime() - new Date(a.meta.date as string).getTime());

  for (const doc of posts) {
    const authors = doc.meta.authors as { name?: string }[] | undefined;
    feed.item({
      title: doc.title,
      description: doc.description || '',
      url: `${siteUrl}${doc.path}`,
      date: new Date(doc.meta.date as string),
      author: authors?.[0]?.name || 'Aaron Shih',
    });
  }

  setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8');
  return feed.xml({ indent: true });
});
