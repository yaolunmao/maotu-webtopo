import { nextTick, reactive } from 'vue';
import type { CacheBoundingBox, ICache, IDoneJson } from './types';
import { objectDeepClone } from '../utils';

export const cacheStore: ICache = reactive({
  boundingBox: [],
  setBoundingBox: (val: CacheBoundingBox[]) => {
    cacheStore.boundingBox = val;
  },
  adsorbPoint: [],
  setAdsorbPoint(val) {
    cacheStore.adsorbPoint = val;
  },
  copy: [],
  setCopy(val) {
    cacheStore.copy = val;
  },
  history: [[]],
  historyIndex: 0,
  addHistory(val: IDoneJson[]) {
    nextTick(() => {
      if (cacheStore.historyIndex + 1 < cacheStore.history.length) {
        cacheStore.history.splice(cacheStore.historyIndex + 1);
      }
      cacheStore.history.push(objectDeepClone(val));
      cacheStore.historyIndex = cacheStore.history.length - 1;
      if (cacheStore.history.length > 20) {
        cacheStore.history.shift();
        cacheStore.historyIndex = cacheStore.history.length - 1;
      }
    });
  }
});
