import { resolve } from "node:path";
import { SitemapStream } from "sitemap";
import { createWriteStream } from "node:fs";

export default async function generateSiteMap(outDir: string, links: Array<any>) {
  const sitemap = new SitemapStream({
    hostname: "https://allenvitepress.zeabur.app/",
    lastmodDateOnly: true,
  });
  const writeStream = createWriteStream(resolve(outDir, "Sitemap.xml"));

  sitemap.pipe(writeStream);
  links.forEach((link) => {
    sitemap.write(link);
  });
  sitemap.end();
  await new Promise((r) => writeStream.on("finish", r));
}
