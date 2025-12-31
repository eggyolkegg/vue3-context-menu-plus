<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  useTemplateRef,
  VNode,
  watchEffect,
} from "vue";
import type { Props, MenuItem } from "../types";

const {
  zIndex = 9999,
  minWidth = 150,
  x,
  y,
  menus,
  visible,
} = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "item-click", item: MenuItem): void;
}>();

const menuRef = useTemplateRef<HTMLElement>("menuRef");
const subMenuVisible = ref<Record<string | number, boolean>>({});
const subMenuStyle = ref({ top: "0px", left: "0px" });
const parentShow = ref(false);
const childShow = ref(false);

watchEffect(() => {
  x;
  if (!visible) subMenuVisible.value = {};
  parentShow.value = false;
  childShow.value = false;
});

// 菜单样式
const menuStyle = computed(() => ({
  left: `${x}px`,
  top: `${y}px`,
  zIndex: zIndex,
  minWidth: `${minWidth}px`,
}));

// 当前显示的菜单
const currentMenus = computed(() => menus as MenuItem[]);

/**
 * 点击菜单项
 * @param item 点击菜单对象
 */
const handleClick = (item: MenuItem) => {
  if (item.disabled) return;

  if (item.handler) {
    item.handler(menuRef.value!, null);
  }

  emit("item-click", item);
  emit("update:visible", false);
  subMenuVisible.value = {};
};

/**
 * 鼠标进入显示子菜单
 * @param item 选中的子菜单
 */
const handleMouseEnter = (item: MenuItem) => {
  if (!(item.children && item.children.length > 0)) return;
  subMenuVisible.value = { [item.id]: true };

  // 计算子菜单位置
  if (!menuRef.value) return;
  const rect = menuRef.value.getBoundingClientRect();
  subMenuStyle.value = {
    top: "0px",
    left: `${rect.width}px`,
  };
};

/**
 * 点击外部关闭菜单
 * @param event
 */
const handleClickOutside = (event: MouseEvent) => {
  if (!(menuRef.value && !menuRef.value.contains(event.target as Node))) return;
  emit("update:visible", false);
  subMenuVisible.value = {};
};

/**
 * 判断是否显示陪衬样式
 * @param e icon的vnode
 */
const isShow = (e: VNode, type: string) => {
  if (type === "parent" && !parentShow.value) parentShow.value = !!e;
  if (type === "child" && !childShow.value) childShow.value = !!e;
};

onMounted(() => {
  // 监听全局点击
  document.addEventListener("click", handleClickOutside);
  document.addEventListener("contextmenu", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  document.removeEventListener("contextmenu", handleClickOutside);
});
</script>

<template>
  <transition name="context-menu-fade">
    <div
      ref="menuRef"
      v-if="visible"
      class="vue-context-menu"
      :style="menuStyle"
      @click.stop
      @contextmenu.stop.prevent
    >
      <div class="context-menu-content">
        <template v-for="item in currentMenus" :key="item.id">
          <!-- <span v-show="false">{{ ds(item.icon) }}</span> -->
          <!-- 分隔线 -->
          <div v-if="item.divider" class="context-menu-divider"></div>

          <!-- 菜单项 -->
          <div
            v-else
            :class="[
              'context-menu-item',
              {
                disabled: item.disabled,
                'has-children': item.children && item.children.length > 0,
              },
            ]"
            @click="handleClick(item)"
            @mouseenter="handleMouseEnter(item)"
          >
            <div class="menu-content">
              <!-- 图标   -->
              <span v-if="item.icon" class="menu-icon">
                {{ isShow(item.icon(), "parent") }}
                <component :is="item.icon()" />
              </span>
              <span
                v-show="parentShow && item.icon === undefined"
                class="menu-icon"
              >
              </span>

              <!-- 标签 -->
              <span class="menu-label">{{ item.label }}</span>

              <!-- 右标签 -->
              <span v-if="item.rightLabel" class="menu-label-right">
                <component :is="item.rightLabel()" />
              </span>
            </div>

            <!-- 子菜单箭头 -->
            <span v-if="item.children" class="menu-arrow">▶</span>

            <!-- 子菜单 -->
            <div
              v-if="item.children && subMenuVisible[item.id]"
              class="context-submenu"
              :style="subMenuStyle"
            >
              <div
                v-for="child in item.children"
                :key="child.id"
                class="context-menu-item"
                :class="{ disabled: child.disabled }"
                @click.stop="handleClick(child)"
              >
                <span v-if="child.icon" class="menu-icon">
                  {{ isShow(child.icon(), "child") }}
                  <component :is="child.icon()" />
                </span>
                <span
                  v-show="childShow && child.icon === undefined"
                  class="menu-icon"
                />

                <span class="menu-label">{{ item.label }}</span>

                <span v-if="item.rightLabel" class="menu-label-right">
                  <component :is="item.rightLabel()" />
                </span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.vue-context-menu {
  position: fixed;
  background: white;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 5px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 14px;
  color: #606266;
}

.context-menu-content {
  width: 100%;
}

.context-menu-item {
  padding: 8px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  position: relative;
  transition: background-color 0.2s;
}

.context-menu-item:hover:not(.disabled) {
  background-color: #f1f3f5;
  border-radius: 3px;
}

.context-menu-item.disabled {
  color: #c0c4cc;
  cursor: not-allowed;
}

.context-menu-divider {
  height: 1px;
  background-color: #ebeef5;
  margin: 5px 0;
}

.menu-icon {
  margin-right: 10px;
  font-size: 14px;
  width: 14px;
  display: inline-flex;
  justify-content: center;
}

.menu-content {
  display: flex;
  flex: 1;
  justify-content: space-between;
}

.menu-label {
  flex: 1;
  white-space: nowrap;
}

.menu-label-right {
  margin-left: 50px;
  flex: 1;
  white-space: nowrap;
}

.menu-arrow {
  margin-left: 8px;
  font-size: 12px;
  color: #909399;
}

.context-submenu {
  position: absolute;
  background: white;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  min-width: 150px;
  z-index: 10000;
}

/* 动画效果 */
.context-menu-fade-enter-active,
.context-menu-fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.context-menu-fade-enter-from,
.context-menu-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
