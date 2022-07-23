import { ComponentInternalInstance, reactive, ref } from "vue";
import { TColumn, TContainer } from "../../typings/editorTypes";

//* 容器相关
export const ContainerInstances = reactive<Map<string, ComponentInternalInstance>>(new Map()); //* 容器对应的实例组件
export const Containers = reactive<Map<string, TContainer>>(new Map()); //* 容器所在的列
export const ContainerEls = reactive<Map<string, HTMLElement>>(new Map()); //* 容器对应的元素

//* 设备相关
export const deviceWidth = ref<number>(600); //* 设备宽度
export const deviceEl = ref<HTMLElement>(null); //* 设备对应的元素
//* 设备距离页面左上角偏移值
export const DeviceOffsets = reactive<{
  left: number,
  top: number
}>({
  left: 0,
  top: 0
});

//* 编辑器相关
export const editorColumns = ref<number>(24); //* 每一行的列数
export const editorScrollOffset = reactive({
  left: 0,
  top: 0
});
export const editorPreviewing = ref<boolean>(false); //* 预览中

//* 根容器
export const RootContainerColumn = ref<TColumn>({
  id: "0",
  occupied: false,
  occupiedColumns: editorColumns.value,
  index: 0,
  width: deviceWidth.value,
  componentName: "",
  componentWidth: "",
  moving: false,
  position: {
    top: 0,
    left: 0,
  },
  highlight: false,
  containerId: "",
  insertContainerId: "",
  rowId: "1",
});