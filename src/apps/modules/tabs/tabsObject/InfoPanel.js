import { workFlowUrl } from "imports/config";

export const INFORMATION_PANEL = ({ id: appId }) => ({
  number: 10,
  label: "InfoPanel",
  name: "infoPanel",
  moduleName: "INFORMATION_PANEL",
  apiUrl: `${workFlowUrl}/search`, //`/submission/GetAllRunningSubmissions/${appId}/`,
  content: { type: "InfoPanel" },
  icon: "../images/infoLabel.svg",
  pageSize: 12,
});
