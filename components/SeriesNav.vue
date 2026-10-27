<template>
  <nav v-if="series && series.items.length > 1" class="my-6 rounded-lg border p-4 text-sm">
    <div class="mb-2 font-semibold">
      {{ t('seriesProgress', { current: series.index + 1, total: series.items.length }) }}
    </div>
    <ol class="mb-3 flex flex-wrap gap-1.5">
      <li v-for="(item, i) in series.items" :key="item._path">
        <NuxtLink
          :to="item._path"
          :title="item.title"
          class="flex size-7 items-center justify-center rounded-md border text-xs transition-colors"
          :class="i === series.index ? 'border-primary bg-primary text-primary-foreground' : 'hover:border-primary'"
        >
          {{ i + 1 }}
        </NuxtLink>
      </li>
    </ol>
    <div class="flex justify-between gap-4">
      <NuxtLink v-if="series.prev" :to="series.prev._path" class="line-clamp-1 text-muted-foreground hover:text-primary">
        ← {{ series.prev.title }}
      </NuxtLink>
      <span v-else />
      <NuxtLink v-if="series.next" :to="series.next._path" class="line-clamp-1 text-right text-muted-foreground hover:text-primary">
        {{ series.next.title }} →
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
// Series are files named `<name>-NNN.md` in the same folder, e.g. react-001 … react-007
const props = defineProps<{ path: string }>();

const { t } = useI18n();

const match = props.path.match(/^(.*\/)([a-z]+)-\d{3}$/);

const { data: series } = await useAsyncData(`series-${props.path}`, async () => {
  if (!match)
    return null;
  const [, dir, name] = match;
  const pattern = new RegExp(`^${dir}${name}-\\d{3}$`);
  const items = (await queryContent(dir)
    .only(['_path', 'title'])
    .find())
    .filter(doc => pattern.test(doc._path!))
    .sort((a, b) => a._path!.localeCompare(b._path!));
  const index = items.findIndex(item => item._path === props.path);
  return { items, index, prev: items[index - 1], next: items[index + 1] };
});
</script>
