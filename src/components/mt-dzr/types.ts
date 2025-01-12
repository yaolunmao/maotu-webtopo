export interface IDzrProps {
  id: string;
  modelValue: IDzrPropsModelValue; //位置和大小
  scaleRatio?: number; //画布缩放倍数
  hide: boolean; //隐藏
  grid?: IDzrPropsGrid; //网格配置
  resize?: boolean; //开启缩放
  rotate?: boolean; //开启旋转
  lock?: boolean; //锁定
  active?: boolean; //激活
  useProportionalScaling?: boolean; //开启等比例缩放
  showGhostDom?: boolean; //是否显示幽灵dom
  class?: string; //
  disabled: boolean; //是否禁用
  adsorp_diff?: {
    x: number;
    y: number;
  };
}
export interface IDzrPropsModelValue {
  left: number;
  top: number;
  width: number;
  height: number;
  angle: number;
}
export interface IDzrPropsGrid {
  enabled: boolean; //开启网格
  align: boolean; //对齐到网格
  size: number; //网格大小
}
