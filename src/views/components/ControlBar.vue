<template>
  <section class="control-bar">
    <ul class="control-group-list" @click="controlProject">
      <li class="control-group-item" v-for="(controlGroup, groupKey) in controls" :key="groupKey">
        <ul class="control-list">
          <li class="control-item"
            :class="{ 'control-item_disabled': controlItem.disabled, 'control-item_highlight': controlItem.highlight }"
            v-for="(controlItem, itemKey) in controlGroup" :key="itemKey" :data-key="itemKey"
            :data-group-key="groupKey">
            <div class="antdv" :class="[controlItem.icon]" :data-key="itemKey" :data-group-key="groupKey"></div>
            {{ controlItem.title }}
          </li>
        </ul>
      </li>
    </ul>
  </section>
  <structure v-model:show="previewStructure"></structure>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import structure from "./Structure.vue";
import { editorPreviewing } from "../store";
import { ShowAuxiliaryLine } from "../store/rowStore";
import containerService from "../services/containerService";
import commonService from "../services/commonService";

type TControl = {
  title: string;
  key: string;
  icon: string;
  disabled: boolean;
  highlight?: boolean
}
type TControlGroup = Record<string, Record<string, TControl>>;

const previewStructure = ref<boolean>(false);

const controls = reactive<TControlGroup>({
  page: {
    save: {
      title: "保存",
      key: "save",
      icon: "antdv-save",
      disabled: false,
    },
    clear: {
      title: "清空",
      key: "clear",
      icon: "antdv-rest",
      disabled: false,
    },
    undo: {
      title: "撤回",
      key: "undo",
      icon: "antdv-undo",
      disabled: true,
    },
    redo: {
      title: "重做",
      key: "redo",
      icon: "antdv-redo",
      disabled: true,
    },
    records: {
      title: "记录",
      key: "records",
      icon: "antdv-time-circle",
      disabled: false,
    },
    preview: {
      title: "预览",
      key: "preview",
      icon: "antdv-eye",
      disabled: false,
    },
    fullScreen: {
      title: "全屏",
      key: "fullScreen",
      icon: "antdv-fullscreen",
      disabled: false,
    },
    auxiliaryLine: {
      title: "辅助线",
      key: "auxiliaryLine",
      icon: "antdv-table",
      disabled: false,
    },
    structure: {
      title: "结构",
      key: "structure",
      icon: "antdv-number",
      disabled: false,
    },
  },
  project: {
    pageSetting: {
      title: "页面",
      key: "pageSetting",
      icon: "antdv-file",
      disabled: false,
    },
    projectSetting: {
      title: "项目",
      key: "projectSetting",
      icon: "antdv-project",
      disabled: false,
    },
  },
});

let alreadyFullScreen: boolean = false;
function controlProject(e: MouseEvent) {
  let key: string | undefined = (e.target as HTMLElement).dataset.key;
  let groupKey: string | undefined = (e.target as HTMLElement).dataset.groupKey;
  if (!key || !groupKey) return;
  switch (key) {
    case "fullScreen":
      if (document.fullscreenElement) {
        document.exitFullscreen();
        fullScreen();
      } else {
        document.documentElement.requestFullscreen();
        exitFullScreen();
      }
      alreadyFullScreen = !alreadyFullScreen;
      break;
    case "clear":
      commonService.clearEditor();
      break;
    case "auxiliaryLine":
      ShowAuxiliaryLine.value = !ShowAuxiliaryLine.value;
      break;
    case "structure":
      previewStructure.value = !previewStructure.value;
      break;
    case "preview":
      editorPreviewing.value = !editorPreviewing.value;
      if (editorPreviewing.value) {
        controls.page.preview.title = "预览中";
        controls.page.preview.highlight = true;
      } else {
        controls.page.preview.title = "预览";
        controls.page.preview.highlight = false;
      }
      break;
  }
}
function exitFullScreen() {
  controls.page.fullScreen.title = "全屏";
  controls.page.fullScreen.icon = "antdv-fullscreen";
}
function fullScreen() {
  controls.page.fullScreen.title = "退出全屏";
  controls.page.fullScreen.icon = "antdv-fullscreen-exit";
}

document.onfullscreenchange = function (event) {
  if (document.fullscreenElement) {
    fullScreen();
  } else {
    exitFullScreen();
  }
};
</script>

<style scoped>
.control-bar {
  position: relative;
  z-index: 2;
  padding: 3px 20px;
  user-select: none;
  background-color: white;
  box-shadow: 0 3px 8px 0 rgba(50, 50, 50, 0.05);
}

.control-group-list {
  text-align: center;
}

.control-group-item {
  display: inline-block;
}

.control-list {
  display: flex;
  justify-content: center;
  align-items: center;
}

.control-item {
  position: relative;
  padding: 3px 10px;
  min-width: 46px;
  color: var(--font-light-color);
  font-size: 12px;
  text-align: center;
  cursor: pointer;
}

.control-item_disabled {
  opacity: 0.6;
}

.control-item:hover,
.control-item_highlight {
  color: var(--primary-color);
}

.control-item_disabled:hover {
  color: var(--font-light-color);
}

.control-item>div {
  position: absolute;
  top: -5px;
  left: 0;
  right: 0;
  margin: 0 auto;
  /* margin-bottom: 4px; */
  font-size: 20px;
  transition: all 0.2s linear;
  opacity: 0;
}

.control-item:hover>div {
  opacity: 1;
  transform: translateY(-16px);
}
</style>
