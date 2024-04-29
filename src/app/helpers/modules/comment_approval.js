import { host } from "imports/config";
import moment from "moment-hijri";
export default {
  number: 5,
  label: "Comments",
  // preSubmit(values, currentStep, props) {
  //   return new Promise(function (resolve, reject) {
  //     const { t } = props;

  //     values["comment"].date = moment().format("iYYYY/iMM/iD");
  //     let hours = new Date().getHours();
  //     let mintes = new Date().getMinutes();
  //     values["comment"].time = hours + ":" + mintes;

  //     resolve(values);
  //   });
  // },
  //description: 'this is the Second Step description',
  sections: {
    comment: {
      label: "Comments",
      type: "inputs",
      fields: {
        comment: {
          label: "Notes",
          field: "textArea",
        },

        attachemnts: {
          label: "Attachments",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
        },
      },
    },
  },
};
