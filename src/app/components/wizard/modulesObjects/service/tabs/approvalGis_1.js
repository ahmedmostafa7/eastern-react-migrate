import { host } from "imports/config";
export default {
  label: "اعتماد مدير إدارة ضبط التنمية",
  sections: {
    notes_1: {
      label: "قرار مدير إدارة ضبط التنمية",
      type: "inputs",
      fields: {
        acceptOrReject: {
          field: "radio",
          initValue: "1",
          label: "موافقة مدير إدارة ضبط التنمية على المعاملة",
          hideLabel: false,
          options: {
            accept: {
              label: "موافق",
              value: "1",
            },
            reject: {
              label: "غير موافق",
              value: "2",
            },
          },
          required: true,
        },
        details: {
          field: "textArea",
          label: "الملاحظات",
          hideLabel: false,
          rows: "5",
        },
        attachment: {
          label: "مرفقات",
          hideLabel: false,
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
          multiple: false,
          // required: true,
          maxNumOfFiles: 1,
        },
      },
    },
  },
};