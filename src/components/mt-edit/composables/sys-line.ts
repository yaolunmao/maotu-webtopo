import { nextTick } from 'vue';
import type { IDoneJson, IDoneJsonBinfo } from '../store/types';
import { getRectCenterCoordinate, getRectCoordinate, rotatePoint } from '../utils';

/**
 * 更新系统连线实际宽高
 * @param sys_lines
 * @param scale
 */
export const useUpdateSysLineRect = (
  sys_lines: IDoneJson[],
  canvasDom: HTMLElement,
  scale: number
) => {
  sys_lines.forEach((f) => {
    const itemRect = document.querySelector(`#${f.id} g .real`)!.getBoundingClientRect();
    const canvas_area_bounding_info = canvasDom!.getBoundingClientRect();
    const new_left = (itemRect?.left - canvas_area_bounding_info?.left) / scale;
    const new_top = (itemRect?.top - canvas_area_bounding_info?.top) / scale;
    const move_x = new_left - f.binfo.left;
    const move_y = new_top - f.binfo.top;
    f.binfo.left = new_left;
    f.binfo.top = new_top;
    f.binfo.width = itemRect?.width / scale;
    f.binfo.height = itemRect?.height / scale;
    f.props.point_position = {
      ...f.props.point_position,
      val: f.props.point_position.val.map((m: { x: number; y: number }) => {
        return {
          x: m.x - move_x,
          y: m.y - move_y
        };
      })
    };
  });
};
/**
 * 更新系统连线
 * @param sys_lines 要更新的连线列表
 * @param done_json 所有组件信息
 * @param canvasDom 画布dom
 * @param scale 画布缩放
 */
