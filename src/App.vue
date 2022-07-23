<script setup lang="ts">
import { version } from "../package.json";
import { ref } from "vue";
import { NSpin, NConfigProvider } from "naive-ui";
import userService from "./service/userService";
import projectPinService from "./service/projectPinService";
import userStore from "./store/userStore";
import globalStore from "./store/globalStore";
import { Toast } from "vant";

import hljs from "highlight.js";
import json from "highlight.js/lib/languages/json";
hljs.registerLanguage("json", json);

window.onerror = function () {
  Toast("控制台有报错");
  globalStore.consoleErrorCount++;
};

const pageLoading = ref<boolean>(false);
userService
  .silentLogin()
  .then(() => {
    if (userStore.isLogin) {
      projectPinService.getPins();
    }
  })
  .finally(() => {
    pageLoading.value = false;
  });
</script>

<template>
  <n-spin v-show="pageLoading" style="
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
    " description="页面渲染中"></n-spin>
  <n-config-provider :hljs="hljs">
    <n-message-provider>
      <router-view v-if="!pageLoading"></router-view>
    </n-message-provider>
  </n-config-provider>
  <footer class="page-footer" v-show="globalStore.showFooter">{{ version }} <a href="mailto:mail@isdtj.com">联系我</a>
  </footer>
</template>

<style scoped>
.page-footer {
  margin: 40px 0 20px;
  text-align: center;
  color: var(--font-light-color);
  user-select: none;
}
</style>
