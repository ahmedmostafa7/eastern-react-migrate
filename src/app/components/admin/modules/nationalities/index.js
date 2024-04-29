import { workFlowUrl } from "configFiles/config";
import { NATIONALIDTYPES } from "../";
export const NATIONALITIES = {
  primaryKey: "id",
  apiUrl: "/api/Nationalities/",
  label: "Nationalities",
  singleLabel: "nationality",
  icon: "global",
  views: ["local_name", "nationalty_type_id"],
  search_with: ["name"],
  show: "local_name",
  fields: {
    local_name: {
      required: true,
      label: "Name",
      // unique: true
    },
    nationalty_type_id: {
      label: "National ID Type",
      field: "select",
      fetch: `${workFlowUrl}${NATIONALIDTYPES.apiUrl}`,
      moduleName: "NATIONALIDTYPES",
      label_key: NATIONALIDTYPES.show,
      value_key: NATIONALIDTYPES.primaryKey,
      api_config: { params: { pageSize: 2000 } },
      show: "nationalidtypes.name",
    },
  },
};
