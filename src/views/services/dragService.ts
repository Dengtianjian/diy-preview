import { ComponentInternalInstance, ref, watch } from "vue";
import eventBus from "../../foundation/eventBus";
import { TComponent } from "../../typings/componentTypes";
import { TColumn, TContainer, TRow, TRows } from "../../typings/editorTypes";
import { ContainerEls, ContainerInstances, Containers, editorColumns, editorScrollOffset } from "../store";
import componentStore from "../store/componentStore";
import commonService from "./commonService";
import rowService from "./rowService";

type TDragTypes = {
  add: 0,
  move: 1
}

const dragType = ref<keyof TDragTypes>("add"); //* 拖拽类型。add=从组件列表拖拽到容器里，move=在容器里移动组件

//* 拖拽进入了容器相关
let enterContainerId = ref<string>(""); //* 进入的容器ID
let enterContainer: TContainer = null; //* 进入的容器信息
let enterContainerColumn: TColumn = null; //* 进入的容器，也就是列相关信息，只是这个列的insertContaienrId不是空的
let enterContainerInstance: ComponentInternalInstance = null; //* 进入的容器Vue组件实例
let enterContainerEl: HTMLElement = null; //* 进入的容器元素
let enterContainerRows: TRows = []; //* 进入的容器拥有的行。指向的是enterContainer的rows属性
let enterContainerRowEls: HTMLElement[] = []; //* 进入的容器拥有的行对应的元素
let enterContainerHitRow: TRow = null; //* 进入了容器命中的行信息
let enterContainerHitRowIndex: number = null; //* 进入的容器命中的行索引值
let hitRowOverColumnIndex: number[] = []; //* 行命中的列索引值
//* 命中的容器位置相对于左上角0,0 偏移值
let enterContainerOffsets = {
  left: 0,
  right: 0,
  top: 0,
  bottom: 0
}

//* 如果dragType=add 该值就不为空
const addTargetComponent = ref<TComponent>(null);
const moveComponentColumn = ref<TColumn>(null); ///* 移动的组件所在的列
const moveComponentRow = ref<TRow>(null); //* 移动的组件所在的行

//* 发布订阅，可以让容器组件订阅，方便容器判断拖拽时鼠标是否在容器范围内
const distribute = eventBus.distribute("__container_drag_service");
watch(() => enterContainerId.value, distribute.complete);

//* 计算组件所需占用的列数量
/**
 * 计算添加的组件所需占用的列数量
 */
function calcAddTargetComponentOccupiedColumns(): number {
  if (!addTargetComponent.value || !enterContainerColumn) return 1;
  if (addTargetComponent.value.occupiedColumns > 0) {
    return addTargetComponent.value.occupiedColumns;
  }

  //* 优先采用 occupiedColumns ，如果occupiedColumns<1 再到 width
  //* occupiedColumns=占的列数，直接endIndex=startIndex+occupiedColumns即可
  //* width=组件的宽度，如果是string就parseFloat取出数值，如果是numer直接除以所在row的columnWidth获取occupiedColumns

  let width: number = parseFloat(addTargetComponent.value.width.toString());

  if (enterContainerHitRow) {
    return commonService.numberRoundedUp(width / enterContainerHitRow.columnWidth);
  }

  return commonService.numberRoundedUp(width / (enterContainerColumn.width / editorColumns.value));
}
/**
 * 计算移动的组件所需占用的列数量
 */
function calcMoveTargetComponentOccupiedColumns(): number {
  if (!moveComponentColumn.value) return 1;
  if (moveComponentColumn.value.occupiedColumns) return moveComponentColumn.value.occupiedColumns;

  let componentWidth: number = 0;
  if (moveComponentColumn.value.componentWidth) {
    if (typeof moveComponentColumn.value.componentWidth === "string") {
      componentWidth = parseFloat(moveComponentColumn.value.componentWidth);
    }
  } else {
    componentWidth = moveComponentColumn.value.width;
  }

  let occupiedColumns: number = 1;
  if (enterContainerHitRow) {
    occupiedColumns = rowService.calcColumnComponentOccupiedColumns(moveComponentColumn.value, enterContainerHitRow.width);
  } else if (enterContainerEl) {
    occupiedColumns = rowService.calcColumnComponentOccupiedColumns(moveComponentColumn.value, 0, enterContainerEl.clientWidth);
  }

  return occupiedColumns;
}
/**
 * 计算移动的组件或者添加的组件所需要占用的列数量
 * @returns 计算的需要占用列数量
 */
