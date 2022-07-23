import { StyleValue } from "vue"

//* 因为会拖拽容器组件放到列里面，所以会有一些参数用于容器的
export type TColumn = {
  id: string, //* id
  occupied: boolean | number; //* 是否被别的列所占用。如果是false的话就没被占用，如果是true就是组件所在列，如果是数字的话就是被别的列占用，这数字指向的是占用的列索引值
  occupiedColumns: number; //* 自己占用的列数
  index: number; //* 在列数组中的索引
  width: number; //* 宽度 默认是设备宽度 / 列数
  componentName: string; //* 组件名称
  componentWidth: number | string; //* 组件宽度。组件实际宽度
  moving: boolean; //* 是否移动中
  position: { //* CSS的Position参数，用于移动中
    top: number;
    left: number;
  };
  highlight: boolean; //* 是否高亮
  containerId: string, //* 所属容器ID
  rowId: string, //* 所在行ID
  insertContainerId: string, //* 如果当前列插入了一个容器组件，该字段就存该容器的ID
}

export type TRow = {
  highlihgt: boolean,
  index: number,
  columnWidth: number,
  width: number,
  columns: Array<TColumn>,
  containerId: string,
  fixedHeight: boolean,
  offsetTop: number,
  height: number,
  style: StyleValue & Partial<CSSStyleDeclaration>,
  id: string, //* 行唯一ID
}

export type TRows = Array<TRow>

export type TContainer = {
  id: string,
  rows: TRows,
  column: TColumn
}