import { createApp, App, h, reactive, nextTick } from "vue";
import ContextMenu from "../components/ContextMenu.vue";
import type { MenuItem, ContextMenuOptions } from "../types";

// 全局菜单实例
let menuInstance: App | null = null;
let container: HTMLElement | null = null;
let currentElement: HTMLElement | null = null;
let mouseEvent: MouseEvent | null = null;
let menuData: any = null; // 响应式数据存储
let currentOnItemClick:
  | ((item: MenuItem, element: HTMLElement, mouseevent: MouseEvent) => void)
  | null = null;

/**
 * 创建vue模版实例
 */
const createMenuInstance = () => {
  container = document.createElement("div");
  document.body.appendChild(container);

  // 创建响应式数据
  menuData = reactive({
    visible: false,
    x: 0,
    y: 0,
    menus: [] as MenuItem[],
  });

  menuInstance = createApp({
    render() {
      return h(ContextMenu, {
        visible: menuData.visible,
        x: menuData.x,
        y: menuData.y,
        menus: menuData.menus,
        "onUpdate:visible": (val: boolean) => {
          menuData.visible = val;
        },
        onItemClick: (item: MenuItem) => {
          if (currentOnItemClick && currentElement && mouseEvent)
            currentOnItemClick(item, currentElement, mouseEvent);
        },
      });
    },
  });

  menuInstance.mount(container);
};

/**
 * 展示菜单
 * @param event 鼠标事件
 * @param menus 菜单数据
 * @param element 触发菜单的元素
 * @param onItemClick 用户自定义的回调函数
 */
function showContextMenu(
  event: MouseEvent,
  menus: MenuItem[],
  element?: HTMLElement,
  onItemClick?: (
    item: MenuItem,
    element: HTMLElement,
    mouseevent: MouseEvent
  ) => void
) {
  if (!menuInstance) createMenuInstance();

  currentOnItemClick = onItemClick || null;
  currentElement = element || (event.currentTarget as HTMLElement);
  mouseEvent = event;

  menuData.visible = true;
  menuData.menus = menus;
  menuData.x = event.clientX;
  menuData.y = event.clientY;

  // 防止菜单超出屏幕
  nextTick(() => {
    const menuEl = container?.querySelector(".vue-context-menu") as HTMLElement;
    if (!menuEl) return;
    const rect = menuEl.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    if (rect.right > viewportWidth) menuData.x = viewportWidth - rect.width - 5;
    if (rect.bottom > viewportHeight)
      menuData.y = viewportHeight - rect.height - 5;
  });

  event.preventDefault();
  event.stopPropagation();
}

/**
 * 提取菜单数据
 * @param componentName attribute 标签
 * @param options 数据源
 * @returns 返回组件所需要的数据
 */
function getMenusForComponent(
  componentName: string,
  options: ContextMenuOptions
): MenuItem[] {
  const menus = options.menus;
  if (Array.isArray(menus)) return menus;
  if (!componentName) {
    console.warn("检测到当前实例不存在data-component的标识");
  }
  return menus[componentName] || [];
}

/**
 * Vue 自定义指令
 */
const contextmenuDirective = {
  mounted(el: HTMLElement, binding: any) {
    const value = binding.value;

    let menus: any;
    let onItemClick:
      | ((item: MenuItem, element: HTMLElement, mouseevent: MouseEvent) => void)
      | undefined;

    if (!value || typeof value !== "object") {
      console.warn("v-contextmenu: 需要绑定 object 或者 Array");
      return;
    }

    for (const [key, val] of Object.entries(value)) {
      if (Array.isArray(val) || typeof val === "object") {
        menus = val;
      } else if (typeof val === "function") {
        onItemClick = val as any;
      }
    }

    const options: ContextMenuOptions = {
      menus: menus,
      zIndex: binding.arg ? parseInt(binding.arg) : 9999,
      ...binding.modifiers,
    };

    el.addEventListener("contextmenu", (event: MouseEvent) => {
      const dataComponent = el.getAttribute("data-component");
      const menuList = getMenusForComponent(dataComponent ?? "", options);

      if (menuList.length > 0)
        showContextMenu(event, menuList, el, onItemClick);
    });
  },
};

export { contextmenuDirective };
