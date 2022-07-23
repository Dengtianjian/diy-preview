import { StyleValue } from "vue"

export type TComponentTreeRowColumn = {
  index: number,
  occupiedColumns: number,
  componentName: string,
  container?: TComponentTreeContainer
}
export type TComponentTreeRow = {
  style: StyleValue & Partial<CSSStyleDeclaration>,
  height: number,
  fixedHeight: boolean,
  columns: Record<number, TComponentTreeRowColumn>
}

export type TComponentTreeContainer = {
  rows: TComponentTreeRow[]
}