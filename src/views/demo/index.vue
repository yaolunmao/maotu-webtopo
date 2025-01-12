<template>
  <div>
    <el-divider>插件能力展示</el-divider>
    <div class="flex flex-wrap mx-20px justify-center items-center">
      <el-card
        v-for="item in ability"
        :key="item.title"
        class="flex justify-center items-center m-10px cursor-pointer"
        @click="item.onClick"
      >
        <img :src="item.img" class="w-300px h-300px" />
        <div>{{ item.title }}</div>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElDivider, ElCard } from 'element-plus';
import { useRouter } from 'vue-router';
const router = useRouter();
const ability = [
  {
    title: '基础编辑页',
    img: '/imgs/edit.png',
    onClick: () => {
      router.push({
        name: 'edit',
        params: {}
      });
    }
  },
  {
    title: '加载已保存数据',
    img: '/imgs/edit-load.png',
    onClick: () => {
      router.push({
        name: 'edit-load',
        params: {}
      });
    }
  },
  {
    title: '外部修改图形属性',
    img: '/imgs/set-node-attr.gif',
    onClick: () => {
      router.push({
        name: 'set-node-attr',
        params: {}
      });
    }
  },
  {
    title: '回调外部项目函数',
    img: '/imgs/event-callback.png',
    onClick: () => {
      router.push({
        name: 'event-callback',
        params: {}
      });
    }
  },
  {
    title: '事件-属性更改',
    img: '/imgs/change-attr.png',
    onClick: () => {
      router.push({
        name: 'change-attr',
        params: {}
      });
    }
  }
];
</script>
