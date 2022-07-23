<template>
  <ul class="row-menus" :style="menuPosition" v-show="menuShow">
    <li class="row-menu-group">
      <div class="row-menu_group-title">
        第 {{ overRowIndex + 1 }} 行
      </div>
      <ul class="row-menu">
        <li class="row-menu-item antdv antdv-deleterow" @click="removeRowByIndex" title="移除行"></li>
        <li class="row-menu-item antdv antdv-insertrowabove" @click="insertRowAbove" title="从上面插入行"></li>
        <li class="row-menu-item antdv antdv-insertrowbelow" @click="insertRowBelow" title="从下面插入行"></li>
        <li class="row-menu-item antdv antdv-setting" @click="rowSet" title="行设置"></li>
      </ul>
    </li>
    <li class="row-menu-group">
      <div class="row-menu_group-title">
        容器
      </div>
      <ul class="row-menu">
        <li class="row-menu-item antdv antdv-insertrowabove" @click="containerUnshiftRow" title="所在容器最前面添加一行"></li>
        <li class="row-menu-item antdv antdv-insertrowbelow" @click="containerPushRow" title="所在容器最后添加一行"></li>
        <li class="row-menu-item antdv antdv-detail" @click="displayContainerRowMap" title="容器行视图"></li>
        <li class="row-menu-item antdv antdv-delete" title="删除容器" @click="removeContainer"></li>
      </ul>
    </li>
  </ul>
  <n-modal v-model:show="showRowSetModal" preset="card" title="行设置" size="huge"
    style="width: 44vw; max-height: 96vh; overflow-y: auto" :bordered="false">
    <n-form label-placement="left" :label-width="144">
      <!-- <n-form-item label="固定高度">
        <div>
          <n-checkbox v-model:checked="rowSetForm.fixedHeight"></n-checkbox>
          <div class="form-item-remind">
            固定高度：超出的高度根据“内容超出行高处理”选项作处理。
            <p>
              没固定高：设置的高度为“最小高度”，行高将根据行内的组件自由变动
            </p>
          </div>
        </div>
      </n-form-item>-->
      <n-form-item label="最小高度">
        <div>
          <n-input-number :min="0" v-model:value="rowSetForm.minHeight"></n-input-number>
          <div class="form-item-remind">
            <p>
              <strong>0</strong> = 不设置最小高度
            </p>
          </div>
        </div>
      </n-form-item>
      <n-form-item label="高度">
        <div>
          <n-input-number v-model:value="rowSetForm.height"></n-input-number>
          <div class="form-item-remind">
            不建议设置高度为0，因为拖拽组件到行内的时候会无法命中行。
            <p>如设置了行高为0，并且无法命中行（例如拖拽组件到行、设置行等），可通过容器的行管理视图来拖拽放置组件</p>
            <p>
              如想高度按照行内的组件走，需要把高度设置为小于
              <strong>0</strong> 即可
            </p>
          </div>
        </div>
      </n-form-item>
      <n-form-item label="最大高度">
        <div>
          <n-input-number :min="0" v-model:value="rowSetForm.maxHeight"></n-input-number>
          <div class="form-item-remind">
            如设置了最大高度，超出最大高度后，将根据“内容超出行高处理”选项作处理
            <p>
              <b>0</b> = 不设置最大高度
            </p>
          </div>
        </div>
      </n-form-item>
      <n-form-item label="内容超出行高处理">
        <n-radio-group v-model:value="rowSetForm.overflowY">
          <n-radio v-for="(option, optionKey) in overflowOptions" :value="optionKey" :key="optionKey">{{ option }}
          </n-radio>
        </n-radio-group>
      </n-form-item>
      <n-form-item label="内容超出行宽处理">
        <n-radio-group v-model:value="rowSetForm.overflowX">
          <n-radio v-for="(option, optionKey) in overflowOptions" :value="optionKey" :key="optionKey">{{ option }}
          </n-radio>
        </n-radio-group>
      </n-form-item>
    </n-form>
    <template #footer>
      <n-space justify="end">
        <n-button type="primary" @click="saveRowSetting">保存</n-button>
      </n-space>
    </template>
  </n-modal>
  <n-modal v-model:show="showRowMap" preset="card" title="容器行视图" size="huge" style="width: 44vw; overflow: hidden auto"
    :closable="true" :bordered="false" @after-leave="rows = []">
    <n-spin size="small" :show="rerendering" description="重渲染中，暂时无法操作，请稍后~">
      <draggable name="list" class="row-list" ref="rowListEl" tag="ul" v-model="rows" itemKey="index" :animation="300"
        @change="rowListChanged">
        <template #item="{ element, index }">
          <li :key="element.id">
            <n-space justify="space-between">
              <span>
                第
                <b>{{ element.index + 1 }}</b> 行
              </span>
              <section class="row-operations">
                <n-button-group size="tiny">
                  <n-button quaternary @click="manageInsertRowAbove(element.index)">从上面插入一行</n-button>
                  <n-button quaternary @click="manageInsertRowBelow(element.index)">从下面插入一行</n-button>
                  <n-popconfirm placement="top-end" negative-text="按错了" positive-text="是的" :positive-button-props="{
                    type: 'error',
                    secondary: true
                  }" :negative-button-props="{
  type: 'primary'
}" @positive-click="confirmRemoveRow(element.index)">
                    <template #trigger>
                      <n-button type="error" quaternary :title="`移除第 ${element.index + 1} 行`" size="tiny">移除</n-button>
                    </template>
                    确认移除第 {{ element.index + 1 }} 行吗，确认后无法撤回
                  </n-popconfirm>
                </n-button-group>
              </section>
            </n-space>
          </li>
        </template>
      </draggable>
    </n-spin>
  </n-modal>
