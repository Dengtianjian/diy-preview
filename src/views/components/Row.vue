<template>
  <div class="row" :class="{ 'row-highlight': row.highlihgt }" data-row="1" v-if="row" ref="rowEl" :style="rowStyle"
    @mouseover.stop="mouseOverRow" @mouseout.stop="mouseOutRow">
    <div class="column" :class="{
      'column-highlight': column.highlight,
      'column-empty': !column.componentName,
      'column-line': ShowAuxiliaryLine,
    }" v-for="column in row.columns" :style="{ width: column.width + 'px' }"
      v-show="column.occupied === false || (column.componentName && column.occupied)">
      <div class="column-wrapper" v-if="column.componentName" @mousedown.stop="columnDragBefore"
        @mouseup.stop="mouseUpColumn" @dragstart.stop="columnDragStart(column)" @dragend.stop="columnDragEnd"
        :draggable="columnDraggable">
        <async-component :component-name="column.componentName" :column="column"></async-component>
      </div>
      <div v-else>{{ column.index }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, PropType, ref } from "vue";
import {
  TColumn,
  TRow,
} from "../../typings/editorTypes";
import dragService from "../services/dragService";
import rowService from "../services/rowService";
import { editorPreviewing } from "../store";
import { RowComponentCount, ShowAuxiliaryLine } from "../store/rowStore";
import AsyncComponent from "./AsyncComponent.vue";
const Props = withDefaults(defineProps<{
  row: TRow,
  rowIndex: number
}>(), {
  row: null,
  rowIndex: null,
});
const Emits = defineEmits(["mounted"]);
const rowEl = ref<HTMLElement | null>(null);

const columnDraggable = ref<boolean>(false);
function columnDragBefore() {
  //* 预览模式
  if (editorPreviewing.value) return;

  columnDraggable.value = true;
}
function mouseUpColumn() {
  //* 预览模式
  if (editorPreviewing.value) return;

  columnDraggable.value = false;
}
function columnDragStart(column: TColumn) {
  //* 预览模式
  if (editorPreviewing.value) return;

  dragService.dragType.value = "move";
  dragService.moveComponentColumn.value = column;
  dragService.moveComponentRow.value = Props.row;
}
function columnDragEnd() {
  //* 预览模式
  if (editorPreviewing.value) return;

  columnDraggable.value = false;
}

function mouseOverRow() {
  //* 预览模式
  if (editorPreviewing.value) return;

  if (!Props.row) return;
  rowService.mouseOverRow(Props.row, Props.rowIndex);
}

function mouseOutRow() {
  //* 预览模式
  if (editorPreviewing.value) return;

  rowService.mouseOutRow();
}

const rowStyle = computed(() => {
  if (
    !RowComponentCount.has(Props.row.id)
  ) {
    return {
      height: "30px",
    };
  } else {
    return Props.row.style;
  }
});

onMounted(() => {
  Emits("mounted", []);
  if (!RowComponentCount.has(Props.row.id)) {
    RowComponentCount.set(Props.row.id, 0);
  }
});
</script>

<style scoped>
.row-wrapper {
  position: relative;
}

.row {
  flex-grow: 1;
  flex-shrink: 0;
  display: inline-flex;
  position: relative;
  width: 100%;
  /* min-height: 40px; */
  font-size: 12px;
  text-align: center;
  user-select: none;
}

.row-highlight,
.row:hover {
  background-color: #9b43ff;
}

.row-number {
  position: absolute;
  left: -20px;
  height: 20px;
  width: 20px;
  text-align: center;
  font-size: 12px;
  background-color: white;
}

.form-item-remind {
  margin-top: 3px;
  font-size: 12px;
  color: #999;
}

.column {
  flex-shrink: 0;
  flex-grow: 1;
  align-self: flex-start;
  position: relative;
  height: inherit;
}

.column-line {
  border-right: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.column-empty {
  align-self: stretch;
}

.column-highlight {
  background-color: red;
}

.column-wrapper {
  position: relative;
  /* z-index: 2; */
}

.column-control {
  position: absolute;
  right: -50px;
  top: 0;
  width: 50px;
  height: 150px;
  background-color: white;
  border: 1px solid var(--primary-color);
  box-sizing: border-box;
}
</style>
