import { printHost } from "imports/config";
import { postItem } from "app/helpers/apiMethods";
import { host, workFlowUrl } from "imports/config";
import { get, isEqual } from "lodash";
import { message } from "antd";
export default {
  label: "إفادة كتابة العدل عن سريان مفعول الصك",
  sections: {
    afada_adle_statements: {
      className: "afada_adle_statements_des",
      type: "inputs",
      label: "إفادة كتابة العدل عن سريان مفعول الصك",
      fields: {
        efada_status: {
          field: "radio",
          label: "حالة الإفادة",
          hideLabel: false,
          options: {
            accept: {
              label: "موافق",
              value: "1",
            },
            reject: {
              label: "مرفوض",
              value: "2",
            },
          },
          required: true,
        },
        sak_efada: {
          label: "مرفق خطاب سريان مفعول الصك",
          placeholder: "select file",
          field: "simpleUploader",
          multiple: false,
          required: true,
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
        },
        image_efada: {
          label: "ارفاق خطاب الإفادة القادم من كتابة العدل",
          placeholder: "select file",
          field: "simpleUploader",
          multiple: false,
          required: true,
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
        },
        letter_number: {
          label: "رقم الخطاب",
          placeholder: "من فضلك ادخل رقم الخطاب",
          required: true,
          // digits: true,
          field: "text",
        },
        letter_date: {
          label: "تاريخ الخطاب",
          placeholder: "من فضلك ادخل تاريخ الخطاب",
          field: "hijriDatePicker",
          lessThanToday: true,
          required: true,
        },
        efada_text: {
          field: "textArea",
          label: "نص الإفادة",
          rows: 8,
          required: true,
        },
      },
    },
  },
};
