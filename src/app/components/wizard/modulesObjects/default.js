import Comment from "app/helpers/modules/comment";
export const default_module = {
  name: "default_module",
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
