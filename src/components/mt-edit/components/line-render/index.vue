<template>
  <svg
    class="mt-line-render"
    :style="{
      position: 'absolute',
      left: `${-lineRenderProps.itemJson.binfo.left - offset}px`,
      top: `${-lineRenderProps.itemJson.binfo.top - offset}px`,
      width: `${lineRenderProps.canvasCfg.width + offset}px`,
      height: `${lineRenderProps.canvasCfg.height + offset}px`
    }"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    pointer-events="none"
  >
    <g>
      <defs>
        <marker
          :id="'markerArrowStart' + lineRenderProps.itemJson.id"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" :fill="lineRenderProps.itemJson.props.stroke.val" />
        </marker>
        <marker
          :id="'markerArrowEnd' + lineRenderProps.itemJson.id"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" :fill="lineRenderProps.itemJson.props.stroke.val" />
        </marker>
      </defs>

      <path
        :d="
          positionArrarToPath(
            lineRenderProps.itemJson.props.point_position.val,
            lineRenderProps.itemJson.binfo.left + offset,
            lineRenderProps.itemJson.binfo.top + offset
          )
        "
        pointer-events="visibleStroke"
        fill="none"
        :stroke="
          lineRenderProps.itemJson.props.ani_type.val === 'electricity'
            ? lineRenderProps.itemJson.props.ani_color.val
            : lineRenderProps.itemJson.props.stroke.val
        "
        :stroke-width="lineRenderProps.itemJson.props['stroke-width'].val"
        style="cursor: move"
        stroke-dashoffset="0"
        :stroke-dasharray="
          lineRenderProps.itemJson.props.ani_type.val === 'electricity'
            ? lineRenderProps.itemJson.props['stroke-width'].val * 3
            : 0
        "
        :marker-start="
          lineRenderProps.itemJson.props?.['marker-start']?.val
            ? `url(#markerArrowStart${lineRenderProps.itemJson.id})`
            : ''
        "
        :marker-end="
          lineRenderProps.itemJson.props?.['marker-end']?.val
            ? `url(#markerArrowEnd${lineRenderProps.itemJson.id})`
            : ''
        "
        class="real"
      >
        <animate
          v-if="lineRenderProps.itemJson.props.ani_type.val === 'electricity'"
          attributeName="stroke-dashoffset"
          :from="lineRenderProps.itemJson.props.ani_reverse.val ? 0 : 1000"
          :to="
            lineRenderProps.itemJson.props.ani_reverse.val
              ? lineRenderProps.itemJson.props.ani_play.val
                ? 1000
                : 0
              : lineRenderProps.itemJson.props.ani_play.val
              ? 0
              : 1000
          "
          :dur="`${
            lineRenderProps.itemJson.props.ani_dur.val < 1
              ? 1
              : lineRenderProps.itemJson.props.ani_dur.val
          }s`"
          repeatCount="indefinite"
        />
      </path>
      <!-- 电流状态不太好选中，所以放个透明的放下面 -->
      <path
        :d="
          positionArrarToPath(
            lineRenderProps.itemJson.props.point_position.val,
            lineRenderProps.itemJson.binfo.left + offset,
            lineRenderProps.itemJson.binfo.top + offset
          )
        "
        pointer-events="visibleStroke"
        fill="none"
        stroke="transparent"
        :stroke-width="lineRenderProps.itemJson.props['stroke-width'].val"
        style="cursor: move"
        stroke-dashoffset="0"
        :marker-start="
          lineRenderProps.itemJson.props?.['marker-start']?.val
            ? `url(#markerArrowStart${lineRenderProps.itemJson.id})`
            : ''
        "
        :marker-end="
          lineRenderProps.itemJson.props?.['marker-end']?.val
            ? `url(#markerArrowEnd${lineRenderProps.itemJson.id})`
            : ''
        "
      ></path>
      <!-- 水珠 -->
      <path
        v-if="lineRenderProps.itemJson.props.ani_type.val === 'waterdrop'"
        :d="
          positionArrarToPath(
            lineRenderProps.itemJson.props.point_position.val,
            lineRenderProps.itemJson.binfo.left + offset,
            lineRenderProps.itemJson.binfo.top + offset
          )
        "
        fill="none"
        fill-opacity="0"
        :stroke="lineRenderProps.itemJson.props.ani_color.val"
        :stroke-width="lineRenderProps.itemJson.props['stroke-width'].val"
        :stroke-dasharray="lineRenderProps.itemJson.props['stroke-width'].val * 3"
        stroke-dashoffset="0"
        stroke-linecap="round"
      >
        <animate
          attributeName="stroke-dashoffset"
          :from="lineRenderProps.itemJson.props.ani_reverse.val ? 0 : 1000"
          :to="
            lineRenderProps.itemJson.props.ani_reverse.val
              ? lineRenderProps.itemJson.props.ani_play.val
                ? 1000
                : 0
              : lineRenderProps.itemJson.props.ani_play.val
              ? 0
              : 1000
          "
          :dur="`${
            lineRenderProps.itemJson.props.ani_dur.val < 1
              ? 1
              : lineRenderProps.itemJson.props.ani_dur.val
          }s`"
          repeatCount="indefinite"
          fill="freeze"
        />
      </path>
      <!-- 轨迹 -->
      <circle
        v-else-if="lineRenderProps.itemJson.props.ani_type.val === 'track'"
        cx="0"
        cy="0"
        :r="lineRenderProps.itemJson.props['stroke-width'].val * 2"
        :fill="lineRenderProps.itemJson.props.ani_color.val"
      >
        <animateMotion
          :path="
            positionArrarToPath(
              lineRenderProps.itemJson.props.point_position.val,
              lineRenderProps.itemJson.binfo.left + offset,
              lineRenderProps.itemJson.binfo.top + offset
            )
          "
          :dur="`${
            lineRenderProps.itemJson.props.ani_dur.val < 1
              ? 1
              : lineRenderProps.itemJson.props.ani_dur.val
          }s`"
          repeatCount="indefinite"
        ></animateMotion>
      </circle>
      <g v-if="lineRenderProps.itemJson.active">
        <circle
          v-for="(item, index) in addPointPosition"
          :key="index"
          pointer-events="fill"
          :cx="item.x + lineRenderProps.itemJson.binfo.left + offset"
          :cy="item.y + lineRenderProps.itemJson.binfo.top + offset"
          r="4"
          stroke-width="2"
          :stroke="lineRenderProps.itemJson.props.stroke.val"
          fill="transparent"
          class="cursor-crosshair opacity-30"
          @mousedown="onMouseDown($event, index, 'add', item)"
          @touchstart.passive="onMouseDown($event, index, 'add', item)"
        />
      </g>
      <g v-if="lineRenderProps.itemJson.active">
        <circle
          v-for="(item, index) in lineRenderProps.itemJson.props.point_position.val"
          :key="index"
          pointer-events="fill"
          :id="`point-${lineRenderProps.itemJson.id}-${index}`"
          :cx="item.x + lineRenderProps.itemJson.binfo.left + offset"
          :cy="item.y + lineRenderProps.itemJson.binfo.top + offset"
          r="4"
          stroke-width="1"
          :stroke="lineRenderProps.itemJson.props.stroke.val"
          fill="#fff"
          :class="
            lineRenderProps.mode === 'line-edit' &&
            index !== 0 &&
            index !== lineRenderProps.itemJson.props.point_position.val.length - 1
              ? 'cursor-remove'
              : 'cursor-pointer'
          "
          @mousedown="onMouseDown($event, index, 'edit', item)"
          @touchstart.passive="onMouseDown($event, index, 'edit', item)"
        />
      </g>
    </g>
  </svg>
</template>
<script setup lang="ts">
import type { MouseTouchEvent } from '@/components/mt-dzr/utils/types';
import type { IDoneJson, IGlobalStoreCanvasCfg, IGlobalStoreGridCfg } from '../../store/types';
import {
  alignToGrid,
  getCenterXY,
  getRealityXY,
  getRectCenterCoordinate,
  getRectCoordinate,
  positionArrarToPath,
  rotatePoint
} from '@/components/mt-edit/utils';
import { computed, reactive, ref, watch } from 'vue';
import { configStore } from '../../store/config';
type LineRenderProps = {
  itemJson: IDoneJson;
  canvasCfg: IGlobalStoreCanvasCfg;
  grid: IGlobalStoreGridCfg;
  canvasDom: HTMLElement | null;
  doneJson: IDoneJson[];
  lockState: boolean;
  mode: 'normal' | 'line-edit';
};
const lineRenderProps = withDefaults(defineProps<LineRenderProps>(), {
  mode: 'normal'
});
const lineRenderEmits = defineEmits(['update:itemJson', 'setIntention', 'lineMouseUp']);
const offset = configStore.lineRenderOffset;
//如果网格关闭或者没有开启网格对齐，网格大小为1
const grid_align_size = computed(() =>
  !lineRenderProps.grid.align || !lineRenderProps.grid.enabled ? 1 : lineRenderProps.grid.size
);
const addPointPosition = ref();
const onMouseDown = (
  de: MouseTouchEvent,
  point_index: number,
  type: 'add' | 'edit',
  item: { x: number; y: number }
) => {
  if (lineRenderProps.lockState) {
    return;
  }

  de.stopPropagation();
  // 如果是编辑模式 并且不是第一个点或者不是最后一个点
  if (
    lineRenderProps.mode === 'line-edit' &&
    type == 'edit' &&
    point_index !== 0 &&
    point_index !== lineRenderProps.itemJson.props.point_position.val.length - 1
  ) {
    //删除该点
    const new_point_position = lineRenderProps.itemJson.props.point_position.val;
    new_point_position.splice(point_index, 1);
    lineRenderEmits('update:itemJson', {
      ...lineRenderProps.itemJson,
      props: {
        ...lineRenderProps.itemJson.props,
        point_position: {
          ...lineRenderProps.itemJson.props.point_position,
          val: new_point_position
        }
      }
    });
    return;
  }
  // 记录鼠标按下时实际点的坐标
  const { x: realityX, y: realityY } = item;
  // 记录最开始点击时鼠标位置
  const d_x = de instanceof MouseEvent ? de.clientX : de.touches[0].pageX;
  const d_y = de instanceof MouseEvent ? de.clientY : de.touches[0].pageY;
  let new_x = 0;
  let new_y = 0;
  let first_click = true;
  const onMouseMove = (e: MouseTouchEvent) => {
    // 记录鼠标移动的位置
    const m_x = e instanceof MouseEvent ? e.clientX : e.touches[0].pageX;
    const m_y = e instanceof MouseEvent ? e.clientY : e.touches[0].pageY;
    // 移动的距离
    const move_x = de.ctrlKey ? 0 : alignToGrid((m_x - d_x) / lineRenderProps.canvasCfg.scale, 1); //感觉对齐网格有点体验不好 所以固定为一了
    const move_y = de.shiftKey ? 0 : alignToGrid((m_y - d_y) / lineRenderProps.canvasCfg.scale, 1);
    new_x = realityX + move_x;
    new_y = realityY + move_y;
    if (type === 'add') {
      item.x = new_x;
      item.y = new_y;
      if (first_click) {
        const new_point_position = lineRenderProps.itemJson.props.point_position.val;
        new_point_position.splice(point_index + 1, 0, {
          x: new_x,
          y: new_y
        });
        lineRenderEmits('update:itemJson', {
          ...lineRenderProps.itemJson,
          props: {
            ...lineRenderProps.itemJson.props,
            point_position: {
              ...lineRenderProps.itemJson.props.point_position,
              val: new_point_position
            }
          }
        });
        first_click = false;
      } else {
        const new_point_position = lineRenderProps.itemJson.props.point_position.val;
        new_point_position[point_index + 1] = {
          x: new_x,
          y: new_y
        };
        lineRenderEmits('update:itemJson', {
          ...lineRenderProps.itemJson,
          props: {
            ...lineRenderProps.itemJson.props,
            point_position: {
              ...lineRenderProps.itemJson.props.point_position,
              val: new_point_position
            }
          }
        });
      }
    }
    if (type === 'edit') {
      const new_point_position = lineRenderProps.itemJson.props.point_position.val;
      if (point_index === 0) {
        lineRenderEmits('setIntention', 'adsorbStart');
        if (lineRenderProps.mode === 'line-edit') {
          if (first_click) {
            const new_point_position = lineRenderProps.itemJson.props.point_position.val;
            new_point_position.unshift({
              x: new_x,
              y: new_y
            });
            lineRenderEmits('update:itemJson', {
              ...lineRenderProps.itemJson,
              props: {
                ...lineRenderProps.itemJson.props,
                point_position: {
                  ...lineRenderProps.itemJson.props.point_position,
                  val: new_point_position
                }
              }
            });
            first_click = false;
            return;
          }
        }
      } else if (point_index === new_point_position.length - 1) {
        lineRenderEmits('setIntention', 'adsorbEnd');
        if (lineRenderProps.mode === 'line-edit') {
          if (first_click) {
            const new_point_position = lineRenderProps.itemJson.props.point_position.val;
            new_point_position.push({
              x: new_x,
              y: new_y
            });
            lineRenderEmits('update:itemJson', {
              ...lineRenderProps.itemJson,
              props: {
                ...lineRenderProps.itemJson.props,
                point_position: {
                  ...lineRenderProps.itemJson.props.point_position,
                  val: new_point_position
                }
              }
            });
            point_index += 1;
            first_click = false;
            return;
          }
        }
      }
      new_point_position[point_index].x = new_x;
      new_point_position[point_index].y = new_y;
      lineRenderEmits('update:itemJson', {
        ...lineRenderProps.itemJson,
        props: {
          ...lineRenderProps.itemJson.props,
          point_position: {
            ...lineRenderProps.itemJson.props.point_position,
            val: new_point_position
          }
        }
      });
    }
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    document.removeEventListener('touchmove', onMouseMove);
    document.removeEventListener('touchend', onMouseUp);
    const itemRect = document
      .querySelector(`#${lineRenderProps.itemJson.id} g .real`)!
      .getBoundingClientRect();
    const canvas_area_bounding_info = lineRenderProps.canvasDom!.getBoundingClientRect();
    const new_left =
      (itemRect?.left - canvas_area_bounding_info?.left) / lineRenderProps.canvasCfg.scale;
    const new_top =
      (itemRect?.top - canvas_area_bounding_info?.top) / lineRenderProps.canvasCfg.scale;
    const move_x = new_left - lineRenderProps.itemJson.binfo.left;
    const move_y = new_top - lineRenderProps.itemJson.binfo.top;
    lineRenderEmits('setIntention', 'none');
    lineRenderEmits('update:itemJson', {
      ...lineRenderProps.itemJson,
      binfo: {
        ...lineRenderProps.itemJson.binfo,
        left: new_left,
        top: new_top,
        width: itemRect?.width / lineRenderProps.canvasCfg.scale,
        height: itemRect?.height / lineRenderProps.canvasCfg.scale
      },
      props: {
        ...lineRenderProps.itemJson.props,
        point_position: {
          ...lineRenderProps.itemJson.props.point_position,
          val: lineRenderProps.itemJson.props.point_position.val.map(
            (m: { x: number; y: number }) => {
              return {
                x: m.x - move_x,
                y: m.y - move_y
              };
            }
          )
        }
      }
    });
  };
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
  document.addEventListener('touchmove', onMouseMove);
  document.addEventListener('touchend', onMouseUp);
  lineRenderEmits('lineMouseUp');
};
const getCenterPositions = (point_position: { x: number; y: number }[]) => {
  const res: { x: number; y: number }[] = [];
  //根据当前点坐标计算每两点的中点坐标
  point_position.forEach((item, index) => {
    if (index === point_position.length - 1) {
      return;
    }
    const center_xy = getCenterXY(
      item.x,
      item.y,
      point_position[index + 1].x,
      point_position[index + 1].y
    );
    res.push(center_xy);
  });
  return res;
};
watch(
  () => lineRenderProps.itemJson.props.point_position.val,
  (new_val: { x: number; y: number }[]) => {
    addPointPosition.value = getCenterPositions(new_val);
  },
  {
    immediate: true,
    deep: true
  }
);
// watch(
//   () => lineRenderProps.doneJson,
//   (new_val) => {
//     const temp_item_json = lineRenderProps.itemJson;
//     // 处理起点绑定
//     if (lineRenderProps.itemJson.props.bind_anchors.val.start) {
//       // 根据id和类型找到锚点坐标
//       const find_item = new_val.find(
//         (m) => m.id === lineRenderProps.itemJson.props.bind_anchors.val.start.id
//       );
//       if (find_item) {
//         // 四个角原始坐标
//         const { topLeft, topRight, bottomLeft, bottomRight } = getRectCoordinate(find_item);
//         // 四条边中点坐标
//         const { topCenter, bottomCenter, leftCenter, rightCenter } = getRectCenterCoordinate(
//           topLeft,
//           topRight,
//           bottomLeft,
//           bottomRight
//         );
//         // 旋转中心
//         const centerX = topCenter.x;
//         const centerY = leftCenter.y;

