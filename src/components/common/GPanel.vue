<template>
  <section class="panel">
    <div
      class="panel-title"
      v-if="title || $slots.title || subTitle || $slots.subTitle"
    >
      <slot name="title" />{{ title }}
      <div class="panel-title-sub" v-if="subTitle || $slots.subTitle">
        <slot name="sub-title" />
        {{ subTitle }}
      </div>
    </div>
    <slot />
  </section>
</template>
<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: "",
  },
  subTitle: {
    type: String,
    default: "",
  },
});
</script>
<style scoped>
.panel-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 18px;
  color: #333;
}
.panel-title-sub {
  font-size: 16px;
  color: #999;
}
</style>
