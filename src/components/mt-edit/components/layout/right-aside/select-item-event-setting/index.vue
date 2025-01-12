<template>
  <div>
    <el-button type="primary" class="w-1/1" @click="onAddEvent">添加事件</el-button>
    <el-form label-width="60px" label-position="left">
      <el-collapse v-model="activeNames">
        <el-collapse-item
          v-for="(event_list_item, event_list_index) in event_list"
          :key="event_list_item.id"
          :name="event_list_item.id"
        >
          <template #title>
            <div class="flex justify-between items-center w-1/1">
              <el-text>事件{{ event_list_index + 1 }}</el-text>
              <el-popconfirm title="删除该事件?" @confirm="onDelEvent(event_list_index)">
                <template #reference>
                  <el-button text circle size="small" @click.stop>
                    <el-icon title="删除" :class="``" :size="20">
                      <svg-analysis name="delete"></svg-analysis>
                    </el-icon>
                  </el-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
          <div>
            <el-form-item label="事件类型" size="small" class="mt-10px">
              <el-select placeholder="事件类型" v-model="event_list[event_list_index].type">
                <el-option
                  v-for="item in event_type"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="事件行为" size="small">
              <el-select placeholder="事件行为" v-model="event_list[event_list_index].action">
                <el-option
                  v-for="item in event_action"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="event_list_item.action == 'changeAttr'"
              label="属性更改"
              size="small"
            >
              <el-button @click="onChangeAttrClick(event_list_item, event_list_index)"
                >点击配置</el-button
              >
            </el-form-item>
            <el-form-item
              v-else-if="event_list_item.action == 'customCode'"
              label="代码编写"
              size="small"
            >
              <el-button @click="onCustomCodeClick(event_list_item, event_list_index)"
                >点击编写</el-button
              >
            </el-form-item>
            <el-form-item label="触发规则" size="small">
              <el-text>(不填直接触发)</el-text>
            </el-form-item>
            <div>
              <el-text>当</el-text>
              <el-select
                placeholder="选择图形"
                size="small"
                v-model="event_list[event_list_index].trigger_rule.trigger_id"
                @change="onTriggerIdChange(event_list_index)"
              >
                <el-option
                  v-for="item in all_component_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-text>图形</el-text>
              <el-select
                placeholder="选择属性"
                size="small"
                v-model="event_list[event_list_index].trigger_rule.trigger_attr"
                @change="onTriggerAttrChange(event_list_index)"
              >
                <el-option
                  v-for="item in getAttrById(event_list[event_list_index].trigger_rule.trigger_id)"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-text>属性</el-text>
              <el-select
                placeholder="运算符"
                size="small"
                v-model="event_list[event_list_index].trigger_rule.operator"
              >
                <el-option
                  v-for="item in getOperatorList(
                    getAttrTypeByValue(
                      getAttrById(event_list[event_list_index].trigger_rule.trigger_id),
                      event_list[event_list_index].trigger_rule.trigger_attr
                    )
                  )"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <input-target-value
                v-model="event_list[event_list_index].trigger_rule.value"
                :form-type="
                  getAttrTypeByValue(
                    getAttrById(event_list[event_list_index].trigger_rule.trigger_id),
                    event_list[event_list_index].trigger_rule.trigger_attr
                  )
                "
                :options="
                  getAttrOptionsByValue(
                    getAttrById(event_list[event_list_index].trigger_rule.trigger_id),
                    event_list[event_list_index].trigger_rule.trigger_attr
                  )
                "
                :disabled="event_list[event_list_index].trigger_rule.trigger_attr == undefined"
                size="small"
              ></input-target-value>
              <el-text>时</el-text>
              <div>
                <el-text>触发该事件</el-text>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <el-drawer v-model="drawer_visiable" :title="drawer_title" direction="ltr" size="50%">
      <el-button class="w-1/1" @click="onAddChangeAttr">新增一组</el-button>
      <el-form label-width="60px" label-position="left">
        <div
          v-for="(change_attr_item, change_attr_index) in drawer_change_attr"
          :key="change_attr_item.id"
          class="flex items-center mt-10px"
        >
          <el-form-item label="目标图形" size="small" class="m-0 pr-10px w-3/10">
            <el-select
              placeholder="选择目标图形"
              v-model="drawer_change_attr[change_attr_index].target_id"
              @change="drawer_change_attr[change_attr_index].target_attr = undefined"
            >
              <el-option
                v-for="item in all_component_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="目标属性" size="small" class="m-0 pr-10px w-3/10">
            <el-select
              placeholder="选择目标属性"
              v-model="drawer_change_attr[change_attr_index].target_attr"
              @change="onTargetAttrChange(change_attr_index)"
            >
              <el-option
                v-for="item in getAttrById(drawer_change_attr[change_attr_index].target_id)"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="期望值" size="small" class="m-0 pr-10px w-3/10">
            <input-target-value
              v-model="drawer_change_attr[change_attr_index].target_value"
              :form-type="
                getAttrTypeByValue(
                  getAttrById(drawer_change_attr[change_attr_index].target_id),
                  drawer_change_attr[change_attr_index].target_attr
                )
              "
              :options="
                getAttrOptionsByValue(
                  getAttrById(drawer_change_attr[change_attr_index].target_id),
                  drawer_change_attr[change_attr_index].target_attr
                )
              "
              :disabled="drawer_change_attr[change_attr_index].target_attr == undefined"
            ></input-target-value>
          </el-form-item>
          <el-popconfirm title="删除该配置?" @confirm="onRemoveChangeAttr(change_attr_index)">
            <template #reference>
              <el-button text circle size="small" @click.stop>
                <el-icon title="删除" :class="``" :size="20">
                  <svg-analysis name="delete"></svg-analysis>
                </el-icon>
              </el-button>
            </template>
          </el-popconfirm>
        </div>
      </el-form>
    </el-drawer>
    <el-dialog v-model="dialog_visiable" :title="dialog_title" :before-close="onDialogClose">
      <v-ace-editor
        v-model:value="dialog_code"
        lang="javascript"
        theme="monokai"
        style="height: 400px"
        :options="{
          useWorker: true,
          enableBasicAutocompletion: true,
          enableSnippets: true,
          enableLiveAutocompletion: true
        }"
      />
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import {
  ElButton,
  ElForm,
  ElFormItem,
  ElSelect,
  ElOption,
  ElText,
  ElInput,
  ElCollapse,
  ElCollapseItem,
  ElIcon,
  ElPopconfirm,
  ElDrawer,
  ElDialog
} from 'element-plus';
import { computed, ref, watch } from 'vue';
import SvgAnalysis from '@/components/mt-edit/components/svg-analysis/index.vue';
import { randomString } from '@/components/mt-edit/utils';
import type {
  DoneJsonEventListAction,
  DoneJsonEventListType,
  IDoneJson,
  IDoneJsonActionChangeAttr,
  IDoneJsonEventList,
  ILeftAsideConfigItemPublicPropsType
} from '@/components/mt-edit/store/types';
import InputTargetValue from './input-target-value.vue';
import '@/components/mt-edit/ace-edit';
import { VAceEditor } from 'vue3-ace-editor';

