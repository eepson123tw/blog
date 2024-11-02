// vitepress-plugin-dns-prefetch.js
import { promises as fs } from 'node:fs';

// import path from 'node:path';
import { glob } from 'glob';
import { parse } from 'node-html-parser';
import urlRegex from 'url-regex';

const urlPattern = /(https?:\/\/[^/]*)/i;

export default function dnsPrefetchPlugin() {
  return {
    name: 'dns-prefetch',
    apply: 'build',
    async buildEnd() {
      const url = new Set();
      const files = await glob('docs/.vitepress/dist/assets/**/*.{html,css,js}');

      for (const file of files) {
        const source = await fs.readFile(file, 'utf-8');
        const matches = source.match(urlRegex({ strict: true }));
        if (matches) {
          for (const match of matches) {
            const domain = match.match(urlPattern);
            if (domain) {
              url.add(domain[1]);
            }
          }
        }
      }

      const links = [...url]
        .map((link) => `<link rel="dns-prefetch" href="${link}">`)
        .join('\n');

      const htmlFiles = await glob('docs/.vitepress/dist/**/*.html');

      for (const file of htmlFiles) {
        const source = await fs.readFile(file, 'utf-8');
        const root = parse(source);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const head = root.querySelector('head')!;
        head.insertAdjacentHTML('afterbegin', links);
        await fs.writeFile(file, root.toString());
      }
    },
  };
}
