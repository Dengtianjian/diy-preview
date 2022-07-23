<template>
  <div class="upload-image">
    <n-upload
      accept="image/*"
      list-type="image"
      :show-file-list="false"
      :multiple="multiple"
      @change="selectedImageFile"
      :disabled="imageUploading"
    >
      <n-spin :show="imageUploading">
        <div class="upload-button">上传</div>
      </n-spin>
    </n-upload>
    <div class="images-preview" v-show="previews.length > 0">
      <div
        class="image-preview_item"
        v-for="(imageItem, itemIndex) in previews"
        :key="imageItem as string"
      >
        <n-image
          :height="60"
          :width="60"
          style="align-self: flex-start; margin-right: 10px"
          :src="imageItem"
        ></n-image>
        <div class="image-preview_remove" @click="removeImage(itemIndex)">
          移除
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NUpload, useMessage, NSpin } from "naive-ui";
import { ref, watch } from "vue";
const Props = defineProps({
  count: {
    type: Number,
    default: -1,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  previews: {
    type: Array,
    default: [],
  },
  uploading: {
    type: Boolean,
    default: false,
  },
});
const imageUploading = ref<boolean>(false);
watch(
  () => Props.uploading,
  (newV) => {
    if (newV === undefined) {
      imageUploading.value = false;
    } else {
      imageUploading.value = newV;
    }
  }
);

const Emits = defineEmits(["update:upload", "update:remove"]);
const Message = useMessage();

function selectedImageFile({ file, fileList }: any) {
  if (
    Props.count !== -1 &&
    Props.count &&
    Props.previews.length === Props.count
  ) {
    Message.error("最多仅允许上传" + Props.count + "张图片");
    return;
  }
  Emits("update:upload", file.file);
}
function removeImage(imageIndex: number): void {
  Emits("update:remove", imageIndex);
}
</script>

<style scoped>
.upload-image {
  display: flex;
}
.images-preview {
  margin-left: 10px;
}
.images-preview {
  flex-grow: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.image-preview_item {
  position: relative;
  width: 60px;
  height: 60px;
  border: 1px dashed #ccc;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-sizing: border-box;
}
.image-preview_remove {
  position: absolute;
  bottom: -100%;
  left: 0;
  width: 100%;
  height: 20px;
  line-height: 20px;
  text-align: center;
  color: white;
  font-size: 12px;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.4);
}
.image-preview_item:hover .image-preview_remove {
  bottom: 0;
}
.image-preview_item:hover .image-preview_remove:hover {
  background-color: rgba(0, 0, 0, 0.8);
}
.upload-button {
  width: 60px;
  height: 60px;
  line-height: 60px;
  font-size: 12px;
  text-align: center;
  color: #666;
  cursor: pointer;
  background: #fafafa;
  border: 1px dashed #ccc;
  transition: border-color 0.2s linear;
  border-radius: 3px;
  box-sizing: border-box;
}
.upload-button:hover {
  color: var(--font-color);
  border-color: var(--primary-color);
}
</style>
