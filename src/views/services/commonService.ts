import { ContainerEls, ContainerInstances, Containers, deviceEl, RootContainerColumn } from "../store"
import { overRow, overRowIndex, RowMap, Rows, showRowMenu } from "../store/rowStore";

export default {
  /**
   * 计算元素相对于左侧（0，0）的偏移值
   * @param target 目标元素
   * @returns X轴偏移值与Y轴偏移值
   */
  calcuateElOffset(target: HTMLElement): {
    left: number,
    top: number
  } {
    if (target.offsetParent === deviceEl.value) {
      return {
        left: deviceEl.value.offsetLeft,
        top: deviceEl.value.offsetTop
      };
    }
    let left: number = 0;
    let top: number = 0;

    if (target.offsetParent) {
      let { left: PLeft, top: PTop } = this.calcuateElOffset(target.offsetParent as HTMLElement);
      left += PLeft;
      top += PTop;
    }
    left += target.offsetLeft;
    top += target.offsetTop;

    return {
      left,
      top
    }
  },
  clearEditor(): void {
    //* 行相关清除
    Rows.splice(0, Rows.length);
    RowMap.clear();

    showRowMenu.value = false;
    overRow.value = null;
    overRowIndex.value = -1;

    //* 容器相关清除
    ContainerInstances.forEach((ins, id) => {
      if (id !== RootContainerColumn.value.insertContainerId) {
        ContainerInstances.delete(id);
      }
    })
    Containers.forEach((ins, id) => {
      if (id !== RootContainerColumn.value.insertContainerId) {
        Containers.delete(id);
      }
    })
    ContainerEls.forEach((ins, id) => {
      if (id !== RootContainerColumn.value.insertContainerId) {
        ContainerEls.delete(id);
      }
    })
  },
  /**
 * 保留两位小数点并且向上取整
 * @param value 被取整的数值
 * @returns 取整后的值
 */
  numberRoundedUp(value: number | string): number {
    return Math.ceil(Number(Number(value).toFixed(2)));
  }
}