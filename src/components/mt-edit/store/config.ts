import { reactive } from 'vue';
import type { IConfig, ILeftAsideConfigItem } from './types';
const sysComponentItems: ILeftAsideConfigItem[] = [
  {
    id: 'sys-line',
    title: '自由连线',
    type: 'sys-line',
    thumbnail: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTQgMThhMiAyIDAgMSAwIDQgMGEyIDIgMCAxIDAtNCAwTTE2IDZhMiAyIDAgMSAwIDQgMGEyIDIgMCAxIDAtNCAwTTcuNSAxNi41bDktOSIvPjwvc3ZnPg==`,
    props: {
      stroke: {
        title: '线条颜色',
        type: 'color',
        val: '#ff0000'
      },
      'stroke-width': {
        title: '线条宽度',
        type: 'number',
        val: 2
      },
      'marker-start': {
        title: '起点箭头',
        type: 'switch',
        val: false
      },
      'marker-end': {
        title: '终点箭头',
        type: 'switch',
        val: true
      },
      point_position: {
        title: '点坐标',
        type: 'jsonEdit',
        val: [
          {
            x: 0,
            y: 0
          },
          {
            x: 100,
            y: 0
          }
        ],
        disabled: true
      },
      ani_type: {
        title: '动画类型',
        type: 'select',
        val: 'none',
        options: [
          {
            label: '无',
            value: 'none'
          },
          {
            label: '电流',
            value: 'electricity'
          },
          {
            label: '轨迹',
            value: 'track'
          },
          {
            label: '水珠',
            value: 'waterdrop'
          }
        ]
      },
      ani_dur: { title: '持续时间', type: 'number', val: 20 },
      ani_color: { title: '动画颜色', type: 'color', val: '#0a7ae2' },
      ani_reverse: { title: '动画反转', type: 'switch', val: false },
      ani_play: { title: '动画播放', type: 'switch', val: true },
      bind_anchors: {
        title: '锚点绑定',
        type: 'jsonEdit',
        val: {
          start: null,
          end: null
        },
        disabled: true
      }
    },
    common_animations: {
      val: '',
      delay: 'delay-0s',
      speed: 'slow',
      repeat: 'infinite'
    }
  },
  {
    id: 'sys-line-vertical',
    title: '自由连线-竖线',
    type: 'sys-line',
    thumbnail: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTQgMThhMiAyIDAgMSAwIDQgMGEyIDIgMCAxIDAtNCAwTTE2IDZhMiAyIDAgMSAwIDQgMGEyIDIgMCAxIDAtNCAwTTcuNSAxNi41bDktOSIvPjwvc3ZnPg==`,
    props: {
      stroke: {
        title: '线条颜色',
        type: 'color',
        val: '#ff0000'
      },
      'stroke-width': {
        title: '线条宽度',
        type: 'number',
        val: 2
      },
      'marker-start': {
        title: '起点箭头',
        type: 'switch',
        val: false
      },
      'marker-end': {
        title: '终点箭头',
        type: 'switch',
        val: true
      },
      point_position: {
        title: '点坐标',
        type: 'jsonEdit',
        val: [
          {
            x: 0,
            y: 0
          },
          {
            x: 0,
            y: 100
          }
        ],
        disabled: true
      },
      ani_type: {
        title: '动画类型',
        type: 'select',
        val: 'none',
        options: [
          {
            label: '无',
            value: 'none'
          },
          {
            label: '电流',
            value: 'electricity'
          },
          {
            label: '轨迹',
            value: 'track'
          },
          {
            label: '水珠',
            value: 'waterdrop'
          }
        ]
      },
      ani_dur: { title: '持续时间', type: 'number', val: 20 },
      ani_color: { title: '动画颜色', type: 'color', val: '#0a7ae2' },
      ani_reverse: { title: '动画反转', type: 'switch', val: false },
      ani_play: { title: '动画播放', type: 'switch', val: true },
      bind_anchors: {
        title: '锚点绑定',
        type: 'jsonEdit',
        val: {
          start: null,
          end: null
        },
        disabled: true
      }
    },
    common_animations: {
      val: '',
      delay: 'delay-0s',
      speed: 'slow',
      repeat: 'infinite'
    }
  },
  {
    id: 'text-vue',
    title: '文字',
    type: 'vue',
    thumbnail: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIzMiIgZD0ibTMyIDQxNS41bDEyMC0zMjBsMTIwIDMyMG0tNDItMTEySDc0bTI1Mi02NGMxMi4xOS0yOC42OSA0MS00OCA3NC00OGgwYzQ2IDAgODAgMzIgODAgODB2MTQ0Ii8+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIzMiIgZD0iTTMyMCAzNTguNWMwIDM2IDI2Ljg2IDU4IDYwIDU4YzU0IDAgMTAwLTI3IDEwMC0xMDZ2LTE1Yy0yMCAwLTU4IDEtOTIgNWMtMzIuNzcgMy44Ni02OCAxOS02OCA1OCIvPjwvc3ZnPg==`,
    props: {
      text: {
        title: '文字内容',
        type: 'input',
        val: '文字'
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
      },
      fontSize: {
        title: '文字大小',
        type: 'number',
        val: 18
      },
      fill: {
        title: '文字颜色',
        type: 'color',
        val: '#FFF700'
      },
      vertical: {
        title: '竖排展示',
        type: 'switch',
        val: false
      }
    },
    common_animations: {
      val: '',
      delay: 'delay-0s',
      speed: 'slow',
      repeat: 'infinite'
    }
  },
  {
    id: 'card-vue',
    title: '卡片',
    type: 'vue',
    thumbnail: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMTYgMTYiPjxnIGZpbGw9ImN1cnJlbnRDb2xvciI+PHBhdGggZD0iTTE0LjUgM2EuNS41IDAgMCAxIC41LjV2OWEuNS41IDAgMCAxLS41LjVoLTEzYS41LjUgMCAwIDEtLjUtLjV2LTlhLjUuNSAwIDAgMSAuNS0uNXptLTEzLTFBMS41IDEuNSAwIDAgMCAwIDMuNXY5QTEuNSAxLjUgMCAwIDAgMS41IDE0aDEzYTEuNSAxLjUgMCAwIDAgMS41LTEuNXYtOUExLjUgMS41IDAgMCAwIDE0LjUgMnoiLz48cGF0aCBkPSJNMyA1LjVhLjUuNSAwIDAgMSAuNS0uNWg5YS41LjUgMCAwIDEgMCAxaC05YS41LjUgMCAwIDEtLjUtLjVNMyA4YS41LjUgMCAwIDEgLjUtLjVoOWEuNS41IDAgMCAxIDAgMWgtOUEuNS41IDAgMCAxIDMgOG0wIDIuNWEuNS41IDAgMCAxIC41LS41aDZhLjUuNSAwIDAgMSAwIDFoLTZhLjUuNSAwIDAgMS0uNS0uNSIvPjwvZz48L3N2Zz4=`,
    props: {
      shadow: {
        title: '阴影显示时机',
        type: 'select',
        val: 'always',
        options: [
          { label: '总是显示', value: 'always' },
          { label: '鼠标悬浮', value: 'hover' },
          { label: '不显示', value: 'never' }
        ]
      },
      backGroundColor: {
        title: '背景颜色',
        type: 'color',
        val: '#ffffff'
      },
      boxShadow: {
        title: '阴影颜色',
        type: 'color',
        val: '#ffffff'
      }
    },
    common_animations: {
      val: '',
      delay: 'delay-0s',
      speed: 'slow',
      repeat: 'infinite'
    }
  },
  {
    id: 'now-time-vue',
    title: '当前时间',
    type: 'vue',
    thumbnail: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLXdpZHRoPSIzMiIgZD0iTTI1NiA2NEMxNTAgNjQgNjQgMTUwIDY0IDI1NnM4NiAxOTIgMTkyIDE5MnMxOTItODYgMTkyLTE5MlMzNjIgNjQgMjU2IDY0WiIvPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMzIiIGQ9Ik0yNTYgMTI4djE0NGg5NiIvPjwvc3ZnPg==`,
    props: {
      fontColor: {
        title: '文字颜色',
        type: 'color',
        val: '#000000'
      },
      dateSize: {
        title: '日期文字大小',
        type: 'number',
        val: 12
      },
      weekSize: {
        title: '星期文字大小',
        type: 'number',
        val: 12
      },
      timeSize: {
        title: '时间文字大小',
        type: 'number',
        val: 24
      }
    },
    common_animations: {
      val: '',
      delay: 'delay-0s',
      speed: 'slow',
      repeat: 'infinite'
    }
  },
  {
    id: 'kv-vue',
    title: '键值对',
    type: 'vue',
    thumbnail: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjAgMjAiPjxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZD0iTTMgNmEzIDMgMCAwIDEgMy0zaDhhMyAzIDAgMCAxIDMgM3Y4YTMgMyAwIDAgMS0zIDNINmEzIDMgMCAwIDEtMy0zem0zLTJhMiAyIDAgMCAwLTIgMnYzLjVoNS41VjR6bTMuNSA2LjVINFYxNGEyIDIgMCAwIDAgMiAyaDMuNXptMSAwVjE2SDE0YTIgMiAwIDAgMCAyLTJ2LTMuNXptNS41LTFWNmEyIDIgMCAwIDAtMi0yaC0zLjV2NS41eiIvPjwvc3ZnPg==`,
    props: {
      border: {
        title: '边框',
        type: 'switch',
        val: true
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
      },
      fontSize: {
        title: '文字大小',
        type: 'number',
        val: 18
      },
      label: {
        title: '键名',
        type: 'input',
        val: '键名'
      },
      labelWidth: {
        title: '键名宽度',
        type: 'number',
        val: 50
      },
      value: {
        title: '键值',
        type: 'input',
        val: '键值'
      },
      valueWidth: {
        title: '键值宽度',
        type: 'number',
        val: 50
      },
      color: {
        title: '文字颜色',
        type: 'color',
        val: '#FFF700'
      },
      borderColor: {
        title: '边框颜色',
        type: 'color',
        val: '#000000'
      }
    },
    common_animations: {
      val: '',
      delay: 'delay-0s',
      speed: 'slow',
      repeat: 'infinite'
    }
  },
  {
    id: 'sys-button-vue',
    title: '按钮',
    type: 'vue',
    thumbnail: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0yIDhhMyAzIDAgMCAxIDMtM2gxMGEzIDMgMCAwIDEgMyAzdjNhMyAzIDAgMCAxLTMgM0g1YTMgMyAwIDAgMS0zLTNWOFptNyAxLjVhLjUuNSAwIDAgMCAuNS41SDE0YS41LjUgMCAwIDAgMC0xSDkuNWEuNS41IDAgMCAwLS41LjVabS0xIDBhMS41IDEuNSAwIDEgMC0zIDBhMS41IDEuNSAwIDAgMCAzIDBaIi8+PC9zdmc+`,
    props: {
      text: {
        title: '按钮文本',
        type: 'input',
        val: '按钮文本'
      },
      type: {
        title: '按钮类型',
        type: 'select',
        val: '',
        options: [
          {
            value: '',
            label: '默认'
          },
          {
            value: 'primary',
            label: '主要'
          },
          {
            value: 'success',
            label: '成功'
          },
          {
            value: 'warning',
            label: '警告'
          },
          {
            value: 'danger',
            label: '危险'
          }
        ]
      },
      round: {
        title: '圆角',
        type: 'switch',
        val: false
      }
    },
    common_animations: {
      val: '',
      delay: 'delay-0s',
      speed: 'slow',
      repeat: 'infinite'
    }
  }
];
export const configStore: IConfig = reactive({
  sysComponent: sysComponentItems,
  lineRenderOffset: 10
});
