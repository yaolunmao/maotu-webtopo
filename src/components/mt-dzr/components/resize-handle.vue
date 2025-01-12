<template>
  <div>
    <div
      v-for="(item, key) in points"
      :key="key"
      :id="`resize_${key}`"
      :style="item"
      class="mt-dzr-resize mt-dzr-resize-point touch-none"
      @mousedown="(e) => onMouseDown(e, key)"
      @touchstart.passive="(e) => onMouseDown(e, key)"
    ></div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import type { IDzrPropsModelValue } from '../types';
import { dzrStore } from '../store';
import {
  autoDestroyMouseMove,
  calcGrid,
  centerToTL,
  degToRadian,
  formatData,
  getLength,
  getNewStyle,
  getXY
} from '../utils';
import type { MouseTouchEvent } from '../utils/types';
type ResizeProps = {
  itemInfo: IDzrPropsModelValue;
  targetDom: HTMLElement | null;
  scaleRatio: number;
  gridAlignSize: number;
  genId: string;
  useProportionalScaling?: boolean;
};
const resizeProps = withDefaults(defineProps<ResizeProps>(), {
  scaleRatio: 1,
  gridAlignSize: 1,
  useProportionalScaling: false
});
const points = computed(() => {
  return {
    tl: {
      left: '0px',
      top: '0px',
      cursor: getCursor(0)
    },
    tc: {
      left: resizeProps.itemInfo.width / 2 + 'px',
      top: '0px',
      cursor: getCursor(45)
    },
    tr: {
      left: resizeProps.itemInfo.width + 'px',
      top: '0px',
      cursor: getCursor(90)
    },
    l: {
      left: '0px',
      top: resizeProps.itemInfo.height / 2 + 'px',
      cursor: getCursor(315)
    },
    r: {
      left: resizeProps.itemInfo.width + 'px',
      top: resizeProps.itemInfo.height / 2 + 'px',
      cursor: getCursor(135)
    },
    bl: {
      left: '0px',
      top: resizeProps.itemInfo.height + 'px',
      cursor: getCursor(270)
    },
    bc: {
      left: resizeProps.itemInfo.width / 2 + 'px',
      top: resizeProps.itemInfo.height + 'px',
      cursor: getCursor(225)
    },
    br: {
      left: resizeProps.itemInfo.width + 'px',
      top: resizeProps.itemInfo.height + 'px',
      cursor: getCursor(180)
    }
  };
});
const angle_to_cursor = [
  { start: 338, end: 23, cursor: 'nw' },
  { start: 23, end: 68, cursor: 'n' },
  { start: 68, end: 113, cursor: 'ne' },
  { start: 293, end: 338, cursor: 'w' },
  { start: 113, end: 158, cursor: 'e' },
  { start: 248, end: 293, cursor: 'sw' },
  { start: 203, end: 248, cursor: 's' },
  { start: 158, end: 203, cursor: 'se' }
];
/**
 * 获取旋转之后的光标样式
 * @param init_angle 初始角度 360/8=45
 */
const getCursor = (init_angle: number) => {
  const now_init_angle = (init_angle + resizeProps.itemInfo.angle) % 360;
  const find_cursor = angle_to_cursor.find(
    (f) => f.start <= now_init_angle && f.end > now_init_angle
  );
  if (!find_cursor) {
    return 'nw-resize';
  }
  return find_cursor.cursor + '-resize';
};
const emits = defineEmits(['update:itemInfo', 'onResizeDone', 'onResizeMove']);
//记录原始位置
const dzr_copy_info_value = ref({ ...resizeProps.itemInfo });
const onMouseDown = (
  de: MouseTouchEvent,
  type: 'tl' | 'tc' | 'tr' | 'l' | 'r' | 'bl' | 'bc' | 'br'
) => {
  de.stopPropagation();
  dzr_copy_info_value.value = { ...resizeProps.itemInfo };
  const { clientX: de_client_x, clientY: de_client_y } = getXY(de);
  //计算组件中心点
  const { width, height, left, top } = resizeProps.itemInfo;
  const centerX = left + width / 2;
  const centerY = top + height / 2;
  //记录原始信息和中心点
  const rect = {
    width,
    height,
    centerX,
    centerY,
    rotateAngle: resizeProps.itemInfo.angle
  };
  const onMouseMove = (me: MouseTouchEvent) => {
    me.preventDefault();
    dzrStore.showDzrCopy({ ...dzr_copy_info_value.value }, resizeProps.genId);
    const { clientX: me_client_x, clientY: me_client_y } = getXY(me);
    // 距离 网格对齐
    const delta_x = (me_client_x - de_client_x) / resizeProps.scaleRatio;
    const delta_y = (me_client_y - de_client_y) / resizeProps.scaleRatio;
    const alpha = Math.atan2(delta_y, delta_x);
    const delta_l = getLength(delta_x, delta_y);
    const beta = alpha - degToRadian(rect.rotateAngle);
    const deltaW = delta_l * Math.cos(beta);
    const deltaH = delta_l * Math.sin(beta);
    // 如果按shift键则等比缩放
    const ratio =
      resizeProps.useProportionalScaling || me.shiftKey ? rect.width / rect.height : undefined;
    const {
      position: { centerX, centerY },
      size: { width, height }
    } = getNewStyle(type, { ...rect, rotateAngle: rect.rotateAngle }, deltaW, deltaH, ratio, 1, 1);
    const pData = centerToTL({
      centerX,
      centerY,
      width,
      height,
      angle: resizeProps.itemInfo.angle
    });
    const format_data = formatData(pData, centerX, centerY);
    const new_width = calcGrid(format_data.width, resizeProps.gridAlignSize);
    const new_height = calcGrid(format_data.height, resizeProps.gridAlignSize);
    emits('update:itemInfo', {
      ...resizeProps.itemInfo,
      ...format_data,
      left: calcGrid(format_data.left, resizeProps.gridAlignSize),
      top: calcGrid(format_data.top, resizeProps.gridAlignSize),
      width: new_width,
      height: new_height
    });
    emits('onResizeMove', {
      width: new_width,
      height: new_height
    });
  };
  autoDestroyMouseMove(onMouseMove, () => {
    dzrStore.hideDzrCopy();
    emits('onResizeDone');
  });
};
</script>
<style scoped lang="less">
.mt-dzr-resize {
  position: absolute;
}

.mt-dzr-resize-point {
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
</style>
