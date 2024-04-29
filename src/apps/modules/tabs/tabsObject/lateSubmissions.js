import { workFlowUrl } from "configFiles/config";

export const lateSubmissions = ({ id: appId }) => ({
  number: 8,
  label: "Late submissions",
  name: "lateSubmissions",
  moduleName: "lateSubmissions",
  apiUrl: `/submission/GetScalatedSubmission/${appId}`,
  content: {
    type: "tabsTable",
    searchWith: ["request_no"],
    filters: ["workflows"],
    views: ["request_no", "scalated_hours", "owner_name"],
    id: ["id"],
    actions: {
      view: {
        name: "view",
        label: "View",
        function: "View",
        class: "view",
      },
    },
    fields: [
      {
        label: "Request number",
        name: "request_no",
        sorter: "sortReqNum",
      },
      {
        label: "Scalated hours",
        name: "scalated_hours",
        sorter: "sortNum",
      },
      {
        label: "Step name",
        name: "CurrentStep.name",
        sorter: "sortName",
      },
      {
        label: "Owner name",
        name: "owner_name",
        sorter: "sortName",
      },
      {
        label: "Type",
        placeholder: "Type",
        name: "workflows",
        field: "select",
        moduleName: "workflows",
        show: "workflows",
        //fetch:`${workFlowUrl}/workflow/GetCreatedStepInWorkFlow/${appId}`,
        fetch: `${workFlowUrl}/workFlow/GetCreatedStepInWorkFlow/${appId}`,
        value_key: "id",
        label_key: "name",
      },
    ],
  },
});
