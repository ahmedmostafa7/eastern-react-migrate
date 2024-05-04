import notes from "app/helpers/modules/imp_project/notes";
import ownerData from "app/helpers/modules/owner";
import Comment from "app/helpers/modules/comment";
import judge_or_letter from "../steps/create_propertyremoval_requests/judge_or_letter";
import destinationData from "../steps/create_propertyremoval_requests/destinationData";
import efada_wakil_statements from "../steps/wakilamin_efada_propertyremoval/efada_wakil_statements";
import akar_data from "../steps/survplan_cads_propertyremoval/akar_data";
import primary_assessment_print from "../steps/approve_primary_price_propertyremoval/primary_assessment_print";
import approved_assessment_print from "../steps/print_primary_price_propertyremoval/approved_assessment_print";
import financial_Connection from "../steps/financial_connection_propertyremoval/financial_Connection";
import prepare_decision_print from "../steps/prepare_decision_start_propertyremoval/prepare_decision_print";
import approve_amin_prepare_decision_print from "../steps/approve_amin_decision_start_propertyremoval/approve_amin_prepare_decision_print";
import landData from "../steps/survplan_cads_propertyremoval/landData";
import landData_financial_assessment from "../steps/prepare_limitation_reports_propertyremoval/landData";
import approved_prepare_decision_print from "../steps/print_decision_start_propertyremoval/approved_prepare_decision_print";
import project_attachments from "../steps/create_propertyremoval_requests/project_attachments";
import suggestParcelPropertyRemovable from "../steps/survplan_cads_propertyremoval/suggestParcel";
import primary_pricing from "../steps/primary_price_propertyremoval/primary_pricing";
import band_data from "../steps/financial_connection_propertyremoval/band_data";
import prepare_limitation_reports_print from "../steps/prepare_limitation_reports_propertyremoval/prepare_limitation_reports_print";
import prepare_approve_paying_report_print from "../steps/prepare_approve_paying_report_propertyremoval/prepare_approve_paying_report_print";
import approval_approve_paying_print from "../steps/approval_approve_paying_propertyremoval/approval_approve_paying_print";
import print_approve_paying_print from "../steps/print_approve_paying_report_propertyremoval/print_approve_paying_print";
import compensation_shake from "../steps/compensation_shake_propertyremoval/compensation_shake";
import list_of_contents from "../steps/building_limitation_content_propertyremoval/list_of_contents";

export const create_propertyremoval_requests = {
  name: "create_propertyremoval_requests",
  module_id: 123,
  steps: {
    judge_letter: { ...judge_or_letter },
    // landData: { ...landData },
    destinationData: { ...destinationData },
    project_attachments: { ...project_attachments },
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

export const wakilamin_efada_propertyremoval = {
  name: "wakilamin_efada_propertyremoval",
  module_id: 124,
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
    efada_wakil_statements: { ...efada_wakil_statements },
    remark: { ...Comment },
  },
};

export const survplan_cads_propertyremoval = {
  name: "survplan_cads_propertyremoval",
  module_id: 125,
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
    suggestParcelPropertyRemovable: { ...suggestParcelPropertyRemovable },
    // akar_data: { ...akar_data },
    remark: { ...Comment },
  },
};

export const primary_price_propertyremoval = {
  name: "primary_price_propertyremoval",
  module_id: 126,
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
    primary_pricing: { ...primary_pricing },
    remark: { ...Comment },
  },
};

export const approve_primary_price_propertyremoval = {
  name: "approve_primary_price_propertyremoval",
  module_id: 127,
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
    primary_assessment_print: { ...primary_assessment_print },
    remark: { ...Comment },
  },
};

export const print_primary_price_propertyremoval = {
  name: "print_primary_price_propertyremoval",
  module_id: 128,
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
    approved_assessment_print: { ...approved_assessment_print },
    remark: { ...Comment },
  },
};
export const financial_connection_propertyremoval = {
  name: "financial_connection_propertyremoval",
  module_id: 129,
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
    financial_connection: { ...financial_Connection },
    band_data: { ...band_data },
    remark: { ...Comment },
  },
};
export const prepare_decision_start_propertyremoval = {
  name: "prepare_decision_start_propertyremoval",
  module_id: 130,
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
    prepare_decision_print: { ...prepare_decision_print },
    remark: { ...Comment },
  },
};
export const approve_amin_decision_start_propertyremoval = {
  name: "approve_amin_decision_start_propertyremoval",
  module_id: 131,
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
    approve_amin_prepare_decision_print: {
      ...approve_amin_prepare_decision_print,
    },
    remark: { ...Comment },
  },
};
export const print_decision_start_propertyremoval = {
  name: "print_decision_start_propertyremoval",
  module_id: 132,
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
    approved_prepare_decision_print: { ...approved_prepare_decision_print },
    remark: { ...Comment },
  },
};

export const building_limitation_content_propertyremoval = {
  name: "building_limitation_content_propertyremoval",
  module_id: 145,
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
    list_of_contents: { ...list_of_contents },
    remark: { ...Comment },
  },
};

export const prepare_limitation_reports_propertyremoval = {
  name: "prepare_limitation_reports_propertyremoval",
  module_id: 146,
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
    landData: { ...landData_financial_assessment },
    prepare_limitation_reports_print: { ...prepare_limitation_reports_print },
    remark: { ...Comment },
  },
};

export const prepare_approve_paying_report_propertyremoval = {
  name: "prepare_approve_paying_report_propertyremoval",
  module_id: 147,
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
    prepare_approve_paying_report_print: {
      ...prepare_approve_paying_report_print,
    },
    remark: { ...Comment },
  },
};

export const approval_approve_paying_propertyremoval = {
  name: "approval_approve_paying_propertyremoval",
  module_id: 148,
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
    approval_approve_paying_print: { ...approval_approve_paying_print },
    remark: { ...Comment },
  },
};

export const print_approve_paying_report_propertyremoval = {
  name: "print_approve_paying_report_propertyremoval",
  module_id: 149,
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
    print_approve_paying_print: { ...print_approve_paying_print },
    remark: { ...Comment },
  },
};

export const compensation_shake_propertyremoval = {
  name: "compensation_shake_propertyremoval",
  module_id: 150,
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
    compensation_shake: { ...compensation_shake },
    remark: { ...Comment },
  },
};

export const _default_propertyRemoval = {
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

export const summary_propertyRemoval = {
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
