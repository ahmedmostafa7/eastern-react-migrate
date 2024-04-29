// import { workFlowUrl } from 'configFiles/config'

export const ENG_COMP_FREEZE = ({ id: appId }) => ({
  number: 9,
  label: "labels:ENG_COMP_FREEZE",
  name: "engComp",
  moduleName: "ENG_COMP_FREEZE",
  apiUrl: `/EngineeringCompany/GetEngCompByAppId/${appId}`,
  content: {
    type: "tabsTable",
    views: ["name"],
    searchWith: ["name"],
    filters: ["workflows"],
    id: ["id"],
    actions: {
      activate: {
        name: "activate",
        label: "actions:Activate",
        function: "ActivateEmgComp",
        class: "btn follow",
        reloadUrl: `/EngineeringCompany/GetEngCompByAppId/${appId}/1`,
        visible: (rec) => {
          return rec.applications != null;
        },
        appId: appId,
      },
      freeze: {
        name: "Freeze",
        label: "actions:Freeze",
        class: "btn follow",
        function: "FreezeEngComp",
        reloadUrl: `/EngineeringCompany/GetEngCompByAppId/${appId}/1`,
        visible: (rec) => {
          return rec.applications == null;
        },
        appId: appId,
      },
    },
    fields: [
      {
        label: "labels:HEAD_NAME",
        name: "name",
        sorter: "sortReqNum",
      },
    ],
  },
  icon: "images/returned.svg",
});
