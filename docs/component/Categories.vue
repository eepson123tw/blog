<template>
  <div v-for="(page, key) of pageList" :key="key">
    {{ key }}
    <ul v-for="({ pageLink, pageTitle }, index) of page" :key="index">
      <li v-if="pageLink">{{ pageTitle }}</li>
    </ul>
  </div>
</template>

<script setup>
import { useData } from 'vitepress'

const { site: siteData, page, theme } = useData()

const pageFormate = (sidebar) => {
  const mapRecursion = (childList, title, map) => {
    if (childList instanceof Array && childList.length) {
      childList.forEach((child) => {
        if (child.items && child.items.length) {
          mapRecursion(child.items, child.text, map)
        }
      })
    }
    //TODO 是否要重新包種類 套用 tailwind
    map[title] = childList.map((item) =>
      item.link
        ? {
            pageLink: item.link,
            pageTitle: item.text,
          }
        : {}
    )
  }
  return sidebar.reduce((acc, cur) => {
    if (cur.items && cur.items.length) {
      mapRecursion(cur.items, cur.text, acc)
    }
    return acc
  }, {})
}

const pageList = pageFormate(siteData.value.themeConfig.sidebar)
</script>

