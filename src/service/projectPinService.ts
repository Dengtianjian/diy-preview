import { h } from "vue";
import projectGroup from "../api/modules/projectGroupApi";
import ProjectsApi from "../api/modules/ProjectsApi";
import http from "../foundation/http";
import data from "../store/globalStore";
import { TProjectGroups, TProjects } from "../typings/scheme/projectScheme";

type TPinTypes = {
  project: 1, projectGroup: 2
}
function renderImg(src: string) {
  return () =>
    h("img", {
      src,
      style: "width:22px;height:22px;object-fit:cover;border-radius:var(--border-radius);"
    });
}
export default {
  async getPins() {
    let pinProjectGroups = await projectGroup.getPinProjectGroups();
    pinProjectGroups.forEach((projectGroup: TProjectGroups) => {
      this.addPin(projectGroup, "projectGroup");
    });
    let pinProjects = await ProjectsApi.getPinProjects();
    pinProjects.forEach((project: TProjects) => {
      this.addPin(project, "project");
    });
  },
  addPin(projectGroup: TProjects | TProjectGroups, type: keyof TPinTypes = "project") {
    let label: string = (projectGroup as TProjects | TProjectGroups).name as string;
    let icon = renderImg(http.getAttachmentUrl((projectGroup as TProjects | TProjectGroups).icon as string));
    data.pins.push({
      label,
      icon,
      key: `pin-${projectGroup.id}`,
      type,
      id: (projectGroup as TProjects | TProjectGroups).id,
      iconUrl: http.getAttachmentUrl(projectGroup.icon as string)
    });
  },
  removePin(projectGroup: TProjects | TProjectGroups) {
    let index = data.pins.findIndex(item => {
      return item.id === projectGroup.id
    });
    if (index > -1) data.pins.splice(index, 1);
  }
}