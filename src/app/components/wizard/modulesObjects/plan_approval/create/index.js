// import {map} from 'lodash'
import submission_data from "../steps/request_module/submission_data";
import landData from "../steps/request_module/landData";
import waseka from "../steps/request_module/waseka";
import plans from "../steps/request_module/plans";
import plans_motabkh from "../steps/motabkh_module/plans";
import bda2l_motabkh from "../steps/motabkh_module/bda2l";
import feesInfo from "../steps/plan_fees/feesInfo";
import plans_primary_approval from "../steps/primary_approval_module/plans";
import plans_review_primary_approval from "../steps/review_primary_approval_module/plans";
import plans_going_survey_review_approval_details from "../steps/going_survey_review_approval_details_module/plans";
import bda2l from "../steps/going_survey_review_approval_details_module/bda2l";
import lagna_karar from "../steps/going_survey_review_approval_details_module/lagna_karar";
import lagna_notes from "../steps/going_survey_review_approval_details_module/lagna_notes";
import print_notes from "../steps/going_survey_review_approval_details_module/print_notes";
import plans_final_approval from "../steps/final_approval_module/tabtiriPlans";
import tabtiriPlans_attachments from "../steps/final_approval_module/tabtiriPlans_attachments";
import plans_review_final_approval from "../steps/review_final_approval_module/tabtiriPlans";
import plans_study_final_approval from "../steps/study_final_approval_module/tabtiriPlans";

