<!--
 * @Author: eggYolkegg
 * @Date: 2025-12-11 15:41:57
 * @LastEditors: eggYolkegg
 * @LastEditTime: 2025-12-11 16:11:26
 * @Description:  
-->
# Vue3 Context Menu

一个 Vue 3 右键菜单组件，可以根据不同的组件显示不同的右键菜单。

## 安装

```bash
npm install vue3-context-menu
# 或
yarn add vue3-context-menu



# 属性	    类型	        说明	            默认值
# id	    string | number	菜单项唯一标识	    必填
# label	    string	        显示文本	        必填
# icon	    string	        图标类名	        可选
# disabled	boolean	        是否禁用	        false
# divider	boolean	        是否为分隔线	    false
# children	MenuItem[]	    子菜单项	        可选
#handler	Function	    点击处理函数	    可选


# 基本用法
# <div v-contextmenu="menus"></div>

#  设置z-index 
# <div v-contextmenu:10000="menus"></div>

# 使用修饰符 
# <div v-contextmenu.auto-close="menus"></div>

# 全局使用
# import { createApp } from 'vue'
# import VueContextMenu from 'vue3-context-menu'

# const app = createApp(App)
# app.use(VueContextMenu)