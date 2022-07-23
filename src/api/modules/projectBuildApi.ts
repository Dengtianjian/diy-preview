import ApiModule from ".."

class projectBuildApi extends ApiModule {
  prefix = "projects";
  getProjectBuildRecords(projectId: string, page: number = 1, limit: number = 10) {
    return this.get(`${projectId}/build/records`, {
      page, limit
    });
  }
  getProjectPackages(projectId: string, page: number = 1, limit: number = 10) {
    return this.get(`${projectId}/build/packages`, {
      page, limit
    })
  }
  deleteProjectPackage(projectId: string, packageId: string) {
    return this.delete(`${projectId}/build/packages`, {
      packageId
    });
  }
}

export default new projectBuildApi();