import { workFlowUrl } from "imports/config";

export const FOLLOWING_REQUESTS = ({ id: appId }) => ({
  number: 7,
  label: "FollowingRequests",
  name: "following_requests",
  moduleName: "FOLLOWING_REQUESTS",
  apiUrl: `/submission/statistics/app/16/classificationStats`, //`/submission/GetAllRunningSubmissions/${appId}/`,
  content: { type: "FollowingRequests" },
  icon: "images/infoLabel.svg",
  pageSize: 12,
});
