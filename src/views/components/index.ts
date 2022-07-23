import { defineAsyncComponent } from "vue";

export { default as ComponentItem } from "./ComponentItem.vue";
export { default as ComponentList } from "./ComponentList.vue";
export { default as ControlBar } from "./ControlBar.vue";
export { default as Device } from "./Device.vue";

export { default as Row } from "./Row.vue";
export { default as RowMenu } from "./RowMenu.vue";
export { default as Structure } from "./Structure.vue";
export { default as SubTabs } from "./SubTabs.vue";

//* 加载内置的组件
const componentFiles = import.meta.glob("./buildin/*.vue");
const exports = {};
for (const filePath in componentFiles) {
  const componentName: string = filePath.slice(filePath.lastIndexOf("/") + 1, filePath.lastIndexOf("."));
  exports[componentName] = defineAsyncComponent(componentFiles[filePath]);
}

export default exports;