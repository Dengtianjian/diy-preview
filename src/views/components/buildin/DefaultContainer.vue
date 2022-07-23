<template>
  <div class="component-container">
    <div class="component-container_content" :class="{
      'component-container_content-highlight': componentOveringContainer,
    }" @dragenter="dragEnter" @dragover="dragOver" @drop="drop" @dragleave="dragLeave" ref="containerEl">
      <slot>
        <Row v-for="(rowItem, itemIndex) in containerRows" :key="itemIndex" :row="rowItem" :rowIndex="itemIndex"
          :data-index="itemIndex"></Row>
      </slot>
    </div>
    <div class="component-container_remind" v-show="containerRows.length === 0">
      拖拽组件到这里
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ComponentInternalInstance,
  getCurrentInstance,
  nextTick,
  onMounted,
  PropType,
  reactive,
  ref,
  watch,
} from "vue";
import eventBus from "../../../foundation/eventBus";
import commonService from "../../../service/commonService";
import {
  TColumn,
  TContainer,
  TRows,
} from "../../../typings/editorTypes";
import containerService from "../../services/containerService";
import dragService from "../../services/dragService";
import rowService from "../../services/rowService";
import { Containers, ContainerEls, ContainerInstances, editorPreviewing } from "../../store";
import Row from "../Row.vue";
const Props = defineProps({
  column: {
    type: Object as PropType<TColumn>,
    default: null,
  },
});

const Emits = defineEmits(["mounted"]);

let containerId: string = "";
const componentOveringContainer = ref<boolean>(false);
let instance: ComponentInternalInstance | null = null;

const containerEl = ref<HTMLElement | null>(null);
let container: TContainer = null;
const containerRows = ref<TRows>([]);

onMounted(() => {
  //* 预览模式
  if (editorPreviewing.value) {
    container = Containers.get(Props.column.insertContainerId);
    containerRows.value = container.rows;
    return;
  };

  instance = getCurrentInstance();

  if (Props.column.insertContainerId) {
    containerId = Props.column.insertContainerId;
  } else {
    containerId = Props.column.insertContainerId = commonService.genUniqueId();
  }
  ContainerInstances.set(containerId, instance);

  if (!Containers.has(containerId)) {
    Containers.set(containerId, {
      id: containerId,
      rows: reactive<TRows>([]),
      column: Props.column
    });
  }

  container = Containers.get(containerId);
  containerRows.value = container.rows;

  Emits("mounted", containerEl.value, containerId);
  Props.column.insertContainerId = containerId;
  ContainerEls.set(containerId, containerEl.value);

  containerRows.value.forEach((rowItem) => {
    rowItem.containerId = containerId;
    rowItem.columns.forEach((columnItem) => {
      columnItem.containerId = containerId;
    });
  });

  containerService.containerMounted(containerId);
});

function dragEnter(payload: DragEvent) {
  payload.stopPropagation();

  //* 预览模式
  if (editorPreviewing.value) return;

  resetTargetRowParams();

  // if (!dragService.isEnterMe(containerId)) {
  //   let sub = eventBus.subscribe("__container_drag_service", () => {
  //     if (dragService.isEnterMe(containerId)) {
  //       componentOveringContainer.value = true;
  //     } else {
  //       sub.cancel();
  //       componentOveringContainer.value = true;
  //       nextTick(() => {
  //         componentOveringContainer.value = false;
  //       })

  //     }
  //   });
  // }

  dragService.componentEnterContainer(payload, containerId);
  componentOveringContainer.value = true;
}
function dragOver(payload: DragEvent) {
  payload.stopPropagation();
  payload.preventDefault();

  //* 预览模式
  if (editorPreviewing.value) return;

  dragService.componentOverContainer(payload);
}
function dragLeave(payload: DragEvent) {
  payload.stopPropagation();

  //* 预览模式
  if (editorPreviewing.value) return;

  dragService.componentLeaveContainer(payload);

  if (dragService.isEnterMe(containerId)) {
    return;
  }
  componentOveringContainer.value = false;
}
function drop(payload: DragEvent) {
  payload.stopPropagation();
  payload.preventDefault();

  //* 预览模式
  if (editorPreviewing.value) return;

  dragService.dropOnContainer();
  componentOveringContainer.value = false;
  nextTick(resetTargetRowParams);
}

function resetTargetRowParams() {
  if (containerEl.value) {
    rowService.resetContainerRowParams(containerId);
  }
}

//END 后续优化。不用watch。如果进入了该容器，容器会传一个函数给dragService，然后当离开这个容器时，执行传的回调函数
// watch(dragService.enterContainerId, () => {
//   if (dragService.isEnterMe(containerId)) {
//     componentOveringContainer.value = true;
//   } else {
//     componentOveringContainer.value = false;
//   }
// });
</script>

<style scoped>
.component-container {
  position: relative;
  background-color: whtie;
}

.component-container_content {
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  min-height: 30px;
}

.component-container_content-highlight {
  outline: 2px dashed var(--primary-color);
}

.component-container_remind {
  position: absolute;
  top: 0;
  z-index: 0;
  padding: 10px 0;
  height: 30px;
  width: 100%;
  text-align: center;
  font-size: 12px;
  color: var(--font-secondary-color);
  user-select: none;
  box-sizing: border-box;
}

.component-container_menu {
  /* display: none; */
  position: absolute;
  z-index: 2;
  left: 0;
  top: -24px;
  /* padding: 10px 0; */
  height: 24px;
  line-height: 24px;
  width: 100%;
  font-size: 12px;
  text-align: center;
  user-select: none;
  background-color: white;
  box-shadow: 0 -2px 4px 1px rgba(0, 0, 0, 0.15);
  box-sizing: border-box;
}

.component-container_menu:hover {
  color: white;
  cursor: pointer;
  background-color: var(--primary-color);
}
</style>
