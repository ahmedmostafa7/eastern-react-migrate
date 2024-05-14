// import { workFlowUrl } from 'configFiles/config'

export const RETURNED_SUBMISSION = ({ id: appId }) => ({
  number: 2,
  label: "Returned",
  name: "returned",
  moduleName: "RETURNED_SUBMISSION",
  apiUrl: `/submission/GetRunningSubmissions/returned/${appId}${
    (appId == 29 && "?pageSize=18") || ""
  }`,
  content: {
    type: "tabsTable",
    views: [
      "request_no",
      "committee_report_no",
      "export_no",
      "create_date",
      "status",
      "CurrentStep.name",
    ],
    searchWith: ["request_no"],
    filters: ["workflows"],
    id: ["id"],
    actions: {
      edit: {
        name: "edit",
        label: "Edit",
        class: "edit",
        function: "editReturned",
        class: "ediT",
      },
      // print: {
      //     name: 'print',
      //     label: 'Print',
      //     function: 'print',
      //     class:'print'
      // },
    },
    fields: [
      {
        label: "Request number",
        name: "request_no",
        sorter: "sortReqNum",
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
        label: "Status",
        name: "status",
        field: "status",
      },
      {
        label: "Step name",
        name: "CurrentStep.name",
        sorter: "sortName",
      },
    ],
  },
  icon: "../images/returned.svg",
});
