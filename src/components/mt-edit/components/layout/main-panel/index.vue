<template>
  <div class="overflow-hidden w-1/1 h-1/1" @wheel="onMouseWheel">
    <div
      id="mtCanvasArea"
      ref="canvasAreaRef"
      :class="`canvasArea  ${globalStore.intention == 'runDragCanvas' ? 'cursor-grab' : ''}`"
      @drop="onDrop"
      @dragover="onDragOver"
      @touchstart="onDrop($event, true)"
      @mousedown="onMouseDown"
      @mousemove="onCanvasMove"
      @click.right.prevent="onCanvasRightClick"
    >
      <pattern-grid
        v-if="globalStore.gridCfg.enabled"
        :grid="globalStore.gridCfg.size"
      ></pattern-grid>
      <render-core
        v-model:done-json="done_json"
        :canvas-cfg="globalStore.canvasCfg"
        :grid-cfg="globalStore.gridCfg"
        :show-ghost-dom="globalStore.selected_items_id?.length > 1 ? false : true"
        :canvas-dom="canvasAreaRef"
        :global-lock="globalStore.lock"
        :line-append-enable="mainPanelProps.lineAppendEnable"
        @on-mouse-down="onRenderCoreMouseDown"
        @on-item-move="onItemMove"
        @on-move-mouse-up="onMoveMouseUp"
        @on-item-mouse-enter="onItemMouseEnter"
        @on-item-mouse-leave="onItemMouseLeave"
        @set-intention="setIntention"
        @on-item-resize-done="onItemResizeDone"
        @on-item-rotate-done="onItemRotateDone"
        @on-item-right-click.stop="onItemRightClick"
      ></render-core>
      <selected-area
        v-show="globalStore.intention === 'beginMulSelect'"
        ref="selectedAreaRef"
        :scale-ratio="globalStore.canvasCfg.scale"
        :target-dom="canvasAreaRef"
        @selected-area-mouse-up="onSelectedAreaMouseUp"
      ></selected-area>
      <drag-canvas
        ref="dragCanvasRef"
        :scale-ratio="globalStore.canvasCfg.scale"
        @drag-canvas-mouse-down="dragCanvasMouseDown"
        @drag-canvas-mouse-move="dragCanvasMouseMove"
        @drag-canvas-mouse-up="dragCanvasMouseUp"
      ></drag-canvas>
      <draw-line-render
        v-show="globalStore.intention == 'drawSysLineStart'"
        ref="dragLineRenderRef"
        v-model:item-json="draw_line_data"
        :canvas-cfg="globalStore.canvasCfg"
        :canvas-dom="canvasAreaRef"
        :grid="globalStore.gridCfg"
        :mode="'pen'"
        @draw-line-end="onDrawLineEnd"
      ></draw-line-render>
      <div v-if="globalStore.intention == 'adsorbStart' || globalStore.intention == 'adsorbEnd'">
        <div
          v-for="item in cacheStore.adsorbPoint"
          :key="item.type"
          class="adsorb-point touch-none"
          :style="{ left: item.x + 'px', top: item.y + 'px' }"
          :data-id="item.type"
          @mouseenter="onAdsorbPointMouseEnter(item)"
          @mouseout="onAdsorbPointMouseOut()"
        ></div>
      </div>

      <div id="guide-x"></div>
      <div id="guide-y"></div>
    </div>
    <context-menu
      :menu-info="contextMenuStore.menuInfo"
      :show="globalStore.intention == 'showContextMenu'"
      @on-context-menu-click="onContextMenuClick"
    ></context-menu>
  </div>
