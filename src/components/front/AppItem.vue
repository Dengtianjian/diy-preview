<template>
  <div class="app-item_header">
    <img :src="data.iconUrl" class="app-icon" />
    <div class="app-info">
      <h3>
        <n-ellipsis style="max-width: 200px" :tooltip="false">
          {{ data.name }}
        </n-ellipsis>
      </h3>
      <div class="app-summary">
        <n-ellipsis :line-clamp="2" :tooltip="false">
          {{ data.description }}
        </n-ellipsis>
      </div>
    </div>
    <slot name="info"></slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  data: {
    type: Object,
    default: {},
  },
});
</script>

<style scpoed>
.app-item_header {
  display: flex;
  padding: 20px 15px;
  color: var(--font-color);
  overflow: hidden;
}
.app-icon {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--border-radius);
}
.app-info {
  margin-left: 10px;
}
.app-info h3 {
  margin-top: 4px;
  font-size: 20px;
}
.app-summary {
  margin-top: 5px;
  line-height: 17px;
  font-size: 12px;
  color: #999;
  letter-spacing: 1px;
  word-break: break-all;
}
</style>
