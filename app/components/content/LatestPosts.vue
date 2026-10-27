<template>
  <section v-if="posts?.length" class="my-10">
    <h2 class="mb-4 text-2xl font-semibold">
      {{ m.latestPosts }}
    </h2>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="post in posts"
        :key="post.path"
        :to="post.path"
        class="group flex flex-col rounded-lg border border-default bg-default/80 p-4 transition-colors hover:border-primary"
      >
        <span class="line-clamp-2 font-semibold group-hover:text-primary">{{ post.title }}</span>
        <span v-if="post.description" class="mt-1 line-clamp-2 text-sm text-muted">{{ post.description }}</span>
        <span class="mt-auto flex gap-3 pt-3 text-xs text-muted">
          <span>{{ formatDate(post.date) }}</span>
          <span v-if="post.read">~ {{ post.read }} {{ m.minutes }}</span>
        </span>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Collections } from '@nuxt/content';

const props = withDefaults(defineProps<{ limit?: number }>(), { limit: 6 });

const { locale, collection, m } = useBlog();

// date／read 不在 Docus 的 schema 裡，Content v3 會放進 meta
const { data: posts } = await useAsyncData(`latest-posts-${locale.value}`, async () => {
  const docs = await queryCollection(collection.value as keyof Collections)
    .select('path', 'title', 'description', 'meta')
    .all();

  return docs
    .map(doc => ({ ...doc, date: doc.meta?.date as string | undefined, read: doc.meta?.read as string | undefined }))
    .filter(doc => doc.date && doc.path.split('/').filter(Boolean).length > 2)
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime())
    .slice(0, props.limit);
}, { watch: [locale] });

function formatDate(date?: string) {
  return date ? new Date(date).toLocaleDateString(locale.value, { year: 'numeric', month: 'short', day: 'numeric' }) : '';
}
</script>
