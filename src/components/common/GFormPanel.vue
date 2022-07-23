<template>
  <div
    :class="{
      'form-item_border form-item_border-narrow': border,
      'form-item_narrow': narrow,
    }"
  >
    <div class="form-item_label" v-if="label">
      {{ label }}
    </div>
    <div class="form-item_header">
      <slot name="header" />
    </div>
    <div class="form-item_body">
      <slot />
    </div>
    <div class="form-item_tips" v-if="tips && !$slots.tips">
      {{ tips }}
    </div>
    <div class="form-item_footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  label: {
    type: String,
    default: "",
  },
  tips: {
    type: String,
    default: "",
  },
  border: {
    type: Boolean,
    default: false,
  },
  narrow: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.form-item_label {
  padding: 0 0 15px;
  font-size: 14px;
}
.form-item_border {
  border: 1px solid #eee;
  border-radius: var(--border-radius);
}
.form-item_border-narrow .form-item_label {
  padding: 15px 10px;
  border-bottom: 1px solid #eee;
}
.form-item_narrow .form-item_body {
  padding: 0 6px;
}
.form-item_border-narrow .form-item_body {
  padding: 14px;
}
.form-item_tips {
  padding: 14px 0;
  color: #666;
  font-size: 12px;
}
.form-item_narrow .form-item_tips {
  padding: 14px 4px;
}
.form-item_border-narrow .form-item_tips {
  padding: 0 14px 14px;
}
</style>
