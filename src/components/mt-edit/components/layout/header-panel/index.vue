<template>
  <div class="flex justify-between" style="width: 100%">
    <div class="flex items-center justify-between w-200px">
      <div class="flex items-center">
        <el-image
          class="w-45px h-45px pl-20px"
          src="data:image/svg+xml;utf8,%3Csvg%20id%3D%22%E7%BB%84_2%22%20data-name%3D%22%E7%BB%84%202%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22700%22%20height%3D%22700%22%20viewBox%3D%220%200%20700%20700%22%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3Cstyle%3E%0A%20%20%20%20%20%20.cls-1%20%7B%0A%20%20%20%20%20%20%20%20fill%3A%20none%3B%0A%20%20%20%20%20%20%20%20stroke%3A%20%2300ccbd%3B%0A%20%20%20%20%20%20%20%20stroke-width%3A%2020px%3B%0A%20%20%20%20%20%20%20%20fill-rule%3A%20evenodd%3B%0A%20%20%20%20%20%20%7D%0A%0A%20%20%20%20%20%20.cls-2%20%7B%0A%20%20%20%20%20%20%20%20font-size%3A%20100px%3B%0A%20%20%20%20%20%20%7D%0A%0A%20%20%20%20%20%20.cls-2%2C%20.cls-3%20%7B%0A%20%20%20%20%20%20%20%20fill%3A%20%23deea2e%3B%0A%20%20%20%20%20%20%20%20font-weight%3A%20700%3B%0A%20%20%20%20%20%20%7D%0A%0A%20%20%20%20%20%20.cls-3%20%7B%0A%20%20%20%20%20%20%20%20font-size%3A%20120px%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%3C%2Fstyle%3E%0A%20%20%3C%2Fdefs%3E%0A%20%20%3Cg%20id%3D%22%E7%BB%84_1%22%20data-name%3D%22%E7%BB%84%201%22%3E%0A%20%20%20%20%3Cpath%20id%3D%22%E5%BD%A2%E7%8A%B6_1%22%20data-name%3D%22%E5%BD%A2%E7%8A%B6%201%22%20class%3D%22cls-1%22%20d%3D%22M34.518%2C406.156S47.789%2C166%2C187.922%2C211.451c0%2C0%2C55.156%2C15.864%2C91.453%2C45.448%2C0%2C0%2C67.7-42.655%2C141.6%2C0%22%2F%3E%0A%20%20%20%20%3Cpath%20id%3D%22%E5%BD%A2%E7%8A%B6_1_%E6%8B%B7%E8%B4%9D%22%20data-name%3D%22%E5%BD%A2%E7%8A%B6%201%20%E6%8B%B7%E8%B4%9D%22%20class%3D%22cls-1%22%20d%3D%22M665.493%2C406.156s-13.271-240.373-153.4-194.884c0%2C0-55.156%2C15.879-91.452%2C45.489%2C0%2C0-67.7-42.694-141.6%2C0%22%2F%3E%0A%20%20%20%20%3Cpath%20id%3D%22%E5%BD%A2%E7%8A%B6_2%22%20data-name%3D%22%E5%BD%A2%E7%8A%B6%202%22%20class%3D%22cls-1%22%20d%3D%22M117.921%2C306.109s9.026-64.564%2C74.891-32.1%22%2F%3E%0A%20%20%20%20%3Cpath%20id%3D%22%E5%BD%A2%E7%8A%B6_2_%E6%8B%B7%E8%B4%9D%22%20data-name%3D%22%E5%BD%A2%E7%8A%B6%202%20%E6%8B%B7%E8%B4%9D%22%20class%3D%22cls-1%22%20d%3D%22M581.357%2C306.589s-9-65.089-74.668-32.357%22%2F%3E%0A%20%20%20%20%3Ctext%20id%3D%22ao%22%20class%3D%22cls-2%22%20transform%3D%22translate(124.132%20368.651)%20scale(0.823)%22%3Eao%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20id%3D%22tu%22%20class%3D%22cls-2%22%20transform%3D%22translate(482.948%20368.651)%20scale(0.823)%22%3Etu%3C%2Ftext%3E%0A%20%20%3C%2Fg%3E%0A%20%20%3Ctext%20id%3D%22M_A_O_T_U%22%20data-name%3D%22M%20A%20O%20T%20U%22%20class%3D%22cls-3%22%20x%3D%2245.25%22%20y%3D%22537.03%22%3EM%20A%20O%20T%20U%3C%2Ftext%3E%0A%3C%2Fsvg%3E%0A"
        />
        <el-text
          class="pl-10px animate__animated animate__bounceIn animate__slow animate__1 animate__delay-0s"
          >Mt-Edit</el-text
        >
      </div>
      <el-button
        text
        circle
        size="small"
        @click="emits('update:leftAside', !headerPanelProps.leftAside)"
      >
        <el-icon :size="20">
          <svg-analysis v-if="headerPanelProps.leftAside" name="menu-fold"></svg-analysis>
          <svg-analysis v-else name="menu-unfold"></svg-analysis>
        </el-icon>
      </el-button>
    </div>
    <div class="flex justify-between" style="width: calc(100% - 440px)">
      <div class="flex items-center">
        <el-button-group>
          <el-button
            text
            circle
            size="small"
            :disabled="!headerPanelProps.undoEnabled"
            @click="emits('onUndoClick')"
          >
            <el-icon title="撤销 Ctrl+Z" :size="20">
              <svg-analysis name="undo"></svg-analysis>
            </el-icon>
          </el-button>
          <el-button
            text
            circle
            size="small"
            :disabled="!headerPanelProps.redoEnabled"
            @click="emits('onRedoClick')"
          >
            <el-icon title="重做 Ctrl+Y" :size="20">
              <svg-analysis name="redo"></svg-analysis>
            </el-icon>
          </el-button>
        </el-button-group>
        <el-divider direction="vertical"></el-divider>
        <el-button
          text
          circle
          size="small"
          :disabled="!headerPanelProps.deleteEnabled"
          @click="onDeleteClick"
        >
          <el-icon title="删除 delete" :class="``" :size="20">
            <svg-analysis name="delete"></svg-analysis>
          </el-icon>
        </el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button text circle size="small" @click="onTreeClick">
          <el-icon title="组件树" :size="20">
            <svg-analysis name="tree-list"></svg-analysis>
          </el-icon>
        </el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button-group>
          <el-button text circle size="small" @click="onImportClick">
            <el-icon title="导入数据模型" :size="20">
              <svg-analysis name="import-json"></svg-analysis>
            </el-icon>
          </el-button>
          <el-button text circle size="small" @click="onExportClick">
            <el-icon title="导出数据模型" :size="20">
              <svg-analysis name="export-json"></svg-analysis>
            </el-icon> </el-button
        ></el-button-group>
        <el-divider direction="vertical"></el-divider>
        <el-popover
          placement="bottom"
          :width="240"
          trigger="hover"
          :disabled="!headerPanelProps.alignEnabled"
        >
          <template #reference>
            <el-button text circle size="small" :disabled="!headerPanelProps.alignEnabled">
              <el-icon title="对齐" :size="20">
                <svg-analysis name="align"></svg-analysis>
              </el-icon>
            </el-button>
          </template>
          <div class="flex justify-center">
            <el-button-group>
              <el-button text circle size="small" @click="alignSelected('left')">
                <el-icon title="左对齐" :size="20">
                  <svg-analysis name="align-left"></svg-analysis>
                </el-icon>
              </el-button>
              <el-button text circle size="small" @click="alignSelected('horizontally')">
                <el-icon title="水平居中" :size="20">
                  <svg-analysis name="align-horizontally"></svg-analysis>
                </el-icon>
              </el-button>
              <el-button text circle size="small" @click="alignSelected('right')">
                <el-icon title="右对齐" :size="20">
                  <svg-analysis name="align-right"></svg-analysis>
                </el-icon>
              </el-button>
              <el-button text circle size="small" @click="alignSelected('top')">
                <el-icon title="上对齐" :size="20">
                  <svg-analysis name="align-top"></svg-analysis>
                </el-icon>
              </el-button>
              <el-button text circle size="small" @click="alignSelected('vertically')">
                <el-icon title="垂直居中" :size="20">
                  <svg-analysis name="align-vertical"></svg-analysis>
                </el-icon>
              </el-button>
              <el-button text circle size="small" @click="alignSelected('bottom')">
                <el-icon title="下对齐" :size="20">
                  <svg-analysis name="align-bottom"></svg-analysis>
                </el-icon>
              </el-button>
              <el-button text circle size="small" @click="alignSelected('horizontal-distribution')">
                <el-icon title="水平分布" :size="20">
                  <svg-analysis name="horizontal-distribution"></svg-analysis>
                </el-icon>
              </el-button>
              <el-button text circle size="small" @click="alignSelected('vertical-distribution')">
                <el-icon title="垂直分布" :size="20">
                  <svg-analysis name="vertical-distribution"></svg-analysis>
                </el-icon>
              </el-button>
            </el-button-group>
          </div>
        </el-popover>
        <el-divider direction="vertical"></el-divider>
        <el-button-group>
          <el-button
            text
            circle
            size="small"
            :disabled="!headerPanelProps.groupEnabled"
            @click="onGroupClick"
          >
            <el-icon title="组合" :size="20">
              <svg-analysis name="group"></svg-analysis>
            </el-icon>
          </el-button>
          <el-button
            text
            circle
            size="small"
            :disabled="!headerPanelProps.unGroupEnabled"
            @click="onUngroupClick"
          >
            <el-icon title="取消组合" :size="20">
              <svg-analysis name="ungroup"></svg-analysis>
            </el-icon>
          </el-button>
        </el-button-group>
        <el-divider direction="vertical" v-if="!is_npm_env"></el-divider>
        <el-button text circle size="small" @click="onDrawLineClick" v-if="!is_npm_env">
          <el-icon
            title="连线编辑模式"
            :size="20"
            :class="drawline_selected ? 'icon-selected' : ''"
          >
            <svg-analysis name="pen-line"></svg-analysis>
          </el-icon>
        </el-button>
      </div>
      <div class="flex justify-center items-center">
        <el-tag v-if="headerPanelProps.realTimeData.show" size="small">{{
          headerPanelProps.realTimeData.text
        }}</el-tag>
      </div>
      <div class="flex items-center mr-20px">
        <el-button text circle size="small" @click="emits('onReturnClick')">
          <el-icon title="返回" :size="20">
            <svg-analysis name="return"></svg-analysis>
          </el-icon>
        </el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button text circle size="small" @click="emits('onSaveClick')">
          <el-icon title="保存" :size="20">
            <svg-analysis name="save"></svg-analysis>
          </el-icon>
        </el-button>
        <el-divider v-if="headerPanelProps.useThumbnail" direction="vertical"></el-divider>
        <el-button
          v-if="headerPanelProps.useThumbnail"
          text
          circle
          size="small"
          @click="emits('onThumbnailClick')"
        >
          <el-icon title="生成缩略图" :size="20">
            <svg-analysis name="thumbnail"></svg-analysis>
          </el-icon>
        </el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button text circle size="small" @click="emits('onPreviewClick')">
          <el-icon title="预览" :size="20">
            <svg-analysis name="preview"></svg-analysis>
          </el-icon>
        </el-button>
      </div>
    </div>
    <div class="flex items-center justify-between w-200px">
      <el-button
        text
        circle
        size="small"
        @click="emits('update:rightAside', !headerPanelProps.rightAside)"
      >
        <el-icon :size="20" style="cursor: pointer">
          <svg-analysis v-if="headerPanelProps.rightAside" name="menu-unfold"></svg-analysis>
          <svg-analysis v-else name="menu-fold"></svg-analysis>
        </el-icon>
      </el-button>
      <div class="flex items-center">
        <el-button text circle size="small" @click="onHelpClick">
          <el-icon title="帮助" :size="20">
            <svg-analysis name="help"></svg-analysis>
          </el-icon>
        </el-button>
        <el-button text circle size="small" @click="toggle">
          <el-icon title="全屏" :size="20">
            <svg-analysis :name="isFullscreen ? 'exit-full-screen' : 'full-screen'"></svg-analysis>
          </el-icon>
        </el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button text circle size="small" @click="changeLockState">
          <el-icon :title="headerPanelProps.lockState ? '已锁定' : '已解锁'" :size="20">
            <svg-analysis :name="headerPanelProps.lockState ? 'lock' : 'unlock'"></svg-analysis>
          </el-icon>
        </el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button text circle size="small" class="mr-10px">
          <el-icon
            :title="isDark ? '切换到日间模式' : '切换到夜间模式'"
            :size="20"
            @click="toggleDark()"
          >
            <svg-analysis :name="isDark ? 'light' : 'dark'"></svg-analysis>
          </el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useDark, useToggle, useFullscreen } from '@vueuse/core';
