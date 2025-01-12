<template>
  <ul ref="contextMenuRef" class="contextMenu" v-show="show">
    <li
      v-for="(item, key) in contextMenuProps.menuInfo.info"
      :key="item.title"
      @click="onItemClick(key, item, $event)"
    >
      <p :class="item.enable ? '' : 'disabled'">
        {{ item.title }}
        <span class="shortcut">{{ item.hot_key }}</span>
      </p>
    </li>
  </ul>
</template>
<script setup lang="ts">
import type { ContextMenuInfoType, IContextMenuDetail, IContextMenuInfo } from '../../store/types';

type ContextMenuProps = {
  menuInfo: IContextMenuDetail;
  show: boolean;
};
const contextMenuProps = withDefaults(defineProps<ContextMenuProps>(), {});
const emits = defineEmits(['onContextMenuClick']);
const onItemClick = (key: ContextMenuInfoType, item: IContextMenuInfo, e: MouseEvent) => {
  if (!item.enable) {
    return;
  }
  emits('onContextMenuClick', key, e);
};
</script>
<style scoped lang="less">
.contextMenu {
  position: fixed;
  z-index: 99999;
  background: #ffffff;
  padding: 5px 0;
  margin: 0px;
  display: block;
  border-radius: 5px;
  box-shadow: 2px 5px 10px rgba(0, 0, 0, 0.3);
  left: v-bind('contextMenuProps.menuInfo.left + "px"');
  top: v-bind('contextMenuProps.menuInfo.top + "px"');

  li {
    list-style: none;
    padding: 0px;
    margin: 0px;
  }

  .shortcut {
    width: 115px;
    text-align: right;
    float: right;
  }

  p {
    text-decoration: none;
    display: block;
    padding: 0px 15px 1px 20px;
    margin: 0;
    user-select: none;
    -webkit-user-select: none;
  }

  p:hover {
    background-color: #0cf;
    color: #ffffff;
    cursor: default;
  }

  .disabled {
    color: #999;
  }

  .disabled:hover {
    color: #999;
    background-color: transparent;
  }

  li.separator {
    border-top: solid 1px #e3e3e3;
    padding-top: 5px;
    margin-top: 5px;
  }
}
</style>
