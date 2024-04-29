// import {map} from 'lodash'
import LandData from "app/helpers/modules/akarland";
import SakData from "app/helpers/modules/skok";
import notes from "app/helpers/modules/imp_project/notes";
import Comment from "app/helpers/modules/comment";

export const Akar = {
  name: "buy_akar",
  module_id: 78,
  steps: {
    landData: {
      ...LandData,
    },
    sakData: {
      ...SakData({
        search_params: {
          municapility_id: "wizard.mainObject.landData.landData.lands.temp.mun",
        },
      }),
    },
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

export const review_survey_tamlikakar = {
  name: "review_survey_tamlikakar",
  module_id: 136,
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
    remark: { ...Comment },
  },
};

export const approve_survey_tamlikakar = {
  name: "approve_survey_tamlikakar",
  module_id: 137,
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
    remark: { ...Comment },
  },
};

export const approve_munplan_manager_tamlikakar = {
  name: "approve_munplan_manager_tamlikakar",
  module_id: 138,
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
    remark: { ...Comment },
  },
};
