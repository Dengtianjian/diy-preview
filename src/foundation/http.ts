import { Toast } from "vant";
import config from "../config";
export function request(url: string, method: string = "GET", query: Record<string, string> = {}, body: object | FormData = {}, header: Record<string, string> = {}): Promise<any> {
  method = method.toUpperCase();
  const headers = new Headers();
  headers.append("X-Ajax", "fetch");
  if (localStorage.getItem("F_Token")) {
    headers.append("Authorization", "Bearer " + localStorage.getItem("F_Token") as string);
  }
  for (const key in header) {
    headers.append(key, header[key]);
  }
  if ((!headers.has("content-type") || !headers.has("Content-type")) && body instanceof FormData === false) {
    headers.append("content-type", " application/json; charset=utf-8");
  }
  const options: RequestInit = {
    headers,
    method,
    mode: "cors"
  };
  if (!query) query = {};

  if (method === "GET") {
    const urlObj: URL = new URL(url);
    if (url.indexOf("?") !== -1) {
      let urlQueryString: string | string[] = url.split("?")[1];
      if (urlQueryString) {
        urlQueryString = urlQueryString.split("&");
        let urlQuery: Record<string, string> = query || {};
        urlQueryString.forEach(quertStringItem => {
          const splits: string[] = quertStringItem.split("=");
          urlQuery[splits[0]] = splits[1];
        });
        query = urlQuery;
      }
    }
    url = urlObj.origin + urlObj.pathname;
    if (query) {
      url += "?";
      let querys: string[] = [];
      for (const key in query) {
        querys.push(`${key}=${query[key] || ''}`);
      }
      url += querys.join("&");
    }
  } else {
    if (body && body instanceof FormData === false) {
      Object.assign(body, query);
      // if (headers.has("content-type") && headers.get("content-type")?.indexOf("json") !== -1) {
      //   options.body = JSON.stringify(body);
      // }
      options.body = JSON.stringify(body);
    } else {
      options.body = body as FormData;
    }
  }

  return new Promise((resolve, reject) => {
    fetch(url, options).then(async response => {
      if (response.headers.has("Authorization")) {
        const token: string = response.headers.get("Authorization") as string;
        if (token) {
          const tokenValue: string = token.slice(0, token.lastIndexOf("/"));
          const tokenExpiration: string = (Number(token.slice(token.lastIndexOf("/") + 1)) * 1000).toString();

          if (!localStorage.getItem("F_Token") || localStorage.getItem("F_Token") !== tokenValue) {
            localStorage.setItem("F_Token", tokenValue);
            localStorage.setItem("F_TokenExpiration", tokenExpiration);
          }
        } else {
          localStorage.removeItem("F_Token");
          localStorage.removeItem("F_TokenExpiration");
        }
      }

      response.json().then(res => {
        if (response.status > 299) {
          if(response.status>=500){
            Toast("服务器错误");
          }
          reject(res);
        } else {
          resolve(res.data);
        }
      })
    }).catch(err => {
      Toast("服务器错误，请稍后重试");
    })
  })
}

export function get(url: string, query: Record<string, string> = {}) {
  return request(url, "GET", query);
}

export function post(url: string, body: object = {}) {
  return request(url, "POST", {}, body);
}

export function deleteRequest(url: string, body: object = {}) {
  return request(url, "DELETE", {}, body);
}
export function patch(url: string, body: object = {}) {
  return request(url, "PATCH", {}, body);
}
export function put(url: string, body: object = {}) {
  return request(url, "PUT", {}, body);
}

export function uploadFile(url: string, file: File, body: Record<string, string> = {}) {
  const formData: FormData = new FormData();
  for (const key in body) {
    formData.append(key, body[key]);
  }
  formData.append("file", file);

  return request(url, "POST", {}, formData);
}

export function getAttachmentUrl(fileId: string): string {
  return config.APIURL + "/downloadAttachment?fileId=" + escape(fileId);
}

export default {
  request,
  get,
  post,
  patch,
  put,
  delete: deleteRequest,
  uploadFile,
  getAttachmentUrl
}