</template>
<script setup lang="ts">
import { globalStore } from '@/components/mt-edit/store/global';
import { leftAsideStore } from '@/components/mt-edit/store/left-aside';
import { ElMessage } from 'element-plus';
import RenderCore from '@/components/mt-edit/components/render-core/index.vue';
import PatternGrid from '@/components/mt-edit/components/pattern-grid/index.vue';
import { computed, ref, reactive, onMounted, onUnmounted } from 'vue';
import {
  alignToGrid,
  getRealityXY,
  randomString,
  objectDeepClone,
  createGroupInfo,
  cancelGroup,
  calculateGuideY,
  calculateGuideX,
  rotatePoint,
  getRectCoordinate,
  getRectCenterCoordinate,
  handleAlign
} from '@/components/mt-edit/utils';
import type {
  AdsorbPointType,
  ContextMenuInfoType,
  GlobalStoreIntention,
  IDoneJson,
  ILeftAsideConfigItem
} from '@/components/mt-edit/store/types';
import SelectedArea from '@/components/mt-edit/components/selected-area/index.vue';
import type { IAreaBinfo } from '../../selected-area/types';
import { cacheStore } from '@/components/mt-edit/store/cache';
import type { onItemMoveParams } from '../../render-core/types';
import { useUpdateSysLine } from '@/components/mt-edit/composables/sys-line';
import DragCanvas from '@/components/mt-edit/components/drag-canvas/index.vue';
import ContextMenu from '@/components/mt-edit/components/context-menu/index.vue';
import { contextMenuStore } from '@/components/mt-edit/store/context-menu';
import DrawLineRender from '@/components/mt-edit/components/draw-line-render/index.vue';
import { configStore } from '@/components/mt-edit/store/config';
type MainPanelProps = {
  groupEnabled: boolean;
  unGroupEnabled: boolean;
  deleteEnabled: boolean;
  lineAppendEnable?: boolean;
};
const mainPanelProps = withDefaults(defineProps<MainPanelProps>(), {
  lineAppendEnable: false
});
const canvasAreaRef = ref();
const selectedAreaRef = ref<InstanceType<typeof SelectedArea>>();
const dragCanvasRef = ref<InstanceType<typeof DragCanvas>>();
const dragLineRenderRef = ref<InstanceType<typeof DrawLineRender>>();
// 是否需要重新计算画布缩放中心点
const is_need_recal_center = ref(true);
let is_listen_keydown = false; // 是否已经监听了键盘事件
// 画布初始偏移坐标
const init_drag_offset = reactive(globalStore.canvasCfg.drag_offset);
//如果网格关闭或者没有开启网格对齐，网格大小为1
const grid_align_size = computed(() =>
  !globalStore.gridCfg.align || !globalStore.gridCfg.enabled ? 1 : globalStore.gridCfg.size
);
const done_json = computed({
  get() {
    return globalStore.done_json;
  },
  set(val) {
    globalStore.setGlobalStoreDoneJson(val);
  }
});
const sys_line_init = configStore.sysComponent.find((f) => f.type == 'sys-line')!;
const draw_line_init_data: IDoneJson = {
  id: sys_line_init.id + '-' + randomString(),
  title: sys_line_init.title,
  type: sys_line_init.type,
  binfo: {
    left: 0,
    top: 0,
    width: 100,
    height: 0,
    angle: 0
  },
  resize: false,
  rotate: false,
  lock: false,
  active: true,
  hide: false,
  props: {
    ...sys_line_init.props,
    point_position: {
      title: '点坐标',
      type: 'jsonEdit',
      val: [
        {
          x: 0,
          y: 0
        },
        {
          x: 0,
          y: 0
        }
      ],
      disabled: true
    }
  },
  tag: sys_line_init.id,
  common_animations: sys_line_init.common_animations,
  events: []
};
const draw_line_data = ref<IDoneJson>(objectDeepClone(draw_line_init_data));
const onDrop = (e: DragEvent | TouchEvent, isTouch?: boolean) => {
  beginListenerKeyDown();
  if (globalStore.lock && globalStore.intention === 'create') {
    ElMessage.error('画布已锁定，请先解锁！');
    return;
  }
  e.preventDefault();
  if (isTouch && globalStore.intention !== 'create') {
    if (globalStore.lock) {
      globalStore.setIntention('beginDragCanvas');
      dragCanvasRef.value?.onMouseDown(e);
      return;
    }
    if (mainPanelProps.lineAppendEnable) {
      globalStore.setIntention('drawSysLineStart');
      const { realityX, realityY } = getRealityXY(e, canvasAreaRef.value?.getBoundingClientRect());
      draw_line_data.value = {
        ...objectDeepClone(draw_line_init_data),
        binfo: {
          left: alignToGrid(realityX / globalStore.canvasCfg.scale, grid_align_size.value),
          top: alignToGrid(realityY / globalStore.canvasCfg.scale, grid_align_size.value),
          width: 0,
          height: 0,
          angle: 0
        }
      };
      dragLineRenderRef.value?.onMouseDown(e, 1, { x: 0, y: 0 });
      return;
    }
    globalStore.cancelAllSelect();
    globalStore.setIntention('beginMulSelect');
    selectedAreaRef.value?.onMouseDown(e);
  }
  if (globalStore.intention !== 'create') {
    return;
  }
  if (!globalStore.create_item_info) {
    console.error('拖拽初始化失败', globalStore.create_item_info);
    return;
  }
  globalStore.setSelectItems([]);
  //找到要创建图形的信息
  const find_cfg = leftAsideStore.config
    .get(globalStore.create_item_info.config_key)
    ?.find((f) => f.id === globalStore.create_item_info!.item_id);
  if (!find_cfg) {
    console.error('拖拽配置不匹配', globalStore.create_item_info, leftAsideStore.config);
    return;
  }
  const deep_find_cfg = objectDeepClone<ILeftAsideConfigItem>(find_cfg);
  // 自由连线 直角连线都有自定义宽高以及禁止缩放和旋转
  const is_line = deep_find_cfg.type === 'sys-line';
  // 横线
  const is_vertical_line = deep_find_cfg.id === 'sys-line';
  // 竖线
  const is_horizontal_line = deep_find_cfg.id === 'sys-line-vertical';
  //根据配置创建图形
  const { realityX, realityY } = getRealityXY(e, canvasAreaRef.value?.getBoundingClientRect());
  const create_item: IDoneJson = {
    id: deep_find_cfg.id + '-' + randomString(),
    title: deep_find_cfg.title,
    type: deep_find_cfg.type,
    binfo: {
      left: alignToGrid(realityX / globalStore.canvasCfg.scale, grid_align_size.value),
      top: alignToGrid(realityY / globalStore.canvasCfg.scale, grid_align_size.value),
      width: is_vertical_line ? 100 : is_horizontal_line ? 0 : 50,
      height: is_horizontal_line ? 100 : is_vertical_line ? 0 : 50,
      angle: 0
    },
    resize: is_line ? false : true,
    rotate: is_line ? false : true,
    lock: false,
    active: true,
    hide: false,
    props: deep_find_cfg.props,
    tag: deep_find_cfg.id,
    common_animations: deep_find_cfg.common_animations,
    events: []
  };
  if (deep_find_cfg.type === 'svg') {
    create_item.symbol = deep_find_cfg.symbol;
  } else if (deep_find_cfg.type === 'img') {
    create_item.thumbnail = deep_find_cfg.thumbnail;
  }
  const done_json_temp = [...globalStore.done_json];
  done_json_temp.push(create_item);
  globalStore.setGlobalStoreDoneJson(done_json_temp);
  globalStore.setSingleSelect(create_item.id);
  globalStore.setIntention('none');
  globalStore.setCreateItemInfo(null);
  cacheStore.addHistory(done_json_temp);
};
const onDragOver = (e: DragEvent) => {
  e.preventDefault();
};
const onRenderCoreMouseDown = (item: IDoneJson, e: MouseEvent) => {
  beginListenerKeyDown();
  if (globalStore.lock) {
    return;
  }
  // 如果开启了吸附或参考线功能，在点击时候将所有组件目前的边界信息存到缓存中 不存系统连线的边界
  if (globalStore.canvasCfg.adsorp || globalStore.canvasCfg.guide) {
    const allBoundingInfo = globalStore.done_json
      // 如果不想让系统连线也能吸附就用下面的
      // .filter((f) => !f.hide && f.type !== 'sys-line')
      .filter((f) => !f.hide)
      .map((m) => {
        const { left, top, width, height, right, bottom } = document
          .getElementById(m.id)!
          .getBoundingClientRect();
        return {
          id: m.id,
          type: m.type,
          left,
          top,
          width,
          height,
          right,
          bottom
        };
      });
    cacheStore.setBoundingBox(allBoundingInfo);
  }
  if (!e.ctrlKey) {
    // 如果当前id已经是选中状态了 则不需要取消其它组件的激活状态 也不需要重复设置选中状态
    if (globalStore.selected_items_id.includes(item.id)) {
      return;
    }
    //将除了选中id的图形全部设置为非选中
    globalStore.setSingleSelect(item.id);
  } else if (e.ctrlKey && !item.lock) {
    const find_item = globalStore.done_json.find((f) => f.id == item.id)!;
    find_item.active = !find_item.active;
    globalStore.refreshSelectedItemsId();
  }
};
const onMouseDown = (e: MouseEvent) => {
  beginListenerKeyDown();
  globalStore.cancelAllSelect();
  // 锁定状态或者右键点击进行画布拖动
  if (globalStore.lock || e.button == 2) {
    globalStore.setIntention('beginDragCanvas');
    dragCanvasRef.value?.onMouseDown(e);
    return;
  }
  if (mainPanelProps.lineAppendEnable) {
    globalStore.setIntention('drawSysLineStart');
    const { realityX, realityY } = getRealityXY(e, canvasAreaRef.value?.getBoundingClientRect());
    draw_line_data.value = {
      ...objectDeepClone(draw_line_init_data),
      binfo: {
        left: alignToGrid(realityX / globalStore.canvasCfg.scale, grid_align_size.value),
        top: alignToGrid(realityY / globalStore.canvasCfg.scale, grid_align_size.value),
        width: 0,
        height: 0,
        angle: 0
      }
    };
    dragLineRenderRef.value?.onMouseDown(e, 1, { x: 0, y: 0 });
    return;
  }
  globalStore.setIntention('beginMulSelect');
  selectedAreaRef.value?.onMouseDown(e);
};
/**
 * 区域选择结束事件 之所以用getBoundingClientRect是为了处理旋转后的坐标
 * @param area_binfo 区域选择的边界信息
 */
