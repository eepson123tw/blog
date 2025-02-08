<template>
  <div
    class="flex size-full items-center justify-center p-16"
    :class="[colorMode === 'light' ? 'bg-white' : 'bg-zinc-950']"
    :style="`
    background-color: ${colorMode === 'light' ? '#e0f7ff' : '#0f172a'};
    background-image:
      radial-gradient(circle at 30% 30%, ${colorMode === 'light' ? 'rgba(0,128,255,0.4)' : 'rgba(128,128,255,0.4)'}, transparent 60%),
      radial-gradient(circle at 70% 70%, ${colorMode === 'light' ? 'rgba(0,200,255,0.3)' : 'rgba(80,80,200,0.3)'}, transparent 60%),
      repeating-linear-gradient(45deg, ${colorMode === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)'}, ${colorMode === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)'} 1px, transparent 1px, transparent 20px),
      repeating-linear-gradient(135deg, ${colorMode === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)'}, ${colorMode === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)'} 1px, transparent 1px, transparent 20px);
    background-size: 150% 150%, 150% 150%, 100% 100%, 100% 100%;
    background-blend-mode: overlay, screen, normal, normal;
  `"
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
    <div class="relative flex flex-col items-center justify-center">
      <h1
        class="whitespace-pre-wrap break-words text-center text-8xl font-bold"
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
    /([，。！？；："'「」『』【】（）〔〕［］｛｝《》〈〉・…～])/g,
    '$1\u200B',
  );
  return decodedText;
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
