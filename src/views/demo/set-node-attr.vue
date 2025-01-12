<!-- eslint-disable vue/html-indent -->
<template>
  <div>
    <el-button @click="changeRed">改成红色</el-button>
    <el-button @click="changeGreen">改成绿色</el-button>
    <mt-preview ref="svgPreviewRef" :export-json="export_json"></mt-preview>
  </div>
</template>
<script setup lang="ts">
import { MtPreview } from '@/export';
import { ElButton } from 'element-plus';
import { ref } from 'vue';
const svgPreviewRef = ref<InstanceType<typeof MtPreview>>();
const export_json = ref<any>({
  canvasCfg: {
    width: 1920,
    height: 1080,
    scale: 1,
    color: '',
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
    enabled: true,
    align: true,
    size: 10
  },
  json: [
    {
      id: 'demo-4Y2Eq7UPBm',
      title: '演示svg文件',
      type: 'svg',
      binfo: {
        left: 510,
        top: 200,
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
      events: []
    }
  ]
});
const changeRed = () => {
  svgPreviewRef.value
    ?.setItemAttrByID('demo-4Y2Eq7UPBm', 'props.fill.val', '#FF0000')
    .then((res) => {
      console.log(res);
    });
};
const changeGreen = () => {
  svgPreviewRef.value
    ?.setItemAttrByID('demo-4Y2Eq7UPBm', 'props.fill.val', '#00FF00')
    .then((res) => {
      console.log(res);
    });
};
</script>
