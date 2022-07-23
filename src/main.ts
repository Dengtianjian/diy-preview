import { App, createApp } from 'vue'
import AppComponent from './App.vue'
import Router from './router';
import { create, NButton, NEllipsis, NDialogProvider, NMessageProvider, NImage, NSpin, NInput, NForm, NFormItem, NEmpty, NResult, NSpace, NScrollbar } from "naive-ui";
import GPanel from "CC/GPanel.vue";
import GHeader from "FC/GHeader.vue";
import "./assets/common.css";
import 'vant/lib/index.css';

const naive = create({
  components: [NButton, NEllipsis, NDialogProvider, NMessageProvider, NImage, NSpin, NInput, NForm, NFormItem, NEmpty, NResult, NSpace, NScrollbar]
});

const Ins: App<Element> = createApp(AppComponent);
Ins.use(Router);
Ins.use(naive);
Ins.component("GPanel", GPanel);
Ins.component("GHeader", GHeader);
Ins.mount('#app');
