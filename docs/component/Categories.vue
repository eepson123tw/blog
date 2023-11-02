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
        v-for="({ title, link, description, date, text }, index) of page"
        class="text-black flex-1 font-500 p-3 b-dashed border b-blue text-center hover:text-coolGray hover:bg-amber-100"
        style="margin: 0; margin-bottom: 10px"
        :key="index"
      >
        <li v-if="link" style="list-style: none">
          <a :href="link">
            {{ title }}{{ date ? " " + formatDate(new Date(date)) : `${text || ""}` }}
          </a>
          <p class="text-blue" style="margin: 0">{{ description }}</p>
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
import { useSidebar } from "vitepress/theme";
import { ref, onMounted } from "vue";

interface SidebarItem {
  text: string;
  link?: string;
  items?: SidebarItem[];
}

interface sidebarObj {
  collapsed: boolean;
  items: SidebarItem[];
  text: string;
}

interface FormattedPages {
  text: string;
  link: string;
  title: string;
  date: string;
  description: string;
}

interface Formatter {
  date: string;
  description: string;
  layout: string;
  title: string;
}

interface Fcontructor {
  __pageData: {
    frontmatter: Formatter;
  };
}

const { site: siteData, page, theme, frontmatter } = useData();
const frontmatters = ref<Formatter[]>([]);
let pageList = ref<Record<string, FormattedPages[]>>({});

// TODO:fix this code
onMounted(async () => {
  const markdownFiles = import.meta.glob("../view/**/*.md");
  const allFrontmatters: Formatter[] = [];
  for (const path in markdownFiles) {
    const module: Fcontructor = (await markdownFiles[path]()) as Fcontructor;
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
  return `${year}/${month}/${day}`;
};
// 組出map
const pageFormate = (sidebar: {
  [key: string]: sidebarObj[];
}): Record<string, FormattedPages[]> => {
  const mapRecursion = (
    childList: SidebarItem[],
    propsTitle: string,
    map: Record<string, SidebarItem[]>
  ) => {
    if (childList instanceof Array && childList.length) {
      childList.forEach((child) => {
        if (child.items && child.items.length) {
          mapRecursion(child.items, child.text, map);
        }
      });
    }
    map[propsTitle] = {
      ...childList,
    };
  };

  const res = Object.keys(sidebar).reduce((acc, cur) => {
    if (cur) {
      sidebar[cur][0] && mapRecursion(sidebar[cur][0].items, sidebar[cur][0].text, acc);
    }
    return acc;
  }, {} as Record<string, SidebarItem[]>);

  Object.values(res).forEach((item) => {
    for (let child in item) {
      const cur: Fcontructor = (frontmatters.value.find(
        (target) => target.title === item[child].text
      ) || {}) as Fcontructor;
      item[child] = {
        ...item[child],
        ...cur,
      };
    }
  });

  return res as Record<string, FormattedPages[]>;
};
</script>

