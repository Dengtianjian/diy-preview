<template>
  <div class="component-item" ref="componentItem" v-if="data" draggable="true" @dragstart="startAddComponentToDevice"
    @dragend="addComponentOperationEnd">
    <img class="component-cover" :src="data.cover" draggable="false" />
    <n-ellipsis class="component-title" :tooltip="false" :line-clamp="2">{{
        data.name
    }}</n-ellipsis>
  </div>
</template>

<script lang="ts" setup>
import { TComponent } from "../../typings/componentTypes";
import dragService from "../services/dragService";

const Props = withDefaults(defineProps<{
  data: TComponent
}>(), {
  data: null,
});

function startAddComponentToDevice() {
  dragService.dragType.value = "add";
  dragService.addTargetComponent.value = Props.data;
}
function addComponentOperationEnd() {
  dragService.dragEnd();
}
</script>

<style scoped>
.component-item {
  position: relative;
  z-index: 1;
  padding: 6px;
  text-align: center;
  word-break: break-all;
  cursor: pointer;
  user-select: none;
  border: 1px solid var(--border-light-color);
}

.component-item:hover {
  border-color: var(--primary-color);
}

.component-main {
  position: absolute;
  z-index: 3;
}

.component-cover {
  width: 100%;
  height: 60px;
  object-fit: cover;
}

.component-title {
  margin-top: 4px;
  line-height: 18px;
  text-align: center;
  font-size: 12px;
  color: var(--font-secondary-color);
}
</style>
