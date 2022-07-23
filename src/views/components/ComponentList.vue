<template>
  <n-collapse arrow-placement="right" :default-expanded-names="[0, 1]">
    <n-collapse-item :title="group.name" :name="groupIndex" v-for="(group, groupIndex) in components" :key="group.name">
      <div class="components">
        <component-item v-for="(item) in componentStore.componentMap" :key="item[1].name" :data="item[1]">
        </component-item>
      </div>
    </n-collapse-item>
  </n-collapse>
</template>

<script lang="ts" setup>
import { NCollapse, NCollapseItem } from "naive-ui";
import { TComponentGroups } from "../../typings/componentTypes";
import componentStore from "../store/componentStore";
import ComponentItem from "./ComponentItem.vue";

const components: TComponentGroups = [
  {
    name: "全部",
    list: [
      {
        name: "Test",
        title: "Test",
        cover: "https://t7.baidu.com/it/u=2621658848,3952322712&fm=193&f=GIF",
        occupiedColumns: -1,
        width: "60px",
        buildIn: 0,
        path: "",
        loadStatus: "notLoaded"
      },
    ],
  },
  // {
  //   name: "容器",
  //   list: [
  //     {
  //       name: "DefaultContainer",
  //       title: "通用",
  //       cover: "https://t7.baidu.com/it/u=3631608752,3069876728&fm=193&f=GIF",
  //       occupiedColumns: 20,
  //       width: 0,
  //       buildIn: 1,
  //       path: ""
  //     },
  //   ],
  // },
];
</script>

<style scoped>
.components {
  display: grid;
  justify-content: space-evenly;
  grid-template-columns: repeat(3, calc(33.3% - 10px));
  gap: 10px;
}
</style>
