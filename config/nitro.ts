import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import { parseStringPromise } from 'xml2js';
import { genFeed } from '../utils/feed';

const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://www.aaron-shih.com';

export const nitroConfig = {
  publicAssets: [
    {
      baseURL: '/',
      dir: 'public',
    },
  ],
  compressPublicAssets: {
    gzip: true,
    brotli: true,
  },
  prerender: {
    crawlLinks: false,
    failOnError: false,
    routes: ['/sitemap.xml'],
  },
  watchOptions: {
    ignored: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.git/**',
    ],
  },
  hooks: {
    'prerender:generate': async (_route: string, nitro: { options: { output: { publicDir: string } } }) => {
      if (process.env.CI || process.env.SKIP_RSS === 'true') {
        console.warn('Skipping RSS generation in build.');
        return;
      }
      try {
        const response = await fetch(`${siteUrl}/sitemap.xml`, {
          signal: AbortSignal.timeout(10_000),
        });

        if (!response.ok) {
          throw new Error(`Error fetching sitemap: ${response.status} ${response.statusText}`);
        }

        const xmlText = await response.text();
        const parsedSitemap = await parseStringPromise(xmlText);
        const urlEntries = parsedSitemap?.urlset?.url || [];

        const rssXml = await genFeed(urlEntries);
        const outputPath = join(nitro.options.output.publicDir, 'rss.xml');
        writeFileSync(outputPath, rssXml, 'utf-8');
        console.warn(`RSS feed generated at: ${outputPath}`);
      } catch (error) {
        console.error('Failed to generate RSS feed', error);
      }
    },
  },
};
