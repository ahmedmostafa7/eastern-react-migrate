import notes from "app/helpers/modules/imp_project/notes";
import notes_windows from "app/helpers/modules/imp_project/notes_windows";
import Comment from "app/helpers/modules/comment";
import landData from "../tabs/landData";
import data_msa7y from "../tabs/data_msa7y";
import waseka from "../tabs/waseka";
import {
  extraMapOperations,
  surveyOperation,
} from "main_helpers/variables/mapOperations";

let module114 = {
  name: "create_surveycheck_request",
  module_id: 114,
  steps: {
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
module114.steps.data_msa7y.sections.msa7yData.fields.mapviewer = {
  ...module114.steps.data_msa7y.sections.msa7yData.fields.mapviewer,
  ...extraMapOperations,
};

export const create_surveycheck_request = {
  ...module114,
};

let module115 = {
  name: "review_gis_surveycheck",
  module_id: 115,
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
    data_msa7y: { ...JSON.parse(JSON.stringify(data_msa7y)) }, //hide upload
    remark: { ...Comment },
  },
};

module115.steps.data_msa7y.sections.msa7yData.fields.mapviewer = {
  ...module115.steps.data_msa7y.sections.msa7yData.fields.mapviewer,
  ...surveyOperation,
};

export const review_gis_surveycheck = {
  ...module115,
};

let module116 = {
  name: "review_mun_survey_surveycheck",
  module_id: 116,
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
    data_msa7y: { ...JSON.parse(JSON.stringify(data_msa7y)) }, //hide upload
    remark: { ...Comment },
  },
};

module116.steps.data_msa7y.sections.msa7yData.fields.mapviewer = {
  ...module116.steps.data_msa7y.sections.msa7yData.fields.mapviewer,
  ...surveyOperation,
};

export const review_mun_survey_surveycheck = {
  ...module116,
};
