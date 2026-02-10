import { serverQueryContent } from '#content/server';

export default defineEventHandler(async (event) => {
  const siteUrl = 'https://www.aaron-shih.com';
  const contentList = await serverQueryContent(event).find();

  const urls = contentList
    .filter((c: any) => c._path && !c._path.includes('/_'))
    .map((c: any) => {
      const path = c._path;
      const lastmod = c.date
        ? new Date(c.date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];
      return `  <url>
    <loc>${siteUrl}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  setHeader(event, 'Content-Type', 'application/xml');
  return xml;
});
