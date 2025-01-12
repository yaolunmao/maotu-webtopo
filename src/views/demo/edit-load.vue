<template>
  <div class="w-1/1 h-100vh">
    <mt-edit ref="MtEditRef" @on-return-click="onReturnClick"></mt-edit>
  </div>
</template>
<script setup lang="ts">
import { MtEdit } from '@/export';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const MtEditRef = ref<InstanceType<typeof MtEdit>>();
const onReturnClick = () => {
  router.go(-1);
};
onMounted(() => {
  const res = MtEditRef.value?.setImportJson({
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
        x: -333,
        y: -4
      }
    },
    gridCfg: {
      enabled: false,
      align: true,
      size: 10
    },
    json: [
      {
        id: 'text-vue-rfEqQD4y2G',
        title: '文字',
        type: 'vue',
        binfo: {
          left: 738,
          top: 38,
          width: 383,
          height: 50,
          angle: 0
        },
        resize: true,
        rotate: true,
        lock: false,
        active: false,
        hide: false,
        props: {
          text: '加载已有数据',
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
        id: 'sys-line-kgIM4cL60s',
        title: '自由连线',
        type: 'sys-line',
        binfo: {
          left: 501,
          top: 177,
          width: 711,
          height: 0,
          angle: 0
        },
        resize: false,
        rotate: false,
        lock: false,
        active: false,
        hide: false,
        props: {
          stroke: '#ff0000',
          'stroke-width': 2,
          'marker-start': false,
          'marker-end': true,
          point_position: [
            {
              x: 0,
              y: 0
            },
            {
              x: 711,
              y: 0
            }
          ],
          ani_type: 'none',
          ani_dur: 20,
          ani_color: '#0a7ae2',
          ani_reverse: false,
          ani_play: true,
          bind_anchors: {
            start: null,
            end: null
          }
        },
        tag: 'sys-line',
        common_animations: {
          val: '',
          delay: 'delay-0s',
          speed: 'slow',
          repeat: 'infinite'
        },
        events: []
      },
      {
        id: 'sys-line-sfHoJjRCDO',
        title: '自由连线',
        type: 'sys-line',
        binfo: {
          left: 501,
          top: 233,
          width: 735,
          height: 0,
          angle: 0
        },
        resize: false,
        rotate: false,
        lock: false,
        active: false,
        hide: false,
        props: {
          stroke: '#ff0000',
          'stroke-width': 2,
          'marker-start': false,
          'marker-end': false,
          point_position: [
            {
              x: 0,
              y: 0
            },
            {
              x: 735,
              y: 0
            }
          ],
          ani_type: 'electricity',
          ani_dur: 20,
          ani_color: '#FF0000',
          ani_reverse: false,
          ani_play: true,
          bind_anchors: {
            start: null,
            end: null
          }
        },
        tag: 'sys-line',
        common_animations: {
          val: '',
          delay: 'delay-0s',
          speed: 'slow',
          repeat: 'infinite'
        },
        events: []
      },
      {
        id: 'sys-line-Rr3SVNwuSU',
        title: '自由连线',
        type: 'sys-line',
        binfo: {
          left: 498,
          top: 313,
          width: 742,
          height: 0,
          angle: 0
        },
        resize: false,
        rotate: false,
        lock: false,
        active: false,
        hide: false,
        props: {
          stroke: '#FFFFFF',
          'stroke-width': 10,
          'marker-start': false,
          'marker-end': false,
          point_position: [
            {
              x: 0,
              y: 0
            },
            {
              x: 742,
              y: 0
            }
          ],
          ani_type: 'waterdrop',
          ani_dur: 20,
          ani_color: '#0a7ae2',
          ani_reverse: true,
          ani_play: true,
          bind_anchors: {
            start: null,
            end: null
          }
        },
        tag: 'sys-line',
        common_animations: {
          val: '',
          delay: 'delay-0s',
          speed: 'slow',
          repeat: 'infinite'
        },
        events: []
      },
      {
        id: 'demo-6bmwf6LJ0M',
        title: '演示svg文件',
        type: 'svg',
        binfo: {
          left: 791,
          top: 401,
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
          val: 'rotate360',
          delay: 'delay-0s',
          speed: 'slow',
          repeat: 'infinite'
        },
        events: []
      }
    ]
  });
  if (res) {
    console.log('加载成功');
  }
});
</script>

<style scoped></style>
