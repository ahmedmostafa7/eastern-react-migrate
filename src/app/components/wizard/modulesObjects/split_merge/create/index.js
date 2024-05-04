// import {map} from 'lodash'
//import submission_data from "../steps/request_module/submission_data";
import ownerData from "app/helpers/modules/owner";
import notes from "app/helpers/modules/imp_project/notes";
import notes_windows from "app/helpers/modules/imp_project/notes_windows";
import landData_citizen from "../steps/request_module/landData_farz_citizen";
import waseka_citizen from "../steps/request_module/waseka_citizen";
import farz_simple_commentments_citizen from "../steps/request_module/farz_simple_commentments_citizen";
import landData_farz_simple from "../steps/request_module/landData_farz_simple";
import landData_farz_simple_duplix from "../steps/request_module/landData_farz_simple_duplix";
import landData_farz_no_gis from "../steps/request_module/landData_farz_no_gis";
import sugLandData_farz_no_gis from "../steps/request_module/suggestedParcels_no_gis";
import sugLandData_farz_duplex_no_gis from "../steps/request_module/suggestedParcels_duplex_no_gis";
import landData_farz_duplex_no_gis from "../steps/request_module/landData_farz_duplex_no_gis";
import farz_msa7y from "../steps/request_module/farz_msa7y";
import Tadkek_farz_msa7y from "../steps/request_module/Tadkek_farz_msa7y";
import submit_farz_msa7y from "../steps/request_module/submit_farz_msa7y";
import waseka from "../steps/request_module/waseka";
import farz_simple_commentments from "../steps/request_module/farz_simple_commentments";
import farz_duplix_commentments from "../steps/request_module/farz_duplix_commentments";
import technical_report from "../steps/request_module/farz_technical_report";
import duplix_building_details from "../steps/request_module/duplix_building_details";
import Comment from "app/helpers/modules/comment";
import mun_remark from "../steps/request_module/mun_remark";
import owner_summary from "../steps/request_module/owner_summary";
import Tadkek_farz_msa7y_duplix from "../steps/request_module/Tadkek_farz_msa7y_duplix";

export const split_empty_request = {
  name: "split_empty_request",
  module_id: 1,
  steps: {
    ownerData: { ...ownerData },
    //landData: { ...landData_farz_simple },
    tadkek_data_Msa7y: { ...Tadkek_farz_msa7y },
    waseka: { ...waseka },
    data_msa7y: { ...farz_msa7y }, // farz_msa7y
    // comments: { ...Comment },
    approvalSubmissionNotes: { ...notes },
    farz_commentments: { ...farz_simple_commentments },
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

export const split_empty_request_non_gis = {
  name: "split_empty_request_non_gis",
  module_id: 12,
  steps: {
    ownerData: { ...ownerData },
    landData: { ...landData_farz_no_gis },
    waseka: { ...waseka },
    sugLandData: { ...sugLandData_farz_no_gis },
    approvalSubmissionNotes: { ...notes },
    farz_commentments: { ...farz_simple_commentments },
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

export const split_duplixs_request = {
  name: "split_duplixs_request",
  module_id: 11,
  steps: {
    ownerData: { ...ownerData },
    // landData: { ...landData_farz_simple_duplix },
    tadkek_data_Msa7y: { ...Tadkek_farz_msa7y_duplix },
    waseka: { ...waseka },
    duplix_building_details: { ...duplix_building_details },
    data_msa7y: { ...farz_msa7y },
    duplix_checktor: { ...technical_report },
    approvalSubmissionNotes: { ...notes },
    farz_commentments: { ...farz_duplix_commentments },
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

export const split_duplixs_request_non_gis = {
  name: "split_duplixs_request_non_gis",
  module_id: 14,
  steps: {
    ownerData: { ...ownerData },
    landData: { ...landData_farz_duplex_no_gis },
    waseka: { ...waseka },
    duplix_building_details: { ...duplix_building_details },
    sugLandData: { ...sugLandData_farz_duplex_no_gis },
    duplix_checktor: { ...technical_report },
    approvalSubmissionNotes: { ...notes },
    farz_commentments: { ...farz_duplix_commentments },
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

export const split_empty_request_owner = {
  name: "split_empty_request_owner",
  module_id: 22,
  steps: {
    ownerData: { ...ownerData },
    landData: { ...landData_citizen },
    waseka: { ...waseka_citizen },
    farz_commentments: { ...farz_simple_commentments_citizen },
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

export const split_empty_request_engineer = {
  name: "split_empty_request_engineer",
  module_id: 23,
  steps: {
    owner_summary: { ...owner_summary },
    landData: { ...landData_farz_simple },
    waseka: { ...waseka },
    data_msa7y: { ...farz_msa7y }, // farz_msa7y
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

export const split_empty_request_duplix_engineer = {
  name: "split_empty_request_duplix_engineer",
  module_id: 34,
  steps: {
    owner_summary: { ...owner_summary },
    landData: { ...landData_farz_simple_duplix },
    waseka: { ...waseka },
    duplix_building_details: { ...duplix_building_details },
    data_msa7y: { ...farz_msa7y }, //
    duplix_checktor: { ...technical_report },
    approvalSubmissionNotes: { ...notes },
    farz_commentments: { ...farz_duplix_commentments },
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

export const default_split_merge = {
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

export const final_step_spm = {
  name: "final_step_spm",
  module_id: 6,
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
    data_msa7y: { ...submit_farz_msa7y },
  },
};

export const summary = {
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

export const issuing_technical_commitee = {
  name: "issuing_technical_commitee",
  module_id: 8,
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
    mun_remark: { ...mun_remark },
  },
};
