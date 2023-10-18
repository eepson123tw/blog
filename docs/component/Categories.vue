<template>
  <div
    class="flex b-blue b-1 mx-2 mb-2 justify-center items-start flex-col b-solid p-3 text-amber-5 bg-black font-900"
    v-for="(page, key) of pageList"
    :key="key"
  >
    {{ key }}
    <ul
      v-for="({ pageLink, pageTitle, data }, index) of page"
      class="text-blue flex-1 font-500"
      :key="index"
    >
      <li v-if="pageLink">
        <a :href="pageLink">
          {{ pageTitle
          }}{{ data && data.date ? " - " + formatDate(new Date(data.date)) : "" }}
        </a>
      </li>
    </ul>
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
  data: { date: string };
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
});
// date formate
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0 based
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
// 組出map
const pageFormate = (sidebar: SidebarItem[]): Record<string, FormattedPages[]> => {
  const mapRecursion = (
    childList: SidebarItem[],
    title: string,
    map: Record<string, FormattedPages[]>
  ) => {
    if (childList instanceof Array && childList.length) {
      childList.forEach((child) => {
        if (child.items && child.items.length) {
          mapRecursion(child.items, child.text, map);
        }
      });
    }
    map[title] = childList
      .filter((item) => item.link)
      .map((item) => ({
        pageLink: item.link as string,
        pageTitle: item.text,
        title: title,
        data: frontmatters.value.find(({ title }) => title === item.text),
      }));
  };

  return sidebar.reduce((acc, cur) => {
    if (cur.items && cur.items.length) {
      mapRecursion(cur.items, cur.text, acc);
    }
    return acc;
  }, {} as Record<string, FormattedPages[]>);
};
</script>

