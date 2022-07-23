import type { TComponent as TComponentScheme } from "./scheme/componentScheme";

export type TComponentLoadStatus = {
  notLoaded: -1,
  error: 0,
  loaded: 1,
  loading: 2
}
export type TComponent = {
  loadStatus: keyof TComponentLoadStatus
} & TComponentScheme;

export type TComponentGroup = {
  name: string,
  list: TComponent[]
}

export type TComponentGroups = TComponentGroup[];