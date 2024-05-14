import { workFlowUrl } from "imports/config";
import { get } from "lodash";
export const RUNNING_ORDERING = ({ id: appId }) => ({
  number: 1,
  label: "Inbox_Ordering",
  name: "Inbox_Ordering",
  moduleName: "RUNNING_ORDERING",
  apiUrl: `/submission/GetRunningSubmissions/false/${appId}`,
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
  icon: "../images/inbox.svg",
});
