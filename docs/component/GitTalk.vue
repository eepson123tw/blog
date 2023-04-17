<template>
  <div id="gitalk-container"></div>
</template>

<script setup>
import Gitalk from 'gitalk'
import { onMounted } from 'vue'
onMounted(() => {
  const commentConfig = {
    enable: true,
    clientID: 'deceb2d7071942b4ff48',
    clientSecret: 'b928a71e4e41bc0991623142505926522a68d8d8',
    repo: 'https://github.com/eepson123tw/blog',
    owner: 'eepson123tw',
    admin: ['eepson123tw'],
    githubID: 'eepson123tw',
    id: decodeURI(window.location.pathname),
    language: 'zh-TW',
    proxy:
      'https://cors-anywhere.azm.workers.dev/https://github.com/login/oauth/access_token',
    distractionFreeMode: true,
  }
  const gitalk = new Gitalk(commentConfig)
  gitalk.render('gitalk-container')
})
</script>


