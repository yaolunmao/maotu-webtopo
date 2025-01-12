import { getCurrentInstance, reactive } from 'vue';
import type { ILeftAside, ILeftAsideConfigItemPublic, ILeftAsideConfigItem } from './types';
import { ElMessage } from 'element-plus';
import { svgToSymbol } from '../utils';
import { configStore } from './config';

export const leftAsideStore: ILeftAside = reactive({
  config: new Map<string, ILeftAsideConfigItem[]>([
    ['本地文件', []],
    ['系统组件', configStore.sysComponent]
  ]),
  registerConfig: (title: string, config: ILeftAsideConfigItemPublic[]) => {
    if (title == '本地文件' || title == '系统组件') {
      ElMessage.info(`title:${title}已被系统占用，请更换名称！`);
      return;
    }

    if (leftAsideStore.config.has(title)) {
      ElMessage.info(`title:${title}已存在，已经将其配置覆盖`);
    }
    const cfg: ILeftAsideConfigItem[] = config.map((m) => {
      if (m.type == 'svg') {
        const { symbol_str, width, height } = svgToSymbol(m.svg!, m.id);
        return {
          ...m,
          symbol: {
            symbol_id: m.id,
            symbol_str,
            width,
            height
          },
          common_animations: {
            val: '',
            delay: 'delay-0s',
            speed: 'slow',
            repeat: 'infinite'
          }
        };
      }
      return {
        ...m,
        common_animations: {
          val: '',
          delay: 'delay-0s',
          speed: 'slow',
          repeat: 'infinite'
        }
      };
    });
    leftAsideStore.config.set(title, cfg);
  }
});
