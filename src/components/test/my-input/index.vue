<template>
  <div style="width: 100%; height: 100%">
    <el-input v-model="val" style="width: 100%; height: 100%"></el-input>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { ElInput } from 'element-plus';
const props = defineProps(['modelValue']);
const emits = defineEmits(['update:modelValue']);
const val = computed({
  get: () => props.modelValue,
  set: (value) => {
    emits('update:modelValue', value);
  }
});
</script>
<style scoped></style>
