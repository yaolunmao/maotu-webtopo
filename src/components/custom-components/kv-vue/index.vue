<template>
  <table class="w-1/1 h-1/1 kvTable">
    <tbody>
      <tr>
        <td class="kvKey kvKeyValue" colspan="1">{{ props.label }}</td>
        <td class="kvValue kvKeyValue" colspan="1">{{ props.value }}</td>
      </tr>
    </tbody>
  </table>
</template>
<script setup lang="ts">
import { ElDescriptions, ElDescriptionsItem } from 'element-plus';
import type { PropType } from 'vue';
const props = defineProps({
  fontFamily: {
    type: String,
    default: ''
  },
  fontSize: {
    type: Number,
    default: 15
  },
  label: {
    type: String,
    default: ''
  },
  labelWidth: {
    type: Number,
    default: 50
  },
  value: {
    type: String,
    default: ''
  },
  valueWidth: {
    type: Number,
    default: 50
  },
  color: {
    type: String,
    default: ''
  },
  border: {
    type: Boolean,
    default: true
  },
  borderColor: {
    type: String,
    default: ''
  }
});
</script>
<style scroped>
.kvTable {
  border: v-bind('`${props.border?1:0}px solid ${props.borderColor}`');
}
.kvKeyValue {
  font-size: v-bind('`${props.fontSize}px`');
  font-family: v-bind('`${props.fontFamily}`');
  color: v-bind('`${props.color}`');
}
.kvKey {
  width: v-bind('`${props.labelWidth}px`');
  border-right-width: v-bind('`${props.border?1:0}px`');
  border-right-style: solid;
  border-right-color: v-bind('`${props.borderColor}`') !important;
}
.kvValue {
  width: v-bind('`${props.valueWidth}px`');
}
</style>
