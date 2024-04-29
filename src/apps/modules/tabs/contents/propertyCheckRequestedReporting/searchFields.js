import { get } from "lodash";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { MUNICIPALITIES } from "../../../../../app/components/admin/modules";

export default {
  search_with: {
    name: "search_with",
    label: "search_with",
    field: "select",
    data: [
      { key: "labels:municipality", value: "municipalityCode" },
      { key: "labels:Submission Type", value: "SubmissionType" },
      // { key: "labels:Submission Steps", value: "SubmissionStep" },
    ],
    moduleName: "search_with",
    label_key: "key",
    value_key: "value",
  },
  municipalityCode: {
    name: "municipalityCode",
    label: "municipality",
    field: "select",
    fetch: `${workFlowUrl}/municipality/getall`,
    label_key: MUNICIPALITIES.show,
    value_key: "code",
    permission: { show_match_value: { search_with: "municipalityCode" } },
    invokeOnRender: true,
  },
  // SubmissionStep_workflow: {
  //   name: "SubmissionStep_workflow",
  //   label: "Workflow Titles",
  //   field: "select",
  //   fetch: `${workFlowUrl}/workFlow/GetCreatedStepInWorkFlow/{appId}`,
  //   value_key: "id",
  //   label_key: "name",
  //   permission: { show_match_value: { search_with: "SubmissionStep" } },
  //   invokeOnRender: true,
  //   selectChange: (val, rec, props) => {
  //
  //     if (rec?.id) {
  //       fetchData(`${workFlowUrl}/workflow/${rec.id}/steps`).then(
  //         (response) => {
  //           props.setSelector("SubmissionStep", {
  //             label_key: "name",
  //             value_key: "id",
  //             data: response,
  //             value: null,
  //           });
  //         }
  //       );
  //     }
  //   },
  // },
  // SubmissionStep: {
  //   name: "SubmissionStep",
  //   label: "Submission Steps",
  //   field: "select",
  //   permission: {
  //     show_every: ["SubmissionStep_workflow"],
  //     show_match_value: { search_with: "SubmissionStep" },
  //   },
  //   moduleName: "SubmissionStep",
  //   label_key: "name",
  //   value_key: "id",
  // },
  SubmissionType: {
    name: "SubmissionType",
    label: "Submission Type",
    hideLabel: false,
    field: "select",
    permission: { show_match_value: { search_with: "SubmissionType" } },
    data: [
      {
        value: 1,
        name: "labels:runningProcesses",
      },
      {
        value: 2,
        name: "labels:finishedProcesses",
      },
      {
        value: 3,

        name: "labels:rejectedProcesses",
      },
    ],
    moduleName: "SubmissionType",
    label_key: "name",
    value_key: "value",
  },
  // search: {
  //   name: "search",
  //   label: "search_value",
  //   permission: {
  //     not_match_value: { search_with: "SubmissionType" },
  //   },
  // },
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
