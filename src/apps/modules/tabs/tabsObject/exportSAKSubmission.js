import { workFlowUrl } from "imports/config";
import { get } from "lodash";
import { checkTabsColumnsByAppId } from "../tableActionFunctions";
export const EXPORT_SAK_SUBMISSIONS = ({ id: appId }) => ({
  number: 2,
  label: "Ridgenerated",
  name: "EXPORT_SAK_SUBMISSIONS",
  moduleName: "EXPORT_SAK_SUBMISSIONS",
  apiUrl: `/submission/GetRunningSubmissions/ridgenerated/${appId}`,
  content: {
    type: "tabsTable",
    searchWith: ["request_no"],
    filters: ["workflows", "CurrentStep.name"],
    // main_filters: {
    //     step: {
    //         label: 'Current Step',
    //         name: 'CurrentStep.name'
    //     }
    // },
    views: [
      "request_no",
      "committee_report_no",
      "export_no",
      "CreatorUser.name",
      "create_date",
      "owner_name",
      "CurrentStep.name",
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
        // field: "custom",
        // fun(val, record) {
        //
        //   if (appId == 16 && record.currentStep.index > 20) {
        //     return get(record, "request_no");
        //   }
        //   return get(record, "committee_report_no", val);
        // },
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
        label: "Creator name",
        name: "CreatorUser.name",
        field: "custom",
        fun(val, record) {
          if (!get(record, "CreatorUser")) {
            return get(record, "owner_name");
          }
          return get(record, "CreatorUser.engineering_companies.name", val);
        },
        sorter: "sortName",
      },
      {
        label: (appId == 26 && "Department Name") || "Owner name",
        name: (appId == 26 && "CreatorUser.departments.name") || "owner_name",
        sorter: "sortName",
      },
      {
        label: "Step name",
        name: "CurrentStep.name",
        sorter: "sortName",
        filtering: true,
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
    ]),
  },
  icon: "../images/inbox.svg",
});
