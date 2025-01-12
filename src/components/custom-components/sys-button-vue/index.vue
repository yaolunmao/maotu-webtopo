<template>
  <div style="width: 100%; height: 100%">
    <button class="w-1/1 h-1/1" :style="getStyle(props.type, props.round)">
      <el-text>{{ props.text }}</el-text>
    </button>
  </div>
</template>
<script setup lang="ts">
import { ElText } from 'element-plus';
import type { PropType } from 'vue';
type ButtonType = '' | 'default' | 'success' | 'warning' | 'info' | 'primary' | 'danger';
const props = defineProps({
  text: {
    type: String,
    default: '按钮文本'
  },
  type: {
    type: String as PropType<ButtonType>,
    default: ''
  },
  round: {
    type: Boolean,
    default: false
  }
});
const getStyle = (type: ButtonType, round: boolean) => {
  let bg_color = '';
  let border_radius = '4px';
  if (type == 'primary') {
    bg_color = '#409eff';
  } else if (type == 'success') {
    bg_color = '#67c23a';
  } else if (type == 'warning') {
    bg_color = '#e6a23c';
  } else if (type == 'danger') {
    bg_color = '#f56c6c';
  } else if (type == 'info') {
    bg_color = '#909399';
  }
  if (round) {
    border_radius = '20px';
  }
  return {
    backgroundColor: bg_color,
    borderRadius: border_radius
  };
};
</script>
