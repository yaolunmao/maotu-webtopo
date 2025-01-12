# maotu-webtopo

基于 vue3 的 web 组态引擎库

探索将已有 svg 文件转为自由缩放图形库的解决方案，也可用作低代码大屏项目开发

## 说明

此开源版本的代码源自于 [maotu 插件版](https://www.npmjs.com/package/maotu) 0.3.1 版本，与插件版的差异请查阅插件版的 readme。

## 使用文档

请参考：[http://mt.yaolm.top](http://mt.yaolm.top)

## 声明

`maotu-webtopo` 使用了 `LGPL-3.0` 协议。这意味着：
*   您可以将 `maotu-webtopo` 作为库链接到您的商业项目，而无需开源您的整个项目。
*   如果您修改了 `maotu-webtopo` 的**核心库**代码，并分发了修改后的版本，您必须按照 LGPL-3.0 协议的要求，开源您所做的修改。
*   如果您仅仅是将`maotu-webtopo` 作为库链接到你的项目，而没有修改或分发它的源代码，那么你的项目无需开源。

   详细的 LGPL-3.0 许可证文本请查阅 [https://www.gnu.org/licenses/lgpl-3.0.html](https://www.gnu.org/licenses/lgpl-3.0.html)。

## 如何构建插件并使用

**构建库：**

1.  使用 `pnpm run lib` 命令构建 `maotu-webtopo`，生成 `dist` 文件夹。

**使用库：**

1. **推荐使用 pnpm 安装:**
    
    ```bash
    pnpm i maotu  # 前提是你已经发布到了 npm
    ```

  如果选择手动复制，请继续参考以下步骤
2.  将 `dist` 文件夹中的以下文件复制到你的项目：
    *   `dist/maotu.es.js`：库的入口文件。
    *   `dist/style.css`：库的样式文件。
    *  `dist/src`  ： 库的ts类型定义。
    * 将这些文件放到你项目中的合适位置。例如，你可以创建一个 `src/lib/maotu` 目录，并将它们复制到这里。
3.  确保你的项目可以访问到 `style.css` 文件。可以通过在入口文件或组件中引入的方式来实现。

**在项目中使用示例：**

```vue
<script setup lang="ts">
import { MtEdit } from "@/lib/maotu/maotu.es" // 替换为你的实际路径
import "@/lib/maotu/style.css"  // 替换为你的实际路径
</script>

<template>
  <div class="w-1/1 h-100vh">
    <mt-edit ref="MtEditRef" />
  </div>
</template>

<style scoped></style>
```

## 鸣谢

maotu的部分逻辑实现参考了以下大佬的文章

[幽月之格-可拖拽、缩放、旋转组件实现细节](https://juejin.cn/user/3597257779449165/posts)

[woai3c-一个低代码（可视化拖拽）教学项目](https://github.com/woai3c/visual-drag-demo)

