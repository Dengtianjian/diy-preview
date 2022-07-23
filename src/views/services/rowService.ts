import { ComponentInternalInstance } from "vue";
import commonService from "../../service/commonService";
import { TComponent } from "../../typings/componentTypes";
import { TColumn, TContainer, TRow, TRows } from "../../typings/editorTypes"
import { ContainerEls, ContainerInstances, Containers, DeviceOffsets, editorColumns } from "../store"
import componentStore from "../store/componentStore";
import { menuPosition, overRow, overRowIndex, RowComponentCount, RowMap, showRowMenu } from "../store/rowStore";
import CS from "./commonService";
import componentService from "./componentService";

function mouseOverRow(row: TRow, rowIndex: number): void {
  if (overRow.value === row) return;
  overRow.value = row;
  overRowIndex.value = rowIndex;
  showRowMenu.value = true;

  const containerEl: HTMLElement = ContainerEls.get(row.containerId);

  const rowEl: HTMLElement = containerEl.children[rowIndex] as HTMLElement;

  const { left, top } = CS.calcuateElOffset(rowEl);

  menuPosition.left = `${left + rowEl.clientWidth - DeviceOffsets.left}px`;
  menuPosition.top = `${top - DeviceOffsets.top}px`;
}
function mouseOutRow(): void {

}

function calcColumnComponentOccupiedColumns(column: TColumn, rowWidth?: number, containerWidth?: number): number {
  let componentWidth: string | number = column.componentWidth;

  if (componentWidth > 0) {
    componentWidth = parseFloat(componentWidth.toString());
  } else {
    if (column.occupiedColumns > 0) {
      return column.occupiedColumns;
    } else {
      componentWidth = parseFloat(column.width.toString());
    }
  }

  let occupiedColumns: number = 1;
  if (rowWidth) {
    occupiedColumns = CS.numberRoundedUp(componentWidth / (rowWidth / editorColumns.value));
  } else if (containerWidth) {
    occupiedColumns = CS.numberRoundedUp(componentWidth / (containerWidth / editorColumns.value));
  }

  return occupiedColumns;
}

