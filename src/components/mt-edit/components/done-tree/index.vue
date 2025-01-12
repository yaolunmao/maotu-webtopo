<template>
  <el-tree
    :data="doneTreeProps.doneJson"
    :props="defaultProps"
    @node-click="handleNodeClick"
    :default-expand-all="true"
    :expand-on-click-node="false"
    :highlight-current="true"
    node-key="id"
    :current-node-key="current_node_key"
  >
    <template #default="{ node, data }">
      <div class="flex justify-between w-8/10">
        <div>{{ node.label }}</div>
        <el-button text circle size="small" class="mr-10px">
          <el-icon :title="data.hide ? '隐藏' : '显示'" :size="20" @click.stop="changeHide(data)">
            <svg-analysis :name="data.hide ? 'view-hide' : 'view-show'"></svg-analysis>
          </el-icon>
        </el-button>
      </div>
    </template>
  </el-tree>
</template>

<script lang="ts" setup>
import { ElTree, ElButton, ElIcon } from 'element-plus';
import { computed } from 'vue';
import type { IDoneJson } from '@/components/mt-edit/store/types';
import SvgAnalysis from '@/components/mt-edit/components/svg-analysis/index.vue';
type DoneTree = {
  doneJson: IDoneJson[];
  selectedItemsId: string[]; //已选中组件的id
};
const doneTreeProps = withDefaults(defineProps<DoneTree>(), {});

const emits = defineEmits(['updateSelectedItemsId', 'updateSelectedIdHide']);

const current_node_key = computed(() => {
  return doneTreeProps.selectedItemsId.length == 1 ? doneTreeProps.selectedItemsId[0] : '';
});
const handleNodeClick = (data: IDoneJson) => {
  emits('updateSelectedItemsId', data.id);
};
const changeHide = (data: IDoneJson) => {
  emits('updateSelectedIdHide', data.id);
};
const defaultProps = {
  children: 'nochildren',
  label: 'title'
};
</script>
