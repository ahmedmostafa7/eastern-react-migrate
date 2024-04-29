import { workFlowUrl } from "imports/config";
import { get } from "lodash";
export const SIGNED_SUBMISSIONS = ({ id: appId }) => ({
  number: 5,
  label: "Signed",
  name: "signed",
  moduleName: "SIGNED_SUBMISSIONS",
  apiUrl: `/submission/GetSignedSubmissions/${appId}`,
  content: {
    type: "tabsTable",
    searchWith: ["request_no"],
    filters: ["workflows", "CurrentStep.name"],
    views: [
      "request_no",
      "CreatorUser.name",
      "create_date",
      "owner_name",
      "CurrentStep.name",
    ],
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
      print: {
        name: "print",
        label: "Print",
        function: "print",
        class: "print_arch",
      },
      ma7darReport: {
        name: "ma7darReport",
        label: "تقرير محضر اللجنة الفنية",
        function: "ma7darReport",
        class: "print_arch",
        visible: (rec) => {
          return true;
        },
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
    ],
  },
  icon: "images/inbox.svg",
});
