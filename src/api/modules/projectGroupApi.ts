import { Toast } from "vant";
import ApiModule from ".."

class ProjectGroup extends ApiModule {
  prefix = "projectGroups";
  async createProjectGroup(data: {
    icon: string,
    name: string,
    description: string
  }) {
    return this.post("", data)
  }
  async getUserProjectGroups(page: number = 1, perPage: number = 12, keyword: string = "") {
    return this.get("", {
      page,
      perPage,
      keyword
    });
  }
  async getProjectGroup(projectGroupId: string) {
    return this.get(projectGroupId);
  }
  async saveProjectGroup(projectGroupId: string, data: {
    icon: string,
    name: string,
    description: string
  }) {
    if (!data.name) {
      Toast("项目组名称不可为空");
      return;
    }
    return this.patch(projectGroupId, data);
  }
  async getProjects(projectGroupId: string, page: number = 1, perPage: number = 15) {
    return this.get(`${projectGroupId}/projects`, {
      page,
      perPage
    })
  }
  async pinProjectGroup(projectGroupId: string, pin: number) {
    return this.put(`${projectGroupId}/pin`, {
      pin
    });
  }
  async getPinProjectGroups() {
    return this.get("pins");
  }
  async softDeleteProjectGroup(projectGroupId: string) {
    return this.delete(projectGroupId);
  }
  async getInTrashProjectGroups(page: number = 1, limit: number = 15) {
    return this.get("trash", {
      page, limit
    })
  }
  async recoveryProjectGroup(groupId: string) {
    return this.post(`${groupId}/recovery`);
  }
}

export default new ProjectGroup();