</template>

<script lang="ts" setup>
import {
  NModal,
  NInputNumber,
  NRadio,
  NRadioGroup,
  NButtonGroup,
  useMessage,
  NPopconfirm
} from "naive-ui";
import { computed, nextTick, ref } from "vue";
import helper from "../../foundation/helper";
import {
  TContainer,
  TRow,
  TRows,
} from "../../typings/editorTypes";
import { menuPosition, showRowMenu, overRowIndex, overRow, RowMap, Rows } from "../store/rowStore";

import draggable from "vuedraggable-es";
import { ContainerEls, ContainerInstances, Containers, editorPreviewing, RootContainerColumn } from "../store";
import rowService from "../services/rowService";
import containerService from "../services/containerService";

const NMessage = useMessage();

const menuShow = computed(() => {
  if (showRowMenu.value) {
    if (editorPreviewing.value) {
      return false;
    }
    return true;
  }
  return false;
})

const overflowOptions = {
  visible: "默认值。内容不会被修剪，会呈现在元素框之外",
  hidden: "内容会被修剪，并且其余内容不可见",
  scroll: "内容会被修剪，浏览器会显示滚动条以便查看其余内容",
  auto: "由浏览器定夺，如果内容被修剪，就会显示滚动条",
  inherit: "规定从父元素继承overflow属性的值",
};

const rowSetForm = ref<{
  height: number;
  maxHeight: number;
  minHeight: number;
  // fixedHeight: boolean;
  overflowX: string;
  overflowY: string;
}>({
  height: -1,
  maxHeight: 0,
  minHeight: 0,
  // fixedHeight: false,
  overflowX: "visible",
  overflowY: "visible",
});

/**
 * 容器最上面插入新的一行
 * @returns void
 */
function containerUnshiftRow() {
  if (!overRow.value) return;

  rowService.addRowToContainer(overRow.value.containerId, 0, null, 0, 1, "");

  rowService.resetContainerRowParams(overRow.value.containerId);
}

