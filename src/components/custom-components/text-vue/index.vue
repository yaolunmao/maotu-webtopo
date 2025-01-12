<template>
  <p
    class="break-words w-1/1 h-1/1"
    :class="props.vertical ? 'text-vertical' : ''"
    :style="{ fontFamily: props.fontFamily, fontSize: props.fontSize + 'px', color: props.fill }"
  >
    {{ props.text }}
  </p>
</template>
<script setup lang="ts">
const props = defineProps({
  fontFamily: {
    type: String,
    default: ''
  },
  fontSize: {
    type: Number,
    default: 15
  },
  text: {
    type: String,
    default: ''
  },
  fill: {
    type: String,
    default: ''
  },
  vertical: {
    type: Boolean,
    default: false
  }
});
</script>
<style scoped>
.text-vertical {
  writing-mode: tb;
  letter-spacing: 5px;
}
</style>
