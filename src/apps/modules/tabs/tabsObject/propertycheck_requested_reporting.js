import { workFlowUrl } from "imports/config";

export const PROPERTYCHECK_REQUESTED_REPORTING = ({ id: appId }) => ({
  number: 13,
  label: "propertycheckRequestingReporting",
  name: "propertycheckRequestingReporting",
  moduleName: "PROPERTYCHECK_REQUESTED_REPORTING",
  apiUrl: `${workFlowUrl}/search-json/`,
  content: { type: "propertycheckRequestingReporting" },
  icon: "../images/addedparcels_reports.svg",
});
