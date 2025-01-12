declare global {
  interface Window {
    $svgEventCallBack: (type: string, svg_item_id: string, ...args: any[]) => void;
    $setItemAttrByID: (id: string, key: string, val: any) => Promise<unknown>;
    $getItemAttrByID: (id: string, key: string, val: any) => any;
    $previewCompareVal: (val1: any, operator: '>' | '<' | '=' | '!=', val2: any) => boolean;
  }
}
export {};
