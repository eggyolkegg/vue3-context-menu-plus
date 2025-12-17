/*
 * @Author: eggYolkegg
 * @Date: 2025-12-11 19:41:16
 * @LastEditors: eggYolkegg
 * @LastEditTime: 2025-12-11 19:43:34
 * @Description:  
 */
import { App } from "vue";
import { contextmenuDirective } from "./directives/contextmenu";
import ContextMenu from "./components/ContextMenu.vue";
import type { MenuItem, ComponentMenuMap, ContextMenuOptions } from "./types";

// 导出组件
export { ContextMenu };

// 导出类型
export type { MenuItem, ComponentMenuMap, ContextMenuOptions };

// 导出指令
export { contextmenuDirective };

// 默认导出插件
const VueContextMenu = {
  install(app: App) {
    // 注册全局指令
    app.directive("contextmenu", contextmenuDirective);

    // 注册全局组件（可选）
    app.component("ContextMenu", ContextMenu);
  },
};

export default VueContextMenu;

