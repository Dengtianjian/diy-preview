<template>
  <ul class="app-item_actions">
    <li
      class="app_action-item"
      :class="{
        'app_action-item_show': showKey === actionItem.key,
        'app_action-item_disabled': actionItem.disabled,
      }"
      v-for="actionItem in actions"
      :key="actionItem.key"
      @mouseover="showKey = actionItem.key"
      @click="onClickAction(actionItem)"
    >
      <i :class="actionItem.icon"></i>
      {{ actionItem.text }}
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";

const props = defineProps({
  actions: [Object, Array],
  defaultShowKey: String,
});

const showKey = ref<string>(props.defaultShowKey || "");
onMounted(() => {
  if (Array.isArray(props.actions)) {
    showKey.value = (
      props.actions as Array<{
        key: string;
      }>
    )[0].key;
  } else {
    let actionKeys: string[] = Object.keys(
      props.actions as Record<string, object>
    );
    showKey.value = actionKeys.length ? actionKeys[0] : "";
  }
});
const emits = defineEmits(["clickAction"]);
function onClickAction(actionItem) {
  emits("clickAction", showKey.value);
}
</script>

<style scoped>
.app-item_actions {
  background-color: white;
}
.app_action-item {
  display: inline-flex;
  align-items: center;
  padding: 10px 15px;
  width: 1px;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  transition: all 0.15s linear;
  cursor: pointer;
}
.app_action-item_show {
  width: fit-content;
}
.app_action-item:hover {
  color: var(--primary-color);
}
.app_action-item_disabled,
.app_action-item_disabled:hover {
  color: #999;
}
.app_action-item i {
  margin-right: 3px;
}
</style>
