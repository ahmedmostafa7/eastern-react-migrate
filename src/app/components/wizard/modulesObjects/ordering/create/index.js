import Approval from "../steps/request_module/Approval";
export const create_ordering = {
  name: "create_ordering",
  module_id: 15,
  steps: {
    Approval: { ...Approval },
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
