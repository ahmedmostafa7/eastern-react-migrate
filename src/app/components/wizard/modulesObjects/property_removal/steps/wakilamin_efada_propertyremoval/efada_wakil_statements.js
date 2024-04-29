import { host } from "imports/config";
import { printHost } from "imports/config";
import { sendEdits } from "app/components/wizard/components/stepContent/actions/actionFunctions/apiActions";
import { postItem, updateItem, fetchData } from "app/helpers/apiMethods";
// import {host} from 'configFiles/config'
export default {
  label: "إفادة وكيل الأمين للتعميير والمشاريع",
  preSubmit(values, currentStep, props) {
    const { t } = props;
    return new Promise(function (resolve, reject) {
      if (values.efada_wakil_statements.efada__wakil_approval == 2) {
        return reject();
      }
      return resolve(values);
    });
  },
  sections: {
    efada_wakil_statements: {
      label: "إفادة وكيل الأمين للتعميير والمشاريع",
      type: "inputs",
      fields: {
        efada__wakil_approval: {
          field: "radio",
          initValue: "1",
          label: "إفادة وكيل الأمين للتعميير والمشاريع",
          hideLabel: false,
          options: {
            ACCEPTANCE_ACTION: {
              label: "اعتماد",
              value: "1",
              actions: [3],
            },
            REJECTION_AND_RETURN_ACTION: {
              label: "رفض",
              value: "2",
              actions: [1, 6],
            },
          },
          required: true,
          onClick: (event, props) => {
            if (event.target.value == 1) {
              props.change("efada_wakil_statements.rejected_notes", null);
            } else {
              props.change("efada_wakil_statements.acceptance_notes", null);
            }

            props.input.onChange(event.target.value);
          },
        },

        rejected_notes: {
          field: "textArea",
          label: "ملاحظات على الإفادة",
          hideLabel: false,
          rows: "5",
          required: true,
          permission: { show_match_value: { efada__wakil_approval: "2" } },
        },
        acceptance_notes: {
          field: "textArea",
          label: "ملاحظات على الإفادة",
          hideLabel: false,
          rows: "5",
          permission: { show_match_value: { efada__wakil_approval: "1" } },
        },
        // efadat: {
        //   field: "list",
        //   className: "modal-table",
        //   label: "efadat",
        //   moduleName: "efadat",
        //   fields: {
        //     option: {
        //       head: "إفادات الوكيل",
        //     },
        //     notes: {
        //       head: "ملاحظات على الإفادة",
        //     },
        //   },
        //   permission: { show_every: ["efadat"] },
        // },
      },
    },
  },
};
