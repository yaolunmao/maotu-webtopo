export type ILeftAsideConfig = Map<string, ILeftAsideConfigItem[]>;
export type ILeftAsideConfigItemPublicPropsType =
  | 'input'
  | 'color'
  | 'select'
  | 'switch'
  | 'number'
  | 'jsonEdit'
  | 'textArea';
// 开放注册配置
export type ILeftAsideConfigItemPublicProps = Record<
  string,
  {
    title: string; //显示在属性面板的标题
    type: ILeftAsideConfigItemPublicPropsType; //属性的类型决定了修改属性的方式
    val: any;
    options?: any; //比如说修改属性的时候用到了下拉框，这里面就可以放下拉框的选项
    disabled?: boolean; //如果禁用了将不会显示到右侧属性面板里，但是仍然可以通过代码修改属性
  }
>;
export type ILeftAsideConfigItemPublicType = 'svg' | 'vue' | 'img' | 'custom-svg';
export type ILeftAsideConfigItemPrivateType = 'group' | 'sys-line';
export interface ILeftAsideConfigItemPublic {
  id: string; //图形的标识 值必须唯一
  title: string; //要显示的标题，一般用中文表示
  type: ILeftAsideConfigItemPublicType | ILeftAsideConfigItemPrivateType; //图形的类型
  thumbnail: string; //显示到左侧时候的缩略图
  svg?: string; //图形的svg代码
  props: ILeftAsideConfigItemPublicProps;
}
export interface ILeftAsideConfigItemPrivateSymbol {
  symbol_id: string;
  symbol_str: string;
  width: string;
  height: string;
}
export interface ICommonAnimations {
  val: string;
  delay: string;
  speed: string;
  repeat: string;
}
export interface ILeftAsideConfigItemPrivate {
  symbol?: ILeftAsideConfigItemPrivateSymbol;
  common_animations: ICommonAnimations;
}
export type ILeftAsideConfigItem = ILeftAsideConfigItemPublic & ILeftAsideConfigItemPrivate;

export type GlobalStoreIntention =
  | 'none'
  | 'create'
  | 'beginMulSelect'
  | 'adsorbStart'
  | 'adsorbEnd'
  | 'beginDragCanvas'
  | 'runDragCanvas'
  | 'endDragCanvas'
  | 'showContextMenu'
  | 'drawSysLineStart';
export interface IGlobalStoreCreateItemInfo {
  config_key: string; //也就是折叠面板的值
  item_id: string; //要创建组件的id
}

export interface IGlobalStoreCanvasCfg {
  width: number;
  height: number;
  scale: number;
  color: string;
  img: string;
  guide: boolean; //参考线
  adsorp: boolean; //吸附
  adsorp_diff: number;
  // 缩放中心
  transform_origin: {
    x: number;
    y: number;
  };
  // 拖动偏移量
  drag_offset: {
    x: number;
    y: number;
  };
}
export interface IGlobalStoreGridCfg {
  enabled: boolean;
  align: boolean;
  size: number;
}
export type DoneJsonEventListType = 'click' | 'dblclick' | 'mouseover' | 'mouseout';
export type DoneJsonEventListAction = 'changeAttr' | 'customCode';
export interface IDoneJsonActionChangeAttr {
  id: string;
  target_id: string;
  target_attr: string | undefined;
  target_value: any;
}
export interface IDoneJsonEventList {
  id: string;
  type: DoneJsonEventListType; // 事件类型
  action: DoneJsonEventListAction; // 事件行为
  change_attr: IDoneJsonActionChangeAttr[]; //属性更改
  custom_code: string;
  trigger_rule: {
    trigger_id?: string; //触发图形的id
    trigger_attr?: string; //触发图形的属性
    operator?: string; //运算符
    value?: any; //期望值
  };
}
export interface IDoneJson {
  id: string; //必须唯一
  title: string; //标题
  type: ILeftAsideConfigItemPublicType | ILeftAsideConfigItemPrivateType; //类型 由配置文件决定
  symbol?: ILeftAsideConfigItemPrivateSymbol; //类型是svg的时候需要用这个将svg转换成symbol
  binfo: IDoneJsonBinfo;
  props: ILeftAsideConfigItemPublicProps;
  resize: boolean; //开启缩放
  rotate: boolean; //开启旋转
  lock: boolean; //锁定
  active: boolean; //激活
  hide: boolean; //隐藏
  common_animations: ICommonAnimations; //通用动画
  use_proportional_scaling?: boolean; //使用等比缩放
  children?: IDoneJson[];
  tag?: string;
  thumbnail?: string;
  events: IDoneJsonEventList[];
}
//图形边界信息
export interface IDoneJsonBinfo {
  left: number;
  top: number;
  width: number;
  height: number;
  angle: number;
}
export interface CacheBoundingBox {
  id: string;
  type: ILeftAsideConfigItemPublicType | ILeftAsideConfigItemPrivateType;
  left: number;
  top: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
}
export type AdsorbPointType = 'tc' | 'bc' | 'lc' | 'rc';
export interface IContextMenuInfo {
  title: string;
  hot_key: string;
  enable: boolean;
}
export type ContextMenuInfoType =
  | 'copy'
  | 'paste'
  | 'delete'
  | 'group'
  | 'ungroup'
  | 'selectAll'
  | 'moveTop'
  | 'moveUp'
  | 'moveDown'
  | 'moveBottom';
