<script setup lang="ts">
import type { IExportJson } from '@/components/mt-edit/components/types';
import { useGenThumbnail } from '@/components/mt-edit/composables/thumbnail';
import { MtEdit } from '@/export';
import { useRouter } from 'vue-router';
const router = useRouter();
const onPreviewClick = (exportJson: IExportJson) => {
  sessionStorage.setItem('exportJson', JSON.stringify(exportJson));
  const routeUrl = router.resolve({
    name: 'preview'
  });
  window.open(routeUrl.href, '_blank');
};
const onSaveClick = (e: IExportJson) => {
  console.log(e, '这是要保存的数据');
};
const onReturnClick = () => {
  router.go(-1);
};
const onThumbnailClick = () => {
  useGenThumbnail();
};
</script>

<template>
  <div class="w-1/1 h-100vh">
    <mt-edit
      :use-thumbnail="true"
      @on-preview-click="onPreviewClick"
      @on-return-click="onReturnClick"
      @on-save-click="onSaveClick"
      @on-thumbnail-click="onThumbnailClick"
    ></mt-edit>
  </div>
</template>

<style scoped></style>
