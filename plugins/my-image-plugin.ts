import { defineNuxtPlugin } from '#app';
import MyImageComponent from '~/components/MyImageComponent.vue';

export default defineNuxtPlugin((nuxtApp) => {
  // 全域註冊 MyImageComponent
  nuxtApp.vueApp.component('CustomImageComponent', MyImageComponent);
});
