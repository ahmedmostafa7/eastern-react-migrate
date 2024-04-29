// import { workFlowUrl } from 'configFiles/config'

export const TRANSFERED_SUBMISSIONS = ({ id: appId }) => ({
  number: 2,
  label: "Transferred",
  name: "transfered",
  moduleName: "TRANSFERED_SUBMISSIONS",
  apiUrl: `/submission/GetRunningSubmissions/transfered/${appId}`,
  content: {
    type: "tabsTable",
    views: ["request_no"],
    searchWith: ["request_no"],
    filters: ["workflows"],
    id: ["id"],
    actions: {
      view: {
        name: "view",
        label: "View",
        function: "view",
        class: "view",
      },
      accept: {
        name: "accept",
        label: "Accept",
        class: "btn follow",
        function: "approveTransferd",
        reloadUrl: `/submission/GetRunningSubmissions/transfered/${appId}`,
        appId: appId,
      },
      reject: {
        name: "refuse",
        label: "Refuse",
        class: "btn follow",
        function: "rejectTransferd",
        reloadUrl: `/submission/GetRunningSubmissions/transfered/${appId}`,
        appId: appId,
      },
    },
    fields: [
      {
        label: "Request number",
        name: "request_no",
        sorter: "sortReqNum",
      },
    ],
  },
  icon: "images/returned.svg",
});
