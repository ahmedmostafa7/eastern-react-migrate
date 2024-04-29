import { workFlowUrl } from "configFiles/config";

export const DISTRICTS = {
  primaryKey: "id",
  apiUrl: "/District",
  label: "Districts",
  singleLabel: "district",
  icon: "global",
  views: ["name"],
  search_with: ["name"],
  show: "name",
  fields: {
    name: {
      required: true,
      label: "Name",
    },
    municipility_id: {
      label: "Municipality",
      field: "select",
      fetch: `${workFlowUrl}/Municipalities`,
      moduleName: "MUNICIPALITIES",
      label_key: "name",
      value_key: "id",
      api_config: { params: { pageIndex: 1, pageSize: 2000 } },
      required: true,
    },
  },
};
