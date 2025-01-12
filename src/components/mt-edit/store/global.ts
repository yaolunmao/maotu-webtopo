import { reactive } from 'vue';
import type {
  GlobalStoreIntention,
  IDoneJson,
  IGlobalStore,
  IGlobalStoreCreateItemInfo,
  IRealTimeData
} from './types';
export const globalStore: IGlobalStore = reactive({
  intention: 'none',
  create_item_info: null,
  selected_items_id: [],
  done_json: [],
  canvasCfg: {
    width: 1920,
    height: 1080,
    scale: 1,
    color: '',
    img: '',
    guide: true,
    adsorp: true,
    adsorp_diff: 5,
    transform_origin: {
      x: 0,
      y: 0
    },
    drag_offset: {
      x: 0,
      y: 0
    }
  },
  gridCfg: {
    enabled: true,
    align: true,
    size: 10
  },
  guideCfg: {
    x: {
      display: false,
      top: 0
    },
    y: {
      display: false,
      left: 0
    }
  },
  lock: false,
  real_time_data: {
    show: false,
    text: ''
  },
  adsorp_diff: {
    x: 0,
    y: 0
  },
  setIntention: (val: GlobalStoreIntention) => {
    globalStore.intention = val;
  },
  setCreateItemInfo: (val: IGlobalStoreCreateItemInfo | null) => {
    globalStore.create_item_info = val;
  },
  setGlobalStoreDoneJson: (val: IDoneJson[]) => {
    globalStore.done_json = val;
  },
  //取消所有组件选中
  cancelAllSelect: () => {
    const done_json_temp = [...globalStore.done_json].map((m) => {
      if (m.active) {
        m.active = false;
      }
      return m;
    });
    globalStore.setGlobalStoreDoneJson(done_json_temp);
    globalStore.selected_items_id = [];
  },
  //刷新选中的id
  refreshSelectedItemsId: () => {
    globalStore.selected_items_id = globalStore.done_json.filter((m) => m.active).map((m) => m.id);
  },
  //删除选中的组件
  deleteSelectedItems: () => {
    const done_json_temp = [...globalStore.done_json].filter(
      (m) => !globalStore.selected_items_id.includes(m.id)
    );
    globalStore.setGlobalStoreDoneJson(done_json_temp);
    globalStore.selected_items_id = [];
  },
  // 设置单个选中
  setSingleSelect: (id: string) => {
    globalStore.done_json.forEach((m) => {
      if (m.id === id) {
        m.active = true;
      } else {
        m.active = false;
      }
    });
    globalStore.selected_items_id = [id];
  },
  setSelectItems: (ids: string[]) => {
    globalStore.done_json.forEach((m) => {
      if (ids.includes(m.id)) {
        m.active = true;
      } else {
        m.active = false;
      }
    });
    globalStore.selected_items_id = ids;
  },
  setRealTimeData: (val: IRealTimeData) => {
    globalStore.real_time_data = val;
  }
});
