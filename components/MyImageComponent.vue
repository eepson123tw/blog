<template>
  <nuxt-img
    :src="imgSrc"
    width="400"
    height="400"
  />
</template>

<script setup lang="ts">
defineProps({
  imgSrc: {
    type: String,
    required: true,
  },
});
</script>
