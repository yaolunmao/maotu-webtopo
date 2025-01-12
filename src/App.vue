<script setup lang="ts">
import { leftAsideStore } from '@/export';
import demo from '/svgs/demo.svg?raw';
const electrical_modules_files = import.meta.glob('./assets/svgs/electrical/**.svg', {
  eager: true,
  as: 'raw'
});
const electrical_stroke_modules_files = import.meta.glob('./assets/svgs/electrical/stroke/**.svg', {
  eager: true,
  as: 'raw'
});
const electrical_register_config: any = [];
for (const key in electrical_modules_files) {
  //根据路径获取svg文件名
  const name = key.split('/').pop()!.split('.')[0];
  electrical_register_config.push({
    id: name,
    title: name,
    type: 'svg',
    thumbnail: 'data:image/svg+xml;utf8,' + encodeURIComponent(electrical_modules_files[key]),
    svg: electrical_modules_files[key],
    props: {
      fill: {
        type: 'color',
        val: '#FF0000',
        title: '填充色'
      }
    }
  });
}
for (const key in electrical_stroke_modules_files) {
  //根据路径获取svg文件名
  const name = key.split('/').pop()!.split('.')[0];
  electrical_register_config.push({
    id: name,
    title: name,
    type: 'svg',
    thumbnail:
      'data:image/svg+xml;utf8,' + encodeURIComponent(electrical_stroke_modules_files[key]),
    svg: electrical_stroke_modules_files[key],
    props: {
      stroke: {
        type: 'color',
        val: '#00ff00',
        title: '边框色'
      }
    }
  });
}
leftAsideStore.registerConfig('电气符号', electrical_register_config);
leftAsideStore.registerConfig('开发测试用', [
  {
    id: 'demo',
    title: '演示svg文件',
    type: 'svg',
    thumbnail: '/svgs/demo.svg',
    svg: demo,
    props: {
      fill: {
        type: 'color',
        val: '#FF0000',
        title: '填充色'
      }
    }
  },
  {
    id: 'my-button',
    title: '我的按钮',
    type: 'vue',
    thumbnail: '/svgs/my-button.svg',
    props: {
      text: {
        type: 'input',
        val: '按钮',
        title: '文本'
      },
      bgColor: {
        type: 'color',
        val: '#44B6E7',
        title: '背景色'
      },
      fontFamily: {
        title: '字体',
        type: 'select',
        val: '黑体',
        options: [
          {
            value: '黑体',
            label: '黑体'
          },
          {
            value: '宋体',
            label: '宋体'
          }
        ]
      }
    }
  },
  {
    id: 'my-input',
    title: '我的输入框',
    type: 'vue',
    thumbnail: '/svgs/my-input.svg',
    props: {
      modelValue: {
        type: 'input',
        val: '输入框',
        title: '文本'
      }
    }
  },
  {
    id: 'custom-demo',
    title: '自定义svg',
    type: 'custom-svg',
    thumbnail: '/svgs/demo.svg',
    props: {
      circleFill: {
        type: 'color',
        val: '#FF0000',
        title: '圆颜色'
      },
      pathFill1: {
        type: 'color',
        val: '#00FF00',
        title: '线1颜色'
      },
      pathFill2: {
        type: 'color',
        val: '#0000FF',
        title: '线2颜色'
      },
      pathFill3: {
        type: 'color',
        val: '#FFFF00',
        title: '线3颜色'
      },
      showLine2: {
        type: 'switch',
        val: true,
        title: '显示线2'
      }
    }
  },
  {
    id: 'pie-charts',
    title: 'echarts饼图',
    type: 'vue',
    thumbnail: '/svgs/pie-charts.svg',
    props: {
      title: {
        title: '标题',
        type: 'input',
        val: '默认标题'
      },
      seriesName: {
        title: '详情',
        type: 'input',
        val: '详情标题'
      },
      seriesData: {
        title: '数据',
        type: 'jsonEdit',
        val: [
          {
            value: 1048,
            name: '办公楼A'
          },
          {
            value: 735,
            name: '办公楼B'
          },
          {
            value: 580,
            name: '保安室'
          },
          {
            value: 484,
            name: '地下车库'
          },
          {
            value: 300,
            name: '食堂'
          }
        ]
      }
    }
  }
]);
</script>

<template>
  <router-view></router-view>
</template>

<style scoped></style>
