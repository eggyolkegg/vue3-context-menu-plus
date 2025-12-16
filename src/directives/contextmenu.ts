import { createApp, App, h } from "vue";
import ContextMenu from "../components/ContextMenu.vue";
import type { MenuItem, ContextMenuOptions } from "../types";

// 全局菜单实例
let menuInstance: App | null = null;
let container: HTMLElement | null = null;

// 获取组件名
function getComponentName(el: HTMLElement): string {
  // 优先从data-component获取
  const dataComponent = el.getAttribute("data-component");
  if (dataComponent) return dataComponent;

  // 从class中查找组件类名
  const classList = el.classList;
  for (let i = 0; i < classList.length; i++) {
    const className = classList[i];
    if (className.startsWith("component-")) {
      return className.replace("component-", "");
    }
  }

  // 默认返回标签名
  return el.tagName.toLowerCase();
}

// 创建菜单实例
function createMenuInstance() {
  if (menuInstance) return;

  container = document.createElement("div");
  document.body.appendChild(container);

  menuInstance = createApp({
    data() {
      return {
        visible: false,
        x: 0,
        y: 0,
        menus: [] as MenuItem[],
      };
    },
    render() {
      return h(ContextMenu, {
        visible: this.visible,
        x: this.x,
        y: this.y,
        menus: this.menus,
        "onUpdate:visible": (val: boolean) => {
          this.visible = val;
        },
        onItemClick: (item: MenuItem) => {
          // 菜单项点击处理
        },
      });
    },
  });

  menuInstance.mount(container);
}

// 显示菜单
function showContextMenu(
  event: MouseEvent,
  menus: MenuItem[],
  options?: Partial<ContextMenuOptions>
) {
  if (!menuInstance) createMenuInstance();

  const vm = menuInstance!._instance!.proxy as any;
  vm.x = event.clientX;
  vm.y = event.clientY;
  vm.menus = menus;
  vm.visible = true;

  // 防止菜单超出屏幕
  requestAnimationFrame(() => {
    const menuEl = container?.querySelector(".vue-context-menu") as HTMLElement;
    if (menuEl) {
      const rect = menuEl.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (rect.right > viewportWidth) {
        vm.x = viewportWidth - rect.width - 5;
      }
      if (rect.bottom > viewportHeight) {
        vm.y = viewportHeight - rect.height - 5;
      }
    }
  });

  event.preventDefault();
  event.stopPropagation();
}

// 获取对应组件的菜单
function getMenusForComponent(
  componentName: string,
  options: ContextMenuOptions
): MenuItem[] {
  if (typeof options.menus === "function") {
    return options.menus(componentName);
  } else if (Array.isArray(options.menus)) {
    return options.menus;
  } else {
    return options.menus[componentName] || [];
  }
}

// 指令定义
const contextmenuDirective = {
  mounted(el: HTMLElement, binding: any) {
    const options: ContextMenuOptions = {
      menus: binding.value,
      zIndex: binding.arg ? parseInt(binding.arg) : 9999,
      ...binding.modifiers,
    };

    el.addEventListener("contextmenu", (event: MouseEvent) => {
      const componentName = getComponentName(el);
      const menus = getMenusForComponent(componentName, options);

      if (menus.length > 0) {
        showContextMenu(event, menus, options);
      }
    });
  },
};

export { contextmenuDirective };
