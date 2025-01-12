import { reactive } from 'vue';
import type { ContextMenuInfoType, IContextMenu } from './types';

export const contextMenuStore: IContextMenu = reactive({
  menuInfo: {
    display: false,
    left: 0,
    top: 0,
    info: {
      selectAll: {
        title: '全选',
        hot_key: 'Ctrl + A',
        enable: false
      },
      copy: {
        title: '复制',
        hot_key: 'Ctrl + C',
        enable: false
      },
      paste: {
        title: '粘贴',
        hot_key: 'Ctrl + V',
        enable: false
      },
      delete: {
        title: '删除',
        hot_key: 'Delete',
        enable: false
      },
      group: {
        title: '组合',
        hot_key: 'Ctrl + G',
        enable: false
      },
      ungroup: {
        title: '取消组合',
        hot_key: 'Ctrl + U',
        enable: false
      },
      moveTop: {
        title: '置顶',
        hot_key: 'Ctrl + Right',
        enable: false
      },
      moveUp: {
        title: '上移',
        hot_key: 'Ctrl + Up',
        enable: false
      },
      moveDown: {
        title: '下移',
        hot_key: 'Ctrl + Down',
        enable: false
      },
      moveBottom: {
        title: '置底',
        hot_key: 'Ctrl + Left',
        enable: false
      }
    }
  },
  setMenuInfo: (val: IContextMenu['menuInfo']) => {
    contextMenuStore.menuInfo = val;
  },
  setDisplayItem: (val: ContextMenuInfoType[]) => {
    for (const key in contextMenuStore.menuInfo.info) {
      contextMenuStore.menuInfo.info[key as ContextMenuInfoType].enable = false;
    }
    val.forEach((f) => {
      contextMenuStore.menuInfo.info[f].enable = true;
    });
  }
});
