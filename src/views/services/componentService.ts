import { ComponentInternalInstance, defineAsyncComponent, getCurrentInstance } from "vue";
import eventBus from "../../foundation/eventBus";
import { TComponent } from "../../typings/componentTypes";
import componentStore from "../store/componentStore";

function getLoadComponentTaskId(componentName: string): string {
  return `load-component-${componentName}`;
}

export default {
  loadComponent(componentName: string): Promise<boolean> {
    const instance: ComponentInternalInstance = getCurrentInstance();
    const component: TComponent = componentStore.componentMap.get(componentName);
    if (component.loadStatus === "loaded") return Promise.resolve(true);

    let componentPath: string = "";

    if (component.buildIn == 1) {
      component.loadStatus = "loaded";
      return Promise.resolve(true);
    } else {
      if (component.loadStatus === "loading") {
        return new Promise((resolve, reject) => {
          const sub = eventBus.subscribe(getLoadComponentTaskId(componentName), (res) => {
            if (res) {
              resolve(true);
            } else {
              reject(false);
            }
            sub.cancel();
          });
        })
      }

      if (import.meta.env.MODE === "production") {
        componentPath = component.path;
      } else {
        componentPath = componentStore.DevComponentMap.get(componentName);
      }
    }
    console.log(componentPath);
    

    const task = eventBus.distribute(getLoadComponentTaskId(componentName));
    component.loadStatus = "loading";
    return new Promise((resolve, reject) => {
      if (import.meta.env.PROD) {
        import(componentPath).then((res: {
          default?: any,
          _sfc_main?: any,
          [key: string]: any
        }) => {
          let loadComponent: any = undefined;
          if (res.default) loadComponent = res.default;
          if (res._sfc_main) loadComponent = res._sfc_main;
          if (res[componentName]) loadComponent = res[componentName];

          if (!loadComponent) resolve(undefined);

          instance.appContext.components[componentName] = loadComponent;
          component.loadStatus = "loaded";
          resolve(true);
          task.complete(true);
        }).catch(reject);
      } else {
        component.loadStatus = "error";
        instance.appContext.components[componentName] = defineAsyncComponent(
          () => import(componentPath)
        )
        resolve(true);
        task.complete(false);
      }
    });
  }
}