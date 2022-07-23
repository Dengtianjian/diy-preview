import { Toast } from "vant";
import ApiModule from "..";
import { TProjects } from "../../typings/scheme/projectScheme";

class ProjectsApi extends ApiModule {
  prefix = "projects";
  async createProject(data: {
    icon: string,
    name: string,
    version: string,
    groupId: string,
    description: string
  }) {
    if (!data.icon) {
      Toast("请上传项目图标");
      return Promise.reject("请上传项目图标");
    }
    if (!data.name) {
      Toast("请输入项目名称");
      return Promise.reject("请输入项目名称");
    }
    if (!data.version) {
      Toast("请输入项目版本号");
      return Promise.reject("请输入项目版本号");
    }
    return this.post("", data);
  }
  async pinProject(projectId: string, pin: number) {
    return this.put(`${projectId}/pin`, {
      pin
    });
  }
  async getPinProjects() {
    return this.get("pins");
  }
  async editProject(projectId: string, saveData: {
    icon: string,
    name: string,
    version: string,
    description: string,
    pin: string
  }) {
    if (!saveData.icon) {
      Toast("请上传项目图标");
      return Promise.reject("请上传项目图标");
    }
    if (!saveData.name) {
      Toast("请输入项目名称");
      return Promise.reject("请输入项目名称");
    }
    if (!saveData.description) {
      Toast("请输入项目描述");
      return Promise.reject("请输入项目描述");
    }
    return this.patch(projectId, saveData);
  }
  async getProject(projectId: string): Promise<TProjects> {
    return this.get(projectId);
  }
  async buildProject(projectId: string, technologyId: string) {
    return this.post(`${projectId}/build`, {
      technologyId
    });
  }
  async getProjectLastBuild(projectId: string) {
    return this.get(`${projectId}/lastBuild`);
  }
  /**
   * 软删除项目
   * @param projectId 项目ID
   */
  async softDeleteProject(projectId: string) {
    return this.delete(`${projectId}`);
  }
  /**
   * 获取回收箱的项目
   * @param page 页数
   * @param limit 每页数量
   * @returns 项目数组
   */
  async getTrashProjects(page: number = 1, limit: number = 10) {
    return this.get("trash", {
      page, limit
    });
  }
  async recoveryProject(projectId: string) {
    return this.post(`${projectId}/recover`);
  }
  async reallyDeleteProject(projectId: string) {
    return this.delete(`${projectId}/reallyDelete`);
  }
  async getProjectOperationRecords(projectId: string, page: number = 1, limit: number = 10) {
    return this.get(`${projectId}/operationRecords`, {
      page, limit
    });
  }
}

export default new ProjectsApi();