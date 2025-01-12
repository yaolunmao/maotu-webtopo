<template>
  <div>
    <v-ace-editor
      v-model:value="export_json"
      lang="json"
      theme="monokai"
      style="height: 400px"
      :options="{
        useWorker: true,
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
      }"
    />
  </div>
</template>
<script setup lang="ts">
import { VAceEditor } from 'vue3-ace-editor';
import type { IDoneJson, IGlobalStoreCanvasCfg, IGlobalStoreGridCfg } from '../../store/types';
import { computed } from 'vue';
import type { IExportDoneJson, IExportJson } from '../types';
import { genExportJson } from '../../composables';
type ExportProps = {
  doneJson: IDoneJson[];
  canvasCfg: IGlobalStoreCanvasCfg;
  gridCfg: IGlobalStoreGridCfg;
};
const exportProps = withDefaults(defineProps<ExportProps>(), {});
const export_json = computed({
  get: () => {
    const { exportJson } = genExportJson(
      exportProps.canvasCfg,
      exportProps.gridCfg,
      exportProps.doneJson
    );
    return JSON.stringify(exportJson, null, 2);
  },
  set: () => {}
});
</script>
