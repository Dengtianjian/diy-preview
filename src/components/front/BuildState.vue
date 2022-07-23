<template>
  <div>
    <g-panel class="build-state">
      <section>
        <h2>{{ buildStatusTitle[data.status] }}</h2>
        <h6 v-show="errorReason">
          {{ errorReason }}
        </h6>
        <div class="build-queuing" v-if="data.status == 1">
          {{ queueReminder }}
        </div>
      </section>
      <n-progress
        class="build-progress"
        :processing="data.status < 3"
        :percentage="Number(data.progress) || 0"
        :color="data.status == 4 ? 'var(--color-red)' : 'var(--primary-color)'"
        :stroke-width="16"
        :show-indicator="true"
        indicator-placement="inside"
      ></n-progress>
      <ul class="build-info">
        <li>
          <div>创建时间</div>
          {{ data.createdAtFormat }}
        </li>
        <li>
          <div>开始时间</div>
          {{ data.startAtFormat }}
        </li>
        <li>
          <div>结束时间</div>
          {{ data.endAtFormat }}
        </li>
        <li>
          <div>构建开始时间</div>
          {{ data.buildStartAtFormat }}
        </li>
        <li>
          <div>构建结束时间</div>
          {{ data.buildEndAtFormat }}
        </li>
        <li>
          <div>构建类型</div>
          {{ data.technologyId }}
        </li>
        <li>
          <div>构建时长</div>
          {{ data.status == 3 ? `${data.buildDuration}秒` : "-" }}
        </li>
        <li>
          <div>进度</div>
          {{ data.progress || 0 }}%
        </li>
        <li>
          <div>状态</div>
          {{ buildStatusLangs[data.status] }}
        </li>
        <li>
          <div>页面数量</div>
          {{ data.pageCount }}
        </li>
      </ul>
    </g-panel>
  </div>
</template>

<script lang="ts" setup>
import { NProgress, NAlert } from "naive-ui";
import { computed, ref } from "vue";
const Props = defineProps({
  data: {
    type: Object,
    default() {
      return {};
    },
  },
  queuePosition: {
    type: Number,
    default: null,
  },
  errorReason: {
    type: String,
    default: null,
  },
});
const buildStatusLangs = {
  1: "排队中",
  2: "进行中",
  3: "已完成",
  4: "已中断",
};
const buildStatusTitle = {
  1: "队列排队中",
  2: "任务进行中",
  3: "任务已完成",
  4: "任务已中断",
};
const queueReminder = computed(() => {
  if (Props.queuePosition === 0) {
    return "构建即将开始，感谢您的耐心等候";
  } else if (Props.queuePosition !== null) {
    return `排在第 ${Props.queuePosition} 位。由于构建人数过多，请耐心等候`;
  } else {
    return "队列所在位置未知，请稍后";
  }
});
</script>

<style scoped>
.build-state h2 {
  font-size: 20px;
  text-align: center;
}
.build-state h6 {
  margin-top: 10px;
  font-size: 14px;
  text-align: center;
  color: var(--color-red);
}
.build-progress {
  margin-top: 20px;
}
.build-queuing {
  margin-top: 20px;
  text-align: center;
  /* font-weight: bold; */
}
.build-info {
  display: grid;
  grid-template-columns: repeat(3, 33.3%);
  gap: 20px;
  margin: 40px auto;
  width: 90%;
}
.build-info li > div {
  display: inline-block;
  width: 120px;
  color: #666;
}
.build-info li > div::after {
  display: inline-block;
  content: "：";
}

.view-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
.view-details a {
  color: var(--primary-color);
}
</style>
