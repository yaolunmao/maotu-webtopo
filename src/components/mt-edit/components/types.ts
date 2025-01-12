import type { IDoneJson, IGlobalStoreCanvasCfg, IGlobalStoreGridCfg } from '../store/types';

export type MouseTouchEvent = MouseEvent | TouchEvent;
export interface IExportDoneJson extends Omit<IDoneJson, 'props' | 'symbol'> {
  props: {
    [key: string]: any;
  };
}
export interface IExportJson {
  canvasCfg: IGlobalStoreCanvasCfg;
  gridCfg: IGlobalStoreGridCfg;
  json: IExportDoneJson[];
}
