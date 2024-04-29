import { APPLICATIONS } from "../";
import { workFlowUrl } from "configFiles/config";

export const GROUPS = {
  primaryKey: "id",
  apiUrl: "/Groups",
  label: "Groups",
  singleLabel: "group",
  icon: "global",
  deleteMessage:
    "unable to delete group because there are users that belongs to it",
  views: ["name"],
  search_with: ["name"],
  show: "name",
  fields: {
    name: {
      required: true,
      label: "Group Name",
      // unique: true
    },
    groups_permissions: {
      field: "tableList",
      label: "Jobs",
      hideLabels: true,
      addFrom: "top",
      moduleName: "GROUPSPERMISSIONS",
      value_key: "id",
      inline: true,
      preSubmit: {
        addValuesFromSelector: [
          {
            moduleName: "APPLICATIONS",
            value_key: APPLICATIONS.primaryKey,
            valueOf: "app_id",
            key: "applications",
          },
          {
            moduleName: "MODULES",
            value_key: "id",
            valueOf: "module_id",
            key: "apps_modules",
          },
        ],
      },
      fields: [
        {
          name: "app_id",
          label: "Application",
          field: "select",
          fetch: `${workFlowUrl}${APPLICATIONS.apiUrl}`,
          api_config: { params: { pageIndex: 1, pageSize: 2000 } },
          moduleName: "APPLICATIONS",
          label_key: APPLICATIONS.show,
          value_key: APPLICATIONS.primaryKey,
          show: `applications.${APPLICATIONS.show}`,
          required: true,
        },
        {
          name: "module_id",
          label: "Module",
          field: "select",
          fetch: `${workFlowUrl}/appmodules/`,
          api_config: { params: { pageIndex: 1, pageSize: 2000 } },
          moduleName: "MODULES",
          label_key: "name",
          value_key: "id",
          show: `apps_modules.name`,
          required: true,
        },
        {
          name: "get",
          label: "Read",
          field: "boolean",
          hide_sublabel: true,
        },
        {
          name: "create",
          label: "Create",
          field: "boolean",
          hide_sublabel: true,
        },
        {
          name: "update",
          label: "Update",
          field: "boolean",
          hide_sublabel: true,
        },
        {
          name: "delete",
          label: "Delete",
          field: "boolean",
          hide_sublabel: true,
        },
      ],
    },
  },
};
