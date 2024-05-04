import notes from "app/helpers/modules/imp_project/notes";
import ownerData from "app/helpers/modules/owner";
import landData from "../steps/request_module/landData";
import landDataArchive from "../steps/request_module/landDataArchive";
import waseka from "../steps/request_module/waseka";
import Comment from "app/helpers/modules/comment";
import letter_print from "../steps/emission_propertycheck_sak_letter/letter_print";
import letter_adle_print from "../steps/print_send_propertycheck_letter_adle/letter_adle_print";
import afada_adle_statements from "../steps/adle_statement_propertycheck/afada_adle_statements";

import data_msa7y from "../steps/request_module/data_msa7y";

import data_msa7y_Revision from "../steps/request_module/data_msa7y_Revision";

export const create_propertycheck_request = {
  name: "create_propertycheck_request",
  module_id: 104,
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

export const emission_propertycheck_sak_letter = {
  name: "emission_propertycheck_sak_letter",
  module_id: 105,
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
    landDataArchive: { ...landDataArchive },
    letter_print: { ...letter_print },
    remark: { ...Comment },
  },
};

export const print_send_propertycheck_letter_adle = {
  name: "print_send_propertycheck_letter_adle",
  module_id: 106,
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
    letter_print: { ...letter_print },
    // letter_adle_print: { ...letter_adle_print },
    remark: { ...Comment },
  },
};

export const adle_statement_propertycheck = {
  name: "adle_statement_propertycheck",
  module_id: 107,
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
    afada_adle_statements: { ...afada_adle_statements },
    remark: { ...Comment },
  },
};

export const update_propertycheck_map = {
  name: "update_propertycheck_map",
  module_id: 119,
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
    // هنا كريم يتم اضافة شاشة الخريطة للانهاء
    data_msa7y: { ...data_msa7y },
  },
};

export const approve_sak_propertycheck = {
  name: "approve_sak_propertycheck",
  module_id: 111,
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
    letter_print: { ...letter_print },
    // letter_adle_print: { ...letter_adle_print },
    remark: { ...Comment },
  },
};

export const review_survey_propertycheck = {
  name: "review_survey_propertycheck",
  module_id: 134,
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
    data_msa7y: { ...data_msa7y_Revision },
    remark: { ...Comment },
  },
};

export const review_gis_propertycheck = {
  name: "review_gis_propertycheck",
  module_id: 135,
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
    data_msa7y: { ...data_msa7y_Revision },
    remark: { ...Comment },
  },
};

export const _default_propertyCheck = {
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

export const summary_propertyCheck = {
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
