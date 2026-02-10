import { serverQueryContent } from '#content/server';
import RSS from 'rss';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const siteUrl = config.public.siteUrl || 'https://www.aaron-shih.com';
  // Query all markdown content
  const docs = await serverQueryContent(event)
    .where({
      _extension: 'md',
      // Exclude index and intro pages
      _path: { $not: { $in: ['/index', '/intro', '/en/index', '/en/intro', '/ja/index', '/ja/intro'] } },
    })
    .sort({ date: -1 })
    .find();

  // Create RSS feed
  const feed = new RSS({
    title: 'Aaron\'s Blog',
    description: 'Frontend development, React, Vue, self-learning, focusing on 3D modules, AI, data visualization, and data analysis exploration.',
    feed_url: `${siteUrl}/rss.xml`,
    site_url: siteUrl,
    language: 'zh-TW',
    pubDate: new Date(),
  });

  // Add items to feed
  for (const doc of docs) {
    // Skip if no title or date
    if (!doc.title || !doc.date)
      continue;

    // Build the URL path
    const url = `${siteUrl}${doc._path}`;

    feed.item({
      title: doc.title,
      description: doc.description || '',
      url,
      date: new Date(doc.date),
      author: doc.authors?.[0]?.name || 'Aaron Shih',
    });
  }

  // Set content type and return XML
  setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8');
  return feed.xml({ indent: true });
});
