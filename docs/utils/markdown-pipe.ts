import type { Plugin } from "vite";

export function MarkdownTransform(): Plugin {
  return {
    name: "md-transform",
    enforce: "pre",
    async transform(code, id) {
      if (!id.match(/\.md\b/)) return null;

      // convert links to components
      const linkRegex = /\[(.+?)\]\((.+?)\)/g;
      let matches = linkRegex.exec(code);
      while (matches) {
        const [text, link] = matches.slice(1);
        code = code.replace(
          matches[0],
          `<CustomLink title="${text}" href="${link}" />`
        );
        matches = linkRegex.exec(code);
      }

      return code;
    },
  };
}
