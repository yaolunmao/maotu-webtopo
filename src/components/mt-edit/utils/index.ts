import type { MoveItemBoundingInfo } from '../components/render-core/types';
import type {
  CacheBoundingBox,
  IDoneJson,
  IDoneJsonBinfo,
  ILeftAsideConfigItemPublicProps
} from '../store/types';
import { useUpdateSysLine } from '@/components/mt-edit/composables/sys-line';
export const createGroupInfo = (
  selected_items: IDoneJson[],
  canvas_dom: HTMLElement,
  scale_ratio: number
): IDoneJson => {
  //定义组合后的组件信息
  let min_left = Infinity;
  let min_top = Infinity;
  let max_left = -Infinity;
  let max_top = -Infinity;
  //获取画布的信息
  const canvas_dom_rect = canvas_dom.getBoundingClientRect();
  selected_items.forEach((item) => {
    // 获取旋转后left和top
    const itemRect = document.getElementById(item.id!)!.getBoundingClientRect();
    // 最小left
    min_left = Math.min(min_left, (itemRect.left - canvas_dom_rect.left) / scale_ratio);
    // 最大left
    max_left = Math.max(max_left, (itemRect.right - canvas_dom_rect.left) / scale_ratio);
    // 最小top
    min_top = Math.min(min_top, (itemRect.top - canvas_dom_rect.top) / scale_ratio);
    // 最大top
    max_top = Math.max(max_top, (itemRect.bottom - canvas_dom_rect.top) / scale_ratio);
  });
  //定义组合元素的边界信息
  const group_binfo = {
    left: min_left,
    top: min_top,
    width: max_left - min_left,
    height: max_top - min_top,
    angle: 0
  };
  // 计算子元素相对父元素的位置
  selected_items.forEach((item) => {
    item.binfo.left = item.binfo.left! - min_left;
    item.binfo.top = item.binfo.top! - min_top;
    item.binfo = {
      width: 100 * (item.binfo.width / group_binfo.width),
      height: 100 * (item.binfo.height / group_binfo.height),
      left: 100 * (item.binfo.left / group_binfo.width),
      top: 100 * (item.binfo.top / group_binfo.height),
      angle: item.binfo.angle || 0
    };
    item.active = false;
  });

  // 组合组件信息
  return {
    id: 'group-' + randomString(),
    title: '组合',
    type: 'group',
    binfo: group_binfo,
    resize: true,
    rotate: true,
    lock: false,
    active: true,
    hide: false,
    use_proportional_scaling: true,
    props: {},
    common_animations: {
      val: '',
      delay: 'delay-0s',
      speed: 'slow',
      repeat: 'infinite'
    },
    children: [...selected_items],
    events: [],
    tag: 'group'
  };
};
/**
 * 取消组合
 * @param elements 元素列表
 * @param editorRect 画布react信息
 * @returns 拆分后的列表
 */
