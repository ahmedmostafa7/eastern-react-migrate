import { ISSUERS_TYPE, MUNICIPALITIES } from "../";
import { workFlowUrl } from "configFiles/config";

export const ISSUERS = {
  primaryKey: "id",
  apiUrl: "/api/issuer",
  label: "Issuers",
  singleLabel: "issuer",
  icon: "global",
  views: [
    "name",
    "code",
    "type_id",
    "municipality_id",
    "address",
    "phone",
    "fax",
    "email",
    "website",
  ],
  show: "name",
  search_with: ["name"],
  fields: {
    name: {
      label: "Name",
      required: true,
      // unique: true
    },
    code: {
      label: "Issuer Code",
      type: "number",
      required: true,
    },
    type_id: {
      label: "Issuer type",
      show: "issuers_type.name",
      field: "select",
      label_key: ISSUERS_TYPE.show,
      value_key: ISSUERS_TYPE.primaryKey,
      moduleName: "ISSUERS_TYPE",
      fetch: `${workFlowUrl}${ISSUERS_TYPE.apiUrl}`,
      api_config: { params: { pageSize: 2000 } },
      required: true,
    },
    municipality_id: {
      label: "Municipality",
      show: "municipalities.name",
      field: "select",
      label_key: MUNICIPALITIES.show,
      value_key: MUNICIPALITIES.primaryKey,
      moduleName: "MUNICIPALITIES",
      fetch: `${workFlowUrl}${MUNICIPALITIES.apiUrl}`,
      api_config: { params: { pageSize: 2000 } },
      required: true,
    },
    address: {
      label: "Address",
      // unique: true
    },
    phone: {
      label: "Phone Number",
      type: "number",
      required: true,
    },
    fax: {
      label: "Fax",
      type: "number",
    },
    email: {
      label: "Email Address",
      emailValid: true,
      required: true,
    },
    website: {
      label: "Website",
    },
  },
};
