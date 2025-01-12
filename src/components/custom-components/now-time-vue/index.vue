<!-- eslint-disable vue/html-indent -->
<template>
  <div>
    <div class="flex">
      <div class="font-bold" :style="{ color: props.fontColor, fontSize: `${props.dateSize}px` }">
        {{ date }}
      </div>
      <div
        class="font-bold ml-5px"
        :style="{ color: props.fontColor, fontSize: `${props.weekSize}px ` }"
      >
        {{ week }}
      </div>
    </div>
    <div
      class="font-bold mt-5px ml-5px"
      :style="{ color: props.fontColor, fontSize: `${props.timeSize}px ` }"
    >
      {{ time }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, onUnmounted } from 'vue';
const props = defineProps({
  fontColor: {
    type: String,
    default: '#000000'
  },
  dateSize: {
    type: Number,
    default: 12
  },
  weekSize: {
    type: Number,
    default: 12
  },
  timeSize: {
    type: Number,
    default: 24
  }
});
const now_date = ref(new Date());
const timer = ref();
const date = computed(() => {
  const year = now_date.value.getFullYear();
  const month = now_date.value.getMonth() + 1;
  const day = now_date.value.getDate();
  const time = year.toString() + '年' + month.toString() + '月' + day.toString() + '日';
  return time;
});
const week = computed(() => {
  const d = now_date.value.getDay();
  const weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const time = weekday[d];
  return time;
});
const time = computed(() => {
  const hour = now_date.value.getHours();
  const minute = now_date.value.getMinutes();
  const second = now_date.value.getSeconds();
  const time =
    (hour < 10 ? '0' + hour.toString() : hour.toString()) +
    ':' +
    (minute < 10 ? '0' + minute.toString() : minute.toString()) +
    ':' +
    (second < 10 ? '0' + second.toString() : second.toString());
  return time;
});
onMounted(() => {
  timer.value = setInterval(() => {
    now_date.value = new Date(); // 修改数据date
  }, 500);
});
onUnmounted(() => {
  clearInterval(timer.value);
});
</script>
