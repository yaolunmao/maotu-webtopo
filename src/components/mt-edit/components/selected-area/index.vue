<template>
  <div class="mt-selected-area"></div>
</template>

<script setup lang="ts">
import { ref, unref } from 'vue';
import { getRealityXY } from '@/components/mt-edit/utils';
import type { MouseTouchEvent } from '../types';
import type { IAreaBinfo } from './types';
type SelectedAreaProps = {
  scaleRatio: number;
  targetDom: HTMLElement | null;
};
const selectedAreaProps = withDefaults(defineProps<SelectedAreaProps>(), {
  scaleRatio: 1,
  targetDom: null
});
const emits = defineEmits(['selectedAreaMouseUp']);
const area_binfo = ref<IAreaBinfo>({
  width: 0,
  height: 0,
  top: 0,
  left: 0
});

const onMouseDown = (de: MouseTouchEvent) => {
  // 鼠标按下的位置
  const { realityX, realityY } = getRealityXY(
    de,
    selectedAreaProps.targetDom?.getBoundingClientRect()
  );
  // 记录最开始点击时鼠标位置
  const d_x = de instanceof MouseEvent ? de.clientX : de.touches[0].pageX;
  const d_y = de instanceof MouseEvent ? de.clientY : de.touches[0].pageY;
  const onMouseMove = (e: MouseTouchEvent) => {
    // 记录鼠标移动的位置
    const m_x = e instanceof MouseEvent ? e.clientX : e.touches[0].pageX;
    const m_y = e instanceof MouseEvent ? e.clientY : e.touches[0].pageY;
    // 移动的距离
    const move_x = (m_x - d_x) / selectedAreaProps.scaleRatio;
    const move_y = (m_y - d_y) / selectedAreaProps.scaleRatio;
    let left = realityX / selectedAreaProps.scaleRatio,
      top = realityY / selectedAreaProps.scaleRatio;
    let width = Math.abs(move_x),
      height = Math.abs(move_y);
    if (move_x < 0) {
      left = realityX / selectedAreaProps.scaleRatio - width;
    }
    if (move_y < 0) {
      top = realityY / selectedAreaProps.scaleRatio - height;
    }
    area_binfo.value = {
      width,
      height,
      left,
      top
    };
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    document.removeEventListener('touchmove', onMouseMove);
    document.removeEventListener('touchend', onMouseUp);
    emits('selectedAreaMouseUp', unref(area_binfo));
    area_binfo.value = {
      width: 0,
      height: 0,
      top: 0,
      left: 0
    };
  };
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
  document.addEventListener('touchmove', onMouseMove);
  document.addEventListener('touchend', onMouseUp);
};

defineExpose({
  onMouseDown
});
</script>
<style scoped>
.mt-selected-area {
  width: v-bind('area_binfo.width + "px"');
  height: v-bind('area_binfo.height + "px"');
  top: v-bind('area_binfo.top + "px"');
  left: v-bind('area_binfo.left + "px"');
  border: 1px solid #00699a;
  background-color: #59c7f9;
  opacity: 0.3;
  position: absolute;
}
</style>