const onSelectedAreaMouseUp = (area_binfo: IAreaBinfo) => {
  //区域选择要过滤掉锁定的组件
  const done_json_temp = [...globalStore.done_json].map((m) => {
    const bounding_info = document.getElementById(m.id)?.getBoundingClientRect();
    const canvas_area_bounding_info = canvasAreaRef.value?.getBoundingClientRect();
    let { left, top, width, height } = m.binfo;
    if (bounding_info && canvas_area_bounding_info) {
      left = (bounding_info.left - canvas_area_bounding_info.left) / globalStore.canvasCfg.scale;
      top = (bounding_info.top - canvas_area_bounding_info.top) / globalStore.canvasCfg.scale;
      width = bounding_info.width / globalStore.canvasCfg.scale;
      height = bounding_info.height / globalStore.canvasCfg.scale;
    }
    // 左右是否包含
    const contain_x = area_binfo.left < left && area_binfo.left + area_binfo.width > left + width;
    // 上下是否包含
    const contain_y = area_binfo.top < top && area_binfo.top + area_binfo.height > top + height;
    if (contain_x && contain_y && !m.lock && !m.hide) {
      m.active = true;
    }
    return m;
  });

  globalStore.setGlobalStoreDoneJson(done_json_temp);
  globalStore.refreshSelectedItemsId();
  globalStore.setIntention('none');
};
/**
 * 创建组合组件
 */
