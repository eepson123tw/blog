<template>
  <div class="mx-auto max-w-screen-md">
    <section
      class="my-4 text-left"
    >
      <div class="flex items-center gap-1 text-gray-700 dark:text-white">
        <span class="iconify  i-lucide:star self-center text-yellow-500" aria-hidden="true" style="font-size:16px;" />
        <span class="font-semibold">{{ t('createTime') }}:</span>
        <span>{{ formattedDate }}</span>
      </div>
      <div class="flex gap-1 text-gray-700 dark:text-white">
        <span class="iconify  i-lucide:ambulance self-center text-red-500" aria-hidden="true" style="font-size:16px;" />
        <span class="font-semibold">{{ t('readTime') }}:</span>
        <span>~ {{ read }} minutes</span>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  date: string;
  read: string;
}>();
const { t } = useI18n();
const formattedDate = computed(() => {
  const dt = new Date(props.date);
  return dt.toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
});
</script>
