import { Canvg } from 'canvg';
import html2canvas from 'html2canvas';
import { ElMessage } from 'element-plus';
export const useGenThumbnail = async (canvas_id: string = 'mtCanvasArea') => {
  const el = <HTMLElement | null>document.querySelector(`#${canvas_id}`);
  if (!el) {
    ElMessage.error('没有找到canvas元素,请检查！');
    return;
  }
  //记录要移除的svg元素
  const shouldRemoveSvgNodes = [];
  // 获取到所有的SVG 得到一个数组 目前只有自定义连线需要特殊处理 别的元素直接使用html2canvas就可以
  const svgElements: NodeListOf<HTMLElement> = document.body.querySelectorAll(
    `#${canvas_id} .mt-line-render`
  );
  // 遍历这个数组
  for (const item of svgElements) {
    //去除空白字符
    const svg = item.outerHTML.trim();
    // 创建一个 canvas DOM元素
    const canvas = document.createElement('canvas');
    //设置 canvas 元素的宽高
    canvas.width = item.getBoundingClientRect().width;
    canvas.height = item.getBoundingClientRect().height;
    const ctx = canvas.getContext('2d');
    // 将 SVG转化 成 canvas
    const v = Canvg.fromString(ctx!, svg);
    await v.render();

    //设置生成 canvas 元素的坐标  保证与原SVG坐标保持一致
    if (item.style.position) {
      canvas.style.position += item.style.position;
      canvas.style.left += item.style.left;
      canvas.style.top += item.style.top;
    }

    //添加到需要截图的DOM节点中
    item.parentNode!.appendChild(canvas);
    // 删除这个元素
    shouldRemoveSvgNodes.push(canvas);
  }

  const width = el.offsetWidth;
  const height = el.offsetHeight;
  const canvas = await html2canvas(el, {
    useCORS: true,
    scale: 2,
    width,
    height,
    allowTaint: true,
    windowHeight: height,
    logging: false,
    ignoreElements: (element) => {
      if (element.classList.contains('mt-line-render')) {
        return true;
      }
      return false;
    }
  });
  const img_link = document.createElement('a');
  img_link.href = canvas.toDataURL('image/png'); // 转换后的图片地址
  img_link.download = Date.now().toString();
  document.body.appendChild(img_link);
  // 触发点击
  img_link.click();
  // 然后移除
  document.body.removeChild(img_link);
  // 移除需要移除掉的svg节点
  shouldRemoveSvgNodes.forEach((item) => {
    item.remove();
  });
};
