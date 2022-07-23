<template>
  <header :class="{ 'header-border': border }">
    <div
      class="header-warpper"
      :class="[`header-${size}`]"
      :style="{
        width: adaptive
          ? 'var(--large-container-width)'
          : 'var(--container-width)',
      }"
    >
      <router-link to="/">
        <img
          class="header-logo"
          src="https://gw.alipayobjects.com/mdn/prod_resou/afts/img/A*OwZWQ68zSTMAAAAAAAAAAABkARQnAQ"
        />
      </router-link>
      <nav>
        <router-link
          :to="navItem.url"
          v-for="navItem in navs"
          :key="navItem.key"
          >{{ navItem.text }}</router-link
        >
      </nav>
      <div class="user">
        <div class="login-actions" v-if="!userStore.isLogin">
          <router-link to="/user/signin">
            <n-button type="primary">登入</n-button>
          </router-link>
        </div>
        <div class="user-actions" v-if="userStore.isLogin">
          <section
            class="error-remind"
            v-show="globalStore.consoleErrorCount"
            @click="globalStore.consoleErrorCount = 0"
            title="报错计数归零"
          >
            控制台有 {{ globalStore.consoleErrorCount }} 个错误
          </section>
          <router-link class="user_action-item" to="/dashboard"
            >工作台</router-link
          >
          <router-link class="user_action-item user-notice" to>
            <i class="shoutao st-notice"></i>
          </router-link>
          <n-popover
            class="user_action-item"
            trigger="hover"
            placement="bottom-end"
          >
            <template #trigger>
              <div class="user-action_info user_action-item">
                <n-avatar
                  round
                  :src="userStore.user.avatar?.url"
                  :size="size === 'mini' ? 'small' : 'medium'"
                  >{{
                    userStore.user.nickname || userStore.user.username
                  }}</n-avatar
                >
                <i class="shoutao st-unfold"></i>
              </div>
            </template>
            <div class="user_info-popover">
              <p>{{ userStore.user.nickname || userStore.user.username }}</p>
              <div class="user_action-links">
                <div class="user_action-link_group">
                  <router-link class="user_action-link" to
                    >个人主页</router-link
                  >
                  <router-link class="user_action-link" to
                    >账户设置</router-link
                  >
                </div>
                <div class="user_action-link_group">
                  <div class="user_action-link" @click="logout">退出登录</div>
                </div>
              </div>
            </div>
          </n-popover>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { NPopover, NAvatar, useMessage } from "naive-ui";
import { Toast } from "vant";
import userService from "../../service/userService";
import userStore from "../../store/userStore";
import globalStore from "../../store/globalStore";
const NMessage = useMessage();
defineProps({
  adaptive: {
    type: Boolean,
    defualt: false,
  },
  border: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: "default", //* default small mini
  },
});

const navs: Array<{
  url: string;
  text: string;
  key: string;
}> = [];

function logout() {
  userService.accountLogout().then((res) => {
    NMessage.success("退出成功");
  });
}
</script>

<style scoped>
header {
  background-color: white;
}
header.header-border {
  border-bottom: 1px solid #eee;
}
.header-warpper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  width: var(--container-width);
  height: 90px;
}
.header-small {
  height: 60px;
}
.header-mini {
  height: 30px;
}
.header-logo {
  flex-shrink: 0;
  height: 32px;
}
.header-mini .header-logo {
  height: 26px;
}
header nav {
  display: flex;
  margin: 0 20px 0 100px;
  font-size: 16px;
}
.header-mini nav {
  font-size: 14px;
}
header nav a {
  padding: 0 20px;
  color: var(--font-color);
  text-decoration: none;
}
header nav a:hover {
  color: var(--primary-color);
}

header .user {
  flex-shrink: 0;
}
header .login-actions {
  display: inline-block;
}
header .login-actions button {
  margin: 0 5px;
}

.error-remind {
  margin-right: 10px;
  color: var(--color-red);
  font-weight: bold;
  cursor: pointer;
}
.user-actions {
  display: inline-flex;
  align-items: center;
}
.user-actions a {
  text-decoration: none;
  font-size: 16px;
  color: var(--font-color);
}
.header-mini .user-actions a {
  font-size: 14px;
}
.user-actions a:hover {
  color: var(--primary-color);
}
.user-action_info {
  display: flex;
  align-items: center;
}
.user-action_info i {
  padding-left: 5px;
  font-size: 12px;
  font-weight: bold;
}
.user_info-popover {
  width: 200px;
}
.user_action-item {
  cursor: pointer;
}
.user_action-item:not(:last-child) {
  margin-right: 30px;
}
.user-notice i {
  font-size: 22px;
}
.header-mini .user-notice i {
  font-size: 20px;
}

/* 用户信息弹窗 */
.user_info-popover {
  padding: 10px;
}
.user_info-popover p {
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 1px;
}
.user_action-links a {
  display: block;
  text-decoration: none;
  font-size: 14px;
  color: var(--font-color);
}
.user_action-link_group {
  border-top: 1px solid #eee;
}
.user_action-link {
  padding: 15px 0;
}
.user_action-link_group:last-child .user_action-link {
  padding-bottom: 0px;
}
.user_action-link:hover {
  color: var(--primary-color);
}
</style>
