<template>
  <g-header adaptive size="mini"></g-header>
  <control-bar></control-bar>
  <section class="workbench-container">
    <aside class="workbench-materials">
      <n-tabs justify-content="space-evenly" style="position: relative; z-index: 3">
        <n-tab-pane name="components" tab="组件">
          <section class="material-list thin-scroll-bar">
            <component-list></component-list>
          </section>
        </n-tab-pane>
        <n-tab-pane name="templates" tab="模板">模板</n-tab-pane>
      </n-tabs>
      <sub-tabs :tabs="materialSubTabs"></sub-tabs>
    </aside>
    <main class="workbench-editor thin-scroll-bar" @scroll="editorScroll">
      <device class="workbench-device" v-if="pageLoaded"></device>
    </main>
    <aside class="workbench_component-attribute"></aside>
  </section>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, onUnmounted, ref } from "vue";
import { NTabs, NTabPane } from "naive-ui";
import GHeader from "../components/front/GHeader.vue";
import globalStore from "../store/globalStore";
import ControlBar from "./components/ControlBar.vue";
import SubTabs from "./components/SubTabs.vue";
import Device from "./components/Device.vue";
import ComponentList from "./components/ComponentList.vue";
import { editorScrollOffset } from "./store";
import ComponentsApi from "../api/modules/ComponentsApi";
import { TComponent } from "../typings/componentTypes";
import componentStore from "./store/componentStore";

const pageLoaded = ref<boolean>(false);

onMounted(() => {
  globalStore.showFooter = false;
  //! 临时注释 开发完成后恢复
  // window.onbeforeunload = function () {
  //   return "系统可能不会保存您所作的更改";
  // };
  // onBeforeUnmount(() => {
  //   window.onbeforeunload = null;
  // });
  refreshComponentsData().then(() => {
    pageLoaded.value = true;
  })
});
onUnmounted(() => {
  globalStore.showFooter = true;
});

function refreshComponentsData(): Promise<boolean> {
  return fetch("./components.json").then(res => res.json()).then(({ data: components }) => {
    components.forEach(component => {
      component.loadStatus = "notLoaded";
      componentStore.componentMap.set(component.name, component);
    });
  }).then(() => true).catch(() => false);
  // return ComponentsApi.get<TComponent[]>("").then(components => {
  //   components.forEach(component => {
  //     component.loadStatus = "notLoaded";
  //     componentStore.componentMap.set(component.name, component);
  //   });
  // }).then(() => true).catch(() => false);
}

const materialSubTabs = ref([
  {
    key: "basic",
    title: "基础",
  },
  {
    key: "page",
    title: "页面",
  },
  {
    key: "app",
    title: "应用",
  },
]);

function editorScroll(payload: UIEvent) {
  //TODO 缺少 防抖

  editorScrollOffset.left = (payload.target as HTMLElement).scrollLeft;
  editorScrollOffset.top = (payload.target as HTMLElement).scrollTop;
}
</script>

<style scoped>
.workbench-container {
  display: grid;
  grid-template-columns: 300px auto 300px;
  height: calc(100vh - 30px - 24px);
  /** 30是导航栏的高度 24是控制栏的高度 */
  background-color: var(--background-color);
  overflow: hidden;
}

/** 左边栏，项目相关，以及组件选择 */
.workbench-materials {
  padding: 5px;
  background-color: white;
}

.material-list {
  padding-bottom: 10px;
  height: calc(100vh - 54px - 10px - 33px - 12px);
  /* overflow-y: auto;
  overflow-x: visible; */
  box-sizing: border-box;
}

/** 编辑器 */
.workbench-editor {
  padding: 5px;
  height: inherit;
  overflow: hidden auto;
}

/** 右侧边栏，编辑组件属性 */
.workbench_component-attribute {
  padding: 5px;
  height: inherit;
  background-color: white;
}
</style>
