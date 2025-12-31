/*
 * @Author: eggYolkegg
 * @Date: 2025-12-11 19:42:36
 * @LastEditors: eggYolkegg
 * @LastEditTime: 2025-12-31 09:24:21
 * @Description:  项目实体类
 */
import { VNode } from "vue";

// 菜单项类型
export interface MenuItem {
  id: string | number;
  label: string;
  rightLabel?: () => VNode;
  icon?: () => VNode;
  disabled?: boolean;
  divider?: boolean;
  children?: MenuItem[];
  handler?: (el: HTMLElement, component: any) => void;
}

// 组件菜单映射类型
export interface ComponentMenuMap {
  [componentName: string]: MenuItem[];
}

// 指令参数类型
export interface ContextMenuOptions {
  menus: ComponentMenuMap | MenuItem[];
  zIndex?: number;
  maxWidth?: number;
  minWidth?: number;
}

//组件内所需类型
export interface Props extends ContextMenuOptions {
  visible: boolean;
  x: number;
  y: number;
}
