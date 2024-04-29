import { get } from "lodash";
import moment from "moment-hijri";

export default {
  // search_with: {
  //   name: "search_with",
  //   label: "search_with",
  //   field: "select",
  //   data: [
  //     // {value: 'file_no'},
  //     { key: "request_no", value: "request_no" },
  //     { key: "labels:Submission Type", value: "SubmissionType" },
  //     { key: "رقم قطعة الأرض", value: "PARCEL_PLAN_NO" },
  //     { key: "owner_value", value: "owner_value" },
  //     { key: "tabs:Export number", value: "export_no" },
  //     { key: "tabs:Committee report number", value: "committee_report_no" },
  //   ],
  //   moduleName: "search_with",
  //   label_key: "key",
  //   value_key: "value",
  // },
  // sub_search_with: {
  //   name: "sub_search_with",
  //   label: "sub_search_with",
  //   hideLabel: false,
  //   field: "select",
  //   permission: { show_match_value: { search_with: "owner_value" } },
  //   data: [
  //     {
  //       value: 1,
  //       name: "OWNERIDHEAD",
  //     },
  //     {
  //       value: 2,
  //       name: "ENTITYCODE",
  //     },
  //     {
  //       value: 3,
  //       name: "COMMERCIALREGISTRATIONNO",
  //     },
  //     {
  //       value: 4,
  //       name: "OWNERNAMEHEAD",
  //     },
  //   ],
  //   moduleName: "sub_search_with",
  //   label_key: "name",
  //   value_key: "value",
  // },
  // SubmissionType: {
  //   name: "SubmissionType",
  //   label: "Submission Type",
  //   hideLabel: false,
  //   field: "select",
  //   permission: { show_match_value: { search_with: "SubmissionType" } },
  //   data: [
  //     {
  //       value: 1,
  //       name: "labels:runningProcesses",
  //     },
  //     {
  //       value: 2,
  //       name: "labels:finishedProcesses",
  //     },
  //     {
  //       value: 3,
        
  //       name: "labels:rejectedProcesses",
  //     },
  //   ],
  //   moduleName: "SubmissionType",
  //   label_key: "name",
  //   value_key: "value",
  // },
  // search: {
  //   name: "search",
  //   label: "search_value",
  //   permission: {
  //     not_match_value: { search_with: "PlanStatus" },
  //     not_match_value: { search_with: "SubmissionType" },
  //   },
  // },
  from_date: {
    name: "from_date",
    label: "from_date",
    field: "hijriDatePicker",
    dateFormat: "iYYYY/iMM/iDD",
    selectedDate: moment().format("iYYYY/iMM/iDD"),
    lessThanToday: true,
    lessThanDate: { key: "to_date", label: "الى تاريخ" },
  },
  to_date: {
    name: "to_date",
    label: "to_date",
    field: "hijriDatePicker",
    dateFormat: "iYYYY/iMM/iDD",
    selectedDate: moment().format("iYYYY/iMM/iDD"),
    lessThanToday: true,
    moreThanDate: { key: "from_date", label: "من تاريخ" },
  },
};
