<template>
  <el-tabs v-model="activeName" class="select-none">
    <el-tab-pane label="页面" name="page">
      <el-form label-width="70px" label-position="left">
        <el-form-item label="画布尺寸" size="small">
          <el-select v-model="canvas_size" placeholder="请设置画布尺寸">
            <el-option-group label="自定义">
              <div class="flex justify-between">
                <el-input-number
                  v-model="canvas_size_width"
                  size="small"
                  :controls="false"
                  class="w-5/10 pl-5px"
                ></el-input-number>
                <el-text>*</el-text>
                <el-input-number
                  v-model="canvas_size_height"
                  size="small"
                  :controls="false"
                  class="w-5/10 pr-5px"
                ></el-input-number>
              </div>
            </el-option-group>
            <el-option-group
              v-for="group in canvas_size_options"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="缩放倍数" size="small">
          <el-select v-model="canvas_size_scale" placeholder="请设置缩放比例" size="small">
            <el-option
              v-for="item in canvas_size_scale_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
            <div class="flex justify-between px-10px ct-border pt-10px">
              <el-text>自定义:</el-text>
              <el-input-number
                v-model="canvas_size_scale_input"
                size="small"
                :step="0.1"
                :min="0.1"
                class="mx-5px"
              ></el-input-number>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="背景颜色" size="small">
          <el-color-picker v-model="canvas_bg_color"></el-color-picker>
        </el-form-item>
        <el-form-item label="背景图片" size="small">
          <el-upload
            ref="canvasBgImgUploadRef"
            class="w-24px h-24px"
            v-model:file-list="bg_img_list"
            :auto-upload="false"
            :limit="1"
            :show-file-list="false"
            :on-change="onBgImgChange"
            accept="image/*"
            @mouseenter="show_clear_bg_img = true"
            @mouseleave="show_clear_bg_img = false"
          >
            <div class="flex justify-center items-center relative">
              <img
                class="w-40px h-40px absolute left-0"
                v-if="rightAsideProps.canvasCfg.img"
                :src="rightAsideProps.canvasCfg.img"
              />
              <el-button v-else size="small" class="w-40px h-40px absolute left-0">
                <el-icon title="上传" :size="20">
                  <svg-analysis name="upload"></svg-analysis>
                </el-icon>
              </el-button>
              <div
                v-if="rightAsideProps.canvasCfg.img && show_clear_bg_img"
                class="absolute w-40px h-40px left-0 opacity-80 bg-light-300 flex justify-center items-center"
                @click.stop="clearBgImg"
              >
                <el-icon title="删除" :size="25">
                  <svg-analysis name="delete"></svg-analysis>
                </el-icon>
              </div>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="参考线" size="small">
          <el-switch v-model="canvas_guide"></el-switch>
        </el-form-item>
        <el-form-item label="吸附" size="small">
          <el-switch v-model="canvas_adsorp"></el-switch>
        </el-form-item>
        <el-form-item label="网格" size="small">
          <el-switch v-model="grid_enabled"></el-switch>
        </el-form-item>
        <el-form-item label="网格对齐" size="small" v-if="grid_enabled">
          <el-switch v-model="grid_align"></el-switch>
        </el-form-item>
        <el-form-item label="网格大小" size="small" v-if="grid_enabled">
          <el-input-number v-model="grid_size" :min="1"></el-input-number>
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>
<script setup lang="ts">
import type { IGlobalStoreCanvasCfg, IGlobalStoreGridCfg } from '@/components/mt-edit/store/types';
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
import { computed, ref } from 'vue';
import SvgAnalysis from '@/components/mt-edit/components/svg-analysis/index.vue';
import { blobToBase64 } from '@/components/mt-edit/utils';
type RightAsideProps = {
  canvasCfg: IGlobalStoreCanvasCfg;
  gridCfg: IGlobalStoreGridCfg;
};
const rightAsideProps = withDefaults(defineProps<RightAsideProps>(), {});
const emits = defineEmits(['update:canvasCfg', 'update:gridCfg']);
const activeName = ref('page');
const canvasBgImgUploadRef = ref();
const canvas_size = computed({
  get: () => {
    return `${rightAsideProps.canvasCfg.width}*${rightAsideProps.canvasCfg.height}`;
  },
  set: (value) => {
    const [width, height] = value.split('*');
    emits('update:canvasCfg', {
      ...rightAsideProps.canvasCfg,
      width: Number(width),
      height: Number(height)
    });
  }
});
const canvas_size_width = computed({
  get: () => {
    return rightAsideProps.canvasCfg.width;
  },
  set: (value) => {
    emits('update:canvasCfg', {
      ...rightAsideProps.canvasCfg,
      width: value
    });
  }
});
const canvas_size_height = computed({
  get: () => {
    return rightAsideProps.canvasCfg.height;
  },
  set: (value) => {
    emits('update:canvasCfg', {
      ...rightAsideProps.canvasCfg,
      height: value
    });
  }
});
const canvas_size_options = [
  {
    label: 'pc端',
    options: [
      {
        value: '1920*1080',
        label: '1920*1080'
      },
      {
        value: '1600*900',
        label: '1600*900'
      },
      {
        value: '1366*768',
        label: '1366*768'
      },
      {
        value: '1280*720',
        label: '1280*720'
      }
    ]
  },
  {
    label: '移动端',
    options: [
      {
        value: '1024*1366',
        label: '1024*1366'
      },
      {
        value: '768*1024',
        label: '768*1024'
      },
      {
        value: '480*800',
        label: '480*800'
      }
    ]
  }
];
const canvas_size_scale_input = computed({
  get: () => {
    return rightAsideProps.canvasCfg.scale;
  },
  set: (value) => {
    emits('update:canvasCfg', {
      ...rightAsideProps.canvasCfg,
      scale: value
    });
  }
});
const canvas_size_scale = computed({
  get: () => {
    return rightAsideProps.canvasCfg.scale;
  },
  set: (value) => {
    emits('update:canvasCfg', {
      ...rightAsideProps.canvasCfg,
      scale: value
    });
  }
});
const canvas_size_scale_options = [
  {
    value: 0.5,
    label: 0.5
  },
  {
    value: 1,
    label: 1
  },
  {
    value: 1.5,
    label: 1.5
  },
  {
    value: 2,
    label: 2
  }
];
const canvas_bg_color = computed({
  get: () => {
    return rightAsideProps.canvasCfg.color;
  },
  set: (value) => {
    emits('update:canvasCfg', {
      ...rightAsideProps.canvasCfg,
      color: value
    });
  }
});
const show_clear_bg_img = ref(false);
const bg_img_list = ref<UploadUserFile[]>([]);
const grid_enabled = computed({
  get: () => {
    return rightAsideProps.gridCfg.enabled;
  },
  set: (value) => {
    emits('update:gridCfg', {
      ...rightAsideProps.gridCfg,
      enabled: value
    });
  }
});
const grid_align = computed({
  get: () => {
    return rightAsideProps.gridCfg.align;
  },
  set: (value) => {
    emits('update:gridCfg', {
      ...rightAsideProps.gridCfg,
      align: value
    });
  }
});
const grid_size = computed({
  get: () => {
    return rightAsideProps.gridCfg.size;
  },
  set: (value) => {
    emits('update:gridCfg', {
      ...rightAsideProps.gridCfg,
      size: value
    });
  }
});
const onBgImgChange = (e: UploadFile) => {
  show_clear_bg_img.value = false;
  if (!e.raw!.type.includes('image/')) {
    ElMessage.error('只能上传图片!');
    canvasBgImgUploadRef.value.clearFiles();
    bg_img_list.value = [];
    return false;
  } else if (e.raw!.size / 1024 / 1024 > 1) {
    ElMessage.error('不能上传超过1MB的图像!');
    canvasBgImgUploadRef.value.clearFiles();
    bg_img_list.value = [];
    return false;
  }
  blobToBase64(e.raw!).then((base64) => {
    emits('update:canvasCfg', {
      ...rightAsideProps.canvasCfg,
      img: base64
    });
  });
};

const clearBgImg = () => {
  canvasBgImgUploadRef.value.clearFiles();
  emits('update:canvasCfg', {
    ...rightAsideProps.canvasCfg,
    img: ''
  });
};
const canvas_adsorp = computed({
  get: () => {
    return rightAsideProps.canvasCfg.adsorp;
  },
  set: (value) => {
    emits('update:canvasCfg', {
      ...rightAsideProps.canvasCfg,
      adsorp: value
    });
  }
});
const canvas_guide = computed({
  get: () => {
    return rightAsideProps.canvasCfg.guide;
  },
  set: (value) => {
    emits('update:canvasCfg', {
      ...rightAsideProps.canvasCfg,
      guide: value
    });
  }
});
</script>
