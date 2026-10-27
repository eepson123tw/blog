<template>
  <nav v-if="series && series.items.length > 1" class="rounded-lg border border-default p-4 text-sm">
    <div class="mb-2 font-semibold">
      {{ m.seriesProgress(series.index + 1, series.items.length) }}
    </div>
    <ol class="mb-3 flex flex-wrap gap-1.5">
      <li v-for="(item, i) in series.items" :key="item.path">
        <NuxtLink
          :to="item.path"
          :title="item.title"
          class="flex size-7 items-center justify-center rounded-md border text-xs transition-colors"
          :class="i === series.index ? 'border-primary bg-primary text-inverted' : 'border-default hover:border-primary'"
        >
          {{ i + 1 }}
        </NuxtLink>
      </li>
    </ol>
    <div class="flex justify-between gap-4">
      <NuxtLink v-if="series.prev" :to="series.prev.path" class="line-clamp-1 text-muted hover:text-primary">
        ← {{ series.prev.title }}
      </NuxtLink>
      <span v-else />
      <NuxtLink v-if="series.next" :to="series.next.path" class="line-clamp-1 text-right text-muted hover:text-primary">
        {{ series.next.title }} →
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { Collections } from '@nuxt/content';

// Series are files named `<name>-NNN.md` in the same folder, e.g. react-001 … react-007
const props = defineProps<{ path: string }>();

const { collection, m } = useBlog();

const match = props.path.match(/^(.*\/)([a-z]+)-\d{3}$/);

const { data: series } = await useAsyncData(`series-${props.path}`, async () => {
  if (!match)
    return null;
  const [, dir, name] = match;
  const items = (await queryCollection(collection.value as keyof Collections)
    .where('path', 'LIKE', `${dir}${name}-%`)
    .select('path', 'title')
    .all())
    .filter(doc => /-\d{3}$/.test(doc.path))
    .sort((a, b) => a.path.localeCompare(b.path));
  const index = items.findIndex(item => item.path === props.path);
  return { items, index, prev: items[index - 1], next: items[index + 1] };
});
</script>
