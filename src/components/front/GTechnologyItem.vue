<template>
  <div
    class="technology-item"
    :class="{
      'technology-item_disabled': disabled,
      'technology-item_active': selected,
    }"
  >
    <img
      class="technology-cover"
      src="https://t7.baidu.com/it/u=4080826490,615918710&fm=193&f=GIF"
    />
    <section class="technology-info">
      <div class="technology-name">小程序</div>
      <n-ellipsis class="technology-symmary" :line-clamp="3" :tooltip="false">
        微信小程序，小程序的一种，英文名Wechat Mini
        Program，是一种
      </n-ellipsis>
    </section>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  selected: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.technology-item {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 14px;
  box-sizing: border-box;
  border: 1px solid transparent;
  border-radius: var(--border-radius);
  box-sizing: border-box;
  /* border: 1px solid #eee; */
}
.technology-item:hover,
.technology-item_active {
  border-color: var(--primary-color);
}
.technology-item_disabled {
  opacity: 0.5;
}
.technology-item_disabled:hover {
  border-color: transparent;
}
.technology-cover {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--border-radius);
  overflow: hidden;
  background-color: var(--placeholder-color);
}
.technology-name {
  font-size: 20px;
}
.technology-symmary {
  margin-top: 12px;
  line-height: 20px;
  font-size: 14px;
  color: #999;
}
</style>
