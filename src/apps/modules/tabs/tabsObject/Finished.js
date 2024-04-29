import { workFlowUrl } from "imports/config";

export const FINISH_SUBMISSION = ({ id: appId }) => ({
  number: 5,
  label: "Finished",
  name: "Finished",
  moduleName: "FINISH_SUBMISSION",
  apiUrl: `/submission/GetRunningSubmissions/finished/${appId}`,
  content: { type: "Finished" },
  icon: "images/finished-work.svg",
  pageSize: 12,
});
