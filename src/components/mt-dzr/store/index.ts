import { reactive } from 'vue';
import type { IDzrCopyInfo, IDzrStore } from './types';
import type { IDzrPropsModelValue } from '../types';

export const dzrStore: IDzrStore = reactive({
  dzr_copy_info: {
    gen_id: '',
    show: false,
    value: {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      angle: 0
    }
  },
  setDzrCopyInfo: (value: IDzrCopyInfo) => {
    dzrStore.dzr_copy_info = value;
  },
  showDzrCopy: (value: IDzrPropsModelValue, gen_id: string) => {
    dzrStore.setDzrCopyInfo({
      ...dzrStore.dzr_copy_info,
      show: true,
      value,
      gen_id
    });
  },
  hideDzrCopy: () => {
    dzrStore.setDzrCopyInfo({
      ...dzrStore.dzr_copy_info,
      show: false
    });
  }
});