export const cancelGroup = (
  selected_item: IDoneJson,
  canvas_dom: HTMLElement,
  scale_ratio: number,
  grid_align_size: number
) => {
  //获取画布的信息
  const canvas_dom_rect = canvas_dom.getBoundingClientRect();
  // 获取组合元素的子元素列表
  const split_items = selected_item.children!.map((item) => {
    // 子组件相对于浏览器视口位置大小
    const itemRect = document.getElementById(item.id!)!.getBoundingClientRect();
    // 获取元素的中心点坐标
    const center = {
      x: itemRect.left - canvas_dom_rect.left + itemRect.width / 2,
      y: itemRect.top - canvas_dom_rect.top + itemRect.height / 2
    };
    // 拆分后的宽高
    const width = alignToGrid(
      selected_item.binfo.width * (item.binfo.width / 100),
      grid_align_size
    );
    const height = alignToGrid(
      selected_item.binfo.height * (item.binfo.height / 100),
      grid_align_size
    );
    // 根据拆分后的宽高计算边界信息
    const binfo = {
      width,
      height,
      left: center.x / scale_ratio - width / 2,
      top: center.y / scale_ratio - height / 2,
      angle: (item.binfo.angle || 0) + (selected_item.binfo.angle || 0)
    };
    //让拆分后的图形处于选中状态
    return {
      ...item,
      active: true,
      binfo
    };
  });
  return split_items;
};
export const svgToSymbol = (svgStr: string, id: string) => {
  const svgDocument = new DOMParser().parseFromString(svgStr, 'image/svg+xml').children[0];
  let width = '0';
  let height = '0';
  const viewBox = svgDocument.getAttribute('viewBox');
  const symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
  if (viewBox) {
    const [, , w, h] = viewBox.split(' ');
    symbol.setAttributeNS(null, 'viewBox', viewBox);
    width = w;
    height = h;
  } else {
    width = svgDocument.getAttribute('width') || '0';
    height = svgDocument.getAttribute('height') || '0';
    symbol.setAttributeNS(null, 'viewBox', '0 0 ' + width + ' ' + height);
  }
  symbol.setAttributeNS(null, 'id', id);
  symbol.innerHTML = svgDocument.innerHTML
    .replaceAll('stroke:currentColor', '')
    .replaceAll('stroke: currentColor', '')
    .replaceAll('stroke="currentColor"', '');
  return { symbol_str: symbol.outerHTML, width, height };
};
export const symbolGenSvg = (
  symbol_id: string,
  symbol_str: string,
  width: string,
  height: string,
  props_str: string
) => {
  return `<svg
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  version="1.1"
  width="${width}"
  height="${height}"
>
  ${symbol_str}
  <use
  xlink:href="#${symbol_id}"
  ${props_str}
  x="0"
  y="0"
></use>
</svg>
`;
};
export const svgToImgSrc = (svgStr: string) => {
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svgStr);
};
/**
 * 生成dom可用的属性字符串
 * @param props
 * @returns
 */
export const genDomPropstr = (props: ILeftAsideConfigItemPublicProps) => {
  let res = '';
  for (const key in props) {
    res += ` ${key}="${props[key].val}"`;
  }
  return res;
};
/**
 * 生成随机字符串
 * @param len 生成个数
 */
export const randomString = (len?: number) => {
  len = len || 10;
  const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const maxPos = str.length;
  let random_str = '';
  for (let i = 0; i < len; i++) {
    random_str += str.charAt(Math.floor(Math.random() * maxPos));
  }
  return random_str;
};
function isTouchEvent(val: unknown): val is TouchEvent {
  const typeStr = Object.prototype.toString.call(val);
  return typeStr.substring(8, typeStr.length - 1) === 'TouchEvent';
}
/**
 * 获取当前点击坐标 根据pc端和移动端获取
 * @param e
 * @returns
 */
export function getRealityXY(
  e: DragEvent | TouchEvent | MouseEvent,
  canvas_dom_rect: DOMRect | undefined
) {
  let realityX = 0,
    realityY = 0;
  if (isTouchEvent(e)) {
    const touch = e.targetTouches[0];
    realityX = canvas_dom_rect ? touch.pageX - canvas_dom_rect.x : 0;
    realityY = canvas_dom_rect ? touch.pageY - canvas_dom_rect.y : 0;
  } else {
    realityX = canvas_dom_rect ? e.clientX - canvas_dom_rect.x : e.clientX;
    realityY = canvas_dom_rect ? e.clientY - canvas_dom_rect.y : e.clientY;
  }

  return { realityX, realityY };
}
export const blobToBase64 = (file: Blob) => {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader();
    let img_src: string | ArrayBuffer = '';
    reader.readAsDataURL(file);
    reader.onload = function () {
      img_src = reader.result ?? '';
    };
    reader.onerror = function (error) {
      reject(error);
    };
    reader.onloadend = function () {
      resolve(img_src);
    };
  });
};
/**
 * 根据坐标对齐到网格
 * @param position 当前坐标
 * @param grid 网格大小
 * @returns 对应网格的坐标
 */
export const alignToGrid = (position: number, grid = 1) => {
  const integerPart = Math.floor(position / grid);
  const fractionalPart = position % grid;

  if (fractionalPart >= grid / 2) {
    return (integerPart + 1) * grid;
  } else {
    return integerPart * grid;
  }
};
/**
 * json对象深拷贝
 * @param object
 * @param default_val
 * @returns
 */
