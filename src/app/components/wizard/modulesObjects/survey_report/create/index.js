// import {map} from 'lodash'
//import submission_data from "../steps/request_module/submission_data";
import ownerData from "app/helpers/modules/owner";
import notes from "app/helpers/modules/imp_project/notes";
import notes_windows from "app/helpers/modules/imp_project/notes_windows";
import Comment from "app/helpers/modules/comment";
import landData from "../steps/request_module/landData";
import landData_unplan from "../steps/request_module/landData_unplan";
import data_msa7y from "../steps/request_module/data_msa7y";
import waseka from "../steps/request_module/waseka";
import owner_summary from "../../split_merge/steps/request_module/owner_summary";

export const create_survay_report_request = {
  name: "create_survay_report_request",
  module_id: 16,
  steps: {
    ownerData: { ...ownerData },
    landData: { ...landData },
    waseka: { ...waseka },
    data_msa7y: { ...data_msa7y },
    approvalSubmissionNotes: { ...notes },
    summery: {
      number: 8,
      label: "Summary",
      sections: {
        summery: {
          label: "Summary",
          type: "wizardSummery",
        },
      },
    },
  },
};

export const create_survay_report_request_non_gis = {
  name: "create_survay_report_request_non_gis",
  module_id: 17,
  steps: {
    ownerData: { ...ownerData },
    landData: { ...landData_unplan },
    waseka: { ...waseka },
    data_msa7y: { ...data_msa7y },
    approvalSubmissionNotes: { ...notes },
    summery: {
      number: 8,
      label: "Summary",
      sections: {
        summery: {
          label: "Summary",
          type: "wizardSummery",
        },
      },
    },
  },
};

export const split_empty_request_survey_engineer = {
  name: "split_empty_request_survey_engineer",
  module_id: 35,
  steps: {
    owner_summary: { ...owner_summary },
    landData: { ...landData },
    waseka: { ...waseka },
    data_msa7y: { ...data_msa7y },
    approvalSubmissionNotes: { ...notes },
    summery: {
      number: 8,
      label: "Summary",
      sections: {
        summery: {
          label: "Summary",
          type: "wizardSummery",
        },
      },
    },
  },
};

export const _default_survayReports = {
  name: "default",
  module_id: 2,
  steps: {
    summery: {
      number: 8,
      label: "Summary",
      sections: {
        summery: {
          label: "Summary",
          type: "wizardSummery",
        },
      },
    },
    comments: { ...Comment },
  },
};

export const summary_survayReport = {
  name: "summary",
  module_id: 7,
  steps: {
    summery: {
      number: 8,
      label: "Summary",
      sections: {
        summery: {
          label: "Summary",
          type: "wizardSummery",
        },
      },
    },
  },
};
