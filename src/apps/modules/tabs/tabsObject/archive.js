import { workFlowUrl } from "imports/config";

export const ARCHIVED_SUBMISSION = ({ id: appId }) => ({
  number: 7,
  label: "Archive",
  name: "archive",
  moduleName: "ARCHIVED_SUBMISSION",
  apiUrl: `${workFlowUrl}/search/`,
  content: { type: "Archive" },
  icon: "../images/archive.svg",
});