export const objectDeepClone = <T>(object: object, default_val: any = {}) => {
  if (!object) {
    return default_val as T;
  }
  return JSON.parse(JSON.stringify(object)) as T;
};
export const prosToVBind = (item: ILeftAsideConfigItemPublicProps) => {
  let temp = {};
  for (const key in item) {
    temp = { ...temp, ...{ [key]: item[key].val } };
  }
  return temp;
};
/**
 * 计算y轴参考线属性和需要吸附的偏移距离
 * @param cacheStore_boundingBox
 * @param adsorp_diff
 * @param move_item_bounding_info
 */
export const calculateGuideY = (
  cacheStore_boundingBox: CacheBoundingBox[],
  adsorp_diff: number,
  move_item_bounding_info: MoveItemBoundingInfo[],
  canvas_bounding_info: DOMRect,
  scale: number
) => {
  for (let index = 0; index < move_item_bounding_info.length; index++) {
    // 拿到移动时的边界信息
    const { left, right, width } = move_item_bounding_info[index];
    // 左左 左中 左右
    const ll = cacheStore_boundingBox.find((f) => Math.abs(f.left - left) < adsorp_diff);
    const lc = cacheStore_boundingBox.find(
      (f) => Math.abs(f.left - (left + width / 2)) < adsorp_diff
    );
    const lr = cacheStore_boundingBox.find((f) => Math.abs(f.left - right) < adsorp_diff);
    // 中左 中中 中右
    const cl = cacheStore_boundingBox.find(
      (f) => Math.abs(f.left + f.width / 2 - left) < adsorp_diff
    );
    const cc = cacheStore_boundingBox.find(
      (f) => Math.abs(f.left + f.width / 2 - (left + width / 2)) < adsorp_diff
    );
    const cr = cacheStore_boundingBox.find(
      (f) => Math.abs(f.left + f.width / 2 - right) < adsorp_diff
    );
    // 右左 右中 右右
    const rr = cacheStore_boundingBox.find((f) => Math.abs(f.right - right) < adsorp_diff);
    const rc = cacheStore_boundingBox.find(
      (f) => Math.abs(f.right - (left + width / 2)) < adsorp_diff
    );
    const rl = cacheStore_boundingBox.find((f) => Math.abs(f.right - left) < adsorp_diff);
    if (ll) {
      return {
        y_info: {
          display: true,
          left: (ll.left - canvas_bounding_info.left) / scale
        },
        move_x: ll.left - left
      };
    } else if (lc) {
      return {
        y_info: {
          display: true,
          left: (lc.left - canvas_bounding_info.left) / scale
        },
        move_x: lc.left - (left + width / 2)
      };
    } else if (lr) {
      return {
        y_info: {
          display: true,
          left: (lr.left - canvas_bounding_info.left) / scale
        },
        move_x: lr.left - right
      };
    } else if (cl) {
      return {
        y_info: {
          display: true,
          left: (cl.left + cl.width / 2 - canvas_bounding_info.left) / scale
        },
        move_x: cl.left + cl.width / 2 - left
      };
    } else if (cc) {
      return {
        y_info: {
          display: true,
          left: (cc.left + cc.width / 2 - canvas_bounding_info.left) / scale
        },
        move_x: cc.left + cc.width / 2 - (left + width / 2)
      };
    } else if (cr) {
      return {
        y_info: {
          display: true,
          left: (cr.left + cr.width / 2 - canvas_bounding_info.left) / scale
        },
        move_x: cr.left + cr.width / 2 - right
      };
    } else if (rl) {
      return {
        y_info: {
          display: true,
          left: (rl.right - canvas_bounding_info.left) / scale
        },
        move_x: rl.right - left
      };
    } else if (rc) {
      return {
        y_info: {
          display: true,
          left: (rc.right - canvas_bounding_info.left) / scale
        },
        move_x: rc.right - (left + width / 2)
      };
    } else if (rr) {
      return {
        y_info: {
          display: true,
          left: (rr.right - canvas_bounding_info.left) / scale
        },
        move_x: rr.right - right
      };
    }
  }
  return {
    y_info: {
      display: false,
      left: 0
    },
    move_x: 0
  };
};
/**
 * 计算x轴参考线属性和需要吸附的偏移距离
 * @param cacheStore_boundingBox
 * @param adsorp_diff
 * @param move_item_bounding_info
 */
