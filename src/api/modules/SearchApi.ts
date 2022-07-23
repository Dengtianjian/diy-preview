import ApiModule from "..";

class SearchApi extends ApiModule {
  prefix = "search";
  transferTarget(keywords: string, page: number = 1, limit: number = 10) {
    return this.get("transferTarget", {
      keywords,
      page,
      limit
    })
  }
}

export default new SearchApi();