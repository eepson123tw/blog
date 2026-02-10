<template>
  <div id="gitalk-container" />
</template>

<script setup lang="ts">
import * as Gitalk from 'gitalk';
import { onMounted } from 'vue';
import 'gitalk/dist/gitalk.css';

const config = useRuntimeConfig();

onMounted(() => {
  const owner = config.public.gitalkOwner as string || 'eepson123tw';

  const commentConfig = {
    enable: true,
    clientID: config.public.gitalkClientId as string,
    clientSecret: config.public.gitalkClientSecret as string,
    repo: config.public.gitalkRepo as string || 'blog',
    owner,
    admin: [owner],
    githubID: owner,
    id: decodeURI(window.location.pathname),
    language: 'zh-TW',
    proxy: 'https://cors-anywhere.azm.workers.dev/https://github.com/login/oauth/access_token',
    distractionFreeMode: true,
  };

  // eslint-disable-next-line new-cap
  const gitalk = new Gitalk.default(commentConfig);
  gitalk.render('gitalk-container');
});
</script>

<style scoped>
#gitalk-container {
  color: black !important;
}
</style>
