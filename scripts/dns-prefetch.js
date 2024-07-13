import { promises as fs } from "node:fs"; // 修正 fs 模塊導入
import path from "node:path"; // 修正 path 模塊導入
import { parse } from "node-html-parser";
import { glob } from "glob";
import urlRegex from "url-regex";

// 外部 link regex
const urlPattern = /(https?:\/\/[^/]*)/i;
const url = new Set();

async function searchDomain() {
  const files = await glob("docs/.vitepress/dist/assets/**/*.{html,css,js}");
  for (const file of files) {
    const source = await fs.readFile(file, "utf-8");
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
}

async function writeDomain() {
  const files = await glob("docs/.vitepress/dist/**/*.html");
  const links = [...url]
    .map((link) => `<link rel="dns-prefetch" href="${link}">`)
    .join("\n");
  for (const file of files) {
    const source = await fs.readFile(file, "utf-8");
    const root = parse(source);
    const head = root.querySelector("head");
    head.insertAdjacentHTML("afterbegin", links);
    await fs.writeFile(file, root.toString());
  }
}

async function main() {
  await searchDomain();
  await writeDomain();
}

main();
