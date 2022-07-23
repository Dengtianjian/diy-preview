import { TComponent } from "../../typings/componentTypes";
import { TComponentTreeContainer } from "../../typings/componentTreeTypes";
import { TRow } from "../../typings/editorTypes";
import componentService from "./componentService";
import rowService from "./rowService";
import { overRow, overRowIndex, RowMap, Rows, showRowMenu } from "../store/rowStore";
import { ContainerEls, ContainerInstances, Containers, RootContainerColumn } from "../store";
import commonService from "./commonService";
import componentStore from "../store/componentStore";

const loadContainerQueue: Array<[() => void, (containerId: string) => void]> = [];
let containerQueueTaskExecuting: boolean = false

export default {
  sourceTreeAddToContainer(sourceTree: TComponentTreeContainer, targetContainerId: string) {
    sourceTree.rows.forEach((rowItem) => {
      const row: TRow = rowService.pushRowToContainer(targetContainerId, null, 0, 1);
      row.fixedHeight = rowItem.fixedHeight;
      row.height = rowItem.height;
      row.style = rowItem.style;

      for (const columnIndex in rowItem.columns) {
        const columnItem = rowItem.columns[columnIndex];
        const component: TComponent = componentStore.componentMap.get(columnItem.componentName);

        if (columnItem.container) {
          this.addContainer(
            row,
            component,
            columnItem.index,
            columnItem.occupiedColumns
          ).then((containerId: string) => {
            this.sourceTreeAddToContainer(
              columnItem.container,
              containerId
            );
          })
        } else {
          rowService.addComponent(
            row,
            component,
            columnItem.index,
            columnItem.occupiedColumns
          );
        }
      }
    });
  },
  containerMounted(containerId: string) {
    const head = loadContainerQueue[0];
    if (!head) return;
    head[1](containerId);
    containerQueueTaskExecuting = false;
    loadContainerQueue.shift();
    if (loadContainerQueue.length) {
      loadContainerQueue[0][0]();
    }
  },
  addContainer(row: TRow, component: TComponent, startIndex: number, occupiedColumns: number, insertContainerId?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      loadContainerQueue.push([() => {
        containerQueueTaskExecuting = true;
        rowService.addComponent(row, component, startIndex, occupiedColumns, insertContainerId);
      }, resolve]);
      if (containerQueueTaskExecuting === false) {
        loadContainerQueue[0][0]();
      }
    });
  },
  removeContainer(containerId: string): void {
    const container = Containers.get(containerId);
    const containerColumn = container.column;

    //* 如果是根容器就清空
    if (containerId == RootContainerColumn.value.insertContainerId) {
      return commonService.clearEditor();
    }

    container.rows.forEach(rowItem => {
      if (rowItem.columns.length > 0) {
        rowItem.columns.forEach(columnItem => {
          if (columnItem.insertContainerId) {
            this.removeContainer(columnItem.insertContainerId);
          }
        })
      }
      RowMap.delete(rowItem.id);
    })

    //* 容器所在列的所属的行
    const row: TRow = RowMap.get(containerColumn.rowId);

    rowService.removeComponent(row, containerColumn.index);

    //* 容器相关清除
    ContainerInstances.delete(containerId);
    Containers.delete(containerId);
    ContainerEls.delete(containerId);
  }
}