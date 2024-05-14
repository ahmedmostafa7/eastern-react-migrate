import { workFlowUrl } from "imports/config";
import { get } from "lodash";
import { checkTabsColumnsByAppId } from "../tableActionFunctions";
export const PROBLEM_EXPORT_SAK = ({ id: appId }) => ({
  number: 5,
  label: "DeedMojErrors",
  name: "PROBLEM_EXPORT_SAK",
  moduleName: "PROBLEM_EXPORT_SAK",
  apiUrl: `/momrah/errors?appId=${appId}&errorType=mojDeedError`,
  content: {
    type: "tabsTable",
    searchWith: ["request_no"],
    filters: ["workflows", "CurrentStep.name"],
    main_filters: {
      request_no: {
        placeholder: "رقم المعاملة",
        name: "request_no",
        apiUrl: `/momrah/errors/requestNo?appId=${appId}&errorType=mojDeedError`,
      },
      // step: {
      //   placeholder: "اسم الخطوة",
      //   name: "CurrentStep.name",
      // },
    },
    views: ["request_no", "owner_name", "CreatorUser.name", "moj_deed_err"],
    id: ["id"],
    actions: {
      view: {
        name: "view",
        label: "View",
        function: "view",
        class: "view",
      },
      followUp: {
        name: "followUp",
        label: "Follow up",
        function: "followUp",
        class: "follow",
      },
      sakUpdate: {
        name: "sakUpdate",
        label: "Sak Update",
        function: "sakUpdate",
        class: "follow",
      },
      print: {
        name: "print",
        label: "Print",
        function: "print",
        class: "print_arch",
      },
    },
    fields: checkTabsColumnsByAppId(appId, [
      {
        label: "Request number",
        name: "request_no",
        sorter: "sortReqNum",
        field: "text",
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
        name: "moj_deed_err",
        sorter: "sortName",
        filtering: true,
      },
    ]),
  },
  icon: "../images/realEstate.svg",
});
