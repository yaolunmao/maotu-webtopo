<template>
  <el-tabs v-model="activeName" v-if="selectItemSettingProps.itemJson" class="select-none">
    <el-tab-pane label="配置" name="config">
      <el-collapse v-model="activeNames" accordion>
        <el-collapse-item title="边界和属性" name="1">
          <el-form label-width="60px" label-position="left">
            <el-form-item label="标题" size="small">
              <el-input size="small" v-model="item_title"></el-input>
            </el-form-item>
            <el-form-item label="x轴坐标" size="small">
              <el-input-number
                size="small"
                v-model="item_binfo_left"
                @change="emits('addHistory')"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="y轴坐标" size="small">
              <el-input-number
                size="small"
                v-model="item_binfo_top"
                @change="emits('addHistory')"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="宽度" size="small" v-if="!is_line">
              <el-input-number
                size="small"
                v-model="item_binfo_width"
                @change="emits('addHistory')"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="高度" size="small" v-if="!is_line">
              <el-input-number
                size="small"
                v-model="item_binfo_height"
                @change="emits('addHistory')"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="旋转角度" size="small" v-if="!is_line">
              <el-input-number
                size="small"
                v-model="item_binfo_angle"
                @change="emits('addHistory')"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="隐藏" size="small">
              <el-switch size="small" v-model="item_hide" @change="emits('addHistory')"></el-switch>
            </el-form-item>
            <el-form-item label="锁定" size="small">
              <el-switch size="small" v-model="item_lock" @change="emits('addHistory')"></el-switch>
            </el-form-item>
            <el-form-item v-if="!item_lock && !is_line" label="可缩放" size="small">
              <el-switch size="small" v-model="item_resize"></el-switch>
            </el-form-item>
            <el-form-item
              v-if="item_resize && !item_lock && !is_line"
              label="等比缩放"
              size="small"
            >
              <el-switch size="small" v-model="item_use_proportional_scaling"></el-switch>
            </el-form-item>
            <el-form-item v-if="!item_lock && !is_line" label="可旋转" size="small">
              <el-switch size="small" v-model="item_rotate"></el-switch>
            </el-form-item>
            <select-item-props-setting v-model:propsInfo="item_props"></select-item-props-setting>
          </el-form>
        </el-collapse-item>
        <el-collapse-item title="动画配置" name="2">
          <select-item-animate-setting
            v-model:common-animates="item_common_animations"
          ></select-item-animate-setting>
        </el-collapse-item>
      </el-collapse>
    </el-tab-pane>
    <el-tab-pane label="事件" name="event">
      <select-item-event-setting
        :done-json="selectItemSettingProps.doneJson"
        v-model:item-events="item_events"
      ></select-item-event-setting>
    </el-tab-pane>
    <el-tab-pane label="绑定" name="bind_device">
      <slot v-if="hasDeviceBindSlot" name="deviceBind" :item="selectItemSettingProps.itemJson" />
      <el-empty v-else description="请传递插槽进行设备绑定页面显示" />
    </el-tab-pane>
  </el-tabs>
