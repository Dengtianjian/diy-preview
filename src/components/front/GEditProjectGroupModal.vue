<template>
  <n-modal v-model:show="show" @after-leave="closeModal">
    <n-card style="width: 600px" :title="title || '编辑项目组'" :bordered="false" size="huge">
      <template #header-extra>
        <i class="antdv antdv-close" @click="showModal = false" style="cursor: pointer"></i>
      </template>
      <n-form :show-label="false">
        <n-form-item>
          <g-upload-image v-model:previews="projectsIcons" :count="1" @update:upload="uploadIcon"
            @update:remove="removeIcon" :uploading="projectIconUploading"></g-upload-image>
        </n-form-item>
        <n-form-item>
          <n-input placeholder="请输入项目组名称" v-model:value="projectsName"></n-input>
        </n-form-item>
        <n-form-item>
          <n-input placeholder="请输入项目组描述" type="textarea" v-model:value="projectDescription"></n-input>
        </n-form-item>
      </n-form>
      <template #footer>
        <div class="modal-buttons_right">
          <n-button @click="
            showModal = false;
          cancelEditProjects;
          ">取消</n-button>
          <n-button type="primary" @click="save" :loading="loading">保存</n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { NModal, NCard, NFormItem, NForm, NInput, useMessage } from "naive-ui";
import GUploadImage from "FC/GUploadImage.vue";
import http from "../../foundation/http";
import config from "../../config";
import AttachmentApi from "../../api/modules/AttachmentApi";

const NMessage = useMessage();
const projectsIcons = reactive<Array<string>>([]);
const projectsName = ref<string>("");
const projectsIcon = ref<string>("");
const projectIconUploading = ref<boolean>(false);
const projectDescription = ref<string>("");

const showModal = ref<boolean>(false);

const Props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "编辑项目组",
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

watch(
  () => Props.show,
  (nv) => {
    if (nv === false) return;
    if (Props.icon) {
      projectsIcons.push(http.getAttachmentUrl(Props.icon));
      projectsIcon.value = Props.icon;
    }
    if (Props.name) {
      projectsName.value = Props.name;
    }
    if (Props.description) {
      projectDescription.value = Props.description;
    }
  }
);

const Emits = defineEmits(["save", "cancel", "update:show"]);
function closeModal() {
  Emits("update:show");
  projectsIcon.value = "";
  projectsName.value = "";
  projectDescription.value = "";
  projectsIcons.splice(0, projectsIcons.length);
}

function cancelEditProjects() {
  Emits("cancel");
}
function uploadIcon(iconFile: File) {
  projectIconUploading.value = true;
  http
    .uploadFile(config.APIURL + "/attachment", iconFile)
    .then((res) => {
      projectsIcons.push(http.getAttachmentUrl(res.fileId));
      projectsIcon.value = res.fileId;
    })
    .finally(() => {
      projectIconUploading.value = false;
    })
    .catch((err) => {
      projectsIcons.pop();
      NMessage.error(err.message);
    });
}
function removeIcon(fileIndex: number) {
  if (projectIconUploading.value === true) {
    return;
  }
  projectIconUploading.value = true;
  AttachmentApi.deleteAttachment(projectsIcon.value)
    .then((res) => {
      projectsIcons.splice(fileIndex, 1);
      projectsIcon.value = "";
    })
    .catch((err) => {
      NMessage.error(err.message);
    })
    .finally(() => {
      projectIconUploading.value = false;
    });
}
function save() {
  Emits("save", {
    icon: projectsIcon.value,
    name: projectsName.value,
    description: projectDescription.value,
  });
}
</script>

<style scoped>
</style>
