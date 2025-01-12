<template>
  <div id="mt-left-aside" class="pt-10px h-1/1 box-border p-x-10px">
    <el-input
      v-model="search_str"
      class="pb-10px pr-10px"
      placeholder="请输入关键字进行搜索"
    ></el-input>
    <div class="h-85/100">
      <el-scrollbar class="pr-10px" :view-style="{ height: '100%' }">
        <el-collapse v-model="active_names">
          <el-collapse-item
            v-for="config_item_key in checked_keys"
            :key="config_item_key"
            :title="config_item_key"
            :name="config_item_key"
          >
            <div class="flex flex-wrap">
              <div
                draggable="true"
                @dragstart="onDragStart(config_item_key, item.id)"
                @touchstart.passive="onDragStart(config_item_key, item.id)"
                class="w-40px h-40px"
                v-for="(item, index) in getFilteritems(
                  leftAsideProps.leftAsideConfig.get(config_item_key)
                )"
                :key="item.id"
              >
                <el-tooltip
                  v-model:visible="is_show_tooltip[`${config_item_key}${item.id}`]"
                  placement="right"
                  :width="200"
                  :effect="isDark ? 'dark' : 'light'"
                  :show-arrow="false"
                  :hide-after="0"
                  trigger="hover"
                  :enterable="false"
                  :offset="getOffset(index + 1)"
                >
                  <el-image
                    draggable="false"
                    class="w-30px h-30px select-none"
                    :class="isDark ? 'bg-amber-50' : ''"
                    :src="item.thumbnail"
                  />
                  <template #content>
                    <div class="flex justify-center items-center">
                      <div class="flex flex-col">
                        <el-text>{{ item.title }}</el-text>
                        <el-image
                          class="w-100px h-100px pt-5px"
                          :class="isDark ? 'bg-amber-50' : ''"
                          :src="item.thumbnail"
                        />
                      </div>
                    </div>
                  </template>
                </el-tooltip>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-scrollbar>
    </div>
    <div class="h-[calc(10%-1px)] flex justify-center items-center ct-border">
      <el-button class="w-80/100" @click="onManageClick">管理</el-button>
    </div>
    <el-dialog v-model="manage_dialog_visiable" title="图库管理" width="80%" destroy-on-close>
      <div class="flex">
        <div>
          <div>
            <div class="flex justify-center">
              <el-checkbox v-model="check_all" :indeterminate="is_indeterminate">全选</el-checkbox>
            </div>
            <el-scrollbar height="50vh">
              <el-tree
                ref="treeRef"
                :data="classify_list"
                :highlight-current="true"
                show-checkbox
                @check-change="handleCheckChange"
                node-key="label"
                :default-checked-keys="checked_keys"
                @node-click="onNodeClick"
              ></el-tree>
            </el-scrollbar>
            <el-upload
              ref="uploadRef"
              class="w-24px h-24px"
              v-model:file-list="up_img_list"
              :auto-upload="false"
              :limit="1"
              :show-file-list="false"
              :on-change="onUpLoadChange"
              accept="image/*"
            >
              <el-button type="primary">本地上传</el-button>
            </el-upload>
          </div>
        </div>

        <el-divider direction="vertical" class="h-50vh ml-40px"></el-divider>
        <div v-if="selected_node_key">
          <el-scrollbar height="50vh">
            <div class="flex flex-wrap">
              <div
                v-for="item in leftAsideProps.leftAsideConfig.get(selected_node_key)"
                :key="item.id"
                class="w-160px h-160px flex flex-wrap justify-center items-center cursor-pointer relative"
                @mouseenter="show_del_local_file = item.id"
                @mouseleave="show_del_local_file = null"
              >
                <el-tooltip
                  :effect="isDark ? 'dark' : 'light'"
                  :content="item.title"
                  placement="top"
                >
                  <div>
                    <el-image
                      class="w-60px h-60px"
                      :class="isDark ? 'bg-amber-50' : ''"
                      :src="item.thumbnail"
                    />
                    <div class="w-60px h-60px flex justify-center items-center">
                      <el-text truncated>{{ item.title }}</el-text>
                    </div>
                    <div
                      v-if="selected_node_key == '本地文件' && show_del_local_file == item.id"
                      class="absolute w-160px h-160px left-0 top-0 opacity-80 bg-light-300 flex justify-center items-center"
                    >
                      <el-button type="danger" @click="onDelLocalFile(item)">删除</el-button>
                    </div>
                  </div>
                </el-tooltip>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import {
  ElInput,
  ElCollapse,
  ElCollapseItem,
  ElButton,
  ElScrollbar,
  ElImage,
  ElTooltip,
  ElText,
  ElDialog,
  ElCheckbox,
  ElDivider,
  ElTree,
  ElUpload,
  type UploadUserFile,
  ElMessage,
  type UploadFile
} from 'element-plus';
import SvgAnalysis from '@/components/mt-edit/components/svg-analysis/index.vue';
import { useDark, useLocalStorage } from '@vueuse/core';
import type {
  ILeftAsideConfig,
  ILeftAsideConfigItem,
  ILeftAsideConfigItemPublic
} from '@/components/mt-edit/store/types';
import { globalStore } from '@/components/mt-edit/store/global';
import { blobToBase64 } from '@/components/mt-edit/utils';
type LeftAsideProps = {
  leftAsideConfig: ILeftAsideConfig;
};
const leftAsideProps = withDefaults(defineProps<LeftAsideProps>(), {
  leftAsideConfig: () => new Map<string, ILeftAsideConfigItem[]>()
});
const isDark = useDark({
  selector: '#mt-edit'
});
const uploadRef = ref();
// 从本地储存中查被禁用的类别
const disable_classify = useLocalStorage<string[]>('mt-disable-classify', []);
// 上传的文件也存到本地储存中
const local_file = useLocalStorage<ILeftAsideConfigItem[]>('mt-local-file', []);
leftAsideProps.leftAsideConfig.set('本地文件', local_file.value);
const treeRef = ref();
const is_show_tooltip: Record<string, boolean> = reactive({});
const active_names = ref([]);
const search_str = ref();
const manage_dialog_visiable = ref(false);
const up_img_list = ref<UploadUserFile[]>([]);
const show_del_local_file = ref<null | string>(null);
const classify_list = computed(() =>
  [...leftAsideProps.leftAsideConfig.keys()].map((m) => {
    return { label: m };
  })
);
const checked_keys = ref<string[]>(
  classify_list.value.filter((f) => !disable_classify.value.includes(f.label)).map((m) => m.label)
);
const selected_node_key = ref();
const check_all = computed({
  get: () => {
    return classify_list.value.length == checked_keys.value.length;
  },
  set: (val) => {
    if (val) {
      checked_keys.value = classify_list.value.map((m) => m.label);
    } else {
      checked_keys.value = [];
      treeRef.value?.setCheckedNodes([]);
    }
  }
});
const is_indeterminate = computed(() => {
  return checked_keys.value.length > 0 && checked_keys.value.length < classify_list.value.length;
});
const getOffset = (index: number) => {
  return index % 4 == 0 ? 40 : index % 4 == 3 ? 80 : index % 4 == 2 ? 120 : 160;
};
const getFilteritems = (
  arr: ILeftAsideConfigItemPublic[] | undefined
): ILeftAsideConfigItemPublic[] => {
  if (!arr) {
    return [];
  }
  if (search_str.value) {
    return arr.filter((f) => f.title.includes(search_str.value));
  }
  return arr;
};
const onDragStart = (config_item_key: string, item_id: string) => {
  if (!config_item_key || !item_id) {
    console.error('拖拽初始化失败', config_item_key, item_id);
    return;
  }
  is_show_tooltip[`${config_item_key}${item_id}`] = false;
  globalStore.setIntention('create');
  globalStore.setCreateItemInfo({
    config_key: config_item_key,
    item_id
  });
};
const onManageClick = () => {
  manage_dialog_visiable.value = true;
};
const handleCheckChange = (data: { label: string }, checked: boolean, indeterminate: boolean) => {
  if (checked && !checked_keys.value.includes(data.label)) {
    checked_keys.value.push(data.label);
  } else if (!checked) {
    checked_keys.value = checked_keys.value.filter((f) => f !== data.label);
  }
  disable_classify.value = classify_list.value
    .filter((f) => !checked_keys.value.includes(f.label))
    .map((m) => m.label);
};
const onNodeClick = ({ label }: { label: string }) => {
  selected_node_key.value = label;
};
const onUpLoadChange = (e: UploadFile) => {
  if (!e.raw!.type.includes('image/')) {
    ElMessage.error('只能上传图片!');
    uploadRef.value.clearFiles();
    up_img_list.value = [];
    return false;
  } else if (e.raw!.size / 1024 / 1024 > 1) {
    ElMessage.error('不能上传超过1MB的图像!');
    uploadRef.value.clearFiles();
    up_img_list.value = [];
    return false;
  }
  blobToBase64(e.raw!).then((base64) => {
    const id = e.name.split('.')[0];
    const config: ILeftAsideConfigItem = {
      id: id,
      title: id,
      type: 'img',
      thumbnail: base64 as string,
      props: {},
      common_animations: {
        val: '',
        delay: 'delay-0s',
        speed: 'slow',
        repeat: 'infinite'
      }
    };
    const find_index = local_file.value.findIndex((f) => f.id == id);
    if (find_index != -1) {
      ElMessage.info('存在同名文件,已覆盖!');
      local_file.value.splice(find_index, 1);
    }
    local_file.value.push(config);
    leftAsideProps.leftAsideConfig.set('本地文件', local_file.value);
    uploadRef.value.clearFiles();
    up_img_list.value = [];
    selected_node_key.value = '本地文件';
    treeRef.value?.setCurrentKey('本地文件');
  });
};
const onDelLocalFile = ({ id }: ILeftAsideConfigItem) => {
  const find_index = local_file.value.findIndex((f) => f.id == id);
  if (find_index != -1) {
    local_file.value.splice(find_index, 1);
  }
  leftAsideProps.leftAsideConfig.set('本地文件', local_file.value);
};
</script>
<style>
#mt-left-aside .el-collapse-item__header,
#mt-left-aside .el-collapse-item__wrap {
  background-color: transparent !important;
}
</style>
