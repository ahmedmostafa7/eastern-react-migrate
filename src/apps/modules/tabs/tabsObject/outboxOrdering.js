import { workFlowUrl } from "imports/config";

export const REQUESTED_ORDERING = ({ id: appId }) => ({
  number: 0,
  label: "Outbox_Ordering",
  name: "Outbox_Ordering",
  moduleName: "REQUESTED_ORDERING",
  apiUrl: `/submission/GetRunningSubmissions/requested/${appId}`,
  content: {
    type: "tabsTable",
    searchWith: ["request_no"],
    filters: ["workflows", "CurrentStep.name"],
    views: ["request_no", "create_date", "CurrentStep.name"],
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
        sorter: "sortReqNum",
        field: "text",
      },
      {
        label: "Create date",
        name: "create_date",
        sorter: "sortDate",
        field: "textDate",
      },

      {
        label: "Step name",
        name: "CurrentStep.name",
        sorter: "sortName",
        filtering: true,
      },
    ],
  },
  icon: "images/sent.svg",
});
