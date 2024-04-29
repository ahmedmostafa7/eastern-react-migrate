import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import store from "app/reducers";
import { map, get, assign } from "lodash";
import { message } from "antd";
import applyFilters from "main_helpers/functions/filters";
const _ = require("lodash");
export default {
  label: "مرفقات",
  number: 2,
  sections: {
    attachments: {
      label: "مرفقات",
      className: "radio_det",
      fields: {
        approval_plan_image: {
          moduleName: "approval_plan_image",
          label: "مرفق المخطط المعتمد",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
          multiple: true,
          required: true,
        },
        approval_karar_image: {
          moduleName: "approval_karar_image",
          label: "مرفق قرار الإعتماد",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
          multiple: true,
          // required: true,
        },
        site_selected_before: {
          moduleName: "site_selected_before",
          required: true,
          label: "هذا الموقع لم يتم تغيير استخدامه لغرض آخر",
          field: "boolean",
        },
      },
    },
  },
};
