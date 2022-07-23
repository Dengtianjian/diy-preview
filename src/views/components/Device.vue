<template>
  <div class="workbench-device" ref="deviceEl" data-device="1" :style="{ width: `${deviceWidth}px` }">
    <DefaultContainer :column="RootContainerColumn" @mounted="containerMounted" v-if="deviceMounted">
      <Row v-for="(rowItem, itemIndex) in Rows" :key="itemIndex" :row="rowItem" :rowIndex="itemIndex"></Row>
    </DefaultContainer>
    <!-- <row-menu></row-menu> -->
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, onMounted, ref } from "vue";
import Row from "./Row.vue";
import RowMenu from "./RowMenu.vue";
import {
  TComponentTreeContainer,
} from "../../typings/componentTreeTypes";
import commonService from "../../service/commonService";
import containerService from "../services/containerService";
import { Containers, deviceWidth, deviceEl as storeDeviceEl, ContainerEls, editorPreviewing, DeviceOffsets, RootContainerColumn } from "../store";
import { Rows } from "../store/rowStore";
import BuildComponents from "./index";
import DefaultContainer from "./buildin/DefaultContainer.vue";

const deviceEl = ref<null | HTMLDivElement>(null);
const deviceMounted = ref<boolean>(false);

const defaultContainer = ref<HTMLElement | null>(null);
function containerMounted(containerEl, containerId) {
  defaultContainer.value = containerEl;

  ContainerEls.set(containerId, containerEl);

  fetch("/test.json")
    .then((res) => res.json())
    .then((res: TComponentTreeContainer) => {
      containerService.sourceTreeAddToContainer(res, RootContainerColumn.value.insertContainerId);
    });
}

onMounted(() => {
  //* 预览模式
  if (editorPreviewing.value) {
    deviceMounted.value = true;
    return;
  };

  storeDeviceEl.value = deviceEl.value as HTMLElement;

  DeviceOffsets.left = deviceEl.value?.offsetLeft || 0;
  DeviceOffsets.top = deviceEl.value?.offsetTop || 0;

  const containerId: string = commonService.genUniqueId();
  RootContainerColumn.value.containerId = containerId;
  RootContainerColumn.value.insertContainerId = containerId;

  Containers.set(containerId, {
    id: containerId,
    rows: Rows,
    column: RootContainerColumn.value
  });

  const Instance = getCurrentInstance();
  for (const componentName in BuildComponents) {
    Instance.appContext.components[componentName] = BuildComponents[componentName];
  }

  deviceMounted.value = true;
});
</script>

<style scoped>
.workbench-device {
  position: relative;
  margin: 30px auto 40px;
  min-height: 80vh;
  width: 375px;
  background-color: white;
  box-shadow: var(--shadow);
}
</style>
