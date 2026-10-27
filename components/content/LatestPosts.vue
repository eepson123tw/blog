<template>
  <section v-if="posts?.length" class="my-10">
    <h2 class="mb-4 scroll-m-20 text-2xl font-semibold tracking-tight">
      {{ t('latestPosts') }}
    </h2>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="post in posts"
        :key="post._path"
        :to="post._path"
        class="group flex flex-col rounded-lg border bg-background/80 p-4 transition-colors hover:border-primary"
      >
        <span class="line-clamp-2 font-semibold group-hover:text-primary">{{ post.title }}</span>
        <span v-if="post.description" class="mt-1 line-clamp-2 text-sm text-muted-foreground">{{ post.description }}</span>
        <span class="mt-auto flex gap-3 pt-3 text-xs text-muted-foreground">
          <span>{{ formatDate(post.date) }}</span>
          <span v-if="post.read">~ {{ post.read }} min</span>
        </span>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ limit?: number }>(), { limit: 6 });

const { t, locale, defaultLocale, availableLocales } = useI18n();
const otherLocales = availableLocales.filter(l => l !== defaultLocale);

const { data: posts } = await useAsyncData(`latest-posts-${locale.value}`, async () => {
  const docs = await queryContent()
    .where({ date: { $exists: true }, navigation: { $ne: false } })
    .only(['_path', 'title', 'description', 'date', 'read'])
    .find();

  return docs
    .filter((doc) => {
      const segments = doc._path!.split('/').filter(Boolean);
      if (locale.value === defaultLocale)
        return !otherLocales.includes(segments[0]) && segments.length > 1;
      return segments[0] === locale.value && segments.length > 2;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, props.limit);
}, { watch: [locale] });

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(locale.value, { year: 'numeric', month: 'short', day: 'numeric' });
}
</script>
