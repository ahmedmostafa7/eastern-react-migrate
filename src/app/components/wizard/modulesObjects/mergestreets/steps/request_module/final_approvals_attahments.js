import { host } from "imports/config";
export default {
  label: "مرفقات الإعتماد النهائية",
  sections: {
    final_approvals: {
      label: "مرفقات الإعتماد النهائية",
      fields: {
        final_approval_krar: {
          label: "قرار الإعتماد النهائي",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
          multiple: false,
          required: true,
          preRequest: (props) => {},
          postRequest: (uploadedUrl, props) => {},
        },
        final_plan: {
          label: "المخطط النهائي",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
          multiple: false,
          required: true,
          preRequest: (props) => {},
          postRequest: (uploadedUrl, props) => {},
        },
      },
    },
  },
};
