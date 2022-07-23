import ApiModule from "..";

class SystemApi extends ApiModule {
  prefix = "system";
  async initSystem(key: string) {
    return this.post("init", {
      key
    });
  }
  async systemUpgrade(key: string) {
    return this.post("upgrade", {
      key
    });
  }
}

export default new SystemApi();