const createGroupItem = () => {
  // 根据选中的组件id，找到对应的需要组合的组件
  const selected_items = objectDeepClone<IDoneJson[]>(
    globalStore.done_json.filter((f) => globalStore.selected_items_id.includes(f.id))
  );
  // 如果选中的组件属于连线的锚点跟随组件 并且要组合的组件不包含该连线 那么取消该连线的绑定关系
  const temp_sys_lines = globalStore.done_json.filter(
    (f) =>
      f.type === 'sys-line' &&
      (globalStore.selected_items_id.includes(f.props.bind_anchors.val.start?.id) ||
        globalStore.selected_items_id.includes(f.props.bind_anchors.val.end?.id)) &&
      !globalStore.selected_items_id.includes(f.id)
  );
  temp_sys_lines.forEach((f) => {
    f.props.bind_anchors.val = {
      start: null,
      end: null
    };
  });
  const create_group_item = createGroupInfo(
    selected_items,
    canvasAreaRef.value,
    globalStore.canvasCfg.scale
  );
  const done_json_temp = [...globalStore.done_json].filter(
    (f) => !globalStore.selected_items_id.includes(f.id)
  );
  done_json_temp.push(create_group_item);
  globalStore.setGlobalStoreDoneJson(done_json_temp);
  globalStore.setSingleSelect(create_group_item.id);
  cacheStore.addHistory(globalStore.done_json);
};
const onUngroup = () => {
  // 根据选中的组件id，找到对应的需要解除组合的组件
  if (globalStore.selected_items_id.length != 1) {
    ElMessage.error('只能解除组合组件!');
    return;
  }
  const selected_item_info = globalStore.done_json.find(
    (f) => f.id === globalStore.selected_items_id[0]
  );
  if (!selected_item_info) {
    ElMessage.error('未知错误！无法找到解组信息');
    return;
  }
  if (selected_item_info.type != 'group') {
    ElMessage.error('只能解除组合组件!');
    return;
  }
  //获取拆分后的组件信息
  const split_group_items = cancelGroup(
    selected_item_info,
    canvasAreaRef.value,
    globalStore.canvasCfg.scale,
    grid_align_size.value
  );
  const done_json_temp = [...globalStore.done_json].filter(
    (f) => !globalStore.selected_items_id.includes(f.id)
  );
  globalStore.setGlobalStoreDoneJson([...done_json_temp, ...split_group_items]);
  globalStore.setSelectItems(split_group_items.map((m) => m.id));
  cacheStore.addHistory(globalStore.done_json);
};
const onItemMove = ({ move_item_bounding_info, move_binfo }: onItemMoveParams) => {
  // 拿到画布的边界信息
  const canvas_bounding_info = canvasAreaRef.value?.getBoundingClientRect();
  // 开启了参考线或者吸附 才需要计算参考线属性和吸附距离
  if (globalStore.canvasCfg.adsorp || globalStore.canvasCfg.guide) {
    // 定义需要进行对比的缓存信息
    let cache_store_bounding_box = cacheStore.boundingBox;
    // 如果移动的是多个 只需要对比缓存数据中未移动的图形边界计算吸附距离
    if (globalStore.selected_items_id.length > 1 && move_item_bounding_info.length > 1) {
      // 从缓存里面取出所有组件的边界除去本次移动图形的其它图形边界信息 缓存里本来就没有系统连线的信息 所以这里不用过滤
      cache_store_bounding_box = cacheStore.boundingBox.filter(
        (f) => !globalStore.selected_items_id.includes(f.id)
      );
    }
    // 如果不想让系统连线也能吸附就用下面的 过滤掉多选时候连线的边界
    // const move_item_bounding_info_temp = move_item_bounding_info.filter(
    //   (f) => f.type !== 'sys-line'
    // );
    const move_item_bounding_info_temp = move_item_bounding_info;
    const { y_info, move_x } = calculateGuideY(
      cache_store_bounding_box,
      globalStore.canvasCfg.adsorp_diff,
      move_item_bounding_info_temp,
      canvas_bounding_info,
      globalStore.canvasCfg.scale
    );
    const { x_info, move_y } = calculateGuideX(
      cache_store_bounding_box,
      globalStore.canvasCfg.adsorp_diff,
      move_item_bounding_info_temp,
      canvas_bounding_info,
      globalStore.canvasCfg.scale
    );
    globalStore.guideCfg.x = x_info;
    globalStore.guideCfg.y = y_info;
    // 吸附
    if (move_x != 0 && globalStore.canvasCfg.adsorp) {
      // 把当前移动的所有组件吸附到最近的点上
      // globalStore.done_json.forEach((f) => {
      //   if (globalStore.selected_items_id.includes(f.id)) {
      //     f.binfo.left += move_x;
      //   }
      // });
      globalStore.adsorp_diff.x = move_x;
    } else {
      globalStore.adsorp_diff.x = 0;
    }
    if (move_y != 0 && globalStore.canvasCfg.adsorp) {
      // 把当前移动的所有组件吸附到最近的点上
      // globalStore.done_json.forEach((f) => {
      //   if (globalStore.selected_items_id.includes(f.id)) {
      //     f.binfo.top += move_y;
      //   }
      // });
      globalStore.adsorp_diff.y = move_y;
    } else {
      globalStore.adsorp_diff.y = 0;
    }
  }
  // 如果多选的组件里有连线，并且连线的锚点绑定对应的组件不在多选里 那么清除掉连线的绑定关系
  const clear_bind_sys_line = globalStore.done_json.filter(
    (f) =>
      f.type == 'sys-line' &&
      globalStore.selected_items_id.includes(f.id) &&
      (f.props.bind_anchors.val.start || f.props.bind_anchors.val.end)
  );
  // 循环将当前连线的绑定关系清空
  clear_bind_sys_line.forEach((f) => {
    if (f.props.bind_anchors.val.start) {
      if (!globalStore.selected_items_id.includes(f.props.bind_anchors.val.start.id)) {
        f.props.bind_anchors.val.start = null;
      }
    }
    if (f.props.bind_anchors.val.end) {
      if (!globalStore.selected_items_id.includes(f.props.bind_anchors.val.end.id)) {
        f.props.bind_anchors.val.end = null;
      }
    }
  });
  //移动的时候要判断一下有没有系统连线绑定到了该组件
  const all_bind_sys_line = globalStore.done_json.filter(
    (f) =>
      f.type == 'sys-line' &&
      (globalStore.selected_items_id.includes(f.props.bind_anchors.val.start?.id) ||
        globalStore.selected_items_id.includes(f.props.bind_anchors.val.end?.id)) &&
      !globalStore.selected_items_id.includes(f.id)
  );
  useUpdateSysLine(
    all_bind_sys_line,
    globalStore.done_json,
    canvasAreaRef.value,
    globalStore.canvasCfg.scale,
    move_binfo
  );
};
/**
 * 移动完成事件
 */
const onMoveMouseUp = () => {
  //移动完毕之后隐藏参考线
  globalStore.guideCfg.x.display = false;
  globalStore.guideCfg.y.display = false;
  cacheStore.addHistory(globalStore.done_json);
};
/**
 * 缓存连线可以吸附的四个点
 * @param item
 */
