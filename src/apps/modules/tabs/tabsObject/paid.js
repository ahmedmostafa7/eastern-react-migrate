import { workFlowUrl } from "imports/config";
import { get, isNumber } from "lodash";

export const PAYED_SUBMISSIONS = ({ id: appId }) => ({
  number: 3,
  icon: "../images/paid.svg",
  label: "Paid",
  name: "Paid",
  moduleName: "PAYED_SUBMISSIONS",
  apiUrl: `/submission/GetRunningSubmissions/paid/${appId}`,
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
      invoicePrint: {
        name: "invoicePrint",
        label: "InvoicePrint",
        function: "invoicePrint",
        class: "print_arch",
        visible: (rec) => {
          return (
            rec?.submission_invoices?.length > 0 ||
            isNumber(rec?.invoice_number)
          );
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
});
