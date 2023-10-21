<template>
  <div
    class="mb-3 text-amber-5 font-900"
    v-for="(page, key) of pageList"
    v-show="pageList"
    :key="key"
  >
    {{ key }}
    <div class="grid grid-cols-1">
      <ul
        v-for="({ pageLink, pageTitle, data }, index) of page"
        class="text-black flex-1 font-500 p-3 b-dashed border b-blue text-center hover:text-coolGray hover:bg-amber-100"
        style="margin: 0; margin-bottom: 10px"
        :key="index"
      >
        <li v-if="pageLink" style="list-style: none">
          <a :href="pageLink">
            {{ pageTitle
            }}{{ data && data.date ? " " + formatDate(new Date(data.date)) : "" }}
          </a>
          <p class="text-blue" style="margin: 0">{{ data.description }}</p>
        </li>
      </ul>
    </div>
  </div>
  <div
    v-show="!pageList.FrontEnd"
    class="text-black text-xl flex justify-center items-center"
  >
    <p>Loading...</p>
    <p class="i-twemoji-frog" style="margin-left: 20px"></p>
  </div>
</template>

<script setup lang="ts">
import { useData } from "vitepress";
import { ref, onMounted } from "vue";

interface SidebarItem {
  text: string;
  link?: string;
  items?: SidebarItem[];
}

interface FormattedPages {
  pageLink: string;
  pageTitle: string;
  title: string;
  data: { date: string; description: string };
}

const { site: siteData, page, theme, frontmatter } = useData();
const frontmatters = ref<any[]>([]);
let pageList = ref<Record<string, FormattedPages[]>>({});

// TODO:fix this code
onMounted(async () => {
  const markdownFiles = import.meta.glob("../view/**/*.md");
  const allFrontmatters: any[] = [];
  for (const path in markdownFiles) {
    const module: any = await markdownFiles[path]();
    allFrontmatters.push(module.__pageData.frontmatter);
  }
  frontmatters.value = allFrontmatters;
  pageList.value = pageFormate(siteData.value.themeConfig.sidebar);
  console.log(pageList);
});

// date formate
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0 based
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};
// 組出map
const pageFormate = (sidebar: SidebarItem[]): Record<string, FormattedPages[]> => {
  const mapRecursion = (
    childList: SidebarItem[],
    propsTitle: string,
    map: Record<string, FormattedPages[]>
  ) => {
    if (childList instanceof Array && childList.length) {
      childList.forEach((child) => {
        if (child.items && child.items.length) {
          mapRecursion(child.items, child.text, map);
        }
      });
    }
    map[propsTitle] = childList
      .filter((item) => item.link)
      .map((item) => ({
        pageLink: item.link as string,
        pageTitle: item.text,
        title: propsTitle,
        data: frontmatters.value.find(
          ({ title }) =>
            title.replaceAll(/\s/gi, "") === item.text.replaceAll(/\s/gi, "")
        ),
      }))
      .sort(
        (a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf()
      );
  };

  return sidebar.reduce((acc, cur) => {
    if (cur.items && cur.items.length) {
      mapRecursion(cur.items, cur.text, acc);
    }
    return acc;
  }, {} as Record<string, FormattedPages[]>);
};
</script>

