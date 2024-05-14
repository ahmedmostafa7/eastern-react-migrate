import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
// import {  } from "imports/config";
import store from "app/reducers";
import { map, get, assign } from "lodash";
import { message } from "antd";
import applyFilters from "main_helpers/functions/filters";
import axios from "axios";
import { workFlowUrl, host } from "imports/config";
const _ = require("lodash");
export default {
  number: 1,
  label: "اسم المشروع ومرفقاته",
  sections: {
    project_attachments: {
      label: "اسم المشروع ومرفقاته",
      type: "inputs",
      required: true,
      fields: {
        project_name: {
          moduleName: "project_name",
          label: "اسم المشروع",
          required: true,
          field: "text",
        },
        municipality_id: {
          moduleName: "municipality_id",
          label: "البلدية",
          placeholder: "من فضلك اختر البلدية",
          required: true,
          field: "select",
          label_key: "name",
          value_key: "code",
          fetch: `${workFlowUrl}/api/Municipality`,
          //permission: { show_match_value: { entity_type_id: 3 } },
        },
        attachments_enabled: {
          label: "مرفقات مسار النزع",
          field: "boolean",
          required: false,
        },
        image_pdf_attachment: {
          label: "مرفق الكروكي المساحي بصيغة PDF أو Image",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          //uploadUrl: `${host}uploadFile/`,
          fileType: "image/*,.pdf",
          multiple: false,
          required: false,
          permission: { show_every: ["attachments_enabled"] },
        },
        dwg_attachment: {
          label: "مرفق الكروكي المساحي بصيغة DWG",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: ".dwg",
          multiple: false,
          required: false,
          permission: { show_every: ["attachments_enabled"] },
        },
        others: {
          label: "مرفقات أخرى",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf,.dwg",
          multiple: true,
          required: false,
        },
      },
    },
  },
};
