import { reactive, ref } from "vue";
import { TRow, TRows } from "../../typings/editorTypes";

export const RowComponentCount = reactive<Map<string, number>>(new Map()); //* 每行的组件数量

export const RowMap = reactive<Map<string, TRow>>(new Map()); //* 行ID对应的行
export const Rows = reactive<TRows>([]); //* 行

export const ShowAuxiliaryLine = ref<boolean>(false); //* 是否显示辅助线

//* 鼠标移动到行相关
export const overRow = ref<TRow>(null);
export const overRowIndex = ref<number>(-1);
//* 行菜单相关
export const menuPosition = reactive<{
  left: string,
  top: string
}>({
  left: "0px",
  top: "0px"
});
export const showRowMenu = ref<boolean>(false);