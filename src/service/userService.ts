import userStore from "../store/userStore";
import userApi from "../api/modules/user";

export default {
  checkLogin(): boolean {
    const token: string | null = localStorage.getItem("F_Token");
    if (!token) {
      return false;
    }
    const tokenExpiration: string | null = localStorage.getItem("F_TokenExpiration");
    if (!tokenExpiration) {
      localStorage.removeItem("F_Token");
      return false;
    }
    if (Number(tokenExpiration) < Date.now()) {
      localStorage.removeItem("F_Token");
      return false;
    }
    userStore.isLogin = true;

    return true;
  },
  async silentLogin(): Promise<void> {
    if (this.checkLogin() === false) return Promise.reject();

    return await userApi.silentLogin();
  },
  async accountLogout() {
    userStore.isLogin = false;
    userStore.user = {};
    localStorage.removeItem("F_TOKEN");
    localStorage.removeItem("F_TokenExpiration");
    await userApi.logout();
  }
}