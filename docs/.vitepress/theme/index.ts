// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import Theme from 'vitepress/theme'
import GitTalk from '../../component/GitTalk.vue'
import './style.css'
import 'gitalk/dist/gitalk.css'
import 'element-plus/dist/index.css'

export default {
  ...Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.component('GitTalk', GitTalk)
    import('element-plus').then((module) => {
      app.use(module)
    })
  }
}
