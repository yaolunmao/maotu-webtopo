<!-- eslint-disable vue/html-indent -->
<template>
  <div class="w-1/1 h-1/1 flex justify-center items-center custom-card">
    <el-card
      class="w-95/100 h-95/100"
      :shadow="props.shadow as any"
      :style="{
        'background-color': props.backGroundColor
      }"
    ></el-card>
  </div>
</template>
<script setup lang="ts">
import { ElCard } from 'element-plus';
const props = defineProps({
  shadow: {
    type: String,
    default: ''
  },
  backGroundColor: {
    type: String,
    default: '#ffffff'
  },
  boxShadow: {
    type: String,
    default: '#ffffff'
  }
});
</script>
<style lang="less">
.custom-card {
  .el-card.is-always-shadow {
    box-shadow: v-bind('`0px 0px 12px ${$props.boxShadow}`') !important;
  }
  .el-card.is-hover-shadow:hover {
    box-shadow: v-bind('`0px 0px 12px ${$props.boxShadow}`') !important;
  }
}
</style>
