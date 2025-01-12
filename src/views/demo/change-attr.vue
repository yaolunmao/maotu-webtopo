<template>
  <div class="w-1/1 h-100vh">
    <mt-edit
      ref="MtEditRef"
      @on-return-click="onReturnClick"
      @on-preview-click="onPreviewClick"
    ></mt-edit>
  </div>
</template>
<script setup lang="ts">
import type { IExportJson } from '@/components/mt-edit/components/types';
import { MtEdit } from '@/export';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const MtEditRef = ref<InstanceType<typeof MtEdit>>();
const onPreviewClick = (exportJson: IExportJson) => {
  sessionStorage.setItem('exportJson', JSON.stringify(exportJson));
  const routeUrl = router.resolve({
    name: 'preview'
  });
  window.open(routeUrl.href, '_blank');
};

const onReturnClick = () => {
  router.go(-1);
};
onMounted(() => {
  MtEditRef.value?.setImportJson({
    canvasCfg: {
      width: 1920,
      height: 1080,
      scale: 1,
      color: '#000000',
      img: '',
      guide: false,
      adsorp: false,
      adsorp_diff: 3,
      transform_origin: {
        x: 0,
        y: 0
      },
      drag_offset: {
        x: 0,
        y: 0
      }
    },
    gridCfg: {
      enabled: false,
      align: true,
      size: 10
    },
    json: [
      {
        id: 'sys-button-vue-mDvwKZN8o8',
        title: '按钮',
        type: 'vue',
        binfo: {
          left: 551,
          top: 301,
          width: 230,
          height: 50,
          angle: 0
        },
        resize: true,
        rotate: true,
        lock: false,
        active: false,
        hide: false,
        props: {
          text: '连续点我更改发电机颜色',
          type: 'primary',
          round: false
        },
        tag: 'sys-button-vue',
        common_animations: {
          val: '',
          delay: 'delay-0s',
          speed: 'slow',
          repeat: 'infinite'
        },
        events: [
          {
            id: 'B3WIAOMhsX',
            type: 'click',
            action: 'changeAttr',
            change_attr: [
              {
                id: 'urxZScYkBI',
                target_id: '交流发电机-n3chkyZXmm',
                target_attr: 'props.fill.val',
                target_value: '#FF0000'
              }
            ],
            custom_code: '',
            trigger_rule: {
              trigger_id: '交流发电机-n3chkyZXmm',
              trigger_attr: 'props.fill.val',
              operator: '=',
              value: '#0000FF'
            }
          },
          {
            id: '8sTLbGQJlg',
            type: 'click',
            action: 'changeAttr',
            change_attr: [
              {
                id: 'mSEryeWrAq',
                target_id: '交流发电机-n3chkyZXmm',
                target_attr: 'props.fill.val',
                target_value: '#0000FF'
              }
            ],
            custom_code: '',
            trigger_rule: {
              trigger_id: '交流发电机-n3chkyZXmm',
              trigger_attr: 'props.fill.val',
              operator: '=',
              value: '#FF0000'
            }
          }
        ]
      },
      {
        id: '交流发电机-n3chkyZXmm',
        title: '交流发电机',
        type: 'svg',
        binfo: {
          left: 320,
          top: 140,
          width: 50,
          height: 50,
          angle: 0
        },
        resize: true,
        rotate: true,
        lock: false,
        active: false,
        hide: false,
        props: {
          fill: '#FF0000'
        },
        tag: '交流发电机',
        common_animations: {
          val: '',
          delay: 'delay-0s',
          speed: 'slow',
          repeat: 'infinite'
        },
        events: []
      },
      {
        id: 'text-vue-11VSQoJxa6',
        title: '文字',
        type: 'vue',
        binfo: {
          left: 560,
          top: 60,
          width: 600,
          height: 50,
          angle: 0
        },
        resize: true,
        rotate: true,
        lock: false,
        active: false,
        hide: false,
        props: {
          text: '请先将点击右上角预览，再点击按钮查看效果',
          fontFamily: '黑体',
          fontSize: 18,
          fill: '#FFF700',
          vertical: false
        },
        tag: 'text-vue',
        common_animations: {
          val: '',
          delay: 'delay-0s',
          speed: 'slow',
          repeat: 'infinite'
        },
        events: []
      },
      {
        id: 'text-vue-eoZAkwVSHu',
        title: '文字',
        type: 'vue',
        binfo: {
          left: 964,
          top: 194,
          width: 341,
          height: 50,
          angle: 0
        },
        resize: true,
        rotate: true,
        lock: false,
        active: false,
        hide: false,
        props: {
          text: '编辑模式下选中按钮可查看事件如何配置',
          fontFamily: '黑体',
          fontSize: 18,
          fill: '#FFF700',
          vertical: false
        },
        tag: 'text-vue',
        common_animations: {
          val: '',
          delay: 'delay-0s',
          speed: 'slow',
          repeat: 'infinite'
        },
        events: []
      }
    ]
  });
});
</script>

<style scoped></style>
