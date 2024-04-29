import { workFlowUrl } from "configFiles/config";
import { USER_TITLE } from "../";

export const COMMITTEES = {
  primaryKey: "id",
  apiUrl: "/api/committee",
  label: "Committies",
  singleLabel: "committee",
  icon: "global",
  views: ["name", "users"],
  search_with: ["name"],
  show: "name",
  preSubmit: {
    new: {
      convertArrayToObjectArrayFromSelectors: {
        field: "users",
        key: "users",
        moduleName: "USER_TITLE_PROVINCE",
        value_key: USER_TITLE.primaryKey,
      },
    },
    edit: {
      convertArrayToObjectArrayFromSelectors: {
        field: "users",
        key: "users",
        moduleName: "USER_TITLE_PROVINCE",
        value_key: USER_TITLE.primaryKey,
      },
    },
  },
  preOpen: {
    edit: {
      convertObjectArrayToArray: {
        field: "committee_actors",
        key: "user_id",
        newKey: "users",
      },
    },
  },
  fields: {
    name: {
      required: true,
      label: "Name",
      unique: true,
    },
    users: {
      label: "Committe Members",
      field: "multiSelect",
      label_key: USER_TITLE.show,
      value_key: USER_TITLE.primaryKey,
      moduleName: "USER_TITLE_PROVINCE",
      fetch: `${workFlowUrl}/user/getall`,
      api_config: {
        params: { pageSize: 2000, q: 2, filter_key: "province_id" },
      },
      show: "committee_actors.length",
      isValueTheObject: true,
      required: true,
    },
  },
};
