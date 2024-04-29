import { host } from "configFiles/config";
import { some } from "lodash";
import { message } from "antd";
export const approvalsSelect = {
  number: 5,
  label: "Select Approvals",
  preSubmit(values, currentStep, props) {
    console.log(values);
    const valid = some(values.selected);
    if (valid) {
      return Promise.resolve(values);
    }
    message.error(props.t("Please Select Attachment"));
    // throw "invalid selection"
    return Promise.reject("error");
  },
  //description: 'this is the Second Step description',
  sections: {
    selected: {
      label: "Approvals",
      type: "inputs",
      fields: {
        electric: {
          label: "Electric Approval",
          field: "boolean",
        },
        transmit: {
          label: "Transimition Approval",
          field: "boolean",
        },
        military: {
          label: "Military Approval",
          field: "boolean",
        },
        plane: {
          label: "Plane Approval",
          field: "boolean",
        },
        water: {
          label: "Water Approval",
          field: "boolean",
        },
        final_plans: {
          label: "Final Plans",
          field: "boolean",
        },
        super_contract: {
          label: "Supervision contact",
          field: "boolean",
        },
        others: {
          label: "Others",
          field: "boolean",
        },
        others_name: {
          label: "Others Name",
          maxLength: 100,
          permission: {
            show_every: ["others"],
          },
        },
      },
    },
  },
};

export default {
  number: 5,
  label: "Approvals",

  //description: 'this is the Second Step description',
  sections: {
    approvals: {
      label: "Approvals",
      type: "inputs",
      fields: {
        electric: {
          label: "Electric Approval",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: ".pdf",
          required_state:
            "wizard.mainObject.approvals_select.selected.electric",
          permission: {
            stateFilter: {
              key: "path",
              path: "wizard.mainObject.approvals_select.selected.electric",
              compare: 1,
            },
          },
        },
        transmit: {
          label: "Transimition Approval",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: ".pdf",
          required_state:
            "wizard.mainObject.approvals_select.selected.transmit",
          permission: {
            stateFilter: {
              key: "path",
              path: "wizard.mainObject.approvals_select.selected.transmit",
              compare: 1,
            },
          },
        },
        military: {
          label: "Military Approval",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: ".pdf",
          required_state:
            "wizard.mainObject.approvals_select.selected.military",
          permission: {
            stateFilter: {
              key: "path",
              path: "wizard.mainObject.approvals_select.selected.militar",
              compare: 1,
            },
          },
        },
        plane: {
          label: "Plane Approval",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: ".pdf",
          required_state: "wizard.mainObject.approvals_select.selected.plane",
          permission: {
            stateFilter: {
              key: "path",
              path: "wizard.mainObject.approvals_select.selected.plane",
              compare: 1,
            },
          },
        },
        defnece_letter_number: {
          label: "Defence Letter Number",
          maxLength: 14,
          required: true,
        },
        defnece_letter_date: {
          label: "Defence Letter Date",
          field: "hijriDatePicker",
          required: true,
        },
        water: {
          label: "Water Approval",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: ".pdf",
          required_state: "wizard.mainObject.approvals_select.selected.water",
          permission: {
            stateFilter: {
              key: "path",
              path: "wizard.mainObject.approvals_select.selected.water",
              compare: 1,
            },
          },
        },
        final_plans: {
          label: "Final Plans",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: ".pdf",
          required_state:
            "wizard.mainObject.approvals_select.selected.final_plans",
          permission: {
            stateFilter: {
              key: "path",
              path: "wizard.mainObject.approvals_select.selected.final_plans",
              compare: 1,
            },
          },
        },
        engineering_super: {
          label: "Engineering Supervision",
          required: true,
          maxLength: 100,
        },
        super_contract: {
          label: "Supervision contact",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: ".pdf",
          required_state:
            "wizard.mainObject.approvals_select.selected.super_contract",
          permission: {
            stateFilter: {
              key: "path",
              path: "wizard.mainObject.approvals_select.selected.super_contract",
              compare: 1,
            },
          },
        },
        others: {
          label: "Others Attachments",
          label_state:
            "wizard.mainObject.approvals_select.selected.others_name",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: ".pdf",
          required_state: "wizard.mainObject.approvals_select.selected.others",
          permission: {
            stateFilter: {
              key: "path",
              path: "wizard.mainObject.approvals_select.selected.others",
              compare: 1,
            },
          },
        },
      },
    },
  },
};
