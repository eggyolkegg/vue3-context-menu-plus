<!--
 * @Author: eggYolkegg
 * @Date: 2025-12-11 16:07:38
 * @LastEditors: eggYolkegg
 * @LastEditTime: 2025-12-11 16:07:44
 * @Description:  
-->
<template>
  <!-- 方式1：根据不同组件显示不同菜单 -->
  <div data-component="my-component" v-contextmenu="componentMenus">
    右键点击我
  </div>

  <!-- 方式2：直接传入菜单数组 -->
  <div v-contextmenu="menuItems">右键点击我</div>

  <!-- 方式3：使用函数动态返回菜单 -->
  <div v-contextmenu="getMenus">右键点击我</div>
</template>

<script setup>
import { ref } from "vue";

// 组件菜单映射
const componentMenus = {
  "my-component": [
    { id: 1, label: "编辑", handler: () => console.log("编辑") },
    { id: 2, label: "删除", disabled: true },
  ],
  "other-component": [{ id: 3, label: "查看详情" }],
};

// 直接菜单数组
const menuItems = ref([
  { id: 1, label: "选项1" },
  { id: 2, label: "选项2", divider: true },
  {
    id: 3,
    label: "子菜单",
    children: [
      { id: 4, label: "子选项1" },
      { id: 5, label: "子选项2" },
    ],
  },
]);

// 动态函数
const getMenus = (componentName) => {
  return componentMenus[componentName] || [];
};
</script>
