<template>
  <div class="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
    <span class="flex items-center gap-1.5">
      <UIcon name="i-lucide-calendar" class="size-4 text-primary" />
      <span class="font-medium text-default">{{ m.createTime }}</span>
      <time :datetime="String(date)">{{ formattedDate }}</time>
    </span>
    <span v-if="read" class="flex items-center gap-1.5">
      <UIcon name="i-lucide-clock" class="size-4 text-primary" />
      <span class="font-medium text-default">{{ m.readTime }}</span>
      <span>~ {{ read }} {{ m.minutes }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  date: string;
  read?: string | number;
}>();

const { locale, m } = useBlog();

const formattedDate = computed(() => new Date(props.date).toLocaleDateString(locale.value, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}));
</script>
