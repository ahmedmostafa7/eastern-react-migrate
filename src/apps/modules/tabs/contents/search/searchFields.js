import { get } from "lodash";

export const searchFields = {
  search_with: {
    name: "search_with",
    label: "Search with",
    field: "select",
    data: [
      { value: "file_no" },
      { value: "request_no" },
      { value: "owner_name" },
      { value: "owner_ssn" },
      { value: "eng_name" },
      { value: "PARCEL_PLAN_NO" },
      { value: "status" },
    ],
    moduleName: "search_with",
    label_key: "value",
    value_key: "value",
    resetFields: ["statusSearch"],
  },
  statusSearch: {
    name: "statusSearch",
    label: "Status search",
    field: "select",
    data: [
      { label: "Running", value: "1" },
      { label: "first approval", value: "الإعتماد الأولي" },
      { label: "final approval", value: "الإعتماد النهائي" },
      { label: "Finished", value: "2" },
      { label: "Rejected", value: "3" },
    ],
    moduleName: "search_with",
    label_key: "label",
    value_key: "value",
    permission: {
      show_match_value: { search_with: "status" },
    },
  },
  search: {
    name: "search",
    label: "search value",
    permission: {
      not_match_value: { search_with: "status" },
    },
  },
  from_date: {
    name: "from_date",
    label: "From date",
    field: "hijriDatePicker",
    dateFormat: "iYYYY/iMM/iDD",
    lessThanToday: true,
  },
  to_date: {
    name: "to_date",
    label: "To date",
    field: "hijriDatePicker",
    dateFormat: "iYYYY/iMM/iDD",
    lessThanToday: true,
  },
};
