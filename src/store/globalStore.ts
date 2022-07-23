import { MenuGroupOption, MenuOption } from "naive-ui";
import { h, reactive } from "vue";
import { TProjects } from "../typings/scheme/projectScheme";

function renderIcon(className: string) {
  return () => h("i", {
    className
  })
}
const globalStore = reactive<{
  pins: Array<MenuOption | MenuGroupOption>,
  projectPage: {
    projectInfo: TProjects | null
  },
  showFooter: boolean,
  consoleErrorCount: number
}>({
  pins: [
    {
      label: "管理",
      icon: renderIcon("antdv antdv-detail"),
      key: "pin",
      type: "manage",
      disabledPin: true
    }
  ],
  projectPage: {
    projectInfo: null
  },
  showFooter: true,
  consoleErrorCount: 0
})

export default globalStore