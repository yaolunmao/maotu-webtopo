<template>
  <div v-for="(attr_item, key) in selectItemPropsSettingProps.propsInfo" :key="key">
    <el-form-item v-if="!attr_item.disabled" :label="attr_item.title" size="small">
      <el-select
        v-if="attr_item.type === 'select' && !attr_item.disabled"
        v-model="attr_item.val"
        placeholder="Select"
        size="small"
        :disabled="attr_item?.disabled"
      >
        <el-option
          v-for="item in attr_item.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input-number
        v-else-if="attr_item.type === 'number' && !attr_item.disabled"
        v-model="attr_item.val"
        :disabled="attr_item?.disabled"
      ></el-input-number>
      <el-input
        v-else-if="attr_item.type === 'input' && !attr_item.disabled"
        v-model="attr_item.val"
        :disabled="attr_item?.disabled"
      ></el-input>
      <el-input
        v-else-if="attr_item.type === 'textArea' && !attr_item.disabled"
        v-model="attr_item.val"
        :disabled="attr_item?.disabled"
        type="textarea"
      ></el-input>
      <el-color-picker
        v-else-if="attr_item.type === 'color' && !attr_item.disabled"
        v-model="attr_item.val"
        :disabled="attr_item?.disabled"
      ></el-color-picker>
      <el-switch
        v-else-if="attr_item.type === 'switch' && !attr_item.disabled"
        v-model="attr_item.val"
        :disabled="attr_item?.disabled"
      ></el-switch>
      <div v-else-if="attr_item.type === 'jsonEdit' && !attr_item.disabled">
        <json-edit v-model:contentObj="attr_item.val"></json-edit>
      </div>
    </el-form-item>
  </div>
</template>
<script setup lang="ts">
import type { ILeftAsideConfigItemPublicProps } from '@/components/mt-edit/store/types';
import {
  ElTabs,
  ElTabPane,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElSelect,
  ElOption,
  ElOptionGroup,
  ElSwitch,
  ElText,
  ElColorPicker,
  ElUpload,
  ElIcon,
  type UploadUserFile,
  ElButton,
  type UploadFile,
  ElMessage
} from 'element-plus';
import JsonEdit from './json-edit.vue';
type SelectItemPropsSettingProps = {
  propsInfo: ILeftAsideConfigItemPublicProps | undefined;
};
const selectItemPropsSettingProps = withDefaults(defineProps<SelectItemPropsSettingProps>(), {});
</script>