type SelectItemEventSettingProps = {
  doneJson: IDoneJson[];
  itemEvents?: IDoneJsonEventList[];
};
const selectItemEventSettingProps = withDefaults(defineProps<SelectItemEventSettingProps>(), {
  itemEvents: () => []
});
const selectItemEventSettingEmits = defineEmits(['update:itemEvents']);
interface IActionChangeAttrTarget {
  label: string;
  value: string;
  type: ILeftAsideConfigItemPublicPropsType;
  options?: { label: string; value: any }[];
}

const event_type: {
  label: string;
  value: DoneJsonEventListType;
}[] = [
  {
    label: '单击',
    value: 'click'
  },
  {
    label: '双击',
    value: 'dblclick'
  },
  {
    label: '鼠标移入',
    value: 'mouseover'
  },
  {
    label: '鼠标移出',
    value: 'mouseout'
  }
];
const event_action: {
  label: string;
  value: DoneJsonEventListAction;
}[] = [
  {
    label: '属性更改',
    value: 'changeAttr'
  },
  {
    label: '自定义代码',
    value: 'customCode'
  }
];
const all_component_options = computed(() => {
  return selectItemEventSettingProps.doneJson.map((m) => {
    return {
      label: m.title,
      value: m.id
    };
  });
});
const activeNames = ref([]);
const event_list = computed(() => selectItemEventSettingProps.itemEvents);
const select_event_index = ref(0);
const drawer_visiable = ref(false);
const drawer_title = ref('属性更改配置');
const drawer_change_attr = ref<IDoneJsonActionChangeAttr[]>([]); // 属性更改配置信息
const dialog_visiable = ref(false);
const dialog_title = ref('自定义代码编写');
const dialog_code = ref('');
const onAddEvent = () => {
  event_list.value.push({
    id: randomString(),
    type: 'click',
    action: 'changeAttr',
    change_attr: [],
    custom_code: '',
    trigger_rule: {
      trigger_id: undefined,
      trigger_attr: undefined,
      operator: undefined,
      value: null
    }
  });
};
const onDelEvent = (event_list_index: number) => {
  event_list.value.splice(event_list_index, 1);
};
const onChangeAttrClick = (item: IDoneJsonEventList, index: number) => {
  drawer_visiable.value = true;
  drawer_change_attr.value = item.change_attr;
  drawer_title.value = `事件${index + 1}属性更改配置`;
  select_event_index.value = index;
};
const onAddChangeAttr = () => {
  drawer_change_attr.value.push({
    id: randomString(),
    target_id: '',
    target_attr: undefined,
    target_value: undefined
  });
};
const onRemoveChangeAttr = (change_attr_index: number) => {
  drawer_change_attr.value.splice(change_attr_index, 1);
};
const onTargetAttrChange = (change_attr_index: number) => {
  const type = getAttrTypeByValue(
    getAttrById(drawer_change_attr.value[change_attr_index].target_id),
    drawer_change_attr.value[change_attr_index].target_attr
  );
  if (type == 'switch') {
    drawer_change_attr.value[change_attr_index].target_value = false;
  } else if (type == 'number') {
    drawer_change_attr.value[change_attr_index].target_value = 0;
  } else {
    drawer_change_attr.value[change_attr_index].target_value = undefined;
  }
};
/**
 * 根据id获取属性
 * @param id
 */
