import type { IDzrPropsModelValue } from '../types';
import type { MouseTouchEvent } from './types';

/**
 * 会自动销毁的鼠标移动事件
 * @param onMousemove
 */
export const autoDestroyMouseMove = (
  onMousemove: (e: MouseTouchEvent) => void,
  mouseUpCallBack?: () => void
) => {
  const onMouseup = () => {
    document.removeEventListener('mousemove', onMousemove);
    document.removeEventListener('touchmove', onMousemove);
    document.removeEventListener('mouseup', onMouseup);
    document.removeEventListener('touchend', onMouseup);
    document.removeEventListener('mouseleave', onMouseup);
    if (mouseUpCallBack) {
      mouseUpCallBack();
    }
  };
  document.addEventListener('mousemove', onMousemove);
  document.addEventListener('touchmove', onMousemove);
  document.addEventListener('mouseup', onMouseup);
  document.addEventListener('touchend', onMouseup);
  document.addEventListener('mouseleave', onMouseup);
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
/** 根据移动的距离对齐到网格
 * @param diff 移动的距离
 * @param grid 网格大小
 */
export const calcGrid = (diff: number, grid = 1) => {
  // 得到每次缩放的余数
  const r = Math.abs(diff) % grid;

  // 正负grid
  const mulGrid = diff > 0 ? grid : -grid;
  let result = 0;
  // 余数大于grid的1/2
  if (r > grid / 2) {
    result = mulGrid * Math.ceil(Math.abs(diff) / grid);
  } else {
    result = mulGrid * Math.floor(Math.abs(diff) / grid);
  }

  return result;
};
/**
 * 获取当前点击坐标 根据pc端和移动端获取
 * @param e
 * @returns
 */
export function getXY(e: MouseTouchEvent) {
  let clientX = 0,
    clientY = 0;
  if (isTouchEvent(e)) {
    const touch = e.targetTouches[0];
    clientX = touch.pageX;
    clientY = touch.pageY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }

  return { clientX, clientY };
}

function isTouchEvent(val: unknown): val is TouchEvent {
  const typeStr = Object.prototype.toString.call(val);
  return typeStr.substring(8, typeStr.length - 1) === 'TouchEvent';
}

export const getLength = (x: number, y: number) => Math.sqrt(x * x + y * y);

export const degToRadian = (deg: number) => (deg * Math.PI) / 180;
const cos = (deg: number) => Math.cos(degToRadian(deg));
const sin = (deg: number) => Math.sin(degToRadian(deg));
/**
 * 计算并返回给定类型变换的新样式。
 *
 * @param {string} type - 变换的类型。
 * @param {any} rect - 矩形对象。
 * @param {number} deltaW - 宽度变化。
 * @param {number} deltaH - 高度变化。
 * @param {number | undefined} ratio - 比例。
 * @param {number} minWidth - 最小宽度。
 * @param {number} minHeight - 最小高度。
 * @returns {Object} 矩形的新位置和大小。
 */
export const getNewStyle = (
  type: string,
  rect: any,
  deltaW: number,
  deltaH: number,
  ratio: number | undefined,
  minWidth: number,
  minHeight: number
) => {
  // eslint-disable-next-line prefer-const
  let { width, height, centerX, centerY, rotateAngle } = rect;
  const widthFlag = width < 0 ? -1 : 1;
  const heightFlag = height < 0 ? -1 : 1;
  width = Math.abs(width);
  height = Math.abs(height);
  switch (type) {
    case 'r': {
      const widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth);
      width = widthAndDeltaW.width;
      deltaW = widthAndDeltaW.deltaW;
      if (ratio) {
        deltaH = deltaW / ratio;
        height = width / ratio;
        // 左上角固定
        centerX += (deltaW / 2) * cos(rotateAngle) - (deltaH / 2) * sin(rotateAngle);
        centerY += (deltaW / 2) * sin(rotateAngle) + (deltaH / 2) * cos(rotateAngle);
      } else {
        // 左边固定
        centerX += (deltaW / 2) * cos(rotateAngle);
        centerY += (deltaW / 2) * sin(rotateAngle);
      }
      break;
    }
    case 'tr': {
      deltaH = -deltaH;
      const widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth);
      width = widthAndDeltaW.width;
      deltaW = widthAndDeltaW.deltaW;
      const heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight);
      height = heightAndDeltaH.height;
      deltaH = heightAndDeltaH.deltaH;
      if (ratio) {
        deltaW = deltaH * ratio;
        width = height * ratio;
      }
      centerX += (deltaW / 2) * cos(rotateAngle) + (deltaH / 2) * sin(rotateAngle);
      centerY += (deltaW / 2) * sin(rotateAngle) - (deltaH / 2) * cos(rotateAngle);
      break;
    }
    case 'br': {
      const widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth);
      width = widthAndDeltaW.width;
      deltaW = widthAndDeltaW.deltaW;
      const heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight);
      height = heightAndDeltaH.height;
      deltaH = heightAndDeltaH.deltaH;
      if (ratio) {
        deltaW = deltaH * ratio;
        width = height * ratio;
      }
      centerX += (deltaW / 2) * cos(rotateAngle) - (deltaH / 2) * sin(rotateAngle);
      centerY += (deltaW / 2) * sin(rotateAngle) + (deltaH / 2) * cos(rotateAngle);
      break;
    }
    case 'bc': {
      const heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight);
      height = heightAndDeltaH.height;
      deltaH = heightAndDeltaH.deltaH;
      if (ratio) {
        deltaW = deltaH * ratio;
        width = height * ratio;
        // 左上角固定
        centerX += (deltaW / 2) * cos(rotateAngle) - (deltaH / 2) * sin(rotateAngle);
        centerY += (deltaW / 2) * sin(rotateAngle) + (deltaH / 2) * cos(rotateAngle);
      } else {
        // 上边固定
        centerX -= (deltaH / 2) * sin(rotateAngle);
        centerY += (deltaH / 2) * cos(rotateAngle);
      }
      break;
    }
    case 'bl': {
      deltaW = -deltaW;
      const widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth);
      width = widthAndDeltaW.width;
      deltaW = widthAndDeltaW.deltaW;
      const heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight);
      height = heightAndDeltaH.height;
      deltaH = heightAndDeltaH.deltaH;
      if (ratio) {
        height = width / ratio;
        deltaH = deltaW / ratio;
      }
      centerX -= (deltaW / 2) * cos(rotateAngle) + (deltaH / 2) * sin(rotateAngle);
      centerY -= (deltaW / 2) * sin(rotateAngle) - (deltaH / 2) * cos(rotateAngle);
      break;
    }
    case 'l': {
      deltaW = -deltaW;
      const widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth);
      width = widthAndDeltaW.width;
      deltaW = widthAndDeltaW.deltaW;
      if (ratio) {
        height = width / ratio;
        deltaH = deltaW / ratio;
        // 右上角固定
        centerX -= (deltaW / 2) * cos(rotateAngle) + (deltaH / 2) * sin(rotateAngle);
        centerY -= (deltaW / 2) * sin(rotateAngle) - (deltaH / 2) * cos(rotateAngle);
      } else {
        // 右边固定
        centerX -= (deltaW / 2) * cos(rotateAngle);
        centerY -= (deltaW / 2) * sin(rotateAngle);
      }
      break;
    }
    case 'tl': {
      deltaW = -deltaW;
      deltaH = -deltaH;
      const widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth);
      width = widthAndDeltaW.width;
      deltaW = widthAndDeltaW.deltaW;
      const heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight);
      height = heightAndDeltaH.height;
      deltaH = heightAndDeltaH.deltaH;
      if (ratio) {
        width = height * ratio;
        deltaW = deltaH * ratio;
      }
      centerX -= (deltaW / 2) * cos(rotateAngle) - (deltaH / 2) * sin(rotateAngle);
      centerY -= (deltaW / 2) * sin(rotateAngle) + (deltaH / 2) * cos(rotateAngle);
      break;
    }
    case 'tc': {
      deltaH = -deltaH;
      const heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight);
      height = heightAndDeltaH.height;
      deltaH = heightAndDeltaH.deltaH;
      if (ratio) {
        width = height * ratio;
        deltaW = deltaH * ratio;
        // 左下角固定
        centerX += (deltaW / 2) * cos(rotateAngle) + (deltaH / 2) * sin(rotateAngle);
        centerY += (deltaW / 2) * sin(rotateAngle) - (deltaH / 2) * cos(rotateAngle);
      } else {
        centerX += (deltaH / 2) * sin(rotateAngle);
        centerY -= (deltaH / 2) * cos(rotateAngle);
      }
      break;
    }
  }

  return {
    position: {
      centerX,
      centerY
    },
    size: {
      width: width * widthFlag,
      height: height * heightFlag
    }
  };
};
/**
 * 根据给定的参数设置高度和 deltaH 值。
 *
 * @param {number} height - 当前的高度值。
 * @param {number} deltaH - 高度变化值。
 * @param {number} minHeight - 最小高度值。
 * @return {object} - 包含更新后的高度和 deltaH 值的对象。
 */
