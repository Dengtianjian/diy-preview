import ProjectsApi from "../api/modules/ProjectsApi";
import Dayjs from "../foundation/dayjs";

export default {
  getProjectLastBuild(projectId: string) {
    return ProjectsApi.getProjectLastBuild(projectId).then(
      ({ record, queuePosition, stopReason }) => {
        if (record !== null) {
          record.createdAtFormat = record.createdAt
            ? Dayjs(record.createdAt * 1000).format("YYYY-MM-DD HH:mm:ss")
            : "-";
          record.startAtFormat = record.startAt
            ? Dayjs(record.startAt * 1000).format("YYYY-MM-DD HH:mm:ss")
            : "-";
          record.buildStartAtFormat = record.buildStartAt
            ? Dayjs(record.buildStartAt * 1000).format("YYYY-MM-DD HH:mm:ss")
            : "-";
          record.buildEndAtFormat = record.buildEndAt
            ? Dayjs(record.buildEndAt * 1000).format("YYYY-MM-DD HH:mm:ss")
            : "-";
          record.endAtFormat = record.endAt
            ? Dayjs(record.endAt * 1000).format("YYYY-MM-DD HH:mm:ss")
            : "-";
        }
        return {
          record,
          queuePosition,
          stopReason
        }
      }
    );
  }
}