import {
  ElIcon,
  ElDivider,
  ElPopover,
  ElButton,
  ElButtonGroup,
  ElImage,
  ElText,
  ElTag
} from 'element-plus';
import SvgAnalysis from '@/components/mt-edit/components/svg-analysis/index.vue';
import type { IRealTimeData } from '@/components/mt-edit/store/types';
import { ref } from 'vue';
type HeaderPanelProps = {
  leftAside: boolean;
  rightAside: boolean;
  selectedItemsId: string[]; //已选中组件的id
  groupEnabled: boolean;
  unGroupEnabled: boolean;
  alignEnabled: boolean;
  deleteEnabled: boolean;
  lockState: boolean;
  undoEnabled: boolean;
  redoEnabled: boolean;
  realTimeData: IRealTimeData;
  useThumbnail?: boolean;
};
const headerPanelProps = withDefaults(defineProps<HeaderPanelProps>(), {
  leftAside: true,
  rightAside: true,
  useThumbnail: false,
  selectedItemsId: () => []
});
const emits = defineEmits([
  'update:leftAside',
  'update:rightAside',
  'onGroupClick',
  'onUngroupClick',
  'onDeleteClick',
  'onExportClick',
  'onTreeClick',
  'alignSelected',
  'update:lockState',
  'onHelpClick',
  'onRedoClick',
  'onUndoClick',
  'onImportClick',
  'onPreviewClick',
  'onReturnClick',
  'onSaveClick',
  'onDrawLineClick',
  'onThumbnailClick'
]);
const isDark = useDark({
  selector: '#mt-edit'
});
const { isFullscreen, toggle } = useFullscreen();
const toggleDark = useToggle(isDark);
const drawline_selected = ref(false);
const is_npm_env = ref(import.meta.env.MODE === 'npm');
const onGroupClick = () => {
  emits('onGroupClick');
};
const onUngroupClick = () => {
  emits('onUngroupClick');
};
const onDeleteClick = () => {
  emits('onDeleteClick');
};
const onExportClick = () => {
  emits('onExportClick');
};
const onTreeClick = () => {
  emits('onTreeClick');
};
const alignSelected = (
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
  emits('alignSelected', type);
};
const changeLockState = () => {
  emits('update:lockState', !headerPanelProps.lockState);
};
const onHelpClick = () => {
  emits('onHelpClick');
};
const onImportClick = () => {
  emits('onImportClick');
};
const onDrawLineClick = () => {
  drawline_selected.value = !drawline_selected.value;
  emits('onDrawLineClick', drawline_selected.value);
};
</script>
<style scoped>
.icon-selected {
  background-color: #ecf5ff;
  color: #409eff;
}
</style>
