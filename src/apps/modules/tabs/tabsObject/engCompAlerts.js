// import { workFlowUrl } from 'configFiles/config'
import { workFlowUrl } from "imports/config";
import { get } from "lodash";
export const ENGCOMP_ALERTS = ({ id: appId, user: CreatorUser }) => ({
  number: 10,
  label: "ENGCOMP_ALERTS",
  name: "engCompAlerts",
  moduleName: "ENGCOMP_ALERTS",
  apiUrl: `/submission/GetWarningSubmissions/${appId}`,
  tabHeaderCountLabel: "مجموع الإنذارات للمكتب الهندسي :",
  tabTotalApi: `/submission/GetEngCompWarningsCount/${CreatorUser?.id}/${appId}`,
  content: {
    type: "tabsTable",
    searchWith: ["request_no"],
    //filters: ["workflows", "CurrentStep.name"],
    views: ["request_no", "create_date", "warning_count"],
    id: ["id"],
    //actions: "common",
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
        label: "Warning Count",
        name: "warning_count",
        sorter: "sortNum",
        field: "text",
      },
      // {
      //     label: "Committee report number",
      //     name: 'committee_report_no',
      //     sorter: 'sortReqNum',
      // },
      // {
      //     label: "Export number",
      //     name: 'export_no',
      //     sorter: 'sortNum',
      // },
      // {
      //   label: "Creator name",
      //   name: "CreatorUser.name",
      //   field: "custom",
      //   fun(val, record) {
      //     if (!get(record, "CreatorUser")) {
      //       return get(record, "owner_name");
      //     }
      //     return get(record, "CreatorUser.engineering_companies.name", val);
      //   },
      //   sorter: "sortName",
      // },
      // {
      //   label: "Owner name",
      //   name: "owner_name",
      //   sorter: "sortName",
      // },
      // {
      //   label: "Step name",
      //   name: "CurrentStep.name",
      //   sorter: "sortName",
      //   filtering: true,
      // },
      // {
      //   label: "Type",
      //   placeholder: "Type",
      //   name: "workflows",
      //   field: "select",
      //   moduleName: "workflows",
      //   show: "workflows",
      //   //fetch: `${workFlowUrl}/workflow/GetCreatedStepInWorkFlow/${appId}`,
      //   fetch: `${workFlowUrl}/workFlow/GetCreatedStepInWorkFlow/${appId}`,
      //   value_key: "id",
      //   label_key: "name",
      // },
    ],
  },
  icon: "images/inbox.svg",
});