import data_msa7y from "../steps/request_module/data_msa7y";
import data_msa7y_view from "../steps/review_approval_module/data_msa7y";
import print_takreer from "../steps/primary_approval_module/print_takreer";
import ownerData from "app/helpers/modules/owner";
import destinationData from "../steps/request_module/destinationData";
import notes from "app/helpers/modules/imp_project/notes";
import notes_windows from "app/helpers/modules/imp_project/notes_windows";
import Comment from "app/helpers/modules/comment";
import admission_ctrl from "../steps/addmission_ministry_ctrl_module/admission_ctrl";
import supervision_attachments from "../steps/addmission_ministry_ctrl_module/supervision_attachments";
import requests from "../steps/request_module/requests";
import gov_requests from "../steps/request_module/gov_requests";
import tabtiriPlans_update_GIS_plan_basemap from "../steps/update_GIS_plan_basemap/tabtiriPlans";
import letter_print from "../steps/request_module/letter_print";
import karar_letter_print from "../steps/request_module/karar_letter_print";
import tabligh_letters_print from "../steps/request_module/tabligh_letters_print";
export const Create_Plan_Approval_Request = {
  name: "Create_Plan_Approval_Request",
  module_id: 25,
  steps: {
    submission_data: { ...submission_data },
    ownerData: { ...ownerData },
    landData: { ...landData },
    waseka: { ...waseka },
    data_msa7y: { ...data_msa7y },
    plans: { ...plans },
    requests: { ...requests },
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

export const create_gov_plan_approval_request = {
  name: "create_gov_plan_approval_request",
  module_id: 108,
  steps: {
    submission_data: { ...submission_data },
    destinationData: { ...destinationData },
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

export const continue_create_gov_plan_approval_request = {
  name: "continue_create_gov_plan_approval_request",
  module_id: 109,
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
    plans: { ...plans },
    requests: { ...gov_requests },
    remark: { ...Comment },
  },
};

export const Review = {
  name: "review",
  module_id: 2,
  steps: {
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
    remark: { ...Comment },
  },
};
export const Review_Approval = {
  name: "survey_review_plan_request",
  module_id: 48,
  steps: {
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
    data_msa7y: { ...data_msa7y_view },
    remark: { ...Comment },
  },
};
export const tawgeh = {
  name: "going_survey_review_approval_details",
  module_id: 42,
  steps: {
    summery: {
      number: 1,
      label: "Summary",
      sections: {
        summery: {
          label: "Summary",
          type: "wizardSummery",
        },
      },
    },
    plans: { ...plans_going_survey_review_approval_details },
    bda2l: { ...bda2l },
    print_notes: { ...print_notes },
    lagna_notes: { ...lagna_notes },
    lagna_karar: { ...lagna_karar },
  },
};
export const signatures_karar_lagna_planapproval = {
  name: "signatures_karar_lagna_planapproval",
  module_id: 87,
  steps: {
    summery: {
      number: 1,
      label: "Summary",
      sections: {
        summery: {
          label: "Summary",
          type: "wizardSummery",
        },
      },
    },
    lagna_karar: { ...lagna_karar },
    remark: { ...Comment },
  },
};
export const print_karar_lagna_planapproval = {
  name: "print_karar_lagna_planapproval",
  module_id: 84,
  steps: {
    summery: {
      number: 1,
      label: "Summary",
      sections: {
        summery: {
          label: "Summary",
          type: "wizardSummery",
        },
      },
    },
    lagna_karar: { ...lagna_karar },
    remark: { ...Comment },
  },
};
export const motabkh = {
  name: "survey_plan_approval_details",
  module_id: 39,
  steps: {
    summery: {
      number: 1,
      label: "Summary",
      sections: {
        summery: {
          label: "Summary",
          type: "wizardSummery",
        },
      },
    },
    plans: { ...plans_motabkh },
    bda2l: { ...bda2l_motabkh },
    remark: { ...Comment },
  },
};
export const rosom = {
  name: "plan_fees",
  module_id: 56,
  steps: {
    summery: {
      number: 1,
      label: "Summary",
      sections: {
        summery: {
          label: "Summary",
          type: "wizardSummery",
        },
      },
    },
    fees: { ...feesInfo },
  },
};
export const primary_approval = {
  name: "bands_review_plan_approval",
  module_id: 47,
  steps: {
    summery: {
      number: 1,
      label: "Summary",
      sections: {
        summery: {
          label: "Summary",
          type: "wizardSummery",
        },
      },
    },
    plans: { ...plans_primary_approval },
    print_takreer: { ...print_takreer },
    remark: { ...Comment },
  },
};
// export const review_primary_approval = {
//   name: "bands_review_plan_approval",
//   module_id: 47,
//   steps: {
//     summery: {
//       number: 1,
//       label: "Summary",
//       sections: {
//         summery: {
//           label: "Summary",
//           type: "wizardSummery",
//         },
//       },
//     },
//     plans: { ...plans_review_primary_approval },
//     print_takreer: { ...print_takreer },
//     approvalSubmissionNotes: { ...Comment },
//   },
// };
export const addmission = {
  name: "addmission_ministry_ctrl",
  module_id: 44,
  steps: {
    summery: {
      number: 1,
      label: "Summary",
      sections: {
        summery: {
          label: "Summary",
          type: "wizardSummery",
        },
      },
    },
    supervision_attachments: { ...supervision_attachments },
    admissions: { ...admission_ctrl },
    remark: { ...Comment },
  },
};
export const review_admissions_develop_planapproval = {
  name: "review_admissions_develop_planapproval",
  module_id: 120,
  steps: {
    summery: {
      number: 1,
      label: "Summary",
      sections: {
        summery: {
          label: "Summary",
          type: "wizardSummery",
        },
      },
    },
    print_notes: { ...print_notes },
    admissions: { ...admission_ctrl },
    remark: { ...Comment },
  },
};

export const developing_infastructure_planapproval = {
  name: "developing_infastructure_planapproval",
  module_id: 89,
  steps: {
    summery: {
      number: 1,
      label: "Summary",
      sections: {
        summery: {
          label: "Summary",
          type: "wizardSummery",
        },
      },
    },
    print_takreer: { ...print_takreer },
    remark: { ...Comment },
  },
};

// export const mokhtbah = {
//   name: "addmission_ministry_ctrl",
//   module_id: 44,
//   steps: {
//     summery: {
//       number: 1,
//       label: "Summary",
//       sections: {
//         summery: {
//           label: "Summary",
//           type: "wizardSummery",
//         },
//       },
//     },
//     //admissions: {...admission_ctrl_mokhtbah},
//     approvalSubmissionNotes: { ...Comment },
//   },
// };
// export const review_tatwer = {
//   name: "addmission_ministry_ctrl",
//   module_id: 44,
//   steps: {
//     summery: {
//       number: 1,
//       label: "Summary",
//       sections: {
//         summery: {
//           label: "Summary",
//           type: "wizardSummery",
//         },
//       },
//     },

//     //admissions: {...admission_ctrl_review},
//     approvalSubmissionNotes: { ...Comment },
//   },
// };

export const final_approval = {
  name: "final_approval_plans",
  module_id: 45,
  steps: {
    summery: {
      number: 1,
      label: "Summary",
      sections: {
        summery: {
          label: "Summary",
          type: "wizardSummery",
        },
      },
    },
    tabtiriPlans: { ...plans_final_approval },
    tabtiriPlans_attachments: { ...tabtiriPlans_attachments },
    remark: { ...Comment },
  },
};

export const tabtiriplans_survey_planapproval = {
  name: "tabtiriplans_survey_planapproval",
  module_id: 121,
  steps: {
    summery: {
      number: 1,
      label: "Summary",
      sections: {
        summery: {
          label: "Summary",
          type: "wizardSummery",
        },
      },
    },
    tabtiriPlans: { ...plans_final_approval },
    letter_print: { ...letter_print },
    remark: { ...Comment },
  },
};

export const final_approval_planapproval = {
  name: "final_approval_planapproval",
  module_id: 122,
  steps: {
    summery: {
      number: 1,
      label: "Summary",
      sections: {
        summery: {
          label: "Summary",
          type: "wizardSummery",
        },
      },
    },
    karar_letter_print: { ...karar_letter_print },
    remark: { ...Comment },
  },
};

// export const review_final_approval = {
//   name: "final_approval_plans",
//   module_id: 45,
//   steps: {
//     summery: {
//       number: 1,
//       label: "Summary",
//       sections: {
//         summery: {
//           label: "Summary",
//           type: "wizardSummery",
//         },
//       },
//     },
//     tabtiriPlans: { ...plans_review_final_approval },
//     approvalSubmissionNotes: { ...Comment },
//   },
// };

// export const study_final_approval = {
//   name: "final_approval_plans",
//   module_id: 45,
//   steps: {
//     summery: {
//       number: 1,
//       label: "Summary",
//       sections: {
//         summery: {
//           label: "Summary",
//           type: "wizardSummery",
//         },
//       },
//     },
//     tabtiriPlans: { ...plans_study_final_approval },
//     approvalSubmissionNotes: { ...Comment },
//   },
// };

export const map_update = {
  name: "map_update",
  module_id: 2,
  steps: {
    summery: {
      number: 1,
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

export const primary_plan_approval = {
  name: "primary_plan_approval",
  module_id: 100,
  steps: {
    summery: {
      number: 1,
      label: "Summary",
      sections: {
        summery: {
          label: "Summary",
          type: "wizardSummery",
        },
      },
    },
    print_notes: {
      ...print_notes,
      isHidden: (supporting) => {
        return !(supporting?.isPrintNotesShown == true);
      },
    },
    remark: { ...Comment },
  },
};

export const update_GIS_plan_basemap = {
  name: "update_GIS_plan_basemap",
  module_id: 52,
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
    tabtiriPlans: { ...tabtiriPlans_update_GIS_plan_basemap },
  },
};

export const approve_survmanager_planapproval = {
  name: "approve_survmanager_planapproval",
  module_id: 139,
  steps: {
    summery: {
      number: 1,
      label: "Summary",
      sections: {
        summery: {
          label: "Summary",
          type: "wizardSummery",
        },
      },
    },
    tabtiriPlans: { ...plans_final_approval },
    letter_print: { ...letter_print },
    remark: { ...Comment },
  },
};

export const study_final_approval_spatialplan_planapproval = {
  name: "study_final_approval_spatialplan_planapproval",
  module_id: 140,
  steps: {
    summery: {
      number: 1,
      label: "Summary",
      sections: {
        summery: {
          label: "Summary",
          type: "wizardSummery",
        },
      },
    },
    tabtiriPlans: { ...plans_final_approval },
    karar_letter_print: { ...karar_letter_print },
    remark: { ...Comment },
  },
};
export const approve_planmanager_planapproval = {
  name: "approve_planmanager_planapproval",
  module_id: 141,
  steps: {
    summery: {
      number: 1,
      label: "Summary",
      sections: {
        summery: {
          label: "Summary",
          type: "wizardSummery",
        },
      },
    },
    tabtiriPlans: { ...plans_final_approval },
    karar_letter_print: { ...karar_letter_print },
    remark: { ...Comment },
  },
};

export const approve_planmanager_wakilamin_planapproval = {
  name: "approve_planmanager_wakilamin_planapproval",
  module_id: 142,
  steps: {
    summery: {
      number: 1,
      label: "Summary",
      sections: {
        summery: {
          label: "Summary",
          type: "wizardSummery",
        },
      },
    },
    tabligh_letters_print: { ...tabligh_letters_print },
    remark: { ...Comment },
  },
};

export const approve_amin_planapproval = {
  name: "approve_amin_planapproval",
  module_id: 143,
  steps: {
    summery: {
      number: 1,
      label: "Summary",
      sections: {
        summery: {
          label: "Summary",
          type: "wizardSummery",
        },
      },
    },
    tabligh_letters_print: { ...tabligh_letters_print },
    remark: { ...Comment },
  },
};

export const final_approval_spatialplan_planapproval = {
  name: "final_approval_spatialplan_planapproval",
  module_id: 144,
  steps: {
    summery: {
      number: 1,
      label: "Summary",
      sections: {
        summery: {
          label: "Summary",
          type: "wizardSummery",
        },
      },
    },
    tabligh_letters_print: { ...tabligh_letters_print },
    remark: { ...Comment },
  },
};