const showRowSetModal = ref<boolean>(false);
function rowSet() {
  if (!overRow.value) return;
  // rowSetForm.value.fixedHeight = overRow.fixedHeight;
  if (helper.isNumber(overRow.value.style.height)) {
    rowSetForm.value.height = parseFloat(overRow.value.style.height ?? "0");
  }

  if (helper.isNumber(overRow.value.style.minHeight)) {
    rowSetForm.value.minHeight = parseFloat(
      overRow.value.style.minHeight ?? "0"
    );
  }
  if (helper.isNumber(overRow.value.style.maxHeight)) {
    rowSetForm.value.maxHeight = parseFloat(
      overRow.value.style.maxHeight ?? "0"
    );
  }
  rowSetForm.value.overflowX = overRow.value.style.overflowX ?? "visible";
  rowSetForm.value.overflowY = overRow.value.style.overflowY ?? "visible";
  showRowSetModal.value = true;
}
function saveRowSetting() {
  if (!overRow.value) return;
  // overRow.fixedHeight = rowSetForm.value.fixedHeight;
  if (rowSetForm.value.height < 0) {
    overRow.value.style.height = "initial";
  } else {
    overRow.value.style.height = String(rowSetForm.value.height) + "px";
  }

  if (rowSetForm.value.minHeight < 1) {
    overRow.value.style.minHeight = "initial";
  } else {
    overRow.value.style.minHeight = String(rowSetForm.value.minHeight) + "px";
  }
  if (rowSetForm.value.maxHeight < 1) {
    overRow.value.style.maxHeight = "initial";
  } else {
    overRow.value.style.maxHeight = String(rowSetForm.value.maxHeight) + "px";
  }
  overRow.value.style.overflowX = rowSetForm.value.overflowX;
  overRow.value.style.overflowY = rowSetForm.value.overflowY;

  showRowSetModal.value = false;
  rowService.resetContainerRowParams(overRow.value.containerId);
}

function removeRowByIndex() {
  if (!overRow.value || overRowIndex.value === undefined) return;

  rowService.removeRow(overRow.value.containerId, overRowIndex.value);

  overRow.value = null;
  overRowIndex.value = -1;
}

/**
 * 容器最下面插入新的一行
 * @returns void
 */
function containerPushRow() {
  if (!overRow.value) return;

  rowService.pushRowToContainer(overRow.value.containerId, null, 0, 1, "");

  rowService.resetContainerRowParams(overRow.value.containerId);
}

/**
 * 在当前行下面插入行
 * @returns void
 */
function insertRowBelow(): void {
  if (!overRow.value) return;
  rowService.addRowToContainer(overRow.value.containerId, overRowIndex.value + 1, null, 0, 1, "");
  rowService.resetContainerRowParams(overRow.value.containerId);
}
/**
 * 在当前行上面插入行
 * @returns void
 */
function insertRowAbove(): void {
  if (!overRow.value) return;
  rowService.addRowToContainer(overRow.value.containerId, overRowIndex.value, null, 0, 1, "");
  overRowIndex.value++;

  rowService.resetContainerRowParams(overRow.value.containerId);
}

const showRowMap = ref<boolean>(false);
const rows = ref<
  Array<{
    index: number;
    id: string;
    showDeleteConfirmPopover: boolean
  }>
>([]);;
let containerRows: TRows = null;
//* 容器行视图
function displayContainerRowMap() {
  if (showRowMap.value === false) {
    //* 弹出弹窗之前获取行，并且转换
    const container: TContainer = Containers.get(overRow.value.containerId);
    containerRows = container.rows;
    container.rows.forEach((rowItem, itemIndex) => {
      rows.value.push({
        id: rowItem.id,
        index: itemIndex,
        showDeleteConfirmPopover: false
      });
    });
  }
  showRowMap.value = !showRowMap.value;
}