function calcuateOccupiedColumns(): number {
  switch (dragType.value) {
    case "add":
      return calcAddTargetComponentOccupiedColumns();
    case "move":
      return calcMoveTargetComponentOccupiedColumns();
  }
}

/**
 * 取消hitRowOverColumnIndex里面指定的列高亮
 */
function cancelColumnHighlight(): void {
  hitRowOverColumnIndex.forEach(index => {
    enterContainerHitRow.columns[index].highlight = false;
  });
  hitRowOverColumnIndex = [];
}

/**
 * 检测是否可以放置在指定的行和列
 * @returns true|false
 */
function checkAllowedPlacedHere(): boolean {
  let allow: boolean = true;

  if (!enterContainerHitRow) return allow;

  if (enterContainerHitRow.id !== moveComponentRow.value?.id || dragType.value === "add") {

    for (const index of hitRowOverColumnIndex) {
      if (enterContainerHitRow.columns[index].occupied !== false || enterContainerHitRow.columns[index].componentName) {
        allow = false;
      }
    }
  } else {
    if (enterContainerHitRow.id === moveComponentRow.value.id) {
      const oldIndex: number = moveComponentColumn.value.index;
      if (hitRowOverColumnIndex.includes(oldIndex)) {
        for (const index of hitRowOverColumnIndex) {
          if (index === oldIndex) continue;
          if ((enterContainerHitRow.columns[index].occupied !== false || enterContainerHitRow.columns[index].componentName) && enterContainerHitRow.columns[index].occupied !== oldIndex) {
            allow = false;
            break;
          }
        }
      } else {
        for (const index of hitRowOverColumnIndex) {
          if (enterContainerHitRow.columns[index].occupied !== oldIndex && (enterContainerHitRow.columns[index].occupied !== false || enterContainerHitRow.columns[index].componentName)) {
            allow = false;
            break;
          }
        }
      }
    }
  }

  return allow;
}

/**
 * 根据Y轴偏移量匹配行
 * @param offsetY Y轴偏移量
 */
function matchRow(offsetY: number): void {
  if (enterContainerRows.length === 0) return;

  let hitRowIndex: number = enterContainerRows.findIndex(rowItem => {
    return offsetY > rowItem.offsetTop && offsetY < rowItem.height + rowItem.offsetTop;
  });

  if (hitRowIndex < 0 || !enterContainerRowEls[hitRowIndex]) return;
  if (hitRowIndex === enterContainerHitRowIndex && enterContainerHitRowIndex >= 0) return;

  cancelColumnHighlight();

  enterContainerHitRow = enterContainerRows[hitRowIndex];
  enterContainerHitRowIndex = hitRowIndex;
}

/**
 * 根据X轴在行的便宜值匹配列
 * @param offsetX X轴偏移量
 */
function matchColumn(offsetX: number): void {
  if (!enterContainerHitRow) return;

  if (!addTargetComponent.value && dragType.value === "add") return;
  if (!moveComponentColumn.value && dragType.value === "move") return;

  let startIndex: number = Math.floor(offsetX / enterContainerHitRow.columnWidth);

  if (startIndex < 0) {
    startIndex = 0;
  };
  if (startIndex > editorColumns.value) {
    startIndex = editorColumns.value - 1;
  }


  const endIndex: Number = startIndex + calcuateOccupiedColumns();
  if (endIndex > editorColumns.value) return;

  //* 如果高亮的位置和之前的位置一样就不用再执行下面的代码
  if (hitRowOverColumnIndex.length) {
    if (enterContainerHitRow[0] === startIndex && hitRowOverColumnIndex[hitRowOverColumnIndex.length - 1] === endIndex) return;
  }

  //DONE 如果是已经有占用的列，但是移动到的格子是空的，就相当于把组件移动了多少个格子，而不是放弃移动
  // 先遍历一次看看有没有是已经占用的列，有的话就不继续执行下面代码
  // for (let index = startIndex; index < endIndex; index++) {
  //   const column = enterContainerHitRow.columns[index];
  //   if (column.occupied || column.componentName) {
  //     return;
  //   }
  // }

  cancelColumnHighlight();

  for (let index = startIndex; index < endIndex; index++) {
    hitRowOverColumnIndex.push(index);
    enterContainerHitRow.columns[index].highlight = true;
  }
}

