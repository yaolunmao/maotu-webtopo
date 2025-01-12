<template>
  <el-form label-width="60px" label-position="left">
    <el-form-item label="动画效果" size="small">
      <common-animate v-model="item_val"></common-animate>
    </el-form-item>
    <el-form-item label="延迟" size="small">
      <el-select v-model="item_delay">
        <el-option value="delay-0s" label="无"></el-option>
        <el-option value="delay-1s" label="1秒"></el-option
        ><el-option value="delay-2s" label="2秒"></el-option
        ><el-option value="delay-3s" label="3秒"></el-option
        ><el-option value="delay-4s" label="4秒"></el-option
        ><el-option value="delay-5s" label="5秒"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="动画速度" size="small">
      <el-select v-model="item_speed">
        <el-option value="slow" label="慢"></el-option>
        <el-option value="slower" label="最慢"></el-option>
        <el-option value="fast" label="快"></el-option>
        <el-option value="faster" label="最快"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="循环次数" size="small">
      <el-select v-model="item_repeat">
        <el-option value="repeat-1" label="一次"></el-option>
        <el-option value="repeat-2" label="两次"></el-option>
        <el-option value="repeat-3" label="三次"></el-option>
        <el-option value="infinite" label="无限次"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import type { ICommonAnimations } from '@/components/mt-edit/store/types';
import CommonAnimate from './common-animate.vue';
import { computed } from 'vue';
import { ElForm, ElFormItem, ElSelect, ElOption } from 'element-plus';
type SelectItemAnimateSettingProps = {
  commonAnimates: ICommonAnimations | undefined;
};
const selectItemAnimateSettingProps = withDefaults(
  defineProps<SelectItemAnimateSettingProps>(),
  {}
);
const emits = defineEmits(['update:commonAnimates']);
const item_val = computed({
  get: () => {
    return selectItemAnimateSettingProps.commonAnimates?.val;
  },
  set: (value) => {
    emits('update:commonAnimates', {
      ...selectItemAnimateSettingProps.commonAnimates,
      val: value
    });
  }
});
const item_delay = computed({
  get: () => {
    return selectItemAnimateSettingProps.commonAnimates?.delay;
  },
  set: (value) => {
    emits('update:commonAnimates', {
      ...selectItemAnimateSettingProps.commonAnimates,
      delay: value
    });
  }
});
const item_speed = computed({
  get: () => {
    return selectItemAnimateSettingProps.commonAnimates?.speed;
  },
  set: (value) => {
    emits('update:commonAnimates', {
      ...selectItemAnimateSettingProps.commonAnimates,
      speed: value
    });
  }
});
const item_repeat = computed({
  get: () => {
    return selectItemAnimateSettingProps.commonAnimates?.repeat;
  },
  set: (value) => {
    emits('update:commonAnimates', {
      ...selectItemAnimateSettingProps.commonAnimates,
      repeat: value
    });
  }
});
</script>
