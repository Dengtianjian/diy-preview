<template>
  <n-modal v-model:show="show" @after-leave="closeModal">
    <g-panel class="details-panel" title="构建项目">
      <section class="details-header">
        <img
          class="technology-icon"
          src="https://gw.alipayobjects.com/zos/antpim/RVZCLhxlPEndObdfjlPE.jpg"
          alt=""
        />
        微信小程序
      </section>
      <section class="technology-summary">
        微信小程序，小程序的一种，英文名Wechat Mini
        Program，是一种不需要下载安装即可使用的应用，它实现了应用“触手可及”的梦想，用户扫一扫或搜一下即可打开应用。
      </section>
      <n-alert title="已经有项目在构建中" type="error" v-show="hasBuilding">
        一次仅允许构建一个项目，请等候已有项目构建完成再执行
      </n-alert>
      <n-button
        class="build-start_button"
        block
        type="primary"
        :loading="loading"
        :disabled="hasBuilding"
        @click="buildStart"
        >构建</n-button
      >
    </g-panel>
  </n-modal>
</template>

<script lang="ts" setup>
import { NModal, NAlert, useMessage } from "naive-ui";

const Props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  hasBuilding: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["update:show", "buildStart"]);

function closeModal() {
  emits("update:show", false);
}

function buildStart() {
  if (Props.hasBuilding || Props.loading) return;
  emits("buildStart");
}
</script>

<style scoped>
.details-panel {
  width: 600px;
  /* min-height: 300px; */
}
.details-header {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 20px;
}
.technology-icon {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: var(--border-radius);
}
.technology-summary {
  margin: 20px 10px;
  line-height: 20px;
  font-size: 14px;
  color: #999;
}
.build-start_button {
  margin-top: 20px;
}
</style>
