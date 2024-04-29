import notes from "app/helpers/modules/imp_project/notes";
import submission_data_export from "../steps/submission_data";
export const archive_sys = {
  name: "archive_sys",
  module_id: 88,
  steps: {
    submission_data_export: { ...submission_data_export },
    approvalSubmissionNotes: { ...notes },
    summery: {
      number: 1,
      label: "Summery",
      sections: {
        summery: {
          label: "Summery",
          type: "wizardSummery",
        },
      },
    },
  },
};
