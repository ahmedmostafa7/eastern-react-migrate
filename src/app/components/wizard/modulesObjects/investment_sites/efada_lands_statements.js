import { host } from "imports/config";
import { printHost } from "imports/config";
import { sendEdits } from "app/components/wizard/components/stepContent/actions/actionFunctions/apiActions";
import { postItem, updateItem, fetchData } from "app/helpers/apiMethods";
// import {host} from 'configFiles/config'
export default {
  label: "إفادة الأراضي والممتلكات",
  // preSubmit(values, currentStep, props) {
  //   const { t } = props;
  //   return new Promise(function (resolve, reject) {
  //
  //     if (props.actionName.toLowerCase() != "next") return resolve(values);

  //     let neweFada = {
  //       efada_melkia_aradi: Object.values(
  //         currentStep?.sections?.efada_lands_statements?.fields
  //           ?.efada_melkia_aradi?.options
  //       )?.find(
  //         (r) => r.value == values.efada_lands_statements.efada_melkia_aradi
  //       )?.label,
  //       notes: values.efada_lands_statements.notes,
  //     };

  //     values.efada_lands_statements.efadat = (!values.efada_lands_statements
  //       .efadat && [neweFada]) || [
  //       ...values.efada_lands_statements.efadat,
  //       neweFada,
  //     ];
  //     return resolve(values);
  //   });
  // },
  sections: {
    efada_lands_statements: {
      label: "إفادة الأراضي والممتلكات",
      type: "inputs",
      fields: {
        efada_melkia_aradi: {
          field: "radio",
          initValue: "1",
          label: "إفادة الإدارة العامة للأراضي والممتلكات عن ملكية الارض",
          hideLabel: false,
          options: {
            return: {
              label: "عائدة للأمانة",
              value: "1",
            },
            not_return: {
              label: "غير عائدة للأمانة",
              value: "2",
            },
            return_with_munEfada: {
              label: "عائدة للأمانة تحتاج إفادة البلدية",
              value: "3",
            },
          },
          required: true,
        },

        notes: {
          field: "textArea",
          label: "ملاحظات على الإفادة",
          hideLabel: false,
          rows: "5",
        },
        efadat: {
          field: "list",
          className: "modal-table",
          label: "efadat",
          moduleName: "efadat",
          fields: {
            option: {
              head: "إفادات الإدارة العامة للأراضي والممتلكات",
            },
            notes: {
              head: "ملاحظات على الإفادة",
            },
          },
          permission: { show_every: ["efadat"] },
        },
      },
    },
  },
};
