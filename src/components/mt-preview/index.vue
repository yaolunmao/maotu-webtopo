<template>
  <div style="height: 100vh">
    <el-scrollbar
      ref="elScrollbarRef"
      class="w-1/1 h-1/1"
      :max-height="canvas_cfg.height"
      @scroll="onScroll"
    >
      <div
        ref="canvasAreaRef"
        :class="`canvasArea ${mtPreviewProps.canDrag ? 'cursor-grab' : ''} `"
        @mousedown="onMouseDown"
        @wheel="onMouseWheel"
      >
        <render-core
          v-model:done-json="done_json"
          :canvas-cfg="canvas_cfg"
          :grid-cfg="grid_cfg"
          :show-ghost-dom="false"
          :canvas-dom="canvasAreaRef"
          :global-lock="false"
          :preivew-mode="true"
          :show-popover="mtPreviewProps.showPopover"
        ></render-core>
      </div>
      <drag-canvas
        ref="dragCanvasRef"
        :scale-ratio="canvas_cfg.scale"
        @drag-canvas-mouse-down="dragCanvasMouseDown"
        @drag-canvas-mouse-move="dragCanvasMouseMove"
        @drag-canvas-mouse-up="dragCanvasMouseUp"
      ></drag-canvas>
    </el-scrollbar>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import RenderCore from '@/components/mt-edit/components/render-core/index.vue';
import type { IExportJson } from '../mt-edit/components/types';
import { useExportJsonToDoneJson } from '../mt-edit/composables';
import type { IDoneJson } from '../mt-edit/store/types';
import { getItemAttr, previewCompareVal, setItemAttr } from '../mt-edit/utils';
import { ElScrollbar, ElMessage, ElMessageBox } from 'element-plus';
import DragCanvas from '@/components/mt-edit/components/drag-canvas/index.vue';
type MtPreviewProps = {
  exportJson?: IExportJson;
  canZoom?: boolean;
  canDrag?: boolean;
  showPopover?: boolean;
};
const mtPreviewProps = withDefaults(defineProps<MtPreviewProps>(), {
  canDrag: true,
  canZoom: true,
  showPopover: true
});
const emits = defineEmits(['onEventCallBack']);
const canvasAreaRef = ref();
const canvas_cfg = ref({
  width: 1920,
  height: 1080,
  scale: 1,
  color: '',
  img: '',
  guide: true,
  adsorp: true,
  adsorp_diff: 3,
  transform_origin: {
    x: 0,
    y: 0
  },
  drag_offset: {
    x: 0,
    y: 0
  }
});
const grid_cfg = ref({
  enabled: true,
  align: true,
  size: 10
});
const done_json = ref<IDoneJson[]>([]);
const elScrollbarRef = ref<InstanceType<typeof ElScrollbar>>();
const dragCanvasRef = ref<InstanceType<typeof DragCanvas>>();
const scroll_info = reactive({
  begin_left: 0,
  begin_top: 0,
  left: 0,
  top: 0
});
const onScroll = ({ scrollLeft, scrollTop }: { scrollLeft: number; scrollTop: number }) => {
  scroll_info.left = scrollLeft;
  scroll_info.top = scrollTop;
};
const onMouseDown = (e: MouseEvent) => {
  if (mtPreviewProps.canDrag) {
    dragCanvasRef.value?.onMouseDown(e);
  }
};
const dragCanvasMouseDown = () => {
  scroll_info.begin_left = scroll_info.left;
  scroll_info.begin_top = scroll_info.top;
};
const dragCanvasMouseMove = (move_x: number, move_y: number) => {
  let new_left = scroll_info.begin_left - move_x;
  let new_top = scroll_info.begin_top - move_y;
  elScrollbarRef.value?.setScrollLeft(new_left);
  elScrollbarRef.value?.setScrollTop(new_top);
};
/**
 * 画布拖动结束事件
 */
const dragCanvasMouseUp = () => {};
const setItemAttrByID = (id: string, key: string, val: any) => {
  return setItemAttr(id, key, val, done_json.value);
};
const setItemAttrs = (info: { id: string; key: string; val: any }[]) => {
  info.forEach((f) => {
    setItemAttr(f.id, f.key, f.val, done_json.value);
  });
};
const getItemAttrByID = (id: string, key: string, val: any) => {
  return getItemAttr(id, key, done_json.value);
};
const onMouseWheel = (e: any) => {
  if (e.ctrlKey && mtPreviewProps.canZoom) {
    e.preventDefault();
    e.stopPropagation();
    if (e.deltaY > 0) {
      canvas_cfg.value.scale = (canvas_cfg.value.scale * 10 - 1) / 10;
    } else if (e.deltaY < 0) {
      canvas_cfg.value.scale = (canvas_cfg.value.scale * 10 + 1) / 10;
    }
  }
};
const setItemAttrByIDAsync = (id: string, key: string, val: any) => {
  // 通过改变属性的事件去设置值时 需要转换成宏任务 不然多个事件判断会有问题
  setTimeout(() => {
    setItemAttrByID(id, key, val);
  }, 0);
};
(window as any).$mtElMessage = ElMessage;
(window as any).$mtElMessageBox = ElMessageBox;
(window as any).$setItemAttrByID = (id: string, key: string, val: any) =>
  setItemAttrByIDAsync(id, key, val);
(window as any).$getItemAttrByID = getItemAttrByID;
(window as any).$previewCompareVal = previewCompareVal;
(window as any).$mtEventCallBack = (type: string, item_id: string, ...args: any[]) =>
  emits('onEventCallBack', type, item_id, ...args);
onMounted(() => {
  if (mtPreviewProps.exportJson) {
    const { canvasCfg, gridCfg, importDoneJson } = useExportJsonToDoneJson(
      mtPreviewProps.exportJson
    );
    canvas_cfg.value = canvasCfg;
    grid_cfg.value = gridCfg;
    done_json.value = importDoneJson;
  }
});
const setImportJson = (exportJson: IExportJson) => {
  const { canvasCfg, gridCfg, importDoneJson } = useExportJsonToDoneJson(exportJson);
  canvas_cfg.value = canvasCfg;
  grid_cfg.value = gridCfg;
  done_json.value = importDoneJson;
  return true;
};
defineExpose({
  setItemAttrByID,
  setImportJson,
  setItemAttrs
});
</script>
<style scoped>
.canvasArea {
  position: relative;
  transform: v-bind('`scale(${canvas_cfg.scale})`');
  transform-origin: left top;
  width: v-bind('canvas_cfg.width + "px"');
  height: v-bind('canvas_cfg.height + "px"');
  background-color: v-bind('canvas_cfg.color');
  background-image: v-bind('"url("+canvas_cfg.img+")"');
}
</style>
