<template>
  <div
    class="px-4 py-6 md:px-8"
    :class="[config.main.padded && 'container']"
  >
    <ContentRenderer
      :key="page._id"
      :value="page"
    />
  </div>
</template>

<script setup lang="ts">
// import { BlogPost } from '#components';

const { page } = useContent();
const config = useConfig();

useSeoMeta({
  title: `${page.value?.title ?? '404'} - ${config.value.site.name}`,
  ogTitle: page.value?.title,
  description: page.value?.description,
  ogDescription: page.value?.description,
  ogImage: config.value.site.ogImage,
  twitterCard: 'summary_large_image',

});

useHead({
  meta: [{ property: 'article:modified_time', content: `${page.value?.date}` }],
});

defineOgImageComponent('BlogPost', {
  title: page.value?.title,
  description: page.value?.description,
  colorMode: 'light',
});
</script>
