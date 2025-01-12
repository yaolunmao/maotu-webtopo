import type { CacheBoundingBox, IDoneJsonBinfo } from '../../store/types';

export interface onItemMoveParams {
  move_item_bounding_info: MoveItemBoundingInfo[];
  move_binfo: IDoneJsonBinfo & { id: string };
}
export type MoveItemBoundingInfo = CacheBoundingBox;
