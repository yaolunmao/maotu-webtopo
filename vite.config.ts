import { fileURLToPath, URL } from 'node:url';

import { defineConfig, UserConfigExport } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import UnoCSS from 'unocss/vite';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  let config: UserConfigExport = {
    plugins: [
      vue(),
      dts({
        tsconfigPath: 'tsconfig.app.json'
      }),
      UnoCSS({
        // 在低版本浏览器上开发时会报错 Unexpected reserved word
        // 如果在开发环境需要兼容不支持顶级await的低版本浏览器例如Chrome(v87)，就将下面的配置打开
        // hmrTopLevelAwait: false
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
        // 指定symbolId格式
        symbolId: 'mt-edit-[name]',
        // 禁用压缩 否则想要修改无状态组件的stroke或者fill会影响到预设样式 例如stroke-width
        svgoOptions: false,
        customDomId: '___mt__edit__icons__dom__'
      })
    ],

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
      dedupe: ['vue']
    }
  };
  if (mode === 'lib' || mode === 'npm') {
    config = {
      ...config,
      ...{
        build: {
          lib: {
            entry: resolve(__dirname, 'src/export.ts'),
            name: 'maotu',
            fileName: (format: any) => `maotu.${format}.js`
          },
          rollupOptions: {
            // 确保外部化处理那些你不想打包进库的依赖
            external: ['vue', 'pinia'],
            output: {
              // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
              globals: {
                vue: 'Vue',
                pinia: 'Pinia'
              },
              inlineDynamicImports: true
            }
          }
        }
      }
    };
  }
  return config;
});
