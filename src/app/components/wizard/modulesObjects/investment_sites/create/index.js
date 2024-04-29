import Comment from "app/helpers/modules/comment";
import landData_farz_simple_invest from "../landData_farz_simple_invest";
import notes from "app/helpers/modules/imp_project/notes";
import invest_workflow_select from "../invest_workflow_select";
import efada_municipality_statements from "../efada_municipality_statements";
import efada_plan_statements from "../efada_plan_statements";
import efada_lands_statements from "../efada_lands_statements";
import executive_lagna_print from "../executive_lagna_print";

export const create_investmentsites = {
  name: "create_investmentsites",
  module_id: 96,
  steps: {
    investType: { ...invest_workflow_select },
    landData: { ...landData_farz_simple_invest },
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

export const lands_statements = {
  name: "lands_statements",
  module_id: 97,
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
    efada_lands_statements: { ...efada_lands_statements },
    remark: { ...Comment },
  },
};

export const plan_statements = {
  name: "plan_statements",
  module_id: 98,
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
    efada_plan_statements: { ...efada_plan_statements },
    remark: { ...Comment },
  },
};

export const municipality_statements = {
  name: "municipality_statements",
  module_id: 99,
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
    efada_municipality_statements: { ...efada_municipality_statements },
    remark: { ...Comment },
  },
};

export const update_investmentsites_map = {
  name: "update_investmentsites_map",
  module_id: 101,
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
export const approve_investmanager_investmentsites = {
  name: "approve_investmanager_investmentsites",
  module_id: 112,
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
    executive_lagna_print: { ...executive_lagna_print },
    remark: { ...Comment },
  },
};
export const print_investmentsites_lagnh = {
  name: "print_investmentsites_lagnh",
  module_id: 113,
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
    executive_lagna_print: { ...executive_lagna_print },
    remark: { ...Comment },
  },
};

export const approve_landsmanager_investmentsites = {
  name: "approve_landsmanager_investmentsites",
  module_id: 151,
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
