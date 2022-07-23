<template>
  <button :style="style" style="transition:all 0.2s linear">Button</button>
</template>

<script lang="ts" setup>import { onMounted, ref } from 'vue';

const style = ref({
  height: "30px",
  width: "100%"
});

const heights = [
  "30px", "40px", "50px", "80px", "44px", "144px", "35px", "66px", "77px"
];

onMounted(() => {
  // style.value.height = heights[Math.round(Math.random() * 8)];
})

</script>

<style scoped>
</style>