const cacheAdsorbPoint = (item: IDoneJson) => {
  // 四个角原始坐标
  const { topLeft, topRight, bottomLeft, bottomRight } = getRectCoordinate(item.binfo);
  // 四条边中点坐标
  const { topCenter, bottomCenter, leftCenter, rightCenter } = getRectCenterCoordinate(
    topLeft,
    topRight,
    bottomLeft,
    bottomRight
  );
  // 旋转中心
  const centerX = topCenter.x;
  const centerY = leftCenter.y;

  // 旋转角度（弧度）
  const angleRad = (Math.PI / 180) * item.binfo.angle;

  // 计算旋转后的坐标
  const rotatedTopCenter = rotatePoint(topCenter.x, topCenter.y, centerX, centerY, angleRad);
  const rotatedBottomCenter = rotatePoint(
    bottomCenter.x,
    bottomCenter.y,
    centerX,
    centerY,
    angleRad
  );
  const rotatedLeftCenter = rotatePoint(leftCenter.x, leftCenter.y, centerX, centerY, angleRad);
  const rotatedRightCenter = rotatePoint(rightCenter.x, rightCenter.y, centerX, centerY, angleRad);
  cacheStore.setAdsorbPoint([
    {
      type: 'tc',
      x: rotatedTopCenter.x,
      y: rotatedTopCenter.y,
      id: item.id
    },
    {
      type: 'bc',
      x: rotatedBottomCenter.x,
      y: rotatedBottomCenter.y,
      id: item.id
    },
    {
      type: 'lc',
      x: rotatedLeftCenter.x,
      y: rotatedLeftCenter.y,
      id: item.id
    },
    {
      type: 'rc',
      x: rotatedRightCenter.x,
      y: rotatedRightCenter.y,
      id: item.id
    }
  ]);
};
const onItemMouseEnter = (e: any, item: IDoneJson) => {
  // 鼠标进入的时候计算可以吸附的四点坐标 去除连线
  if (item.type == 'sys-line') {
    return;
  }
  cacheAdsorbPoint(item);
};
const onItemMouseLeave = (e: any, item: IDoneJson) => {
  //如果拖动连线起点或者终点，则不清空连线锚点缓存
  if (globalStore.intention == 'adsorbStart' || globalStore.intention == 'adsorbEnd') {
    return;
  }
  cacheStore.setAdsorbPoint([]);
};
const setIntention = (val: GlobalStoreIntention) => {
  globalStore.setIntention(val);
};
const onAdsorbPointMouseEnter = (item: {
  type: AdsorbPointType;
  x: number;
  y: number;
  id: string;
}) => {
  if (globalStore.intention == 'adsorbStart' || globalStore.intention == 'adsorbEnd') {
    //将当前操作的连线绑定到该锚点上
    const handle_item = globalStore.done_json.find((f) => f.id == globalStore.selected_items_id[0]);
    if (handle_item) {
      if (globalStore.intention == 'adsorbStart') {
        handle_item.props.bind_anchors.val = {
          ...handle_item.props.bind_anchors.val,
          start: {
            type: item.type,
            id: item.id
          }
        };
        handle_item.props.point_position.val[0] = {
          x: item.x - handle_item.binfo.left,
          y: item.y - handle_item.binfo.top
        };
      } else if (globalStore.intention == 'adsorbEnd') {
        handle_item.props.bind_anchors.val = {
          ...handle_item.props.bind_anchors.val,
          end: {
            type: item.type,
            id: item.id
          }
        };
        handle_item.props.point_position.val[handle_item.props.point_position.val.length - 1] = {
          x: item.x - handle_item.binfo.left,
          y: item.y - handle_item.binfo.top
        };
      }
    }
  }
};
const onAdsorbPointMouseOut = () => {
  if (globalStore.intention == 'adsorbStart' || globalStore.intention == 'adsorbEnd') {
    //将当前操作的连线取消绑定到该锚点上
    const handle_item = globalStore.done_json.find((f) => f.id == globalStore.selected_items_id[0]);
    if (handle_item) {
      if (globalStore.intention == 'adsorbStart') {
        handle_item.props.bind_anchors.val = {
          ...handle_item.props.bind_anchors.val,
          start: null
        };
      } else if (globalStore.intention == 'adsorbEnd') {
        handle_item.props.bind_anchors.val = {
          ...handle_item.props.bind_anchors.val,
          end: null
        };
      }
    }
  }
};
const onItemResizeDone = (item: IDoneJson) => {
  // 缩放完成之后查看是否有连线绑定到了该图形 更新连线信息
  const update_lines = globalStore.done_json.filter(
    (f) =>
      f.type == 'sys-line' &&
      (f.props.bind_anchors.val.start?.id == item.id || f.props.bind_anchors.val.end?.id == item.id)
  );
  useUpdateSysLine(
    update_lines,
    globalStore.done_json,
    canvasAreaRef.value,
    globalStore.canvasCfg.scale
  );
  cacheStore.addHistory(globalStore.done_json);
};
const onItemRotateDone = (item: IDoneJson) => {
  const update_lines = globalStore.done_json.filter(
    (f) =>
      f.type == 'sys-line' &&
      (f.props.bind_anchors.val.start?.id == item.id || f.props.bind_anchors.val.end?.id == item.id)
  );
  useUpdateSysLine(
    update_lines,
    globalStore.done_json,
    canvasAreaRef.value,
    globalStore.canvasCfg.scale
  );
  cacheStore.addHistory(globalStore.done_json);
};
const onAlignSelected = (
  type:
    | 'left'
    | 'horizontally'
    | 'right'
    | 'top'
    | 'vertically'
    | 'bottom'
    | 'horizontal-distribution'
    | 'vertical-distribution'
) => {
  // 取出当前选中的所有元素
  const selected_items = globalStore.done_json.filter((f) =>
    globalStore.selected_items_id.includes(f.id)
  );
  handleAlign(
    type,
    selected_items,
    canvasAreaRef.value,
    globalStore.canvasCfg.scale,
    globalStore.done_json
  );
  cacheStore.addHistory(globalStore.done_json);
};
const dragCanvasMouseDown = () => {
  init_drag_offset.x = globalStore.canvasCfg.drag_offset.x;
  init_drag_offset.y = globalStore.canvasCfg.drag_offset.y;
};
/**
 * 画布拖动移动事件
 * @param move_x
 * @param move_y
 */
