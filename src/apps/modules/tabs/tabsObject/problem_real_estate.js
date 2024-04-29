import { workFlowUrl } from "imports/config";
import { get } from "lodash";
import { checkTabsColumnsByAppId } from "../tableActionFunctions";
export const PROBLEM_REAL_ESTATE = ({ id: appId }) => ({
  number: 5,
  label: "RIDErrors",
  name: "PROBLEM_REAL_ESTATE",
  moduleName: "PROBLEM_REAL_ESTATE",
  apiUrl: `/momrah/errors?appId=${appId}&errorType=ridError`,
  content: {
    type: "tabsTable",
    searchWith: ["request_no"],
    filters: ["workflows", "CurrentStep.name"],
    main_filters: {
      request_no: {
        placeholder: "رقم المعاملة",
        name: "request_no",
        apiUrl: `/momrah/errors/requestNo?appId=${appId}&errorType=ridError`,
      },
      // step: {
      //   placeholder: "اسم الخطوة",
      //   name: "CurrentStep.name",
      // },
    },
    views: ["request_no", "owner_name", "CreatorUser.name", "rid_error_msg"],
    id: ["id"],
    actions: "common",
    fields: checkTabsColumnsByAppId(appId, [
      {
        label: "Request number",
        name: "request_no",
        sorter: "sortReqNum",
        field: "text",
        filtering: true,
      },
      {
        label: (appId == 26 && "Department Name") || "Owner name",
        name: (appId == 26 && "CreatorUser.departments.name") || "owner_name",
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
        label: "problemReason",
        name: "rid_error_msg",
        sorter: "sortName",
      },
    ]),
  },
  icon: "images/realEstate.svg",
});
