<template>
  <div>
    <v-ace-editor
      v-model:value="import_json"
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
import { ref } from 'vue';
import type { IExportJson } from '../types';
import { globalStore } from '../../store/global';
import { useExportJsonToDoneJson } from '../../composables';
const import_json = ref('');
const onImport = () => {
  return new Promise((resolve, reject) => {
    try {
      const json: IExportJson = JSON.parse(import_json.value);

      const { canvasCfg, gridCfg, importDoneJson } = useExportJsonToDoneJson(json);
      globalStore.canvasCfg = canvasCfg;
      globalStore.gridCfg = gridCfg;
      globalStore.setGlobalStoreDoneJson(importDoneJson);
      resolve(true);
    } catch (error) {
      resolve(false);
    }
  });
};
defineExpose({
  onImport
});
</script>
