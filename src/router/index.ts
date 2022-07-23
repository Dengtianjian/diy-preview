import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import config from "../config";
import userService from "../service/userService";
import clientRoute from "./clientRoute";
import manageRoute from "./manageRoute";
import systemRoutes from "./systemRoutes";

const routes: RouteRecordRaw[] = [
  ...clientRoute,
  ...manageRoute,
  ...systemRoutes
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  // if (to.path === "/user/signin" && userService.checkLogin()) {
  //   next({
  //     path: "/"
  //   });
  //   return;
  // }
  // if (to.meta.auth && userService.checkLogin() === false) {
  //   next({
  //     path: "/user/signin"
  //   });
  //   return;
  // }
  if (to.meta.title) {
    document.title = to.meta.title as string + " · " + config.name;
  }

  next();
})

export default router