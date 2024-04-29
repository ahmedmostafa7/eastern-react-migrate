import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import store from "app/reducers";
import { map, get, assign } from "lodash";
import { message } from "antd";
import applyFilters from "main_helpers/functions/filters";
const _ = require("lodash");
export default {
  label: "موافقة الجهة المستفيدة",
  number: 2,
  sections: {
    beneficiary_attachments: {
      label: "موافقة الجهة المستفيدة",
      className: "radio_det",
      fields: {
        letter_type: {
          moduleName: "letter_type",
          label: "نوع موافقة الجهة المستفيدة",
          placeholder: "من فضلك اختر نوع موافقة الجهة المستفيدة",
          field: "select",
          label_key: "name",
          value_key: "name",
          required: true,
          disable_placeholder: true,
          data: [
            {
              name: "محضر",
            },
            {
              name: "خطاب",
            },
            {
              name: "موافقة الجهة المستفيدة على نسخة المخطط",
            },
          ],
        },
        letter_no: {
          moduleName: "letter_no",
          label: "رقم الخطاب",
          placeholder: "من فضلك ادخل رقم الخطاب",
          required: true,
          field: "text",
          permission: { show_match_value: { letter_type: "خطاب" } },
        },
        letter_date: {
          moduleName: "letter_date",
          label: "تاريخ الخطاب",
          placeholder: "من فضلك ادخل تاريخ الخطاب",
          required: true,
          field: "hijriDatePicker",
          permission: { show_match_value: { letter_type: "خطاب" } },
        },
        ma7dar_no: {
          moduleName: "ma7dar_no",
          label: "رقم المحضر",
          placeholder: "من فضلك ادخل رقم المحضر",
          required: true,
          field: "text",
          permission: { show_match_value: { letter_type: "محضر" } },
        },
        ma7dar_date: {
          moduleName: "ma7dar_date",
          label: "تاريخ المحضر",
          placeholder: "من فضلك ادخل تاريخ المحضر",
          required: true,
          field: "hijriDatePicker",
          permission: { show_match_value: { letter_type: "محضر" } },
        },
        letter_type_image: {
          moduleName: "letter_type_image",
          label: "مرفق الجهة المستفيدة",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
          multiple: true,
          required: true,
          permission: {
            // show_match_value: { letter_type: "محضر" },
            show_match_value: {
              letter_type: [
                "خطاب",
                "محضر",
                "موافقة الجهة المستفيدة على نسخة المخطط",
              ],
            },
            // show_include_value_array: { letter_type: ["خطاب", "محضر"] },
          },
        },
      },
    },
  },
};
