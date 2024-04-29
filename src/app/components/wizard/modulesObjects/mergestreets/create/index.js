// import {map} from 'lodash'
import ownerData from "app/helpers/modules/owner";
import notes from "app/helpers/modules/imp_project/notes";
import Comment from "app/helpers/modules/comment";
import landData from "../steps/request_module/landData";
import landData_exportCAD from "../steps/request_module/landData_exportCAD";
import waseka from "../steps/request_module/waseka";
import admission from "../steps/request_module/admission";
import admission_drasa from "../steps/request_module/admission_drasa";
import data_msa7y from "../steps/request_module/data_msa7y";
import data_msa7y_exportCAD from "../steps/request_module/data_msa7y_exportCAD";
import data_msa7y_details from "../steps/request_module/data_msa7y_details";
import debagh from "../steps/request_module/debagh";
import approvals from "../steps/request_module/approvals";
import print_notes from "../steps/request_module/print_notes";
import final_approvals from "../steps/request_module/final_approvals";
import final_approvals_attahments from "../steps/request_module/final_approvals_attahments";
export const create_mergestreets_request = {
  name: "create_mergestreets_request",
  module_id: 57,
  steps: {
    ownerData: { ...ownerData },
    landData: { ...landData },
    waseka: { ...waseka },
    admission: { ...admission },
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

export const cadsurvey_mergestreets = {
  name: "cadsurvey_mergestreets",
  module_id: 59,
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
    landData: { ...landData_exportCAD },
    remark: { ...Comment },
  },
};

export const uploadcad_mergestreets = {
  name: "uploadcad_mergestreets",
  module_id: 58,
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
    landData: { ...landData_exportCAD },
    data_msa7y: { ...data_msa7y },
    remark: { ...Comment },
  },
};

export const approve_mergestreets = {
  name: "approve_mergestreets",
  module_id: 60,
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
    debagh: { ...debagh },
    remark: { ...Comment },
  },
};

export const attachment_mergestreets = {
  name: "attachment_mergestreets",
  module_id: 61,
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
    approvals: { ...approvals },
    remark: { ...Comment },
  },
};

export const study_mergestreets = {
  name: "study_mergestreets",
  module_id: 63,
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
    landData: { ...landData_exportCAD },
    data_msa7y: { ...data_msa7y_exportCAD },
    admission_drasa: { ...admission_drasa },
    remark: { ...Comment },
  },
};

export const nature_mergestreets = {
  name: "nature_mergestreets",
  module_id: 74,
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
    landData: { ...landData_exportCAD },
    data_msa7y: { ...data_msa7y_exportCAD },
    remark: { ...Comment },
  },
};

export const finalattachment_mergestreets = {
  name: "finalattachment_mergestreets",
  module_id: 75,
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
    final_approvals: { ...final_approvals },
    print_notes: { ...print_notes },
    remark: { ...Comment },
  },
};

export const printnotes_mergestreets = {
  name: "printnotes_mergestreets",
  module_id: 77,
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
    data_msa7y: { ...data_msa7y_details },
    print_notes: { ...print_notes },
    remark: { ...Comment },
  },
};

export const eatmadattachment_mergestreets = {
  name: "eatmadattachment_mergestreets",
  module_id: 79,
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
    final_approvals_attahments: { ...final_approvals_attahments },
    remark: { ...Comment },
  },
};

export const _default = {
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
    remark: { ...Comment },
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
  },
};
