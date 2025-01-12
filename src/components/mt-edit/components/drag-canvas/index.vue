<template>
  <div class="hidden"></div>
</template>

<script setup lang="ts">
import type { MouseTouchEvent } from '../types';
type DragCanvasProps = {
  scaleRatio: number;
};
const dragCanvasProps = withDefaults(defineProps<DragCanvasProps>(), {
  scaleRatio: 1
});
const emits = defineEmits(['dragCanvasMouseDown', 'dragCanvasMouseMove', 'dragCanvasMouseUp']);

const onMouseDown = (de: MouseTouchEvent) => {
  let move_x = 0;
  let move_y = 0;
  // 记录最开始点击时鼠标位置
  const d_x = de instanceof MouseEvent ? de.clientX : de.touches[0].pageX;
  const d_y = de instanceof MouseEvent ? de.clientY : de.touches[0].pageY;
  emits('dragCanvasMouseDown', d_x, d_y);
  const onMouseMove = (e: MouseTouchEvent) => {
    // 记录鼠标移动的位置
    const m_x = e instanceof MouseEvent ? e.clientX : e.touches[0].pageX;
    const m_y = e instanceof MouseEvent ? e.clientY : e.touches[0].pageY;
    // 移动的距离
    move_x = (m_x - d_x) / 1;
    move_y = (m_y - d_y) / 1;
    emits('dragCanvasMouseMove', move_x, move_y);
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    document.removeEventListener('touchmove', onMouseMove);
    document.removeEventListener('touchend', onMouseUp);
    emits('dragCanvasMouseUp', move_x, move_y);
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
<style scoped></style>
