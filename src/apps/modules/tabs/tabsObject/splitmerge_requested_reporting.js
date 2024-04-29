import { workFlowUrl } from "imports/config";

export const SPLITEMARGE_REQUESTED_REPORTING = ({ id: appId }) => ({
  number: 13,
  label: "splitmergeRequestingReporting",
  name: "splitmergeRequestingReporting",
  moduleName: "SPLITEMARGE_REQUESTED_REPORTING",
  apiUrl: `${workFlowUrl}/search-json/`,
  content: { type: "splitmergeRequestingReporting" },
  icon: "images/addedparcels_reports.svg",
});
