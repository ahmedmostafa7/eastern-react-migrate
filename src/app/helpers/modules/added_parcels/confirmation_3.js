import { host } from "imports/config";
export default {
  label: "مرئيات إدارة المساحة",
  sections: {
    notes_1: {
      label: "مرئيات إدارة المساحة",
      type: "inputs",
      fields: {
        acceptOrReject: {
          field: "radio",
          initValue: "1",
          label: "الموافقة على بيع الزائدة",
          hideLabel: false,
          options: {
            accept: {
              label: "يمكن بيعها",
              value: "1",
            },
            reject: {
              label: "عدم بيعها",
              value: "2",
            },
          },
          required: true,
        },
        details: {
          field: "textArea",
          label: "تفاصيل",
          hideLabel: false,
          rows: "5",
        },
        // attachment: {
        //   label: "ارفاق ملف",
        //   hideLabel: true,
        //   field: "simpleUploader",
        //   uploadUrl: `${host}/uploadMultifiles`,
        //   fileType: "image/*,.pdf",
        //   multiple: false,
        //   required: true,
        //   maxNumOfFiles: 1,
        // },
      },
    },
  },
};
