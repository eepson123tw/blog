// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import Theme from "vitepress/theme";
import { inBrowser } from "vitepress";
import busuanzi from "busuanzi.pure.js";
import "./style.css";
import "gitalk/dist/gitalk.css";
import "element-plus/dist/index.css";
import "uno.css";

export default {
  ...Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  enhanceApp({ app, router, siteData }) {
    import("element-plus").then((module) => {
      app.use(module);
    });
    if (inBrowser) {
      router.onAfterRouteChanged = (to) => {
        busuanzi.fetch();
      };
    }
  },
};
