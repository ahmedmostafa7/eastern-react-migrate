import { printHost } from "imports/config";
import { postItem } from "app/helpers/apiMethods";
import { host, workFlowUrl } from "imports/config";
import { plan_approval_fields } from "./reqFields";
import { get } from "lodash";
export default {
  label: "بيانات الصكوك من المواطن",
  sections: {
    waseka: {
      className: "waseka_des",
      type: "inputs",
      label: "بيانات الصكوك",
      fields: {
        image: {
          label: "صورة الصك",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
          multiple: false,
          required: true,
        },
        kroky_image: {
          label: "صورة الكروكي",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
          multiple: false,
          required: true,
        },
      },
    },
  },
};
