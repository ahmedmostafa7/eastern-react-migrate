import { workFlowUrl } from "imports/config";

export const LANDSALLOTMENT_REQUESTED_REPORTING = ({ id: appId }) => ({
  number: 13,
  label: "allotmentRequestingReporting",
  name: "allotmentRequestingReporting",
  moduleName: "LANDSALLOTMENT_REQUESTED_REPORTING",
  apiUrl: `${workFlowUrl}/search-json/`,
  content: { type: "allotmentRequestingReporting" },
  icon: "../images/addedparcels_reports.svg",
});
