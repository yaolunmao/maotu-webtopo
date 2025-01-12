<template>
  <div
    class="absolute select-none opacity-30"
    v-if="
      dzrStore.dzr_copy_info.show &&
      dzrStore.dzr_copy_info.gen_id == gen_id &&
      MtDzrProps.showGhostDom
    "
    style="outline: 1px solid #06b7ff"
    :style="getStyle(dzrStore.dzr_copy_info.value)"
  >
    <render-item>
      <slot></slot>
    </render-item>
  </div>
  <div
    v-if="!MtDzrProps.hide"
    :id="MtDzrProps.id"
    ref="dzrRef"
    :class="`${MtDzrProps.class} absolute select-none touch-none ${
      MtDzrProps.lock ? 'opacity-50' : ''
    } ${
      MtDzrProps.active && MtDzrProps.modelValue.width != 0 && MtDzrProps.modelValue.height != 0
        ? 'dzr-active'
        : ''
    }`"
    @mousedown="onMouseDown"
    @touchstart.passive="onMouseDown"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @click.right.prevent="onRightClick"
    :style="getStyle(drag_data_info)"
  >
    <render-item>
      <slot></slot>
    </render-item>
    <div v-if="MtDzrProps.resize && !MtDzrProps.lock && MtDzrProps.active && !MtDzrProps.disabled">
      <resize-handle
        v-model:item-info="mt_dzr_vmodel"
        :target-dom="dzrRef"
        :scale-ratio="MtDzrProps.scaleRatio"
        :grid-align-size="grid_align_size"
        :gen-id="gen_id"
        :use-proportional-scaling="MtDzrProps.useProportionalScaling"
        @on-resize-done="onResizeDone"
        @on-resize-move="(val) => onResizeMove(val)"
      ></resize-handle>
    </div>
    <rotate-handle
      v-if="MtDzrProps.rotate && !MtDzrProps.lock && MtDzrProps.active && !MtDzrProps.disabled"
      v-model:item-info="mt_dzr_vmodel"
      :target-dom="dzrRef"
      :gen-id="gen_id"
      @on-rotate-done="onRotateDone"
      @on-rotate-move="(val) => onRotateMove(val)"
    ></rotate-handle>
  </div>
</template>
<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { type IDzrProps, type IDzrPropsModelValue } from './types';
import { alignToGrid, autoDestroyMouseMove, getXY, randomString } from './utils/index';
import ResizeHandle from './components/resize-handle.vue';
import RotateHandle from './components/rotate-handle.vue';
import renderItem from './components/render-item.vue';
import { dzrStore } from './store/index';
import type { MouseTouchEvent } from './utils/types';
const MtDzrProps = withDefaults(defineProps<IDzrProps>(), {
  id: randomString(16),
  modelValue: () => {
    return {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      angle: 0
    };
  },
  scaleRatio: 1,
  grid: () => {
    return {
      enabled: false,
      align: false,
      size: 10
    };
  },
  resize: true,
  rotate: true,
  lock: false,
  active: false,
  useProportionalScaling: false,
  showGhostDom: true,
  hide: false,
  disabled: false,
  adsorp_diff: () => {
    return {
      x: 0,
      y: 0
    };
  }
});
const MtDzrEmits = defineEmits([
  'update:modelValue',
  'mousedown',
  'onItemMove',
  'moveMouseUp',
  'onMouseEnter',
  'onMouseLeave',
  'onResizeMove',
  'onResizeDone',
  'onRotateDone',
  'onRightClick',
  'onRotateMove'
]);
const dzrRef = ref();
//
const gen_id = randomString(16);

//记录原始位置
const dzr_copy_info_value = ref({ ...MtDzrProps.modelValue });
// 拖拽数据
const drag_data_info = ref({
  ...MtDzrProps.modelValue
});
const getStyle = (data: IDzrPropsModelValue) => {
  const { width, height, left, top, angle } = data;
  return {
    width: width + 'px',
    height: height + 'px',
    left: left + 'px',
    top: top + 'px',
    transform: `rotate(${angle}deg)`
  };
};

//如果网格关闭或者没有开启网格对齐，网格大小为1
const grid_align_size = computed(() =>
  !MtDzrProps.grid.align || !MtDzrProps.grid.enabled ? 1 : MtDzrProps.grid.size
);
const mt_dzr_vmodel = computed({
  get: () => drag_data_info.value,
  set: (value) => {
    drag_data_info.value = value;
    MtDzrEmits('update:modelValue', value);
  }
});
const onMouseDown = (de: MouseTouchEvent) => {
  MtDzrEmits('mousedown', de);
  if (MtDzrProps.lock || MtDzrProps.disabled) {
    return;
  }
  //记录最开始点击时鼠标位置和组件的位置
  const { clientX: de_client_x, clientY: de_client_y } = getXY(de);
  dzr_copy_info_value.value = { ...MtDzrProps.modelValue };
  drag_data_info.value = {
    ...MtDzrProps.modelValue
  };
  dzrStore.hideDzrCopy();
  const { left: init_x, top: init_y } = MtDzrProps.modelValue;
  //计算xy轴最小坐标和最大坐标，不要超出父元素
  const { clientWidth, clientHeight } = dzrRef.value.parentElement;
  const min_left = 0;
  const min_top = 0;
  const max_left = clientWidth - MtDzrProps.modelValue.width;
  const max_top = clientHeight - MtDzrProps.modelValue.height;
  let set_new_left = init_x;
  let set_new_top = init_y;
  const onMouseMove = (me: MouseTouchEvent) => {
    dzrStore.showDzrCopy({ ...dzr_copy_info_value.value }, gen_id);
    const { clientX: me_client_x, clientY: me_client_y } = getXY(me);
    const move_x = (me_client_x - de_client_x) / MtDzrProps.scaleRatio;
    const move_y = (me_client_y - de_client_y) / MtDzrProps.scaleRatio;

    const new_left = alignToGrid(init_x + move_x, grid_align_size.value);
    const new_top = alignToGrid(init_y + move_y, grid_align_size.value);
    set_new_left = new_left < min_left ? min_left : new_left > max_left ? max_left : new_left;
    set_new_top = new_top < min_top ? min_top : new_top > max_top ? max_top : new_top;
    drag_data_info.value = {
      ...drag_data_info.value,
      left: set_new_left,
      top: set_new_top
    };
    MtDzrEmits('onItemMove', {
      move_length: {
        x: new_left - init_x,
        y: new_top - init_y
      },
      new_lt: {
        left: set_new_left,
        top: set_new_top
      },
      // 因为是鼠标松开的时候才更新组件数据，所以这里需要把组件的实时binfo返回回去
      move_binfo: {
        id: MtDzrProps.id,
        left: set_new_left,
        top: set_new_top,
        width: drag_data_info.value.width,
        height: drag_data_info.value.height,
        angle: drag_data_info.value.angle
      }
    });
    nextTick(() => {
      const adsorp_diff_x = MtDzrProps.adsorp_diff?.x ?? 0;
      const adsorp_diff_y = MtDzrProps.adsorp_diff?.y ?? 0;
      // 当视图渲染之后 根据需要吸附的距离更新数据
      if (adsorp_diff_x == 0 && adsorp_diff_y == 0) {
        return;
      }
      set_new_left += adsorp_diff_x;
      set_new_top += adsorp_diff_y;
      drag_data_info.value = {
        ...drag_data_info.value,
        left: set_new_left,
        top: set_new_top
      };
      MtDzrEmits('onItemMove', {
        new_lt: {
          left: set_new_left,
          top: set_new_top
        },
        // 因为是鼠标松开的时候才更新组件数据，所以这里需要把组件的实时binfo返回回去
        move_binfo: {
          id: MtDzrProps.id,
          left: set_new_left,
          top: set_new_top,
          width: drag_data_info.value.width,
          height: drag_data_info.value.height,
          angle: drag_data_info.value.angle
        }
      });
    });
  };
  autoDestroyMouseMove(onMouseMove, () => {
    nextTick(() => {
      dzrStore.hideDzrCopy();
      MtDzrEmits('moveMouseUp');
      MtDzrEmits('update:modelValue', {
        ...MtDzrProps.modelValue,
        left: set_new_left,
        top: set_new_top
      });
    });
  });
};
const onMouseEnter = (e: MouseEvent) => {
  MtDzrEmits('onMouseEnter', e);
};
const onMouseLeave = (e: MouseEvent) => {
  MtDzrEmits('onMouseLeave', e);
};
const onResizeMove = (val: any) => {
  MtDzrEmits('onResizeMove', val);
};
const onResizeDone = () => {
  MtDzrEmits('onResizeDone');
};
const onRotateDone = () => {
  MtDzrEmits('onRotateDone');
};
const onRotateMove = (val: any) => {
  MtDzrEmits('onRotateMove', val);
};
const onRightClick = (e: MouseEvent) => {
  MtDzrEmits('onRightClick', e);
};
watch(
  () => MtDzrProps.modelValue,
  (value) => {
    drag_data_info.value = value;
  },
  {
    deep: true
  }
);
</script>
<style scoped>
.dzr {
  position: absolute;
  user-select: none;
}
.dzr-active {
  outline: 1px solid #06b7ff;
}
</style>
