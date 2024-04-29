import { workFlowUrl } from "imports/config";
import { get } from "lodash";
const checkTabFieldsByAppId = (appId) => {
  debugger;
  return appId == 29
    ? [
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
          label: "Charger",
          name: "users.name",
          sorter: "sortName",
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
          label: "Owner name",
          name: "owner_name",
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
      ]
    : [
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
          name: "committee_report_no",
          sorter: "sortReqNum",
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
          label: "Owner name",
          name: "owner_name",
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
      ];
};
export const SCALATION = ({ id: appId }) => ({
  number: 6,
  label: "Delayed",
  name: "Delayed",
  moduleName: "SCALATION",
  apiUrl: `/submission/GetScalated/${appId}`,
  content: {
    type: "tabsTable",
    searchWith: ["request_no"],
    filters: ["workflows", "CurrentStep.name"],
    views: [
      "request_no",
      "committee_report_no",
      "export_no",
      "CreatorUser.name",
      "create_date",
      "owner_name",
      "CurrentStep.name",
      "users.name",
    ],
    id: ["id"],
    actions: "common",
    fields: [...checkTabFieldsByAppId(appId)],
  },
  icon: "images/late.svg",
});