export const calculateGuideX = (
  cacheStore_boundingBox: CacheBoundingBox[],
  adsorp_diff: number,
  move_item_bounding_info: MoveItemBoundingInfo[],
  canvas_bounding_info: DOMRect,
  scale: number
) => {
  for (let index = 0; index < move_item_bounding_info.length; index++) {
    // 拿到移动时的边界信息
    const { top, bottom, height } = move_item_bounding_info[index];
    // 上上 上中 上下
    const tt = cacheStore_boundingBox.find((f) => Math.abs(f.top - top) < adsorp_diff);
    const tc = cacheStore_boundingBox.find(
      (f) => Math.abs(f.top - (top + height / 2)) < adsorp_diff
    );
    const tb = cacheStore_boundingBox.find((f) => Math.abs(f.top - bottom) < adsorp_diff);
    // 中上 中中 中下
    const ct = cacheStore_boundingBox.find(
      (f) => Math.abs(f.top + f.height / 2 - top) < adsorp_diff
    );
    const cc = cacheStore_boundingBox.find(
      (f) => Math.abs(f.top + f.height / 2 - (top + height / 2)) < adsorp_diff
    );
    const cb = cacheStore_boundingBox.find(
      (f) => Math.abs(f.top + f.height / 2 - bottom) < adsorp_diff
    );
    // 下上 下中 下右
    const bt = cacheStore_boundingBox.find((f) => Math.abs(f.bottom - bottom) < adsorp_diff);
    const bc = cacheStore_boundingBox.find(
      (f) => Math.abs(f.bottom - (top + height / 2)) < adsorp_diff
    );
    const br = cacheStore_boundingBox.find((f) => Math.abs(f.bottom - top) < adsorp_diff);
    if (tt) {
      return {
        x_info: {
          display: true,
          top: (tt.top - canvas_bounding_info.top) / scale
        },
        move_y: tt.top - top
      };
    } else if (tc) {
      return {
        x_info: {
          display: true,
          top: (tc.top - canvas_bounding_info.top) / scale
        },
        move_y: tc.top - (top + height / 2)
      };
    } else if (tb) {
      return {
        x_info: {
          display: true,
          top: (tb.top - canvas_bounding_info.top) / scale
        },
        move_y: tb.top - bottom
      };
    } else if (ct) {
      return {
        x_info: {
          display: true,
          top: (ct.top + ct.height / 2 - canvas_bounding_info.top) / scale
        },
        move_y: ct.top + ct.height / 2 - top
      };
    } else if (cc) {
      return {
        x_info: {
          display: true,
          top: (cc.top + cc.height / 2 - canvas_bounding_info.top) / scale
        },
        move_y: cc.top + cc.height / 2 - (top + height / 2)
      };
    } else if (cb) {
      return {
        x_info: {
          display: true,
          top: (cb.top + cb.height / 2 - canvas_bounding_info.top) / scale
        },
        move_y: cb.top + cb.height / 2 - bottom
      };
    } else if (br) {
      return {
        x_info: {
          display: true,
          top: (br.bottom - canvas_bounding_info.top) / scale
        },
        move_y: br.bottom - top
      };
    } else if (bc) {
      return {
        x_info: {
          display: true,
          top: (bc.bottom - canvas_bounding_info.top) / scale
        },
        move_y: bc.bottom - (top + height / 2)
      };
    } else if (bt) {
      return {
        x_info: {
          display: true,
          top: (bt.bottom - canvas_bounding_info.top) / scale
        },
        move_y: bt.bottom - bottom
      };
    }
  }
  return {
    x_info: {
      display: false,
      top: 0
    },
    move_y: 0
  };
};
/**
 * 坐标数组转换成path路径
 * @param position_arr
 * @returns
 */