/**
 * 根据组件所在的位置判断是否还在容器内
 * @param offsetX X轴偏移量
 * @param offsetY Y轴偏移量
 */
function inContainer(offsetX: number, offsetY: number): boolean {
  if (offsetX >= enterContainerOffsets.left && offsetX <= enterContainerOffsets.right) {
    if (offsetY >= enterContainerOffsets.top && offsetY <= enterContainerOffsets.bottom) {
      return true;
    }
  }
  return false;
}

/**
 * 传入一个容器ID判断当前进入的是否是这个容器
 * @param containerId 被判断的容器ID
 * @returns true|false
 */
function isEnterMe(containerId: string): boolean {
  if (!window.event) return false;
  // @ts-ignore
  if (!window.event instanceof DragEvent) return false;
  if (enterContainerId.value !== containerId) return false;

  const event: DragEvent = window.event as DragEvent;
  return inContainer(calculateOffsetX(event.pageX), calculateOffsetY(event.pageY));
}

//* 计算offset相关偏移值
/**
 * 刷新进入的容器距离页面最左侧最顶部(0,0)位置的偏移量参数
 */
function refreshEnterContainerOffsets(): void {
  if (!enterContainerEl) return;

  const { top, left } = commonService.calcuateElOffset(enterContainerEl);

  //* 左侧偏移值
  enterContainerOffsets.left = left;
  //* 右侧偏移值，也就是元素最右边相对于页面最左侧的偏移值。
  enterContainerOffsets.right = left + enterContainerEl.offsetWidth;

  //* 距离顶部偏移值
  enterContainerOffsets.top = top;
  //* 底部偏移值，也就是元素最底侧距离页面顶部的偏移值
  enterContainerOffsets.bottom = top + enterContainerEl.offsetHeight;
}
/**
 * 计算相对于页面左侧的偏移值
 * @param mouseEventPageX mouseEvent.pageX
 * @returns 计算后的结果
 */
function calculateOffsetXRelatedPage(mouseEventPageX: number): number {
  return mouseEventPageX - enterContainerOffsets.left + editorScrollOffset.left;
}
/**
 * 计算相对于页面的顶部的偏移值
 * @param mouseEventPageY mouseEvent.pageY
 * @returns 计算后的结果
 */
function calculateOffsetYRelatedPage(mouseEventPageY: number): number {
  return mouseEventPageY - enterContainerOffsets.top + editorScrollOffset.top;
}

/**
 * 统一计算X轴的偏移值
 * @param pageX Event.pagrX
 * @returns 计算后的偏移值
 */
function calculateOffsetX(pageX: number): number {
  return editorScrollOffset.left + pageX;
}
/**
 * 统一计算Y轴的偏移值
 * @param pageY Event.pagrY
 * @returns 计算后的Y轴偏移值
 */
function calculateOffsetY(pageY: number): number {
  return editorScrollOffset.top + pageY;
}

/**
 * 重置当前服务模块的变量值
 */
function reset(): void {
  //* 高亮的列取消高亮
  if (hitRowOverColumnIndex.length) {
    cancelColumnHighlight();
    hitRowOverColumnIndex = [];
  }

  //* 行相关重置
  if (enterContainerHitRow) {
    enterContainerHitRow.highlihgt = false;
    enterContainerHitRow = null;
    enterContainerHitRowIndex = -1;
  }

  //* 容器相关变量重置
  enterContainerId.value = "";
  enterContainerColumn = null;
  enterContainer = null;
  enterContainerInstance = null;
  enterContainerEl = null;
  enterContainerRows = [];
  enterContainerRowEls = [];

  //* 组件相关重置
  // addTargetComponent.value = null;
  // moveComponentColumn.value = null;
  // moveComponentRow.value = null;
}

