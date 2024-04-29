// import {map} from 'lodash'
import ownerData from "app/helpers/modules/owner";
import notes from "app/helpers/modules/imp_project/notes";
import Comment from "app/helpers/modules/comment";
import landData from "../steps/request_module/landData";
import data_msa7y from "../steps/request_module/data_msa7y";
import signatures from "../steps/asgin_signatures/signatures";
import waseka from "../steps/request_module/waseka";
import waseka_citizen from "../steps/request_module/waseka_citizen";
import update_contract_submission_data from "../steps/request_module/update_contract_submission_data";
import contract_commentments from "../steps/request_module/contract_commentments";

export const create_contract_update_request = {
  name: "create_contract_update_request",
  module_id: 18,
  steps: {
    ownerData: { ...ownerData },
    //landData: { ...landData },
    update_contract_submission_data: { ...update_contract_submission_data },
    waseka: { ...waseka },
    data_msa7y: { ...data_msa7y },
    approvalSubmissionNotes: { ...notes },
    //remarks: {},
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

export const contract_update_request_owner = {
  name: "contract_update_request_owner",
  module_id: 37,
  steps: {
    ownerData: { ...ownerData },
    waseka: { ...waseka_citizen },
    contract_commentments: { ...contract_commentments },
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
export const create_contract_update_engineer_request = {
  name: "create_contract_update_engineer_request",
  module_id: 38,
  steps: {
    summery0: {
      number: 8,
      label: "Summary",
      sections: {
        summery: {
          label: "Summary",
          type: "wizardSummery",
        },
      },
    },
    ownerData: { ...ownerData },
    landData: { ...landData },
    waseka: { ...waseka },
    data_msa7y: { ...data_msa7y },
    update_contract_submission_data: { ...update_contract_submission_data },
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

export const final_step_update_contract = {
  name: "final_step_update_contract",
  module_id: 118,
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
    // هنا كريم يتم اضافة شاشة الخريطة للانهاء

    data_msa7y: { ...data_msa7y },
  },
};

export const _default = {
  name: "default",
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

export const asgin_signatures = {
  name: "asgin_signatures",
  module_id: 19,
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
    signatures: { ...signatures },
    remark: { ...Comment },
  },
};

export const surv_default = {
  name: "surv_default",
  module_id: 20,
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
