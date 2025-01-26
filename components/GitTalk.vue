<template>
  <div id="gitalk-container" />
</template>

<script setup lang="ts">
import * as Gitalk from 'gitalk';
import { onMounted } from 'vue';
import 'gitalk/dist/gitalk.css';

onMounted(() => {
  const commentConfig = {
    enable: true,
    clientID: 'deceb2d7071942b4ff48',
    clientSecret: 'b928a71e4e41bc0991623142505926522a68d8d8',
    repo: 'blog',
    owner: 'eepson123tw',
    admin: ['eepson123tw'],
    githubID: 'eepson123tw',
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
