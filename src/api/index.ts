import config from "../config";
import http from "../foundation/http";

export default class ApiModule {
  prefix: string = "";
  baseUrl: string = config.APIURL + "/";
  // OP 多个方法的代码相同
  get<ResponseData = any>(url: string = "", query: Record<string, any> = {}): Promise<ResponseData> {
    let requestUrl: string = this.baseUrl + this.prefix;
    if (url) {
      requestUrl += "/" + url;
    }
    return http.get(requestUrl, query);
  }
  post(url: string = "", body: Record<string, any> = {}): Promise<any> {
    let requestUrl: string = this.baseUrl + this.prefix;
    if (url) {
      requestUrl += "/" + url;
    }
    return http.post(requestUrl, body);
  }
  delete(url: string = "", body: Record<string, any> = {}): Promise<any> {
    let requestUrl: string = this.baseUrl + this.prefix;
    if (url) {
      requestUrl += "/" + url;
    }
    return http.delete(requestUrl, body);
  }
  patch(url: string = "", body: Record<string, any> = {}): Promise<any> {
    let requestUrl: string = this.baseUrl + this.prefix;
    if (url) {
      requestUrl += "/" + url;
    }
    return http.patch(requestUrl, body);
  }
  put(url: string = "", body: Record<string, any> = {}): Promise<any> {
    let requestUrl: string = this.baseUrl + this.prefix;
    if (url) {
      requestUrl += "/" + url;
    }
    return http.put(requestUrl, body);
  }
}