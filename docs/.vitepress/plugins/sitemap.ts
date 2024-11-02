import { createWriteStream } from 'node:fs';
import { resolve } from 'node:path';

import { SitemapStream } from 'sitemap';

export default async function generateSiteMap(outDir: string, links: Array<any>) {
  const sitemap = new SitemapStream({
    hostname: 'https://www.aaron-shih.com/',
    lastmodDateOnly: true,
  });
  const writeStream = createWriteStream(resolve(outDir, 'sitemap.xml'));

  sitemap.pipe(writeStream);
  links.forEach((link) => {
    sitemap.write(link);
  });
  sitemap.end();
  await new Promise((r) => writeStream.on('finish', r));
}
