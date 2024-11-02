import { writeFileSync } from 'node:fs';

import { Feed } from 'feed';
import path from 'path';
import { createContentLoader } from 'vitepress';
export default async function generateFeed(
  hostname: string,
  outDir: string,
): Promise<any> {
  const feed = new Feed({
    title: 'Aaron Shih',
    description: 'My personal blog',
    id: hostname,
    link: hostname,
    language: 'en',
    favicon: `${hostname}/favicon.ico`,
    copyright: 'Copyright (c) 2021-present, Aaron Shih',
  });

  const posts = await createContentLoader('/view/**/*.md', {
    excerpt: true,
    render: true,
  }).load();

  posts.sort(
    (a, b) =>
      +new Date(b.frontmatter.date as string) - +new Date(a.frontmatter.date as string),
  );

  for (const { url, excerpt, frontmatter, html } of posts) {
    feed.addItem({
      title: frontmatter.title,
      id: `${hostname}${url}`,
      link: `${hostname}${url}`,
      description: excerpt,
      content: html,
      author: [
        {
          name: 'AaronShih',
          email: 'eepson123@gmial.com',
          link: '',
        },
      ],
      date: frontmatter.date,
    });
  }

  await new Promise(() => writeFileSync(path.join(outDir, 'rss.xml'), feed.rss2()));
}
