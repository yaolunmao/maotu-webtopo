<template>
  <div style="width: 100%; height: 100%">
    <button class="my-button" style="width: 100%; height: 100%">{{ props.text }}</button>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  text: String,
  bgColor: String,
  fontFamily: String
});
</script>
<style scoped>
.my-button {
  background-color: v-bind('props.bgColor');
  font-family: v-bind('props.fontFamily');
}
</style>
