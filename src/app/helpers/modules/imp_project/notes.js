import { host } from "imports/config";
import moment from "moment-hijri";
export default {
  number: 7,
  label: "Notes",
  preSubmit(values, currentStep, props) {
    return new Promise(function (resolve, reject) {
      const { t } = props;

      values["notes"].date = moment().format("iYYYY/iMM/iD");
      let hours = new Date().getHours();
      let mintes = new Date().getMinutes();
      values["notes"].time = hours + ":" + mintes;

      return resolve(values);
    });
  },
  sections: {
    notes: {
      label: "Notes",
      type: "inputs",
      fields: {
        check_plan_approval: {
          permission: { show_match_value_mod: ["data_msa7y"] },

          field: "radio",
          initValue: "1",
          label: "موقف المدقق من الرفع المساحي",
          hideLabel: false,
          options: {
            accept: {
              label: " مقبول",
              value: "1",
            },
            reject: {
              label: "مرفوض ",
              value: "2",
            },
          },
          required: true,
        },
        notes: {
          field: "tableList",
          className: "modal-table",
          label: "approvalSubmissionNotes",
          hideLabel: true,
          value_key: "notes",
          moduleName: "APPROVALSubmissionNotes",
          hideLabels: true,
          inline: true,
          fields: [
            {
              name: "notes",
              label: "Notes",
              placeholder: "من فضلك ادخل هنا الملاحظات",
              field: "textArea",
              rows: "5",
            },
            {
              name: "attachments",
              label: "Attachments",
              hideLabel: true,
              field: "simpleUploader",
              uploadUrl: `${host}/uploadMultifiles`,
              fileType: "image/*,.pdf,.dwg,.DWG",
              multiple: true,
            },
            // {
            //   name: "note_date",
            //   label: "تاريخ الملاحظة",
            //   hideLabel: true,

            //   field: "hijriDatePicker",
            //   equalToday: true,
            //   required: true,
            // },
          ],
        },
        checkWords: {
          name: "check",
          label: "checkWords",
          hideLabel: true,
          field: "boolean",
          requiredCheck: true,
          permission: { show_match_value_mod: [104] },
        },
      },
    },
  },
};
