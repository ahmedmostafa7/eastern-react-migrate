import { host } from "imports/config";
import moment from "moment-hijri";
export default {
  label: "الملاحظات",

  number: 2,
  //description: 'this is the Second Step description',
  sections: {
    printCreate: {
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
        attachment_print_create: {
          label: "نسخة من محضر اللجنة الفنية",

          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
          multiple: false,
          required: true,
          maxNumOfFiles: 1,
        },
      },
    },
  },
};
