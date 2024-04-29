import { workFlowUrl } from "imports/config";

export const PLANAPPROVAL_REQUESTED_REPORTING = ({ id: appId }) => ({
  number: 13,
  label: "e3tmadRequestingReporting",
  name: "e3tmadRequestedReporting",
  moduleName: "PLANAPPROVAL_REQUESTED_REPORTING",
  apiUrl: `${workFlowUrl}/search-json/`,
  content: { type: "e3tmadRequestingReporting" },
  icon: "images/addedparcels_reports.svg",
});
