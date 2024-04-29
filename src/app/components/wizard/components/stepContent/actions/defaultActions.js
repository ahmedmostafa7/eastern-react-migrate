//json object of default wizard actions
export const defaultActions = {
  // cancel: {
  //     label: 'Cancel'
  // },
  next: {
    label: "Next",
    htmlType: "submit",
    className: "next",
    // func: "get_total_letters_ma7dar",
    permissions: {
      hide_check_index: -1,
      // show_owner_approval: 1,
    },
  },
  previous: {
    label: "Previous",
    className: "prev",
    permissions: {
      hide_check_index: 0,
    },
  },

  cancel: {
    label: "Cancel",
    className: "cancel",
    permissions: {
      show_if_props_equal: {
        key: "record.__isHideCancelAction",
        value: undefined,
      },
    },
  },

  saveDraft: {
    label: "Save draft",
    className: "saveDraft",
    permissions: {
      operation: "some",
      stateFilter: {
        key: "StateSelectorCompare",
        path: "wizard.currentModule.record.CurrentStep.index",
        compare: 1,
      },
      draft: {
        function: "stateFilter",
        key: "StateSelectorCompare",
        path: "wizard.currentModule.draft",
        compare: true,
      },
    },
  },
  alert: {
    label: "Alert",
    className: "alert",
    permissions: {
      // currentModule.record.CurrentStep.can_warn
      show_if_props_equal: { key: "record.CurrentStep.can_warn", value: 1 },
      //show_if_props_equal:{key:'record.status', value: 1}, //running submission
    },
  },

  // continueSubmission:{
  //     label:'Continue',
  //     permissions:{
  //         show_props_equal_list : [
  //             {key: 'record.status', value: 4},
  //             { key: 'is_workflow_admin', value: true}
  //         ]
  //         // show_if_props_equal:{key:'record.status', value: 4},//stopped submission
  //         // show_if_props_equal:{key:'is_workflow_admin', value: true},
  //     }
  // },
  saveEdits: {
    label: "Save edits",
    className: "saveEdits editsSaave",
    htmlType: "submit",
    permissions: {
      stateFilter: {
        key: "StateSelectorCompare",
        path: "wizard.currentModule.record.CurrentStep.index",
        op: "gt",
        compare: 1,
      },
      // hide_check_index: 0,
      // hide_if_props_includes:{key:'currentModuleName', value:['default_module', 'plan_approval_submission']},
      show_if_props_equal: { key: "record.status", value: 1 }, //running submission
    },
  },
  preview: {
    label: "طباعة",
    className: "print",
    permissions: {
      hide_if: 1,
      show_if_app_id_equal: {
        key: "record.app_id",
        value: [1, 8, 14, 16, 19],
      },
      // show_if_props_equal: { key: "record.app_id", value: 1 },
      // hide_check_index: 1,
      not_show_if_app_id_equal: {
        key: "record.app_id",
        value: [14],
      },
      show_if_props_equal_3: { key: "record.is_approved", value: undefined },
      // show_check_index: -1,
    },
  },
  print: {
    label: "Print",
    className: "print",
    permissions: {
      not_show_if_app_id_equal: {
        key: "record.app_id",
        value: [14],
      },

      // show_check_index: -1,
      show_if_props_equal: { key: "record.is_approved", value: 1 },
    },
  },
};