const dragCanvasMouseMove = (move_x: number, move_y: number) => {
  if (move_x === 0 && move_y === 0) {
    return;
  }
  globalStore.setIntention('runDragCanvas');
  // 设置画布偏移
  globalStore.canvasCfg.drag_offset = {
    x: init_drag_offset.x + move_x,
    y: init_drag_offset.y + move_y
  };
};
/**
 * 画布拖动结束事件
 */
const dragCanvasMouseUp = () => {
  if (globalStore.intention == 'runDragCanvas') {
    globalStore.setIntention('endDragCanvas');
  } else {
    globalStore.setIntention('none');
  }
};
/**
 * 画布点击事件
 * @param e
 */
const onCanvasRightClick = (e: MouseEvent) => {
  if (globalStore.intention == 'endDragCanvas') {
    return;
  }
  const show_item: ContextMenuInfoType[] = [];
  if (cacheStore.copy.length > 0) {
    show_item.push('paste');
  }
  if (globalStore.done_json.length > 0) {
    show_item.push('selectAll');
  }
  contextMenuStore.setDisplayItem(show_item);
  contextMenuStore.setMenuInfo({
    ...contextMenuStore.menuInfo,
    ...{
      left: e.clientX,
      top: e.clientY
    }
  });
  globalStore.setIntention('showContextMenu');
};
const onItemRightClick = (e: MouseEvent, item: IDoneJson) => {
  const show_item: ContextMenuInfoType[] = ['copy', 'delete'];
  if (mainPanelProps.groupEnabled) {
    show_item.push('group');
  }
  if (mainPanelProps.unGroupEnabled) {
    show_item.push('ungroup');
  }
  if (mainPanelProps.deleteEnabled) {
    show_item.push('delete');
  }
  const find_item_index = globalStore.done_json.findIndex((f) => f.id == item.id);
  if (find_item_index > -1 && find_item_index < globalStore.done_json.length - 1) {
    show_item.push('moveTop');
    show_item.push('moveUp');
  }
  if (find_item_index > -1 && find_item_index > 0) {
    show_item.push('moveDown');
    show_item.push('moveBottom');
  }
  contextMenuStore.setDisplayItem(show_item);
  contextMenuStore.setMenuInfo({
    ...contextMenuStore.menuInfo,
    ...{
      left: e.clientX,
      top: e.clientY
    }
  });
  globalStore.setIntention('showContextMenu');
};
/**
 * 全选
 */
const onContextMenuSelectAll = () => {
  globalStore.setSelectItems(globalStore.done_json.map((f) => f.id));
};
/**
 * 复制
 */
const onContextMenuCopy = () => {
  if (globalStore.selected_items_id.length < 1) {
    return;
  }
  cacheStore.setCopy(
    globalStore.done_json.filter((f) => globalStore.selected_items_id.includes(f.id))
  );
  ElMessage.success('复制成功');
};
const handlePasteData = (data: IDoneJson[]) => {
  data.forEach((f) => {
    f.id = f.tag + '-' + randomString();
    if (f.type == 'sys-line') {
      f.props.bind_anchors.val = {
        start: null,
        end: null
      };
    } else if (f.type == 'group' && f.children) {
      f.children = handlePasteData(f.children);
    }
  });
  return data;
};
/**
 *
 * 粘贴
 */
const onContextMenuPaste = (offset_x: number, offset_y: number) => {
  if (cacheStore.copy.length < 1) {
    return;
  }
  const new_items = handlePasteData(objectDeepClone(cacheStore.copy)).map((m) => {
    return {
      ...m,
      binfo: {
        ...m.binfo,
        left: m.binfo.left - offset_x,
        top: m.binfo.top - offset_y
      }
    };
  });
  globalStore.setGlobalStoreDoneJson([...globalStore.done_json, ...new_items]);
  globalStore.setSelectItems(new_items.map((m) => m.id));
  cacheStore.addHistory(globalStore.done_json);
};
/**
 * 删除
 */
const onContextMenuDelete = () => {
  if (globalStore.selected_items_id.length < 1) {
    return;
  }
  globalStore.deleteSelectedItems();
  cacheStore.addHistory(globalStore.done_json);
};
/**
 * 组合
 */
const onContextMenuGroup = () => {
  if (globalStore.selected_items_id.length < 2) {
    return;
  }
  createGroupItem();
};
/**
 * 取消组合
 */
