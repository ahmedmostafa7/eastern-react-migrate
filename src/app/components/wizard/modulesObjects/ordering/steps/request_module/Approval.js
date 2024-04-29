import { host } from "imports/config";
export default {
  label: "Approval",
  sections: {
    Approval: {
      label: "Approval",
      className: "radio_det",
      fields: {
        image: {
          label: "مرفقات التعميم",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
          multiple: true,
          required: false,
          preRequest: (props) => {},
          postRequest: (uploadedUrl, props, preRequestResults) => {},
        },
        remark: {
          label: "محتوى التعميم",
          moduleName: "remark",
          field: "textArea",
          rows: 4,
        },
      },
    },
  },
};