export const useUpdateSysLine = (
  sys_lines: IDoneJson[],
  done_json: IDoneJson[],
  canvasDom: HTMLElement,
  scale: number,
  move_binfo?: IDoneJsonBinfo & { id: string }
) => {
  const temp_done_json = [...done_json];
  sys_lines.forEach((f) => {
    if (!f.props.bind_anchors.val.start && !f.props.bind_anchors.val.end) {
      return;
    }
    const itemRect = document.querySelector(`#${f.id} g .real`)!.getBoundingClientRect();
    const canvas_area_bounding_info = canvasDom!.getBoundingClientRect();
    const new_left = (itemRect?.left - canvas_area_bounding_info?.left) / scale;
    const new_top = (itemRect?.top - canvas_area_bounding_info?.top) / scale;

    // 处理起点绑定
    if (f.props.bind_anchors.val.start) {
      // 根据id和类型找到锚点坐标
      const find_item = temp_done_json.find((m) => m.id === f.props.bind_anchors.val.start.id);
      if (find_item) {
        const b_info = find_item.id === move_binfo?.id ? move_binfo : find_item.binfo;
        // 四个角原始坐标
        const { topLeft, topRight, bottomLeft, bottomRight } = getRectCoordinate(b_info);
        // 四条边中点坐标
        const { topCenter, bottomCenter, leftCenter, rightCenter } = getRectCenterCoordinate(
          topLeft,
          topRight,
          bottomLeft,
          bottomRight
        );
        // 旋转中心
        const centerX = topCenter.x;
        const centerY = leftCenter.y;

        // 旋转角度（弧度）
        const angleRad = (Math.PI / 180) * find_item.binfo.angle;

        if (f.props.bind_anchors.val.start.type === 'tc') {
          const new_tc = rotatePoint(topCenter.x, topCenter.y, centerX, centerY, angleRad);
          f.props.point_position.val[0] = {
            x: new_tc.x - f.binfo.left,
            y: new_tc.y - f.binfo.top
          };
        } else if (f.props.bind_anchors.val.start.type === 'bc') {
          const new_bc = rotatePoint(bottomCenter.x, bottomCenter.y, centerX, centerY, angleRad);
          f.props.point_position.val[0] = {
            x: new_bc.x - f.binfo.left,
            y: new_bc.y - f.binfo.top
          };
        } else if (f.props.bind_anchors.val.start.type === 'lc') {
          const new_lc = rotatePoint(leftCenter.x, leftCenter.y, centerX, centerY, angleRad);
          f.props.point_position.val[0] = {
            x: new_lc.x - f.binfo.left,
            y: new_lc.y - f.binfo.top
          };
        } else if (f.props.bind_anchors.val.start.type === 'rc') {
          const new_rc = rotatePoint(rightCenter.x, rightCenter.y, centerX, centerY, angleRad);
          f.props.point_position.val[0] = {
            x: new_rc.x - f.binfo.left,
            y: new_rc.y - f.binfo.top
          };
        }
        const move_x = new_left - f.binfo.left;
        const move_y = new_top - f.binfo.top;
        f.binfo = {
          ...f.binfo,
          left: new_left,
          top: new_top,
          width: itemRect?.width / scale,
          height: itemRect?.height / scale
        };
        f.props.point_position = {
          ...f.props.point_position,
          val: f.props.point_position.val.map((m: { x: number; y: number }) => {
            return {
              x: m.x - move_x,
              y: m.y - move_y
            };
          })
        };
      } else {
        f.props.bind_anchors.val.start = null;
      }
    }
    // 处理终点绑定
    if (f.props.bind_anchors.val.end) {
      // 根据id和类型找到锚点坐标
      const find_item = temp_done_json.find((m) => m.id === f.props.bind_anchors.val.end.id);
      if (find_item) {
        const b_info = find_item.id === move_binfo?.id ? move_binfo : find_item.binfo;
        // 四个角原始坐标
        const { topLeft, topRight, bottomLeft, bottomRight } = getRectCoordinate(b_info);
        // 四条边中点坐标
        const { topCenter, bottomCenter, leftCenter, rightCenter } = getRectCenterCoordinate(
          topLeft,
          topRight,
          bottomLeft,
          bottomRight
        );
        // 旋转中心
        const centerX = topCenter.x;
        const centerY = leftCenter.y;

        // 旋转角度（弧度）
        const angleRad = (Math.PI / 180) * find_item.binfo.angle;

        if (f.props.bind_anchors.val.end.type === 'tc') {
          const new_tc = rotatePoint(topCenter.x, topCenter.y, centerX, centerY, angleRad);
          f.props.point_position.val[f.props.point_position.val.length - 1] = {
            x: new_tc.x - f.binfo.left,
            y: new_tc.y - f.binfo.top
          };
        } else if (f.props.bind_anchors.val.end.type === 'bc') {
          const new_bc = rotatePoint(bottomCenter.x, bottomCenter.y, centerX, centerY, angleRad);
          f.props.point_position.val[f.props.point_position.val.length - 1] = {
            x: new_bc.x - f.binfo.left,
            y: new_bc.y - f.binfo.top
          };
        } else if (f.props.bind_anchors.val.end.type === 'lc') {
          const new_lc = rotatePoint(leftCenter.x, leftCenter.y, centerX, centerY, angleRad);
          f.props.point_position.val[f.props.point_position.val.length - 1] = {
            x: new_lc.x - f.binfo.left,
            y: new_lc.y - f.binfo.top
          };
        } else if (f.props.bind_anchors.val.end.type === 'rc') {
          const new_rc = rotatePoint(rightCenter.x, rightCenter.y, centerX, centerY, angleRad);
          f.props.point_position.val[f.props.point_position.val.length - 1] = {
            x: new_rc.x - f.binfo.left,
            y: new_rc.y - f.binfo.top
          };
        }
        const move_x = new_left - f.binfo.left;
        const move_y = new_top - f.binfo.top;
        f.binfo = {
          ...f.binfo,
          left: new_left,
          top: new_top,
          width: itemRect?.width / scale,
          height: itemRect?.height / scale
        };
        f.props.point_position = {
          ...f.props.point_position,
          val: f.props.point_position.val.map((m: { x: number; y: number }) => {
            return {
              x: m.x - move_x,
              y: m.y - move_y
            };
          })
        };
      } else {
        f.props.bind_anchors.val.end = null;
      }
    }
  });
  // 直接写在这里会损失一部分性能 也可以注释掉下面的 然后根据需求在useUpdateSysLine之后手动调用useUpdateSysLineRect
  nextTick(() => {
    useUpdateSysLineRect(sys_lines, canvasDom, scale);
  });
};
