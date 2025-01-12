<template>
  <img draggable="false" class="w-1/1 h-1/1" :src="img_url" />
</template>
<script setup lang="ts">
// @ts-nocheck
import { onMounted, ref, useSlots, watch } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { svgToImgSrc } from '../../utils';
const img_url = ref('');
const slots = useSlots();
const setImgUrl = async () => {
  const slotNodes = slots.default ? slots.default() : [];
  const slotStrings = await renderToString(slotNodes[0]);
  img_url.value = svgToImgSrc(slotStrings);
};
onMounted(async () => {
  await setImgUrl();
});
watch(
  () => slots.default(),
  async () => {
    await setImgUrl();
  },
  { deep: true }
);
</script>