export const positionArrarToPath = (
  position_arr: { x: number; y: number }[],
  offset_x = 0,
  offset_y = 0
) => {
  let path_str = '';
  for (let index = 0; index < position_arr.length; index++) {
    if (index === 0) {
      path_str += `M ${position_arr[index].x + offset_x} ${position_arr[index].y + offset_y}`;
    } else {
      path_str += ` L ${position_arr[index].x + offset_x} ${position_arr[index].y + offset_y}`;
    }
  }
  return path_str;
};
/**
 * 取两点之间坐标
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @returns
 */
export const getCenterXY = (x1: number, y1: number, x2: number, y2: number) => {
  return {
    x: (x1 + x2) / 2,
    y: (y1 + y2) / 2
  };
};
/**
 * 计算旋转之后的坐标
 * @param x 旋转之前x坐标
 * @param y 旋转之前y坐标
 * @param centerX 旋转中心x坐标
 * @param centerY 旋转中心y坐标
 * @param angleRad 旋转角度
 * @returns 旋转之后的xy坐标
 */
export const rotatePoint = (
  x: number,
  y: number,
  centerX: number,
  centerY: number,
  angleRad: number
) => {
  const newX = centerX + (x - centerX) * Math.cos(angleRad) - (y - centerY) * Math.sin(angleRad);
  const newY = centerY + (x - centerX) * Math.sin(angleRad) + (y - centerY) * Math.cos(angleRad);
  return { x: newX, y: newY };
};
// 获取四角坐标
export const getRectCoordinate = (item: IDoneJsonBinfo) => {
  const topLeft = { x: item.left, y: item.top };
  const topRight = { x: item.left + item.width, y: item.top };
  const bottomLeft = { x: item.left, y: item.top + item.height };
  const bottomRight = {
    x: item.left + item.width,
    y: item.top + item.height
  };
  return {
    topLeft,
    topRight,
    bottomLeft,
    bottomRight
  };
};
//获取四条边中点坐标
export const getRectCenterCoordinate = (
  topLeft: { x: any; y: any },
  topRight: { x: any; y: any },
  bottomLeft: { x: any; y: any },
  bottomRight: { x: any; y: any }
) => {
  const topCenter = {
    x: (topLeft.x + topRight.x) / 2,
    y: (topLeft.y + topRight.y) / 2
  };
  const bottomCenter = {
    x: (bottomLeft.x + bottomRight.x) / 2,
    y: (bottomLeft.y + bottomRight.y) / 2
  };
  const leftCenter = {
    x: (topLeft.x + bottomLeft.x) / 2,
    y: (topLeft.y + bottomLeft.y) / 2
  };
  const rightCenter = {
    x: (topRight.x + bottomRight.x) / 2,
    y: (topRight.y + bottomRight.y) / 2
  };
  return {
    topCenter,
    bottomCenter,
    leftCenter,
    rightCenter
  };
};