const onContextMenuUnGroup = () => {
  if (globalStore.selected_items_id.length > 1) {
    return;
  }
  onUngroup();
};
const onContextMoveTop = () => {
  if (globalStore.selected_items_id.length !== 1) {
    return;
  }
  const item = globalStore.done_json.find((f) => f.id === globalStore.selected_items_id[0])!;
  globalStore.setGlobalStoreDoneJson([
    ...globalStore.done_json.filter((f) => f.id !== item.id),
    item
  ]);
  cacheStore.addHistory(globalStore.done_json);
};
const onContextMoveBottom = () => {
  if (globalStore.selected_items_id.length !== 1) {
    return;
  }
  const item = globalStore.done_json.find((f) => f.id === globalStore.selected_items_id[0])!;
  globalStore.setGlobalStoreDoneJson([
    item,
    ...globalStore.done_json.filter((f) => f.id !== item.id)
  ]);
  cacheStore.addHistory(globalStore.done_json);
};
const onContextMoveUp = () => {
  if (globalStore.selected_items_id.length !== 1) {
    return;
  }
  // 找到当前选中item的index
  const index = globalStore.done_json.findIndex((f) => f.id === globalStore.selected_items_id[0]);
  if (index >= globalStore.done_json.length - 1) {
    ElMessage.error('已经是最上层了');
    return;
  }
  const temp = globalStore.done_json[index];
  globalStore.done_json[index] = globalStore.done_json[index + 1];
  globalStore.done_json[index + 1] = temp;
  globalStore.setGlobalStoreDoneJson(globalStore.done_json);
  cacheStore.addHistory(globalStore.done_json);
};
const onContextMoveDown = () => {
  if (globalStore.selected_items_id.length !== 1) {
    return;
  }

  // 找到当前选中item的index
  const index = globalStore.done_json.findIndex((f) => f.id === globalStore.selected_items_id[0]);
  if (index <= 0) {
    ElMessage.error('已经是最下层了');
    return;
  }
  const temp = globalStore.done_json[index];
  globalStore.done_json[index] = globalStore.done_json[index - 1];
  globalStore.done_json[index - 1] = temp;
  globalStore.setGlobalStoreDoneJson(globalStore.done_json);
  cacheStore.addHistory(globalStore.done_json);
};
const onUndo = () => {
  if (cacheStore.historyIndex == 0) {
    return;
  }
  cacheStore.historyIndex -= 1;
  globalStore.setGlobalStoreDoneJson(objectDeepClone(cacheStore.history[cacheStore.historyIndex]));
  globalStore.setSelectItems([]);
};
const onRedo = () => {
  if (cacheStore.historyIndex == cacheStore.history.length - 1) {
    return;
  }
  cacheStore.historyIndex += 1;
  globalStore.setGlobalStoreDoneJson(objectDeepClone(cacheStore.history[cacheStore.historyIndex]));
  globalStore.setSelectItems([]);
};
/**
 * 右键菜单点击事件
 * @param key
 * @param e
 */
const onContextMenuClick = (key: ContextMenuInfoType, e: MouseEvent) => {
  switch (key) {
    case 'selectAll':
      onContextMenuSelectAll();
      break;
    case 'copy':
      onContextMenuCopy();
      break;
    case 'paste': {
      if (cacheStore.copy.length < 1) {
        return;
      }
      const { realityX, realityY } = getRealityXY(e, canvasAreaRef.value?.getBoundingClientRect());
      const left = alignToGrid(realityX / globalStore.canvasCfg.scale, 1);
      const top = alignToGrid(realityY / globalStore.canvasCfg.scale, 1);
      // 找到top最小的那条数据的id
      let min_top_id = '';
      let min_top = Infinity;
      cacheStore.copy.forEach((f) => {
        if (f.binfo.top < min_top) {
          min_top = f.binfo.top;
          min_top_id = f.id;
        }
      });

      const min_top_item = cacheStore.copy.find((f) => f.id === min_top_id);

      const offset_x = min_top_item!.binfo.left - left;
      const offset_y = min_top_item!.binfo.top - top;
      onContextMenuPaste(offset_x, offset_y);
      break;
    }
    case 'delete':
      onContextMenuDelete();
      break;
    case 'group':
      onContextMenuGroup();
      break;
    case 'ungroup':
      onContextMenuUnGroup();
      break;
    case 'moveTop': {
      onContextMoveTop();
      break;
    }
    case 'moveBottom': {
      onContextMoveBottom();
      break;
    }
    case 'moveUp': {
      onContextMoveUp();
      break;
    }
    case 'moveDown': {
      onContextMoveDown();
      break;
    }
    default:
      break;
  }
  globalStore.setIntention('none');
};
const onKeydown = (e: KeyboardEvent) => {
  // 全选
  if (e.ctrlKey && e.key.toLocaleLowerCase() === 'a') {
    e.preventDefault();
    onContextMenuSelectAll();
  }
  //复制
  else if (e.ctrlKey && e.key.toLocaleLowerCase() === 'c') {
    e.preventDefault();
    onContextMenuCopy();
  }
  //粘贴
  else if (e.ctrlKey && e.key.toLocaleLowerCase() === 'v') {
    e.preventDefault();
    onContextMenuPaste(10, 10);
  }
  //删除
  else if (e.key.toLocaleLowerCase() === 'delete') {
    e.preventDefault();
    onContextMenuDelete();
  }
  //组合
  else if (e.ctrlKey && e.key.toLocaleLowerCase() === 'g') {
    e.preventDefault();
    onContextMenuGroup();
  }
  //取消组合
  else if (e.ctrlKey && e.key.toLocaleLowerCase() === 'u') {
    e.preventDefault();
    onContextMenuUnGroup();
  }
  // 置顶
  else if (e.ctrlKey && e.key === 'ArrowRight') {
    e.preventDefault();
    onContextMoveTop();
  }
  // 置底
  else if (e.ctrlKey && e.key === 'ArrowLeft') {
    e.preventDefault();
    onContextMoveBottom();
  }
  // 上移一层
  else if (e.ctrlKey && e.key === 'ArrowUp') {
    e.preventDefault();
    onContextMoveUp();
  }
  // 下移一层
  else if (e.ctrlKey && e.key === 'ArrowDown') {
    e.preventDefault();
    onContextMoveDown();
  }
  // 撤销
  else if (e.ctrlKey && e.key.toLocaleLowerCase() === 'z') {
    e.preventDefault();
    onUndo();
  }
  // 重做
  else if (e.ctrlKey && e.key.toLocaleLowerCase() === 'y') {
    e.preventDefault();
    onRedo();
  }

  // 上移一个像素
  else if (e.key === 'ArrowUp') {
    e.preventDefault();
    upDateLeftAndTop(0, -1);
  }
  // 下移一个像素
  else if (e.key === 'ArrowDown') {
    e.preventDefault();
    upDateLeftAndTop(0, 1);
  }
  // 左移一个像素
  else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    upDateLeftAndTop(-1, 0);
  }
  // 右移一个像素
  else if (e.key === 'ArrowRight') {
    e.preventDefault();
    upDateLeftAndTop(1, 0);
  }
  function upDateLeftAndTop(left: number, top: number) {
    if (globalStore.selected_items_id.length < 1) {
      return;
    }
    const update_lines: IDoneJson[] = [];
    globalStore.done_json.forEach((f) => {
      if (globalStore.selected_items_id.includes(f.id)) {
        f.binfo.left += left;
        f.binfo.top += top;
        if (f.type == 'sys-line') {
          f.props.bind_anchors.val = {
            start: null,
            end: null
          };
        } else {
          update_lines.push(
            ...globalStore.done_json.filter(
              (df) =>
                df.type == 'sys-line' &&
                (df.props.bind_anchors.val.start?.id == f.id ||
                  df.props.bind_anchors.val.end?.id == f.id)
            )
          );
        }
      }
    });
    useUpdateSysLine(
      update_lines,
      globalStore.done_json,
      canvasAreaRef.value,
      globalStore.canvasCfg.scale
    );
    cacheStore.addHistory(globalStore.done_json);
  }
};
const onMouseWheel = (e: any) => {
  if (e.ctrlKey) {
    e.preventDefault();
    e.stopPropagation();
    if (e.deltaY > 0) {
      globalStore.canvasCfg.scale = (globalStore.canvasCfg.scale * 10 - 1) / 10;
    } else if (e.deltaY < 0) {
      globalStore.canvasCfg.scale = (globalStore.canvasCfg.scale * 10 + 1) / 10;
    }
    if (!is_need_recal_center.value) {
      return;
    }
    const { realityX, realityY } = getRealityXY(e, canvasAreaRef.value.getBoundingClientRect());
    const new_transform_origin_x = parseInt(realityX / globalStore.canvasCfg.scale + '');
    const new_transform_origin_y = parseInt(realityY / globalStore.canvasCfg.scale + '');
    if (
      globalStore.canvasCfg.transform_origin.x !== new_transform_origin_x &&
      globalStore.canvasCfg.transform_origin.y !== new_transform_origin_y
    ) {
      globalStore.canvasCfg.transform_origin = {
        x: new_transform_origin_x,
        y: new_transform_origin_y
      };
      is_need_recal_center.value = false;
    }
  }
};
const beginListenerKeyDown = () => {
  if (is_listen_keydown) {
    return;
  }
  // 监听键盘事件
  document.addEventListener('keydown', onKeydown);
  is_listen_keydown = true;
};
const stopListenerKeyDown = () => {
  if (!is_listen_keydown) {
    return;
  }
  document.removeEventListener('keydown', onKeydown);
  is_listen_keydown = false;
};
const onCanvasMove = () => {
  is_need_recal_center.value = true;
};
/**
 * 绘制线结束事件
 * @param line_item 绘制好的线
 */
