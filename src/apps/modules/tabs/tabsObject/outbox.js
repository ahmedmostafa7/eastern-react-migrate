import { workFlowUrl } from "imports/config";
import { checkTabsColumnsByAppId } from "../tableActionFunctions";

export const REQUESTED_SUBMISSION = ({ id: appId }) => ({
  number: 0,
  label: "Outbox",
  name: "outbox",
  moduleName: "REQUESTED_SUBMISSION",
  apiUrl: `/submission/GetRunningSubmissions/requested/${appId}`,
  content: {
    type: "tabsTable",
    searchWith: ["request_no"],
    filters: ["workflows"],
    views: [
      "request_no",
      "committee_report_no",
      "export_no",
      "create_date",
      "owner_name",
      // "CurrentStep.name",
      "CreatorUser.departments.name",
    ],
    id: ["id"],
    actions: "common",
    fields: checkTabsColumnsByAppId(appId, [
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
        label: "Committee report number",
        name: (appId == 16 && "request_no") || "committee_report_no",
        sorter: "sortReqNum",
        visible: (rec) => {
          return appId == 16 ? false : true;
        },
      },
      {
        label: "Export number",
        name: "export_no",
        sorter: "sortNum",
      },
      {
        label: (appId == 26 && "Department Name") || "Owner name",
        name: (appId == 26 && "CreatorUser.departments.name") || "owner_name",
        sorter: "sortName",
      },
      // {
      //   label: "Step name",
      //   name: "CurrentStep.name",
      //   sorter: "sortName",
      //   filtering: true,
      // },
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
    ]),
  },
  icon: "../images/sent.svg",
});
