<template>
  <component :is="componentName" :column="column" v-if="loaded"></component>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { TColumn } from '../../typings/editorTypes';
import componentService from '../services/componentService';
import { useMessage } from "naive-ui";

const NMessage = useMessage();

const Props = defineProps<{
  componentName: string,
  column: TColumn
}>();

const loaded = ref<boolean>(false);
onMounted(() => {
  componentService.loadComponent(Props.componentName).then(() => {
    loaded.value = true;
  }).catch(() => {
    NMessage.error("加载组件失败");
  });
});
</script>

<style scoped>
</style>