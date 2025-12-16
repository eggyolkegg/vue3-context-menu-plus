/*
 * @Author: eggYolkegg
 * @Date: 2025-12-11 15:42:36
 * @LastEditors: eggYolkegg
 * @LastEditTime: 2025-12-11 15:43:01
 * @Description:  
 */
// 菜单项类型
export interface MenuItem {
  id: string | number;
  label: string;
  icon?: string;
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
  menus: ComponentMenuMap | MenuItem[] | ((component: any) => MenuItem[]);
  zIndex?: number;
  maxWidth?: number;
  minWidth?: number;
}
