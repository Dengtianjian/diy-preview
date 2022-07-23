<template>
  <ul class="aside-sub-tabs-list" @click="switchTab">
    <li
      class="aside-sub-tabs-item"
      :class="{
        'aside-sub-tabs-item_active': currentActiveTab === tabItem.key,
      }"
      :data-key="tabItem.key"
      v-for="tabItem in tabs"
      :key="tabItem.key"
    >
      {{ tabItem.title }}
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { PropType, ref } from "vue";

defineProps({
  tabs: {
    type: Array as PropType<
      Array<{
        key: string;
        title: string;
      }>
    >,
    default() {
      return [];
    },
  },
});

const emits = defineEmits(["switch"]);

const currentActiveTab = ref<string>("basic");
function switchTab(payLoad: MouseEvent) {
  let dataset = (payLoad.target as HTMLElement).dataset;
  if (!dataset.key) return;
  currentActiveTab.value = dataset.key;
  emits("switch", currentActiveTab.value);
}
</script>

<style scoped>
/** 组件类型 */
.aside-sub-tabs-list {
  position: absolute;
  z-index: 2;
  top: 120px;
  left: 295px;
}
.aside-sub-tabs-item {
  margin-bottom: 8px;
  padding: 10px;
  min-width: 48px;
  color: var(--font-light-color);
  font-size: 14px;
  cursor: pointer;
  background: white;
  transform: translateX(-8px);
  transition: transform 0.2s linear, box-shadow 0.2s linear 0.1s;
  box-sizing: border-box;
}
.aside-sub-tabs-item_active,
.aside-sub-tabs-item:hover {
  transform: translateX(0px);
  box-shadow: 5px 0 10px -5px rgb(50 30 50 / 10%);
}
.aside-sub-tabs-item_active {
  color: var(--font-secondary-color);
}
</style>
