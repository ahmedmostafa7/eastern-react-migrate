import { workFlowUrl } from "imports/config";

export const ADDEDPARCELS_REQUESTED_REPORTING = ({ id: appId }) => ({
  number: 12,
  label: "RequestedReporting",
  name: "addedparcelsRequestedReporting",
  moduleName: "ADDEDPARCELS_REQUESTED_REPORTING",
  apiUrl: `${workFlowUrl}/search-json/`,
  content: { type: "RequestingReporting" },
  icon: "../images/addedparcels_reports.svg",
  className: "reportIconColor",
});
