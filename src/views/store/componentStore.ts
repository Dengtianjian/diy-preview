import { reactive } from "vue";
import { TComponent } from "../../typings/componentTypes";

const componentMap = reactive<Map<string, TComponent>>(new Map()); //* 组件列表，key=组件的名称

const DevComponentMap: Map<string, string> = new Map(); //* 开发时用到的组件对应的路径
DevComponentMap.set("CButton", "/src/components/workspace/CButton.vue");
DevComponentMap.set("CTitle", "/src/components/workspace/CTitle.vue");
DevComponentMap.set("CGoodsList", "/src/components/workspace/CGoodsList.vue");

export default {
  componentMap,
  DevComponentMap
}