const getAttrById = (id: string | null | undefined) => {
  if (!id) {
    return [];
  }
  const find_item_json = selectItemEventSettingProps.doneJson.find((f) => f.id == id);
  if (!find_item_json) {
    return [];
  }
  const attr: IActionChangeAttrTarget[] = [
    {
      label: 'x轴坐标',
      value: 'binfo.left',
      type: 'number'
    },
    {
      label: 'y轴坐标',
      value: 'binfo.top',
      type: 'number'
    },
    {
      label: '宽度',
      value: 'binfo.width',
      type: 'number'
    },
    {
      label: '高度',
      value: 'binfo.height',
      type: 'number'
    },
    {
      label: '旋转角度',
      value: 'binfo.angle',
      type: 'number'
    }
  ];
  for (const props_key in find_item_json.props) {
    if (find_item_json.props[props_key].disabled) {
      continue;
    }
    attr.push({
      label: find_item_json.props[props_key].title,
      value: `props.${props_key}.val`,
      type: find_item_json.props[props_key].type,
      options: find_item_json.props[props_key].options
    });
  }
  return attr;
};
/**
 * 根据值获取属性类型
 * @param attr
 * @param val
 */
const getAttrTypeByValue = (attr: IActionChangeAttrTarget[], val: any) => {
  return attr.find((f) => f.value == val)?.type ?? '';
};
/**
 * 根据值获取属性选项
 */
const getAttrOptionsByValue = (attr: IActionChangeAttrTarget[], val: any) => {
  return attr.find((f) => f.value == val)?.options;
};
/**
 * 根据属性类型获取运算符
 */
const getOperatorList = (attr_type: ILeftAsideConfigItemPublicPropsType | '') => {
  if (attr_type == 'number') {
    return [
      {
        label: '大于',
        value: '>'
      },
      {
        label: '等于',
        value: '='
      },
      {
        label: '小于',
        value: '<'
      },
      {
        label: '不等于',
        value: '!='
      }
    ];
  } else if (
    attr_type == 'color' ||
    attr_type == 'switch' ||
    attr_type == 'select' ||
    attr_type == 'input'
  ) {
    return [
      {
        label: '等于',
        value: '='
      },
      {
        label: '不等于',
        value: '!='
      }
    ];
  }
  return [];
};
const onTriggerIdChange = (event_list_index: number) => {
  event_list.value[event_list_index].trigger_rule.trigger_attr = undefined;
  event_list.value[event_list_index].trigger_rule.operator = undefined;
  event_list.value[event_list_index].trigger_rule.value = null;
};
const onTriggerAttrChange = (event_list_index: number) => {
  event_list.value[event_list_index].trigger_rule.operator = undefined;
  event_list.value[event_list_index].trigger_rule.value = null;
};
const onCustomCodeClick = (item: IDoneJsonEventList, index: number) => {
  dialog_visiable.value = true;
  dialog_code.value = item.custom_code;
  dialog_title.value = `事件${index + 1}自定义代码编写`;
  select_event_index.value = index;
};
const onDialogClose = () => {
  event_list.value[select_event_index.value].custom_code = dialog_code.value;
  dialog_visiable.value = false;
};
watch(event_list.value, (val) => {
  selectItemEventSettingEmits('update:itemEvents', val);
});
</script>
