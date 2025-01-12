<template>
  <div id="mt-right-aside" class="px-4">
    <select-item-setting
      v-if="globalStore.selected_items_id.length == 1"
      v-model:item-json="globalStore.done_json[find_index_item_json]"
      :done-json="globalStore.done_json"
      @add-history="onAddHistory"
    >
      <template v-if="hasDeviceBindSlot" #deviceBind="{ item }">
        <slot name="deviceBind" :item="item" /> </template
    ></select-item-setting>
    <page-setting
      v-else
      v-model:canvasCfg="globalStore.canvasCfg"
      v-model:grid-cfg="globalStore.gridCfg"
    ></page-setting>
  </div>
</template>
<script setup lang="ts">
import { computed, useSlots } from 'vue';
import PageSetting from './page-setting.vue';
import SelectItemSetting from './select-item-setting.vue';
import { globalStore } from '@/components/mt-edit/store/global';
import { cacheStore } from '@/components/mt-edit/store/cache';
const slots = useSlots();
const find_index_item_json = computed(() => {
  return globalStore.done_json.findIndex((f) => f.id == globalStore.selected_items_id[0]);
});
const onAddHistory = () => {
  cacheStore.addHistory(globalStore.done_json);
};
const hasDeviceBindSlot = computed(() => {
  return !!slots.deviceBind;
});
</script>
<style>
#mt-right-aside .el-collapse-item__header,
#mt-right-aside .el-collapse-item__wrap {
  background-color: transparent !important;
}
</style>