export interface IContextMenuDetail {
  left: number;
  top: number;
  info: {
    [key in ContextMenuInfoType]: IContextMenuInfo;
  };
}
export interface IRealTimeData {
  show: boolean;
  text: string;
}
// 全局状态
export interface IGlobalStore {
  intention: GlobalStoreIntention;
  create_item_info: IGlobalStoreCreateItemInfo | null;
  done_json: IDoneJson[];
  selected_items_id: string[];
  canvasCfg: IGlobalStoreCanvasCfg;
  gridCfg: IGlobalStoreGridCfg;
  guideCfg: {
    x: {
      display: boolean;
      top: number;
    };
    y: {
      display: boolean;
      left: number;
    };
  };
  lock: boolean;
  real_time_data: IRealTimeData;
  adsorp_diff: {
    x: number;
    y: number;
  };
  setIntention: (val: GlobalStoreIntention) => void;
  setCreateItemInfo: (val: IGlobalStoreCreateItemInfo | null) => void;
  setGlobalStoreDoneJson: (val: IDoneJson[]) => void;
  cancelAllSelect: () => void;
  refreshSelectedItemsId: () => void;
  deleteSelectedItems: () => void;
  setSingleSelect: (id: string) => void;
  setSelectItems: (ids: string[]) => void;
  setRealTimeData: (val: IRealTimeData) => void;
}
// 左侧配置
export interface ILeftAside {
  config: ILeftAsideConfig;
  registerConfig: (title: string, config: ILeftAsideConfigItemPublic[]) => void;
}
// 缓存配置
export interface ICache {
  boundingBox: CacheBoundingBox[];
  setBoundingBox: (val: CacheBoundingBox[]) => void;
  adsorbPoint: { type: AdsorbPointType; x: number; y: number; id: string }[];
  setAdsorbPoint: (val: { type: AdsorbPointType; x: number; y: number; id: string }[]) => void;
  copy: IDoneJson[];
  setCopy: (val: IDoneJson[]) => void;
  history: IDoneJson[][];
  historyIndex: number;
  addHistory: (done_json: IDoneJson[]) => void;
}
// 杂项配置
export interface IConfig {
  sysComponent: ILeftAsideConfigItem[];
  lineRenderOffset: number; //因为连线是使用svg进行渲染的，所以需要一个偏移量和div的画布进行重叠
}
/**
 * 右键菜单
 */
export interface IContextMenu {
  menuInfo: IContextMenuDetail;
  setMenuInfo: (val: IContextMenuDetail) => void;
  setDisplayItem: (val: ContextMenuInfoType[]) => void;
}
