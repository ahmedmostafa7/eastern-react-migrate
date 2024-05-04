import notes from "app/helpers/modules/imp_project/notes";
import Comment from "app/helpers/modules/comment";
import letter from "../steps/request_module/letter";
import landData from "../steps/request_module/landData";
import waseka from "../steps/request_module/waseka";
import destinationData from "../steps/request_module/destinationData";
import attachments from "../steps/request_module/attachments";
import beneficiary_attachments from "../steps/request_module/beneficiary_attachments";
import print_karar_issue from "../steps/print_landsallotment/print_karar_issue";
export const create_landsallotment = {
  name: "create_landsallotment",
  module_id: 90,
  steps: {
    destinationData: { ...destinationData },
    letter: { ...letter },
    landData: { ...landData },
    waseka: { ...waseka },
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

export const review_landsallotment_munplan = {
  name: "review_landsallotment_munplan",
  module_id: 91,
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
    landData: { ...landData },
    attachments: { ...attachments },
    remark: { ...Comment },
  },
};

export const review_landsallotment_munsurvey = {
  name: "review_landsallotment_munsurvey",
  module_id: 92,
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
    landData: { ...landData },
    beneficiary_attachments: { ...beneficiary_attachments },
    remark: { ...Comment },
  },
};

export const print_landsallotment = {
  name: "print_landsallotment",
  module_id: 93,
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
    debagh: { ...print_karar_issue },
    remark: { ...Comment },
  },
};

export const prepare_landsallotment = {
  name: "prepare_landsallotment",
  module_id: 103,
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
    debagh: { ...print_karar_issue },
    remark: { ...Comment },
  },
};

export const approve_landsallotment = {
  name: "approve_landmanager_landsallotment",
  module_id: 117,
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
    debagh: { ...print_karar_issue },
    remark: { ...Comment },
  },
};

export const print_landsallotment_adle = {
  name: "print_landsallotment_adle",
  module_id: 94,
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
    debagh: { ...print_karar_issue },
    remark: { ...Comment },
  },
};

export const _default_landsAll = {
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

export const summary_landAll = {
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
