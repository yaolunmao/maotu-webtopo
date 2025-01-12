<template>
  <div class="mt-dzr-rotate touch-none" @mousedown="onMouseDown" @touchstart.passive="onMouseDown">
    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M929 849a30 30 0 0 1-30-30v-83.137a447.514 447.514 0 0 1-70.921 92.209C722.935 933.225 578.442 975.008 442 953.482a444.917 444.917 0 0 1-241.139-120.591 30 30 0 1 1 37.258-47.01l0.231-0.231A385.175 385.175 0 0 0 442 892.625v-0.006c120.855 22.123 250.206-13.519 343.656-106.975a386.646 386.646 0 0 0 70.6-96.653h-87.247a30 30 0 0 1 0-60H929a30 30 0 0 1 30 30V819a30 30 0 0 1-30 30zM512 392a120 120 0 1 1-120 120 120 120 0 0 1 120-120z m293.005-147.025a29.87 29.87 0 0 1-19.117-6.882l-0.232 0.231A386.5 386.5 0 0 0 689.478 168h-0.011c-145.646-75.182-329.021-51.747-451.117 70.35a386.615 386.615 0 0 0-70.6 96.65H255a30 30 0 0 1 0 60H95a30 30 0 0 1-30-30V205a30 30 0 0 1 60 0v83.129a447.534 447.534 0 0 1 70.923-92.206C317.981 73.866 493.048 37.2 647 85.836v-0.045a444.883 444.883 0 0 1 176.143 105.291 30 30 0 0 1-18.138 53.893z"
        fill="#06B7FF"
      ></path>
    </svg>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { dzrStore } from '../store';
import type { IDzrPropsModelValue } from '../types';
import { alignToGrid, autoDestroyMouseMove, getXY } from '../utils';
import type { MouseTouchEvent } from '../utils/types';
type RotateProps = {
  itemInfo: IDzrPropsModelValue;
  targetDom: HTMLElement | null;
  genId: string;
};
const rotateProps = withDefaults(defineProps<RotateProps>(), {});
const emits = defineEmits(['update:itemInfo', 'onRotateDone', 'onRotateMove']);
//记录原始位置
const dzr_copy_info_value = ref({ ...rotateProps.itemInfo });
const is_mouse_down = ref(false);
const onMouseDown = (de: MouseTouchEvent) => {
  de.stopPropagation();
  if (!rotateProps.targetDom) {
    console.error('target_dom is null');
    return;
  }
  const target_dom_rect = rotateProps.targetDom.getBoundingClientRect();
  if (!target_dom_rect) {
    console.error('boundingClientRect is null');
    return;
  }
  const { clientX: de_client_x, clientY: de_client_y } = getXY(de);
  dzr_copy_info_value.value = { ...rotateProps.itemInfo };
  dzrStore.hideDzrCopy();
  //记录旋转前的初始值
  const init_angle = rotateProps.itemInfo.angle;
  //计算组件中心点位置
  const center_x = target_dom_rect.left + target_dom_rect.width / 2;
  const center_y = target_dom_rect.top + target_dom_rect.height / 2;
  is_mouse_down.value = true;
  const onMouseMove = (me: MouseTouchEvent) => {
    if (!is_mouse_down.value) {
      return;
    }
    const { clientX: me_client_x, clientY: me_client_y } = getXY(me);
    dzrStore.showDzrCopy({ ...dzr_copy_info_value.value }, rotateProps.genId);
    // 旋转前的角度
    const rotate_before =
      Math.atan2(de_client_y - center_y, de_client_x - center_x) / (Math.PI / 180);
    // 旋转后的角度
    const rotate_after =
      Math.atan2(me_client_y - center_y, me_client_x - center_x) / (Math.PI / 180);
    const new_angle = alignToGrid(init_angle + rotate_after - rotate_before);
    emits('update:itemInfo', {
      ...rotateProps.itemInfo,
      left: alignToGrid(rotateProps.itemInfo.left),
      top: alignToGrid(rotateProps.itemInfo.top),
      angle: new_angle
    });
    emits('onRotateMove', {
      angle: new_angle
    });
  };
  autoDestroyMouseMove(onMouseMove, () => {
    dzrStore.hideDzrCopy();
    is_mouse_down.value = false;
    emits('onRotateDone');
  });
};
</script>
<style scoped lang="less">
.mt-dzr-rotate {
  position: absolute;
  cursor: grab;
  left: 50%;
  top: 0;
  transform: translate(-50%, -160%);
  width: 16px;
  height: 16px;
  font-size: 20px;
}
</style>
