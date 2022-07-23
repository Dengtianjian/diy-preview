import { reactive } from "vue";
import { TUserInfo } from "../typings/scheme/userScheme";

export default reactive<{
  isLogin: boolean,
  user: TUserInfo,
}>({
  isLogin: false,
  user: {
    nickname: ""
  }
})