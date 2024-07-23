// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import Theme from "vitepress/theme";
import GitTalk from "../../component/GitTalk.vue";
import Categories from "../../component/Categories.vue";
import PageInfo from "../../component/PageInfo.vue";
import "./style.css";
import "gitalk/dist/gitalk.css";
import "element-plus/dist/index.css";
import "./rainbow.css";
import "./overide.css";
import "uno.css";

export default {
  ...Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  enhanceApp({ app, router, siteData }) {
    app.component("GitTalk", GitTalk);
    app.component("Categories", Categories);
    app.component("PageInfo", PageInfo);
    import("element-plus").then((module) => {
      app.use(module);
    });
  },
};