//         // 旋转角度（弧度）
//         const angleRad = (Math.PI / 180) * find_item.binfo.angle;
//         if (lineRenderProps.itemJson.props.bind_anchors.val.start.type === 'tc') {
//           const new_tc = rotatePoint(topCenter.x, topCenter.y, centerX, centerY, angleRad);
//           temp_item_json.props.point_position.val[0] = {
//             x: new_tc.x - lineRenderProps.itemJson.binfo.left,
//             y: new_tc.y - lineRenderProps.itemJson.binfo.top
//           };
//         } else if (lineRenderProps.itemJson.props.bind_anchors.val.start.type === 'bc') {
//           const new_bc = rotatePoint(bottomCenter.x, bottomCenter.y, centerX, centerY, angleRad);
//           temp_item_json.props.point_position.val[0] = {
//             x: new_bc.x - lineRenderProps.itemJson.binfo.left,
//             y: new_bc.y - lineRenderProps.itemJson.binfo.top
//           };
//         }
//       } else {
//         temp_item_json.props.bind_anchors.val.start = null;
//       }
//       lineRenderEmits('update:itemJson', temp_item_json);
//     }
//   }
// );
</script>
<style scoped>
.cursor-remove {
  cursor: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPgoJPGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS1kYXNoYXJyYXk9IjIyIiBzdHJva2UtZGFzaG9mZnNldD0iMjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIj4KCQk8cGF0aCBkPSJNMTkgNUw1IDE5Ij48YW5pbWF0ZSBmaWxsPSJmcmVlemUiIGF0dHJpYnV0ZU5hbWU9InN0cm9rZS1kYXNob2Zmc2V0IiBiZWdpbj0iMC4zcyIgZHVyPSIwLjNzIiB2YWx1ZXM9IjIyOzAiLz48L3BhdGg+CgkJPHBhdGggZD0iTTUgNUwxOSAxOSI+PGFuaW1hdGUgZmlsbD0iZnJlZXplIiBhdHRyaWJ1dGVOYW1lPSJzdHJva2UtZGFzaG9mZnNldCIgZHVyPSIwLjNzIiB2YWx1ZXM9IjIyOzAiLz48L3BhdGg+Cgk8L2c+Cjwvc3ZnPg==),
    auto;
}
</style>