const rerendering = ref<boolean>(false);
function rowListChanged(payload) {
  if (rerendering.value) {
    NMessage.warning("重渲染中，暂时无法操作，请稍后~");
    return;
  }
  const {
    moved: { newIndex, oldIndex },
  } = payload;
  if (newIndex === oldIndex) {
    return;
  }

  rerendering.value = true;
  const targetRow: TRow = containerRows[oldIndex];

  const rows = Containers.get(targetRow.containerId).rows;

  //* 流程：先把移动的行插入到移动到的位置，再把旧移动的行移除掉。也就是复制后移除。

  //* 如果是下移，目标的索引值就是移动到的索引值+1，如果是下移的话，就是被移动到的索引值-1，避免小于0，因为不存在索引0的行
  const targetIndex: number = newIndex > oldIndex ? newIndex + 1 : newIndex - 1 < 0 ? 0 : newIndex - 1;

  //* 下移
  if (newIndex > oldIndex) {
    rows.splice(targetIndex, 0, targetRow);
    rows.splice(oldIndex, 1);
  } else {
    rows.splice(targetIndex + 1, 0, targetRow);
    //* 上移，上移移除的索引+1，因为往上移，会把被移动的行顶下来
    rows.splice(oldIndex + 1, 1);
  }
  nextTick(() => {
    rerendering.value = false;
  });
}

function confirmRemoveRow(rowIndex: number) {
  if (rerendering.value) {
    NMessage.warning("重渲染中，暂时无法操作，请稍后~");
    return;
  }
  rerendering.value = true;
  containerRows.splice(rowIndex, 1);
  rows.value.splice(rowIndex, 1);

  rerendering.value = false;
}

function refreshManageRows() {
  rows.value = [];
  containerRows.forEach((rowItem, itemIndex) => {
    rows.value.push({
      id: rowItem.id,
      index: itemIndex,
      showDeleteConfirmPopover: false
    });
  });
}
//* 插入行时不用overRow insertRowAbove里的overRow改用传参的方式获取
function manageInsertRowAbove(rowIndex: number) {
  rowService.addRowToContainer(overRow.value.containerId, rowIndex, null, 0, 1, "");

  rowService.resetContainerRowParams(overRow.value.containerId);
  refreshManageRows();
}

//* 从下面那里插入一行
function manageInsertRowBelow(rowIndex: number) {
  rowService.addRowToContainer(overRow.value.containerId, rowIndex + 1, null, 0, 1, "");

  rowService.resetContainerRowParams(overRow.value.containerId);
  refreshManageRows();
}

//* 移除容器
function removeContainer(): void {
  containerService.removeContainer(overRow.value.containerId);
}
</script>

<style scoped>
.row-menus {
  position: absolute;
  z-index: 10;
  right: 0;
  top: 0;
  padding: 5px 7px;
  /* max-height: 30px; */
  width: 100px;
  font-size: 12px;
  background-color: rgba(255, 255, 255, 0.8);
  box-sizing: border-box;
  box-shadow: 4px 0 3px rgba(0, 0, 0, 0.1);
  transition: all 0.15s ease-in-out;
}

.row-menu-group:not(:last-child) {
  margin-bottom: 6px;
}

.row-menu {
  display: grid;
  grid-template-columns: repeat(4, 25%);
  /* justify-content: space-around; */
  align-items: center;
  flex-wrap: wrap;
}

.row-menu-item {
  cursor: pointer;
}

.row-menu-item:hover {
  color: var(--primary-color);
}

/* 行视图 */
.row-list {
  --highlight-color: #f5f5f5;

  user-select: none;
  height: 66vh;
  overflow: hidden auto;
}

.row-list::-webkit-scrollbar {
  width: 4px;
}

.row-list::-webkit-scrollbar-track {
  background-color: transparent;
}

.row-list::-webkit-scrollbar-thumb {
  background-color: #eee;
}

.row-list::-webkit-scrollbar-thumb {
  background-color: #ccc;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.35s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scale(0);
  transform-origin: center left;
}

.row-list>li {
  padding: 10px 12px;
  border-bottom: 1px solid var(--highlight-color);
  border-radius: var(--border-radius);
}

.row-list>li:last-child {
  border-bottom: none;
}

.row-list>li:hover {
  color: #000;
  background-color: var(--highlight-color);
}

.row-operations {
  visibility: hidden;
}

.row-list>li:hover .row-operations {
  visibility: visible;
}
</style>
