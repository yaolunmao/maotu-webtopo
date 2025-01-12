<template>
  <div id="mt-edit" class="relative flex-auto w-1/1 h-1/1 dark">
    <el-container class="h-1/1">
      <el-header
        height="45px"
        class="dark:bg-myDarkBgColor cb-border p-0 select-none"
        @mousedown="mainPanelRef?.stopListenerKeyDown()"
      >
        <header-panel
          v-model:leftAside="aside_state.left_show"
          v-model:rightAside="aside_state.right_show"
          v-model:lock-state="globalStore.lock"
          :selected-items-id="globalStore.selected_items_id"
          :group-enabled="header_group_enabled"
          :un-group-enabled="header_un_group_enabled"
          :align-enabled="header_align_enabled"
          :delete-enabled="header_delete_enabled"
          :undo-enabled="cacheStore.historyIndex > 0"
          :redo-enabled="cacheStore.historyIndex < cacheStore.history.length - 1"
          :real-time-data="globalStore.real_time_data"
          :use-thumbnail="mtEidtProps.useThumbnail"
          @on-group-click="mainPanelRef?.createGroupItem"
          @on-ungroup-click="mainPanelRef?.onUngroup"
          @on-delete-click="onDeleteClick"
          @on-export-click="onExportClick"
          @on-tree-click="done_json_tree_visiable = true"
          @on-help-click="onHelpClick"
          @align-selected="onAlignSelected"
          @on-redo-click="onRedoClick"
          @on-undo-click="onUndoClick"
          @on-import-click="onImportClick"
          @on-return-click="emits('onReturnClick')"
          @on-save-click="onSaveClick"
          @on-preview-click="onPreviewClick"
          @on-thumbnail-click="onThumbnailClick"
          @on-draw-line-click="onDrawLineClick"
        ></header-panel>
      </el-header>
      <el-container class="h-[calc(100%-45px-40px)]">
        <el-aside
          :width="aside_state.left_show ? '200px' : '0px'"
          class="dark:bg-myDarkBgColor cr-border mt-edit-aside h-1/1 select-none"
          @mousedown="mainPanelRef?.stopListenerKeyDown()"
        >
          <left-aside :leftAsideConfig="leftAsideStore.config"></left-aside>
        </el-aside>
        <el-main
          class="dark:bg-myMainDarkBgColor"
          @mousedown="mainPanelRef?.beginListenerKeyDown()"
        >
          <main-panel
            ref="mainPanelRef"
            :group-enabled="header_group_enabled"
            :un-group-enabled="header_un_group_enabled"
            :delete-enabled="header_delete_enabled"
            :line-append-enable="line_append_enable"
          ></main-panel>
        </el-main>
        <el-aside
          :width="aside_state.right_show ? '200px' : '0px'"
          class="dark:bg-myDarkBgColor cl-border mt-edit-aside select-none"
          @mousedown="mainPanelRef?.stopListenerKeyDown()"
        >
          <right-aside>
            <template v-if="hasDeviceBindSlot" #deviceBind="{ item }">
              <slot name="deviceBind" :item="item" />
            </template>
          </right-aside>
        </el-aside>
      </el-container>
      <el-footer height="40px" class="dark:bg-myDarkBgColor ct-border select-none">
        <footer-panel></footer-panel>
      </el-footer>
    </el-container>
    <el-dialog
      v-model="import_visible"
      title="数据导入"
      @close="mainPanelRef?.beginListenerKeyDown()"
    >
      <import-json ref="importJsonRef"></import-json>
      <template #footer>
        <el-button type="primary" @click="onImportYes">确定</el-button>
      </template>
    </el-dialog>
    <el-dialog
      v-model="export_visible"
      title="数据导出"
      @close="mainPanelRef?.beginListenerKeyDown()"
    >
      <export-json
        :done-json="objectDeepClone(globalStore.done_json)"
        :canvas-cfg="globalStore.canvasCfg"
        :grid-cfg="globalStore.gridCfg"
      ></export-json>
    </el-dialog>
    <el-drawer v-model="done_json_tree_visiable" title="图形结构树" direction="ltr" size="30%">
      <done-tree
        :done-json="globalStore.done_json"
        :selected-items-id="globalStore.selected_items_id"
        @update-selected-items-id="onTreeUpdateSelectedItemsId"
        @update-selected-id-hide="onDoneTreeUpdateSelectedIdHide"
      ></done-tree>
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
import HeaderPanel from '@/components/mt-edit/components/layout/header-panel/index.vue';
import LeftAside from '@/components/mt-edit/components/layout/left-aside/index.vue';
import MainPanel from '@/components/mt-edit/components/layout/main-panel/index.vue';
import RightAside from '@/components/mt-edit/components/layout/right-aside/index.vue';
import FooterPanel from '@/components/mt-edit/components/layout/footer-panel/index.vue';
import { leftAsideStore } from '@/components/mt-edit/store/left-aside';
import {
  ElContainer,
  ElHeader,
  ElAside,
  ElMain,
  ElFooter,
  ElDialog,
  ElDrawer,
  ElButton,
  ElMessage
} from 'element-plus';
import { globalStore } from '@/components/mt-edit/store/global';
import { computed, reactive, ref, useSlots } from 'vue';
import DoneTree from '@/components/mt-edit/components/done-tree/index.vue';
import { cacheStore } from './store/cache';
import ExportJson from '@/components/mt-edit/components/export-json/index.vue';
import ImportJson from '@/components/mt-edit/components/import-json/index.vue';
import { objectDeepClone } from './utils';
import { genExportJson, useExportJsonToDoneJson } from './composables';
import type { IExportJson } from './components/types';
type MtEditProps = {
  useThumbnail?: boolean;
};
const mtEidtProps = withDefaults(defineProps<MtEditProps>(), {
  useThumbnail: false
});
const emits = defineEmits(['onPreviewClick', 'onReturnClick', 'onSaveClick', 'onThumbnailClick']);
const slots = useSlots();
const mainPanelRef = ref<InstanceType<typeof MainPanel>>();
const importJsonRef = ref<InstanceType<typeof ImportJson>>();
const aside_state = reactive({
  left_show: true,
  right_show: true
});
const hasDeviceBindSlot = computed(() => {
  return !!slots.deviceBind;
});
const header_delete_enabled = computed(() => {
  return globalStore.selected_items_id.length > 0;
});
const header_group_enabled = computed(() => {
  return globalStore.selected_items_id.length > 1;
});
const header_un_group_enabled = computed(() => {
  if (globalStore.selected_items_id.length === 1) {
    const item = globalStore.done_json.find((f) => f.id === globalStore.selected_items_id[0]);
    return item?.type === 'group';
  }
  return false;
});
const header_align_enabled = computed(() => {
  const selected_items = globalStore.done_json.filter(
    (f) => globalStore.selected_items_id.includes(f.id) && f.type !== 'sys-line'
  );
  return selected_items.length > 1;
});
const import_visible = ref(false);
const export_visible = ref(false);
const done_json_tree_visiable = ref(false);
const line_append_enable = ref(false);
const onDeleteClick = () => {
  globalStore.deleteSelectedItems();
  cacheStore.addHistory(globalStore.done_json);
};
const onImportClick = () => {
  import_visible.value = true;
  mainPanelRef.value?.stopListenerKeyDown();
};
const onExportClick = () => {
  export_visible.value = true;
  mainPanelRef.value?.stopListenerKeyDown();
};
const onTreeUpdateSelectedItemsId = (id: string) => {
  globalStore.setSingleSelect(id);
};
const onDoneTreeUpdateSelectedIdHide = (id: string) => {
  const item = globalStore.done_json.find((f) => f.id === id);
  if (item) {
    item.hide = !item.hide;
  }
};
const onAlignSelected = (
  type:
    | 'left'
    | 'horizontally'
    | 'right'
    | 'top'
    | 'vertically'
    | 'bottom'
    | 'horizontal-distribution'
    | 'vertical-distribution'
) => {
  mainPanelRef.value?.onAlignSelected(type);
};
const onHelpClick = () => {
  window.open('http://mt.yaolm.top');
};
const onRedoClick = () => {
  mainPanelRef.value?.onRedo();
};
const onUndoClick = () => {
  mainPanelRef.value?.onUndo();
};
const onImportYes = async () => {
  const res = await importJsonRef.value?.onImport();
  if (res) {
    import_visible.value = false;
    cacheStore.addHistory(globalStore.done_json);
  } else {
    ElMessage.error('导入失败,请检查数据格式');
  }
};
const onPreviewClick = () => {
  // 获取导出json
  const { exportJson } = genExportJson(
    globalStore.canvasCfg,
    globalStore.gridCfg,
    globalStore.done_json
  );
  emits('onPreviewClick', exportJson);
};
const onSaveClick = () => {
  // 获取导出json
  const { exportJson } = genExportJson(
    globalStore.canvasCfg,
    globalStore.gridCfg,
    globalStore.done_json
  );
  emits('onSaveClick', exportJson);
};
const onThumbnailClick = () => {
  emits('onThumbnailClick');
};
const onDrawLineClick = (val: boolean) => {
  line_append_enable.value = val;
};
const setImportJson = (exportJson: IExportJson) => {
  const { canvasCfg, gridCfg, importDoneJson } = useExportJsonToDoneJson(exportJson);
  globalStore.canvasCfg = canvasCfg;
  globalStore.gridCfg = gridCfg;
  globalStore.setGlobalStoreDoneJson(importDoneJson);
  cacheStore.history[0] = importDoneJson;
  return true;
};
defineExpose({
  setImportJson
});
</script>
<style scoped>
.mt-edit-aside {
  transition: width 0.3s;
}
</style>
