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
      guide: true,
      adsorp: true,
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
        id: 'demo-nPL9aqhnSl',
        title: '演示svg文件',
        type: 'svg',
        binfo: {
          left: 650,
          top: 160,
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
        tag: 'demo',
        common_animations: {
          val: '',
          delay: 'delay-0s',
          speed: 'slow',
          repeat: 'infinite'
        },
        events: [
          {
            id: 'pJwJOIUIat',
            type: 'click',
            action: 'customCode',
            change_attr: [],
            custom_code: "$mtEventCallBack('test-dialog',$item_info.id)\nconsole.log(111)",
            trigger_rule: {
              value: null
            }
          }
        ]
      },
      {
        id: 'text-vue-T19K6wCQZ2',
        title: '文字',
        type: 'vue',
        binfo: {
          left: 590,
          top: 80,
          width: 250,
          height: 50,
          angle: 0
        },
        resize: true,
        rotate: true,
        lock: false,
        active: false,
        hide: false,
        props: {
          text: '请点击预览查看事件触发',
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
