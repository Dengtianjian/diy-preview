<template>
  <n-modal
    v-model:show="show"
    preset="card"
    :style="{ width: '60vw' }"
    :mask-closable="true"
    @update:show="showUpdated"
  >
    <n-tabs type="line">
      <n-tab-pane name="tree" tab="Tree">
        <n-tree block-line :data="ComponentTreeOption" :selectable="false" />
      </n-tab-pane>
      <n-tab-pane name="json" tab="JSON">
        <n-code
          :code="componentTreeJson"
          language="json"
          @click="copyJSON"
        ></n-code>
        <input
          name="jsonCode"
          :value="componentTreeJson"
          ref="codeEl"
          style="position: absolute; z-index: -1; opacity: 0"
        />
      </n-tab-pane>
    </n-tabs>
  </n-modal>
</template>

<script lang="ts" setup>
import { NModal, NTree, TreeOption, NTabs, NTabPane, NCode } from "naive-ui";
import { Toast } from "vant";
import { ref, watch } from "vue";
import {
  TComponentTreeContainer,
  TComponentTreeRowColumn,
} from "../../typings/componentTreeTypes";
import { TContainer } from "../../typings/editorTypes";
import { Containers, RootContainerColumn } from "../store";

const Props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});
const Emits = defineEmits(["update:show"]);

function showUpdated(flag: boolean) {
  Emits("update:show", flag);
}

const ComponentTreeOption = ref<TreeOption[]>([]);
const componentTreeJson = ref<string>("");

function genComponentTree(container: TContainer): TComponentTreeContainer {
  const tree: TComponentTreeContainer = {
    rows: [],
  };

  container.rows.forEach((rowItem) => {
    const columns: Record<number, TComponentTreeRowColumn> = {};
    rowItem.columns.forEach((columnItem) => {
      if (columnItem.componentName) {
        let container: TComponentTreeContainer | undefined = undefined;
        if (columnItem.insertContainerId) {
          if (Containers.has(columnItem.insertContainerId)) {
            container = genComponentTree(
              Containers.get(columnItem.insertContainerId)
            );
          }
        }
        columns[columnItem.index] = {
          index: columnItem.index,
          occupiedColumns: columnItem.occupiedColumns,
          componentName: columnItem.componentName,
          container,
        };
      }
    });
    const row = {
      style: rowItem.style,
      height: rowItem.height,
      fixedHeight: rowItem.fixedHeight,
      columns,
    };
    tree.rows.push(row);
  });
  return tree;
}

function genOptionTree(container: TComponentTreeContainer): TreeOption[] {
  const options: TreeOption[] = [];
  container.rows.forEach((item) => {
    const children: TreeOption[] = [];

    for (const columnIndex in item.columns) {
      const columnItem = item.columns[columnIndex];
      let child: TreeOption[] = [];
      const option: TreeOption = {
        label: "列",
        key:
          columnIndex.toString() +
          Date.now().toString() +
          Math.round(Math.random() * 1000),
      };

      if (columnItem.container) {
        child = genOptionTree(columnItem.container);
        option.label = "列 - 容器";
      }
      if (child.length) {
        option["children"] = child;
      }
      children.push(option);
    }

    const option: TreeOption = {
      label: "行",
      key: Date.now().toString() + Math.round(Math.random() * 1000),
    };
    if (children.length) {
      option.children = children;
    }
    options.push(option);
  });
  return options;
}

function refreshTree(): void {
  ComponentTreeOption.value = [];

  const container: TContainer = Containers.get(
    RootContainerColumn.value.insertContainerId
  );

  const componentTree: TComponentTreeContainer = genComponentTree(container);

  ComponentTreeOption.value.push(...genOptionTree(componentTree));
  componentTreeJson.value = JSON.stringify(componentTree, null, 2);
}

const codeEl = ref<HTMLInputElement>(null);
function copyJSON() {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard
      .writeText(codeEl.value.value)
      .then((res) => {
        Toast("复制成功！");
      })
      .catch(() => {
        Toast("复制失败，请检查是否开启了权限");
      });
  } else {
    codeEl.value.select();
    document.execCommand("Copy");
    codeEl.value.blur();
    Toast("复制成功");
  }
}

watch(
  () => Props.show,
  (newV: boolean) => {
    if (newV) {
      refreshTree();
    }
  }
);
</script>

<style scoped></style>