export const handleAlign = (
  type:
    | 'left'
    | 'horizontally'
    | 'right'
    | 'top'
    | 'vertically'
    | 'bottom'
    | 'horizontal-distribution'
    | 'vertical-distribution',
  selected_done_json: IDoneJson[],
  canvasDom: HTMLElement,
  scale: number,
  global_done_json: IDoneJson[]
) => {
  switch (type) {
    case 'left': {
      // 取出最左边的元素 记录最左边的坐标
      const left_x = Math.min(
        ...selected_done_json.filter((f) => f.type !== 'sys-line').map((m) => m.binfo.left)
      );
      // 将所有元素的坐标都设置成最左边
      selected_done_json
        .filter((f) => f.type !== 'sys-line')
        .forEach((m) => {
          m.binfo.left = left_x;
        });
      break;
    }
    case 'horizontally': {
      // 取出第一个元素的中点坐标 将其余元素的中点坐标都设置成这个
      const center_x =
        selected_done_json.filter((f) => f.type !== 'sys-line')[0].binfo.left +
        selected_done_json[0].binfo.width / 2;
      selected_done_json
        .filter((f) => f.type !== 'sys-line')
        .forEach((m) => {
          m.binfo.left = center_x - m.binfo.width / 2;
        });
      break;
    }

    case 'right': {
      // 取出最右边的元素 记录最右边的坐标
      const right_x = Math.max(
        ...selected_done_json
          .filter((f) => f.type !== 'sys-line')
          .map((m) => m.binfo.left + m.binfo.width)
      );
      // 将所有元素的坐标都设置成最右边
      selected_done_json
        .filter((f) => f.type !== 'sys-line')
        .forEach((m) => {
          m.binfo.left = right_x - m.binfo.width;
        });
      break;
    }

    case 'top': {
      // 取出最上边的元素 记录最上边的坐标
      const top_y = Math.min(
        ...selected_done_json.filter((f) => f.type !== 'sys-line').map((m) => m.binfo.top)
      );
      // 将所有元素的坐标都设置成最上边
      selected_done_json
        .filter((f) => f.type !== 'sys-line')
        .forEach((m) => {
          m.binfo.top = top_y;
        });
      break;
    }

    case 'vertically': {
      // 取出第一个元素的中点坐标 将其余元素的中点坐标都设置成这个
      const center_y =
        selected_done_json.filter((f) => f.type !== 'sys-line')[0].binfo.top +
        selected_done_json[0].binfo.height / 2;
      selected_done_json
        .filter((f) => f.type !== 'sys-line')
        .forEach((m) => {
          m.binfo.top = center_y - m.binfo.height / 2;
        });
      break;
    }

    case 'bottom': {
      // 取出最下边的元素 记录最下边的坐标
      const bottom_y = Math.max(
        ...selected_done_json
          .filter((f) => f.type !== 'sys-line')
          .map((m) => m.binfo.top + m.binfo.height)
      );
      // 将所有元素的坐标都设置成最下边
      selected_done_json
        .filter((f) => f.type !== 'sys-line')
        .forEach((m) => {
          m.binfo.top = bottom_y - m.binfo.height;
        });
      break;
    }
    case 'horizontal-distribution': {
      // 将选中的元素按照水平方向中点坐标从小到大排序
      selected_done_json.sort(
        (a, b) => a.binfo.left + a.binfo.width / 2 - b.binfo.left + b.binfo.width / 2
      );
      const max_info = selected_done_json[selected_done_json.length - 1];
      const min_info = selected_done_json[0];
      const point_interval_x =
        (max_info.binfo.left +
          max_info.binfo.width / 2 -
          (min_info.binfo.left + min_info.binfo.width / 2)) /
        (selected_done_json.length - 1);
      selected_done_json.forEach((f, index) => {
        if (index == 0 || index == selected_done_json.length - 1) {
          return;
        }
        const new_x = min_info.binfo.left + min_info.binfo.width / 2 + point_interval_x * index;
        f.binfo = {
          ...f.binfo,
          left: new_x - f.binfo.width / 2
        };
      });
      break;
    }
    case 'vertical-distribution': {
      // 将选中的元素按照垂直方向中点坐标从小到大排序
      selected_done_json.sort(
        (a, b) => a.binfo.top + a.binfo.height / 2 - b.binfo.top + b.binfo.height / 2
      );
      const max_info = selected_done_json[selected_done_json.length - 1];
      const min_info = selected_done_json[0];
      const point_interval_y =
        (max_info.binfo.top +
          max_info.binfo.height / 2 -
          (min_info.binfo.top + min_info.binfo.height / 2)) /
        (selected_done_json.length - 1);
      selected_done_json.forEach((f, index) => {
        if (index == 0 || index == selected_done_json.length - 1) {
          return;
        }
        const new_y = min_info.binfo.top + min_info.binfo.height / 2 + point_interval_y * index;
        f.binfo = {
          ...f.binfo,
          top: new_y - f.binfo.height / 2
        };
      });
      break;
    }
  }
  // 更新绑定连线
  const sys_lines = global_done_json.filter((f) => f.type === 'sys-line');
  useUpdateSysLine(sys_lines, selected_done_json, canvasDom, scale);
  return selected_done_json;
};
/**
 * 设置图形属性
 * @param id
 * @param key
 * @param val
 * @param json_arr
 * @returns
 */
