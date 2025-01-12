<template>
  <mt-dzr
    :id="item.id"
    v-for="(item, index) in renderCoreProps.doneJson"
    :key="item.id"
    v-model="item.binfo"
    :scale-ratio="renderCoreProps.canvasCfg.scale"
    :grid="renderCoreProps.gridCfg"
    :resize="item.resize"
    :rotate="item.rotate"
    :lock="renderCoreProps.globalLock ? true : item.lock"
    :active="renderCoreProps.preivewMode ? false : item.active"
    :useProportionalScaling="item.use_proportional_scaling"
    :show-ghost-dom="renderCoreProps.showGhostDom"
    :hide="item.hide"
    :disabled="renderCoreProps.preivewMode"
    :adsorp_diff="globalStore.adsorp_diff"
    @mousedown="onMouseDown(item, $event)"
    @update:model-value="onUpdateModelValue(item.id, $event)"
    @on-item-move="(e: any) => onItemMove(e, item.id)"
    @move-mouse-up="onMoveMouseUp()"
    @on-mouse-enter="onMouseEnter($event, item)"
    @on-mouse-leave="onMouseLeave($event, item)"
    @on-resize-move="onResizeMove($event)"
    @on-resize-done="onResizeDone(item)"
    @on-rotate-move="onRotateMove($event)"
    @on-rotate-done="onRotateDone(item)"
    @on-right-click="onRightClick($event, item)"
    :class="`${item.type == 'sys-line' ? 'pointer-events-none' : ''} ${getCommonAni(
      item
    )} cursor-pointer`"
  >
    <el-popover
      v-if="renderCoreProps.preivewMode && renderCoreProps.showPopover"
      placement="top-start"
      title="属性信息"
      :width="200"
      trigger="hover"
    >
      <template #reference>
        <render-item
          :item-json="item"
          :canvas-cfg="renderCoreProps.canvasCfg"
          :canvas-dom="renderCoreProps.canvasDom"
          :grid="renderCoreProps.gridCfg"
          :done-json="renderCoreProps.doneJson"
          :lock-state="renderCoreProps.globalLock ? true : item.lock"
          :line-append-enable="renderCoreProps.lineAppendEnable"
          @update:item-json="onUpdateItemJson(index, $event)"
          @set-intention="(val) => renderCoreEmits('setIntention', val)"
          @line-mouse-up="onLineMouseUp"
          v-on="renderCoreProps.preivewMode ? eventToVOn(item) : {}"
        ></render-item>
      </template>
      <template #default>
        <div v-for="(prop_item, prop_item_key) in item.props" :key="prop_item_key">
          <div v-if="!prop_item.disabled">{{ prop_item.title }}:{{ prop_item.val }}</div>
        </div>
      </template>
    </el-popover>
    <render-item
      v-else
      :item-json="item"
      :canvas-cfg="renderCoreProps.canvasCfg"
      :canvas-dom="renderCoreProps.canvasDom"
      :grid="renderCoreProps.gridCfg"
      :done-json="renderCoreProps.doneJson"
      :lock-state="renderCoreProps.globalLock ? true : item.lock"
      :line-append-enable="renderCoreProps.lineAppendEnable"
      @update:item-json="onUpdateItemJson(index, $event)"
      @set-intention="(val) => renderCoreEmits('setIntention', val)"
      @line-mouse-up="onLineMouseUp"
      v-on="renderCoreProps.preivewMode ? eventToVOn(item) : {}"
    ></render-item>
  </mt-dzr>
</template>
<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue';
import MtDzr from '@/components/mt-dzr/index.vue';
import RenderItem from '@/components/mt-edit/components/render-item/index.vue';
import type {
  IDoneJson,
  IDoneJsonBinfo,
  IGlobalStoreCanvasCfg,
  IGlobalStoreGridCfg
} from '@/components/mt-edit/store/types';
import type { MouseTouchEvent } from '../types';
import { globalStore } from '../../store/global';
import type { onItemMoveParams } from './types';
import { eventToVOn } from '../../utils';
import { cacheStore } from '../../store/cache';
import { getCurrentInstance } from 'vue';
import TextVue from '@/components/custom-components/text-vue/index.vue';
import CardVue from '@/components/custom-components/card-vue/index.vue';
import NowTimeVue from '@/components/custom-components/now-time-vue/index.vue';
import KvVue from '@/components/custom-components/kv-vue/index.vue';
import SysButtonVue from '@/components/custom-components/sys-button-vue/index.vue';
import { ElPopover } from 'element-plus';
const instance = getCurrentInstance();
const now_include_keys = Object.keys(instance?.appContext?.components as any);
if (!now_include_keys.includes('text-vue')) {
  instance?.appContext.app.component('text-vue', TextVue);
}
if (!now_include_keys.includes('card-vue')) {
  instance?.appContext.app.component('card-vue', CardVue);
}
if (!now_include_keys.includes('now-time-vue')) {
  instance?.appContext.app.component('now-time-vue', NowTimeVue);
}
if (!now_include_keys.includes('kv-vue')) {
  instance?.appContext.app.component('kv-vue', KvVue);
}
if (!now_include_keys.includes('sys-button-vue')) {
  instance?.appContext.app.component('sys-button-vue', SysButtonVue);
}
type RenderCoreProps = {
  doneJson: IDoneJson[];
  canvasCfg: IGlobalStoreCanvasCfg;
  gridCfg: IGlobalStoreGridCfg;
  showGhostDom: boolean;
  canvasDom: HTMLElement | null;
  globalLock: boolean;
  preivewMode?: boolean;
  lineAppendEnable?: boolean;
  showPopover?: boolean;
};
const renderCoreProps = withDefaults(defineProps<RenderCoreProps>(), {
  doneJson: () => [],
  showGhostDom: true,
  preivewMode: false,
  lineAppendEnable: false,
  showPopover: true
});
const renderCoreEmits = defineEmits([
  'update:doneJson',
  'onMouseDown',
  'onItemMove',
  'onMoveMouseUp',
  'onItemMouseEnter',
  'onItemMouseLeave',
  'setIntention',
  'onItemResizeDone',
  'onItemRotateDone',
  'onItemRightClick'
]);
// 记录多选的情况除了本次移动组件其他的组件位置信息
const other_selected_items_binfo = ref<{ id: string; left: number; top: number }[]>([]);
const onMouseDown = (item: IDoneJson, e: MouseTouchEvent) => {
  other_selected_items_binfo.value = globalStore.done_json
    .filter((m) => m.id !== item.id)
    .map((m) => {
      return {
        id: m.id,
        left: m.binfo.left,
        top: m.binfo.top
      };
    });
  e.stopPropagation();
  renderCoreEmits('onMouseDown', item, e);
};
const onUpdateModelValue = (id: string, value: IDoneJsonBinfo) => {
  renderCoreEmits('update:doneJson', [
    ...renderCoreProps.doneJson.map((m) => {
      if (m.id === id) {
        return {
          ...m,
          binfo: value
        };
      }
      return m;
    })
  ]);
};
const onItemMove = (e: any, id: string) => {
  globalStore.setRealTimeData({
    show: true,
    text: `${e.new_lt.left},${e.new_lt.top}`
  });
  //如果同时选中多个组件，除去当前正在移动这个，手动更新其它的组件
  nextTick(() => {
    // 将所有移动组件的边界信息提供给父组件
    const item_move_params: onItemMoveParams = {
      //所有移动组件的信息
      move_item_bounding_info: globalStore.selected_items_id.map((m) => {
        const { left, top, width, height, right, bottom } = document
          .getElementById(m)!
          .getBoundingClientRect();
        return {
          id: m,
          type: globalStore.done_json.find((f) => f.id === m)!.type,
          left,
          top,
          width,
          height,
          right,
          bottom
        };
      }),
      //当前正在移动的组件的实时坐标信息
      move_binfo: e.move_binfo
    };
    if (globalStore.selected_items_id.length > 1) {
      // 找到其它的组件的id
      const other_items_id = globalStore.selected_items_id.filter((m) => m !== id);
      renderCoreEmits('update:doneJson', [
        ...renderCoreProps.doneJson.map((m) => {
          if (other_items_id.includes(m.id)) {
            //找到初始值
            const init_pos = other_selected_items_binfo.value.find((f) => f.id === m.id);
            return {
              ...m,
              binfo: {
                ...m.binfo,
                left: init_pos?.left + e.move_length.x,
                top: init_pos?.top + e.move_length.y
              }
            };
          }
          return m;
        })
      ]);
    }
    renderCoreEmits('onItemMove', item_move_params);
  });
};
const onMoveMouseUp = () => {
  renderCoreEmits('onMoveMouseUp');
  globalStore.setRealTimeData({
    show: false,
    text: ``
  });
};
const getCommonAni = (item: IDoneJson) => {
  if (!item.common_animations || !item.common_animations.val) {
    return ``;
  }
  return `animate__animated animate__${item.common_animations.val} animate__${item.common_animations.speed} animate__${item.common_animations.repeat} animate__${item.common_animations.delay}`;
};
const onUpdateItemJson = (index: number, item: IDoneJson) => {
  const temp_done_json = [...renderCoreProps.doneJson];
  temp_done_json[index] = item;
  renderCoreEmits('update:doneJson', temp_done_json);
};
const onMouseEnter = (e: MouseEvent, item: IDoneJson) => {
  renderCoreEmits('onItemMouseEnter', e, item);
};
const onMouseLeave = (e: MouseEvent, item: IDoneJson) => {
  renderCoreEmits('onItemMouseLeave', e, item);
};
const onResizeMove = (val: any) => {
  globalStore.setRealTimeData({
    show: true,
    text: `${val?.width}x${val?.height}`
  });
};
const onResizeDone = (item: IDoneJson) => {
  renderCoreEmits('onItemResizeDone', item);
  globalStore.setRealTimeData({
    show: false,
    text: ''
  });
};
const onRotateMove = (val: any) => {
  globalStore.setRealTimeData({
    show: true,
    text: `${val?.angle}°`
  });
};
const onRotateDone = (item: IDoneJson) => {
  globalStore.setRealTimeData({
    show: false,
    text: ``
  });
  renderCoreEmits('onItemRotateDone', item);
};
const onRightClick = (e: MouseEvent, item: IDoneJson) => {
  renderCoreEmits('onItemRightClick', e, item);
};
const onLineMouseUp = () => {
  setTimeout(() => {
    cacheStore.addHistory(globalStore.done_json);
  }, 1000);
};
</script>