</template>
<script setup lang="ts">
import { computed, ref, useSlots } from 'vue';
import {
  ElTabs,
  ElTabPane,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElEmpty,
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
  ElMessage,
  ElCollapse,
  ElCollapseItem
} from 'element-plus';
import type { IDoneJson } from '@/components/mt-edit/store/types';
import SelectItemPropsSetting from './select-item-props-setting.vue';
import SelectItemAnimateSetting from './select-item-animate-setting/index.vue';
import SelectItemEventSetting from './select-item-event-setting/index.vue';
const activeName = ref('config');
const activeNames = ref(['1']);
type SelectItemSettingProps = {
  itemJson: IDoneJson | undefined;
  doneJson: IDoneJson[];
};
const selectItemSettingProps = withDefaults(defineProps<SelectItemSettingProps>(), {});
const emits = defineEmits(['update:itemJson', 'addHistory']);
const slots = useSlots();
// 自由连线 直角连线都有自定义宽高以及禁止缩放和旋转
const is_line = computed(() => selectItemSettingProps.itemJson?.type === 'sys-line');
const item_title = computed({
  get: () => {
    return selectItemSettingProps.itemJson?.title;
  },
  set: (value) => {
    emits('update:itemJson', {
      ...selectItemSettingProps.itemJson,
      title: value
    });
  }
});
const item_binfo_left = computed({
  get: () => {
    return selectItemSettingProps.itemJson?.binfo.left;
  },
  set: (value) => {
    emits('update:itemJson', {
      ...selectItemSettingProps.itemJson,
      binfo: {
        ...selectItemSettingProps.itemJson?.binfo,
        left: value
      }
    });
  }
});
const item_binfo_top = computed({
  get: () => {
    return selectItemSettingProps.itemJson?.binfo.top;
  },
  set: (value) => {
    emits('update:itemJson', {
      ...selectItemSettingProps.itemJson,
      binfo: {
        ...selectItemSettingProps.itemJson?.binfo,
        top: value
      }
    });
  }
});
const item_binfo_width = computed({
  get: () => {
    return selectItemSettingProps.itemJson?.binfo.width;
  },
  set: (value) => {
    emits('update:itemJson', {
      ...selectItemSettingProps.itemJson,
      binfo: {
        ...selectItemSettingProps.itemJson?.binfo,
        width: value
      }
    });
  }
});
const item_binfo_height = computed({
  get: () => {
    return selectItemSettingProps.itemJson?.binfo.height;
  },
  set: (value) => {
    emits('update:itemJson', {
      ...selectItemSettingProps.itemJson,
      binfo: {
        ...selectItemSettingProps.itemJson?.binfo,
        height: value
      }
    });
  }
});
const item_binfo_angle = computed({
  get: () => {
    return selectItemSettingProps.itemJson?.binfo.angle;
  },
  set: (value) => {
    emits('update:itemJson', {
      ...selectItemSettingProps.itemJson,
      binfo: {
        ...selectItemSettingProps.itemJson?.binfo,
        angle: value
      }
    });
  }
});
const item_hide = computed({
  get: () => {
    return selectItemSettingProps.itemJson?.hide;
  },
  set: (value) => {
    emits('update:itemJson', {
      ...selectItemSettingProps.itemJson,
      hide: value
    });
  }
});
const item_lock = computed({
  get: () => {
    return selectItemSettingProps.itemJson?.lock;
  },
  set: (value) => {
    emits('update:itemJson', {
      ...selectItemSettingProps.itemJson,
      lock: value
    });
  }
});
const item_resize = computed({
  get: () => {
    return selectItemSettingProps.itemJson?.resize;
  },
  set: (value) => {
    emits('update:itemJson', {
      ...selectItemSettingProps.itemJson,
      resize: value
    });
  }
});
const item_use_proportional_scaling = computed({
  get: () => {
    return selectItemSettingProps.itemJson?.use_proportional_scaling;
  },
  set: (value) => {
    emits('update:itemJson', {
      ...selectItemSettingProps.itemJson,
      use_proportional_scaling: value
    });
  }
});
const item_rotate = computed({
  get: () => {
    return selectItemSettingProps.itemJson?.rotate;
  },
  set: (value) => {
    emits('update:itemJson', {
      ...selectItemSettingProps.itemJson,
      rotate: value
    });
  }
});
const item_props = computed({
  get: () => {
    return selectItemSettingProps.itemJson?.props;
  },
  set: (value) => {
    emits('update:itemJson', {
      ...selectItemSettingProps.itemJson,
      props: value
    });
  }
});
const item_common_animations = computed({
  get: () => {
    return selectItemSettingProps.itemJson?.common_animations;
  },
  set: (value) => {
    emits('update:itemJson', {
      ...selectItemSettingProps.itemJson,
      common_animations: value
    });
  }
});
const item_events = computed({
  get: () => {
    return selectItemSettingProps.itemJson?.events;
  },
  set: (value) => {
    emits('update:itemJson', {
      ...selectItemSettingProps.itemJson,
      events: value
    });
  }
});
const hasDeviceBindSlot = computed(() => {
  return !!slots.deviceBind;
});
</script>
