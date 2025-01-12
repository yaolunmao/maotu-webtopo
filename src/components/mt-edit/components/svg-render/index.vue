<template>
  <img class="w-1/1 h-1/1" :src="url" />
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { symbolGenSvg, svgToImgSrc, genDomPropstr } from '@/components/mt-edit/utils/index';
import type { ILeftAsideConfigItemPublicProps } from '../../store/types';
type SvgRenderProps = {
  symbolId: string;
  symbolStr: string;
  width: string;
  height: string;
  props: ILeftAsideConfigItemPublicProps;
};
const svgRenderProps = withDefaults(defineProps<SvgRenderProps>(), {});
const url = computed(() => {
  return svgToImgSrc(
    symbolGenSvg(
      svgRenderProps.symbolId,
      svgRenderProps.symbolStr,
      svgRenderProps.width,
      svgRenderProps.height,
      genDomPropstr(svgRenderProps.props)
    )
  );
});
</script>