/**
 * 鼠标拖拽的组件进入了一个容器
 * @param payload DragEvent
 * @param containerId 容器ID
 * @returns void
 */
function componentEnterContainer(payload: DragEvent, containerId: string): void {
  if (containerId === enterContainerId.value) {
    return refreshEnterContainerOffsets();
  }

  if (containerId === moveComponentColumn.value?.insertContainerId && dragType.value === "move") {
    return;
  }
  reset();

  enterContainerId.value = containerId;
  enterContainerEl = ContainerEls.get(containerId);
  enterContainerInstance = ContainerInstances.get(containerId);
  enterContainer = Containers.get(containerId);
  enterContainerRows = enterContainer.rows;
  enterContainerColumn = enterContainer.column;
  enterContainerRowEls = Array.from(enterContainerEl.children) as HTMLElement[];

  refreshEnterContainerOffsets();

  matchRow(calculateOffsetYRelatedPage(payload.pageY));
  matchColumn(calculateOffsetXRelatedPage(payload.pageX));
}

//* 是否已经重置过容器的偏移值。每次进入不同的容器时都是重置一次
let isRefreshedContainerOffsets: boolean = false;
function componentOverContainer(payload: DragEvent): void {
  if (isRefreshedContainerOffsets === false) {
    refreshEnterContainerOffsets();
    isRefreshedContainerOffsets = true;
  }

  matchRow(calculateOffsetYRelatedPage(payload.pageY));
  matchColumn(calculateOffsetXRelatedPage(payload.pageX));
}

/**
 * 鼠标拖拽的组件离开了进入的容器
 * @param payload DragEvent
 * @returns void
 */
function componentLeaveContainer(payload: DragEvent): void {
  if (inContainer(calculateOffsetX(payload.pageX), calculateOffsetY(payload.pageY))) {
    return;
  }

  cancelColumnHighlight();
  // reset();
}

/**
 * 鼠标把拖拽的组件放下在进入的容器
 * @returns void
 */
function dropOnContainer(): void {
  if (!enterContainerId.value || enterContainerId.value === moveComponentColumn.value?.insertContainerId && dragType.value === "move") {
    return;
  }

  //TODO 逐层往上排查是否跟当前移动的容器组件ID一致，如果一致的话就return

  const startIndex: number = hitRowOverColumnIndex[0];

  if (enterContainerHitRow) {
    if (checkAllowedPlacedHere()) {
      //* 如果命中了行，说明是放到指定位置
      switch (dragType.value) {
        case "add":
          rowService.addComponent(enterContainerHitRow, addTargetComponent.value, startIndex, calcuateOccupiedColumns(), "", addTargetComponent.value.width);
          break;
        case "move":
          rowService.moveComponent(moveComponentRow.value, enterContainerHitRow, moveComponentColumn.value.index, startIndex);
          break;
      }
    }
  } else {
    //* 没有命中行，需要初始化容器，添加行，然后添加组件
    switch (dragType.value) {
      case "add":
        rowService.pushRowToContainer(enterContainerId.value, addTargetComponent.value, startIndex, calcuateOccupiedColumns());
        break;
      case "move":
        const component: TComponent = componentStore.componentMap.get(moveComponentColumn.value.componentName);
        rowService.pushRowToContainer(enterContainerId.value, component, moveComponentColumn.value.index, calcuateOccupiedColumns(), moveComponentColumn.value.insertContainerId);
        rowService.removeComponent(moveComponentRow.value, moveComponentColumn.value.index);
        break;
    }
  }

  rowService.resetContainerRowParams(enterContainerId.value);
  reset();
}

export default {
  dragType,
  addTargetComponent,
  moveComponentColumn,
  moveComponentRow,
  enterContainerId,
  isEnterMe,
  componentEnterContainer,
  componentOverContainer,
  componentLeaveContainer,
  dragEnd: reset,
  dropOnContainer
}