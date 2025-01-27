<template>
  <div
    class="flex size-full flex-col justify-center p-16"
    :class="[colorMode === 'light' ? 'bg-white' : 'bg-zinc-950']"
    :style="`background-size: 120px 120px; background-image: linear-gradient(to right, ${colorMode === 'light' ? '#e5e7eb' : '#27272a'} 1px, transparent 1px), linear-gradient(to bottom, ${colorMode === 'light' ? '#e5e7eb' : '#27272a'} 1px, transparent 1px);`"
  >
    <div class="mb-4 flex">
      <img
        v-if="colorMode === 'light'"
        :src="logo.light"
        height="65"
        alt="Light Logo"
      >
      <img
        v-else
        :src="logo.dark"
        height="65"
        alt="Dark Logo"
      >
      <span
        v-if="showTitle && siteTitle"
        class="ml-4 self-center break-words text-4xl font-bold"
        :class="[colorMode === 'light' ? 'text-zinc-900' : 'text-zinc-100']"
        v-html="sanitizeText(siteTitle)"
      />
    </div>
    <div class="relative">
      <h1
        class="whitespace-pre-wrap break-words text-8xl font-bold"
        :class="[colorMode === 'light' ? 'text-zinc-900' : 'text-zinc-100']"
        v-html="sanitizeText(title)"
      />
      <p
        class="whitespace-pre-wrap break-words text-4xl leading-tight"
        :class="[colorMode === 'light' ? 'text-zinc-500' : 'text-zinc-400']"
        v-html="sanitizeText(description)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  colorMode?: 'dark' | 'light';
  title: string;
  description: string;
}>();

const { logo, title: siteTitle, showTitle } = useConfig().value.header;

const colorMode = computed(() => {
  return props.colorMode || useConfig().value.site.ogImageColor || 'light';
});

// Function to sanitize and properly handle Chinese text and punctuation
function sanitizeText(text: string) {
  if (!text)
    return '';

  // Convert HTML entities to their corresponding characters
  const decodedText = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  // Add zero-width spaces after Chinese punctuation marks for better line breaks
  // Including 、 (U+3001) and other CJK punctuation marks
  return decodedText.replace(
    /([、，。！？；："'「」『』【】（）〔〕［］｛｝《》〈〉・…～])/g,
    '$1\u200B',
  );
}
</script>

<style scoped>
/* Add support for CJK text wrapping */
.break-words {
  word-break: break-word;
  overflow-wrap: break-word;
  word-wrap: break-word;
}
</style>
