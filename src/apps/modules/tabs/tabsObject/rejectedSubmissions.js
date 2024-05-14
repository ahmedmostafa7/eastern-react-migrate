import { workFlowUrl } from "imports/config";

export const REJECTED_SUBMISSION = ({ id: appId }) => ({
  number: 3,
  label: "Rejected submissions",
  name: "rejectedSubmissions",
  moduleName: "REJECTED_SUBMISSION",
  apiUrl: `/submission/GetRejectedArchivedSubmissions/${appId}`, // after app_id 3 is the type of rejected submissions
  content: {
    type: "tabsTable",
    views: ["request_no", "create_date"],
    searchWith: ["request_no"],
    filters: ["workflows"],
    id: ["id"],
    actions: {
      view: {
        name: "view",
        label: "View",
        function: "view",
        class: "view",
      },
    },
    fields: [
      {
        label: "Request number",
        name: "request_no",
      },
      {
        label: "Create date",
        name: "create_date",
        sorter: "sortDate",
        field: "textDate",
      },
      {
        label: "Type",
        placeholder: "Type",
        name: "workflows",
        field: "select",
        moduleName: "workflows",
        show: "workflows",
        //fetch: `${workFlowUrl}/workflow/GetCreatedStepInWorkFlow/${appId}`,
        fetch: `${workFlowUrl}/workFlow/GetCreatedStepInWorkFlow/${appId}`,
        value_key: "id",
        label_key: "name",
      },
    ],
  },
  icon: "../images/rejected.svg",
});