const onDrawLineEnd = (line_item: IDoneJson) => {
  const done_json_temp = [...globalStore.done_json];
  const new_line_item = { ...line_item, id: line_item.tag + '-' + randomString() };
  done_json_temp.push(new_line_item);
  globalStore.setGlobalStoreDoneJson(done_json_temp);
  globalStore.setSingleSelect(new_line_item.id);
  globalStore.setIntention('none');
  cacheStore.addHistory(done_json_temp);
};
onMounted(() => {
  beginListenerKeyDown();
});
onUnmounted(() => {
  stopListenerKeyDown();
});
defineExpose({
  createGroupItem,
  onUngroup,
  onAlignSelected,
  onRedo,
  onUndo,
  beginListenerKeyDown,
  stopListenerKeyDown
});
</script>
<style scoped>
.canvasArea {
  position: relative;
  transform: v-bind('`scale(${globalStore.canvasCfg.scale})`');
  transform-origin: v-bind(
    '`${globalStore.canvasCfg.transform_origin.x}px ${globalStore.canvasCfg.transform_origin.y}px`'
  );
  width: v-bind('globalStore.canvasCfg.width + "px"');
  height: v-bind('globalStore.canvasCfg.height + "px"');
  background-color: v-bind('globalStore.canvasCfg.color');
  background-image: v-bind('"url("+globalStore.canvasCfg.img+")"');
  left: v-bind('globalStore.canvasCfg.drag_offset.x + "px"');
  top: v-bind('globalStore.canvasCfg.drag_offset.y + "px"');
}

#guide-x {
  display: v-bind('globalStore.guideCfg.x.display?"block":"none"');
  position: absolute;
  width: 100%;
  left: 0px;
  top: v-bind('globalStore.guideCfg.x.top+"px"');
  border-top: 1px dashed #59c7f9;
}

#guide-y {
  display: v-bind('globalStore.guideCfg.y.display?"block":"none"');
  position: absolute;
  height: 100%;
  left: v-bind('globalStore.guideCfg.y.left+"px"');
  top: 0px;
  border-left: 1px dashed #59c7f9;
}
.adsorb-point {
  position: absolute;
  background: #fff;
  border: 1px solid #59c7f9;
  width: 8px;
  height: 8px;
  margin-left: -4px;
  margin-top: -4px;
  border-radius: 50%;
  z-index: 1;
}
.adsorb-point:hover {
  background: #59c7f9;
}
</style>
