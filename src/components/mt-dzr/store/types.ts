import type { IDzrPropsModelValue } from '../types';

export interface IDzrStore {
  dzr_copy_info: IDzrCopyInfo;
  setDzrCopyInfo: (value: IDzrCopyInfo) => void;
  showDzrCopy: (value: IDzrPropsModelValue, gen_id: string) => void;
  hideDzrCopy: () => void;
}
export interface IDzrCopyInfo {
  gen_id: string;
  show: boolean;
  value: IDzrPropsModelValue;
}