const setHeightAndDeltaH = (height: number, deltaH: number, minHeight: number) => {
  const expectedHeight = height + deltaH;
  if (expectedHeight > minHeight) {
    height = expectedHeight;
  } else {
    deltaH = minHeight - height;
    height = minHeight;
  }
  return { height, deltaH };
};
/**
 * 设置元素的宽度和deltaW值。
 *
 * @param {number} width - 元素的当前宽度。
 * @param {number} deltaW - 元素宽度的变化量。
 * @param {number} minWidth - 元素的最小宽度。
 * @return {Object} - 包含更新后的宽度和deltaW值的对象。
 */
const setWidthAndDeltaW = (width: number, deltaW: number, minWidth: number) => {
  const expectedWidth = width + deltaW;
  if (expectedWidth > minWidth) {
    width = expectedWidth;
  } else {
    deltaW = minWidth - width;
    width = minWidth;
  }
  return { width, deltaW };
};
/**
 * 根据矩形的中心坐标、尺寸和角度计算左上角的位置。
 *
 * @param {object} params - 计算的参数。
 * @param {number} params.centerX - 矩形的中心点的 x 坐标。
 * @param {number} params.centerY - 矩形的中心点的 y 坐标。
 * @param {number} params.width - 矩形的宽度。
 * @param {number} params.height - 矩形的高度。
 * @param {number} params.angle - 矩形的旋转角度。
 * @return {object} - 矩形的左上角位置。
 */
export const centerToTL = ({
  centerX,
  centerY,
  width,
  height,
  angle
}: any): IDzrPropsModelValue => ({
  top: centerY - height / 2,
  left: centerX - width / 2,
  width,
  height,
  angle
});
/**
 * 格式化数据并返回一个包含更新后尺寸和位置的对象。
 *
 * @param {IDzrPropsModelValue} data - 包含宽度和高度的数据。
 * @param {number} centerX - 中心点的x坐标。
 * @param {number} centerY - 中心点的y坐标。
 * @return {object} - 一个包含更新后尺寸和位置的对象。
 */
export const formatData = (data: IDzrPropsModelValue, centerX: number, centerY: number) => {
  const { width, height } = data;
  return {
    width: Math.abs(width),
    height: Math.abs(height),
    left: centerX - Math.abs(width) / 2,
    top: centerY - Math.abs(height) / 2
  };
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
