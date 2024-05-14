import { get } from "lodash";
import { workFlowUrl } from "imports/config";
export default {
  // search_with: {
  //   name: "search_with",
  //   label: "search_with",
  //   field: "select",
  //   data: [
  //     // {value: 'file_no'},
  //     { value: "request_no" },
  //     // { value: "owner_name" },
  //     // { value: "owner_ssn" },
  //   ],
  //   moduleName: "search_with",
  //   label_key: "value",
  //   value_key: "value",
  // },
  search: {
    name: "search",
    label: "request_no",
    permission: {
      not_match_value: { search_with: "PlanStatus" },
    },
  },
  from_date: {
    name: "from_date",
    label: "from_date",
    field: "hijriDatePicker",
    dateFormat: "iYYYY/iMM/iDD",
    lessThanToday: true,
    lessThanDate: { key: "to_date", label: "الى تاريخ" },
  },
  to_date: {
    name: "to_date",
    label: "to_date",
    field: "hijriDatePicker",
    dateFormat: "iYYYY/iMM/iDD",
    lessThanToday: true,
    moreThanDate: { key: "from_date", label: "من تاريخ" },
  },
};
