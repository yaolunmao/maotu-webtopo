<!-- 期望值组件 -->
<template>
  <el-input-number v-if="selectItemEventSettingProps.formType == 'number'"></el-input-number>
  <el-color-picker v-else-if="selectItemEventSettingProps.formType == 'color'"></el-color-picker>
  <el-switch v-else-if="selectItemEventSettingProps.formType == 'switch'"></el-switch>
  <el-select v-else-if="selectItemEventSettingProps.formType == 'select'">
    <el-option
      v-for="item in select_options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    ></el-option>
  </el-select>
  <el-input v-else></el-input>
</template>
<script setup lang="ts">
import type { ILeftAsideConfigItemPublicPropsType } from '@/components/mt-edit/store/types';
import { ElInputNumber, ElInput, ElColorPicker, ElSwitch, ElSelect, ElOption } from 'element-plus';
import { computed } from 'vue';
type InputTargetValue = {
  formType: ILeftAsideConfigItemPublicPropsType | '';
  options?: {
    label: string;
    value: any;
  }[];
};
const selectItemEventSettingProps = withDefaults(defineProps<InputTargetValue>(), {});
const select_options = computed(() => {
  return selectItemEventSettingProps.options ?? [];
});
</script>