export default {
  mouseOverRow,
  mouseOutRow,
  calcColumnComponentOccupiedColumns,
  createRow(targetContainerId: string, component?: TComponent, addComponentStartIndex: number = 0, addComponentOccupiedColumns: number = 1, insertContainerId?: string): TRow {
    const rowWidth: number = Containers.get(targetContainerId).column.width;

    const rowId: string = commonService.genUniqueId();

    const columns: TColumn[] = [];

    const columnWidth: number = Number((rowWidth / editorColumns.value).toPrecision(4));

    for (let index = 0; index < editorColumns.value; index++) {
      const id: string = commonService.genUniqueId();
      columns.push({
        occupied: false,
        occupiedColumns: 1,
        index,
        width: columnWidth,
        componentName: "",
        componentWidth: "",
        moving: false,
        position: {
          top: 0,
          left: 0
        },
        highlight: false,
        id,
        containerId: targetContainerId,
        rowId,
        insertContainerId: ""
      });
    }

    const newRow: TRow = {
      id: rowId,
      highlihgt: false,
      columns,
      index: 0,
      columnWidth,
      width: rowWidth,
      containerId: targetContainerId,
      fixedHeight: false,
      offsetTop: 0,
      height: 10,
      style: {}
    }

    RowComponentCount.set(rowId, 0);

    if (component) {
      this.addComponent(newRow, component, addComponentStartIndex, addComponentOccupiedColumns, insertContainerId);
    }

    RowMap.set(rowId, newRow);

    return newRow;
  },
  addRowToContainer(targetContainerId: string, targetIndex: number = null, component?: TComponent, startIndex: number = 0, occupiedColumns: number = 1, insertContainerId?: string): TRow {
    const rows: TRows = Containers.get(targetContainerId).rows;

    const newRow: TRow = this.createRow(targetContainerId, component, startIndex, occupiedColumns, insertContainerId);
    newRow.index = targetIndex;
    rows.splice(targetIndex, 0, newRow);

    return newRow;
  },
  pushRowToContainer(targetContainerId: string, component: TComponent = null, startIndex: number = 0, occupiedColumns: number = 1, insertContainerId?: string): TRow {
    const rows: TRows = Containers.get(targetContainerId).rows;

    return this.addRowToContainer(targetContainerId, rows.length, component, startIndex, occupiedColumns, insertContainerId);
  },
  resetContainerRowParams(containerId: string): void {
    const containerEl = ContainerEls.get(containerId);
    const rows = Containers.get(containerId).rows;

    if (containerEl) {
      Array.from(containerEl.children).forEach((rowElItem, itemIndex) => {
        if (rowElItem instanceof HTMLDivElement && rowElItem.dataset?.row) {
          rows[itemIndex].index = itemIndex; //* 更新行索引

          rows[itemIndex].columnWidth = rowElItem.clientWidth / editorColumns.value; //* 更新行的列宽

          rows[itemIndex].width = rowElItem.clientWidth; //* 更新行的宽度
          rows[itemIndex].height = rowElItem.clientHeight; //* 更新行的高度
          rows[itemIndex].offsetTop = rowElItem.offsetTop; //* 更新行的Y轴偏移值

          rows[itemIndex].columns.forEach((columnItem, itemIndex) => {
            columnItem.index = itemIndex;
          })
        }
      });
    }
  },
  removeComponent(row: TRow, targetColumnIndex: number): void {
    const column = row.columns[targetColumnIndex];
    const endIndex: number = targetColumnIndex + column.occupiedColumns;

    //* 行的组件数量减去 1
    RowComponentCount.set(row.id, RowComponentCount.get(row.id) - 1);

    //* 把相关列恢复成默认值
    for (let index = targetColumnIndex; index < endIndex; index++) {
      row.columns[index].width = row.columnWidth;
      row.columns[index].occupied = false;
      row.columns[index].occupiedColumns = 1;
      row.columns[index].componentName = "";
      row.columns[index].moving = false;
      row.columns[index].highlight = false;
      row.columns[index].componentWidth = 0;
      row.columns[index].insertContainerId = "";
    }

  },
  removeRow(contaienrId: string, rowIndex: number): boolean {
    if (!Containers.has(contaienrId)) return false;

    const rows: TRows = Containers.get(contaienrId).rows;
    const row: TRow = rows[rowIndex];
    if (!row) return true;

    RowComponentCount.delete(row.id);
    RowMap.delete(row.id);

    rows.splice(rowIndex, 1);

    return true;
  },
  moveComponent(oldRow: TRow, targetRow: TRow, oldIndex: number, targetIndex?: number): void {
    const oldColumn: TColumn = oldRow.columns[oldIndex];
    const component: TComponent = componentStore.componentMap.get(oldColumn.componentName);

    const occupiedColumns: number = calcColumnComponentOccupiedColumns(oldColumn, targetRow.width);

    targetIndex = targetIndex ?? oldColumn.index;
    const insertContainerId: string = oldColumn.insertContainerId;
    const componentWidth: string | number = oldColumn.componentWidth;

    this.removeComponent(oldRow, oldIndex);
    this.addComponent(targetRow, component, targetIndex, occupiedColumns, insertContainerId, componentWidth);
  },
  addComponent(row: TRow, component: TComponent, startIndex: number, occupiedColumns: number, insertContainerId?: string, componentWidth?: number | string): void {
    const conponentName: string = component.name;
    if (!componentWidth) {
      componentWidth = component.width;
    }

    const columnWidth = row.columnWidth;
    const columns = row.columns;

    const endIndex: number = startIndex + occupiedColumns - 1;
    columns[startIndex].occupied = true;
    columns[startIndex].occupiedColumns = occupiedColumns;
    columns[startIndex].componentName = conponentName;
    columns[startIndex].width = occupiedColumns * columnWidth;
    columns[startIndex].componentWidth = componentWidth;
    if (insertContainerId) {
      columns[startIndex].insertContainerId = insertContainerId;

      //* 如果是容器组件就更新容器对应的列
      const container: TContainer = Containers.get(insertContainerId);
      container.column = columns[startIndex];
    }

    for (let index = startIndex + 1; index <= endIndex; index++) {
      columns[index].occupied = startIndex;
      columns[index].occupiedColumns = 1;
      columns[index].width = 0;
    }

    RowComponentCount.set(row.id, RowComponentCount.get(row.id) + 1);
  }
}