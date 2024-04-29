import { host } from "imports/config";
import moment from "moment-hijri";
export default {
  number: 7,
  label: "Notes",
  preSubmit(values, currentStep, props) {
    return new Promise(function (resolve, reject) {
      let timeNow = new Date().toLocaleString().split(",")[1];
      let dateNow = moment().format("iD/iMM/iYYYY") + timeNow;
      if (values["notes"]) {
        values["notes"].date = dateNow;
        resolve(values);
      } else {
        reject();
      }
    });
  },
  sections: {
    notes: {
      label: "Notes",
      type: "inputs",
      fields: {
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
              field: "textArea",
              rows: "5",
            },
            {
              name: "attachments",
              label: "Attachments",
              hideLabel: true,
              field: "simpleUploader",
              uploadUrl: `${host}/uploadMultifiles`,
              fileType: "image/*,.pdf",
              multiple: true,
            },
          ],
        },
        checkWords: {
          name: "check",
          label: "checkWords",
          hideLabel: true,
          field: "boolean",
          requiredCheck: true,
        },
      },
    },
  },
};
