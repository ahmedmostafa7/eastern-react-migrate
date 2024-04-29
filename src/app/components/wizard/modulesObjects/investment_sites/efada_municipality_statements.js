import { host } from "imports/config";
import { printHost } from "imports/config";
import { sendEdits } from "app/components/wizard/components/stepContent/actions/actionFunctions/apiActions";
import { postItem, updateItem, fetchData } from "app/helpers/apiMethods";
// import {host} from 'configFiles/config'
export default {
  label: "إفادة البلدية",
  // preSubmit(values, currentStep, props) {
  //   const { t } = props;
  //   return new Promise(function (resolve, reject) {
  //
  //     if (props.actionName.toLowerCase() != "next") return resolve(values);

  //     let neweFada = {
  //       efada__invest_activity: Object.values(
  //         currentStep?.sections?.efada_municipality_statements?.fields
  //           ?.efada__invest_activity?.options
  //       )?.find(
  //         (r) =>
  //           r.value ==
  //           values.efada_municipality_statements.efada__invest_activity
  //       )?.label,
  //       notes: values.efada_municipality_statements.notes,
  //     };

  //     values.efada_municipality_statements.efadat = (!values
  //       .efada_municipality_statements.efadat && [neweFada]) || [
  //       ...values.efada_municipality_statements.efadat,
  //       neweFada,
  //     ];
  //     return resolve(values);
  //   });
  // },
  sections: {
    efada_municipality_statements: {
      label: "إفادة البلدية",
      type: "inputs",
      fields: {
        efada__invest_activity: {
          field: "radio",
          initValue: "1",
          label: "إفادة البلدية على وجود عوائق لطرح الموقع الاستثماري",
          hideLabel: false,
          options: {
            accept: {
              label: "يوجد عائق",
              value: "1",
            },
            reject: {
              label: "لايوجد عائق",
              value: "2",
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
              head: "إفادات البلدية",
            },
            notes: {
              head: "ملاحظات على الإفادة",
            },
          },
          permission: { show_every: ["efadat"] },
        },
        municipality_attachments: {
          label: "مرفقات أخري",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
          multiple: true,
          required: false,
        },
      },
    },
    site_data_services: {
      type: "inputs",
      label: "خدمات الموقع",
      fields: {
        building_license: {
          // name: "buildingLicense",
          label: "رخصة البناء",
          type: "text",
        },
        current_services: {
          label: "الخدمات الحالية على الموقع",
          field: "multiSelect",
          required: true,
          data: [
            { label: "كهرباء", value: "كهرباء" },
            { label: "صرف", value: "صرف" },
            { label: "مياة", value: "مياة" },
            { label: "هاتف", value: "هاتف" },
            { label: "اخري", value: "اخري" },
            { label: "لا يوجد", value: "لا يوجد" },
          ],
        },
        other_services: {
          placeholder: "خدمات اخري",
          label: "خدمات اخري",
          permission: {
            show_if_value_has_includes: {
              key: "current_services",
              compare: "اخري",
            },
          },
        },
      },
    },
  },
};
