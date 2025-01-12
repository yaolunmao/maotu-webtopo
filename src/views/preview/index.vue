<template>
  <mt-preview ref="MtPreviewRef" @on-event-call-back="onEventCallBack"></mt-preview>
</template>
<script setup lang="ts">
import { MtPreview } from '@/export';
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
const MtPreviewRef = ref<InstanceType<typeof MtPreview>>();
const onEventCallBack = (type: string, item_id: string) => {
  console.log(type, item_id);

  if (type == 'test-dialog') {
    ElMessage.success(`获取到了id:${item_id}`);
  }
};
onMounted(() => {
  MtPreviewRef.value?.setImportJson(JSON.parse(sessionStorage.getItem('exportJson') as any));
});
</script>