export const setItemAttr = (id: string, key: string, val: any, json_arr: IDoneJson[]) => {
  return new Promise((res) => {
    const find_item = json_arr.find((f) => f.id === id);
    if (!find_item) {
      res({
        status: false,
        msg: '要设置的id不存在'
      });
    }
    eval(`find_item.${key} = val;`);
    res({
      status: true,
      msg: '操作成功'
    });
  });
};
export const getItemAttr = (id: string, key: string, json_arr: IDoneJson[]) => {
  const find_item = json_arr.find((f) => f.id === id);
  if (!find_item) {
    return null;
  }
  return eval(`find_item.${key}`);
};
export const previewCompareVal = (val1: any, operator: '>' | '<' | '=' | '!=', val2: any) => {
  if (operator === '=') {
    return String(val1) == String(val2);
  } else if (operator === '>') {
    return Number(val1) > Number(val2);
  } else if (operator === '<') {
    return Number(val1) < Number(val2);
  } else if (operator === '!=') {
    return String(val1) != String(val2);
  }
  return false;
};
/**
 * 将事件转换成v-on
 * @param item
 * @returns
 */
export const eventToVOn = (item: IDoneJson) => {
  const event_obj: Record<string, string> = {};
  item.events.forEach((event) => {
    let code_str = '';
    if (event.action === 'changeAttr') {
      if (event.change_attr.length < 1) {
        return;
      }
      event.change_attr.forEach((attr) => {
        if (!attr.target_id || !attr.target_attr || attr.target_value === undefined) {
          return;
        }
        if (
          !event.trigger_rule ||
          !event.trigger_rule.trigger_id ||
          !event.trigger_rule.trigger_attr ||
          event.trigger_rule.value === undefined ||
          !event.trigger_rule.operator
        ) {
          if (typeof attr.target_value == 'boolean') {
            code_str += `$setItemAttrByID('${attr.target_id}', '${attr.target_attr}', ${attr.target_value});`;
          } else {
            code_str += `$setItemAttrByID('${attr.target_id}', '${attr.target_attr}', '${attr.target_value}');`;
          }
        } else {
          if (typeof attr.target_value == 'boolean') {
            code_str += `if($previewCompareVal($getItemAttrByID('${event.trigger_rule.trigger_id}', '${event.trigger_rule.trigger_attr}'), '${event.trigger_rule.operator}', '${event.trigger_rule.value}')){$setItemAttrByID('${attr.target_id}', '${attr.target_attr}', ${attr.target_value})};`;
          } else {
            code_str += `if($previewCompareVal($getItemAttrByID('${event.trigger_rule.trigger_id}', '${event.trigger_rule.trigger_attr}'), '${event.trigger_rule.operator}', '${event.trigger_rule.value}')){$setItemAttrByID('${attr.target_id}', '${attr.target_attr}', '${attr.target_value}')};`;
          }
        }
      });
    } else if (event.action === 'customCode') {
      if (
        !event.trigger_rule ||
        !event.trigger_rule.trigger_id ||
        !event.trigger_rule.trigger_attr ||
        event.trigger_rule.value === undefined ||
        !event.trigger_rule.operator
      ) {
        code_str += event.custom_code + ';';
      } else {
        code_str += `if($previewCompareVal($getItemAttrByID('${event.trigger_rule.trigger_id}', '${event.trigger_rule.trigger_attr}'), '${event.trigger_rule.operator}', '${event.trigger_rule.value}')){${event.custom_code}};`;
      }
    }
    if (!Object.prototype.hasOwnProperty.call(event_obj, event.type)) {
      event_obj[event.type] = code_str;
    } else {
      event_obj[event.type] += code_str;
    }
  });
  let on_event = {};
  for (const event_key in event_obj) {
    on_event = {
      ...on_event,
      ...{
        [event_key]: () => dynamicEvent(event_obj[event_key])(item)
      }
    };
  }
  return on_event;
};
/**
 * 创建动态事件，可以根据$item_info获取当前图形信息
 * @param code_str
 * @returns
 */
const dynamicEvent = (code_str: string) => {
  try {
    return new Function('$item_info', code_str);
  } catch (error) {
    console.error(error);
    return new Function('$item_info', `console.error('${error}')`);
  }
};
