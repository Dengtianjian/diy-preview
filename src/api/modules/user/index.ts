import ApiModule from "../..";
import { Toast } from "vant";
import userStore from "../../../store/userStore";

class User extends ApiModule {
  prefix: string = "user";
  signin(data: {
    username?: string,
    password?: string,
    email?: string,
    phone_number?: number,
    verification_code?: number,
    signinMethod?: string
  }, signinType: string = "login") {
    switch (data.signinMethod) {
      case "account":
        if (!data.username) {
          Toast({
            message: "请输入登录的账号"
          });
          return;
        }
        if (!data.password) {
          Toast({
            message: "请输入登录的账号密码"
          });
          return;
        }
        break;
      case "email":
        if (!data.email) {
          Toast({
            message: "请输入登录的邮箱账号"
          });
          return;
        }
        if (!data.verification_code) {
          Toast({
            message: "请输入收到的邮件验证码"
          });
          return;
        }
        break;
      case "phone_number":
        if (!data.phone_number) {
          Toast({
            message: "请输入登录的手机号码"
          });
          return;
        }
        if (!data.verification_code) {
          Toast({
            message: "请输入收到的短信验证码"
          });
          return;
        }
        break;
    }
    switch (signinType) {
      case "login":
        return this.post("login", data).then(res => {
          userStore.isLogin = true;
          userStore.user = res;
          return res;
        }).catch((err) => {
          Toast({
            message: err.message
          });
          return Promise.reject(err);
        });
      case "register":
        return this.post("register", data).then(res => {
          console.log(res);
        }).catch((err) => {
          Toast({
            message: err.message
          });
          return Promise.reject(err);
        });
        break;
    }

  }
  async silentLogin(): Promise<void> {
    await this.post("silentLogin").then(res => {
      if (res === false) {
        localStorage.removeItem("F_Token");
        localStorage.removeItem("F_TokenExpiration");
        userStore.isLogin = false;
        userStore.user = {};
        return;
      }
      userStore.isLogin = true;
      userStore.user = res;
    }).catch(err => {
      Toast("登录已失效，请重新登录");
      localStorage.removeItem("F_Token");
      localStorage.removeItem("F_TokenExpiration");
      userStore.isLogin = false;
      userStore.user = {};
    })
  }
  logout() {
    return this.post("logout");
  }
  searchUsers(keywords: string, page: number = 1, limit: number = 10) {
    return this.get("search", {
      keywords, page, limit
    });
  }
}

export default new User();